import React, { useEffect, useRef, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Select } from 'antd';
import { history } from 'umi';
import { format } from '@/utils/momentUtils';
import { queryEnums } from '@/services/enums';
import { DROP_LIST_SEPARATOR } from '@/constant';
import { subjectListData, subjectQueryParamsData, subjectSubmitData } from './data.d';
import { querySubjectList, addSubject, updateSubject } from './service';
import AddSubjectModal from './components/AddSubjectModal';
import EditSubjectModal from './components/EditSubjectModal';

const TableList: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const [addVisibleState, setAddVisibleState] = useState<boolean>(false);
  const [editVisibleState, setEditVisibleState] = useState<boolean>(false);
  const [subjectRowDataState, setSubjectRowDataState] = useState<subjectListData>();
  const [subjectCodeState, setSubjectCodeState] = useState<any>();

  useEffect(() => {
    queryEnums({
      dropType: 'subject',
    }).then((r) => {
      const data = {};
      if (r.code === 200) {
        r.data.map((item: { key: string; val: string }) => {
          data[item.key] = item.val;
          return null;
        });
        setSubjectCodeState(r.data);
      }
    });
  }, [1]);

  const handleCancel = () => {
    setAddVisibleState(false);
    setEditVisibleState(false);
  };

  const handleAddSubmit = (values: subjectSubmitData) => {
    addSubject({
      ...values,
      validTime: [format(values.validTime[0]), format(values.validTime[1])],
    }).then((r) => {
      if (r.code === 200) {
        message.success('主题新增成功');
        if (actionRef.current) {
          actionRef.current.reload();
          setAddVisibleState(false);
        }
      } else {
        message.error('主题新增失败');
      }
    });
  };

  const handleEditSubmit = (values: subjectSubmitData) => {
    const subjectCode = subjectRowDataState ? subjectRowDataState.subjectCode : '';
    updateSubject({
      subjectCode,
      ...values,
      validTime: [format(values.validTime[0]), format(values.validTime[1])],
    }).then((r) => {
      if (r.code === 200) {
        message.success('主题更新成功');
        if (actionRef.current) {
          actionRef.current.reload();
          setEditVisibleState(false);
        }
      } else {
        message.error('主题更新失败');
      }
    });
  };

  const subjectCodeRenderFormItem = (
    table: ProColumns<subjectListData>,
    props: { value?: any; onChange?: (value: any) => void },
  ) => {
    let options;
    if (subjectCodeState) {
      options = subjectCodeState.map((item: { key: string; val: string }) => (
        <Select.Option key={item.key} value={`${item.key}${DROP_LIST_SEPARATOR}${item.val}`}>
          {item.val}
        </Select.Option>
      ));
    }
    return (
      <Select placeholder="支持编码或名称搜索" showSearch allowClear onChange={props.onChange}>
        {options}
      </Select>
    );
  };

  const handleSubmit = (
    params?: subjectQueryParamsData & { pageSize?: number; current?: number },
  ) => {
    const data = { subjectCode: undefined, ...params };
    if (params && params.subjectCode && params.subjectCode.includes(DROP_LIST_SEPARATOR)) {
      const [subjectCode] = params.subjectCode.split(DROP_LIST_SEPARATOR);
      data.subjectCode = subjectCode;
    }
    return querySubjectList(data);
  };

  const columns: ProColumns<subjectListData>[] = [
    {
      title: '主题类型',
      dataIndex: 'subjectType',
      valueEnum: {
        0: 'binlog',
        1: '自定义MQ',
      },
    },
    {
      title: '主题',
      dataIndex: 'subjectCode',
      hideInTable: true,
      renderFormItem: subjectCodeRenderFormItem,
    },
    {
      title: 'Topic',
      dataIndex: 'topic',
    },
    {
      title: '主题信息',
      hideInSearch: true,
      render: (text, row) => {
        return (
          <>
            <div>主题编码：{row.subjectCode}</div>
            <div>主题名称：{row.subjectName}</div>
          </>
        );
      },
    },
    {
      title: '生效时间',
      hideInSearch: true,
      render: (text, row) => {
        return (
          <>
            <div>from:{row.validStartTime}</div>
            <div>to:&nbsp;&nbsp;&nbsp;&nbsp;{row.validEndTime}</div>
          </>
        );
      },
    },
    {
      title: '操作信息',
      hideInSearch: true,
      render: (text, row) => {
        return (
          <>
            <div>操作员：{row.modifier}</div>
            <div>时间：{!row.gmtModified ? row.gmtCreated : row.gmtModified}</div>
          </>
        );
      },
    },
    {
      title: '事件总数',
      dataIndex: 'eventCount',
      hideInSearch: true,
      render: (_, row) => (
        <a
          onClick={() => {
            history.push({
              pathname: '/check-config/event-manage',
              state: {
                subjectCode: row.subjectCode,
              },
            });
          }}
        >
          {row.eventCount}
        </a>
      ),
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (text, row) => (
        <>
          <a
            onClick={() => {
              setEditVisibleState(true);
              setSubjectRowDataState(row);
            }}
          >
            修改
          </a>
        </>
      ),
    },
  ];

  return (
    <PageHeaderWrapper>
      <ProTable<subjectListData>
        pagination={{
          showSizeChanger: true,
        }}
        actionRef={actionRef}
        rowKey="id"
        options={{ density: false, fullScreen: true, reload: true, setting: true }}
        search={{
          collapsed: false,
          collapseRender: () => false,
        }}
        request={handleSubmit}
        columns={columns}
        toolBarRender={() => [
          <Button
            key="add"
            type="primary"
            onClick={() => {
              setAddVisibleState(true);
            }}
          >
            <PlusOutlined />
            新建
          </Button>,
        ]}
      />
      <AddSubjectModal
        visible={addVisibleState}
        onCancel={handleCancel}
        onSubmit={handleAddSubmit}
      />
      <EditSubjectModal
        visible={editVisibleState}
        onCancel={handleCancel}
        onSubmit={handleEditSubmit}
        data={subjectRowDataState}
      />
    </PageHeaderWrapper>
  );
};

export default TableList;
