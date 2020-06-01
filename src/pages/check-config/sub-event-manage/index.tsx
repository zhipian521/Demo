import React, { useEffect, useRef, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Button, Divider, message, Select } from 'antd';
import { queryEnums } from '@/services/enums';
import { useLocation } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
import { RouteComponentProps } from 'react-router';
import { DROP_LIST_SEPARATOR } from '@/constant';
import {
  subEventHistoryData,
  subEventListData,
  subEventQueryParamsData,
  subEventSubmitData,
} from './data.d';
import {
  addSubEvent,
  querySubEvent,
  querySubEventHistory,
  rollbackSubEvent,
  updateSubEvent,
} from './service';
import AddSubEvent from './components/AddSubEvent';
import EditSubEvent from './components/EditSubEvent';
import DetailSubEvent from './components/DetailSubEvent';
import HistorySubEvent from './components/HistorySubEvent';

interface RouteParams {
  eventCode?: string;
}

const TableList: React.FC<RouteComponentProps> = () => {
  const actionRef = useRef<ActionType>();
  const location = useLocation();

  const [eventCodeState, setEventCodeState] = useState<any>();
  const [subEventCodeState, setSubEventCodeState] = useState<any>();
  const [editVisibleState, setEditVisibleState] = useState<boolean>(false);
  const [detailVisibleState, setDetailVisibleState] = useState<boolean>(false);
  const [historyVisibleState, setHistoryVisibleState] = useState<boolean>(false);
  const [addVisibleState, setAddVisibleState] = useState<boolean>(false);
  const [subEventRowDataState, setSubEventRowDataState] = useState<subEventListData>();
  const [routeParamsState, setRouteParamsState] = useState<RouteParams>(
    location.state as RouteParams,
  );
  const [subEventRollbackRowDataState, setSubEventRollbackRowDataState] = useState<
    subEventHistoryData
  >();

  useEffect(() => {
    queryEnums({
      dropType: 'event',
    }).then((r) => {
      if (r.code === 200) {
        setEventCodeState(r.data);
      }
    });
    queryEnums({
      dropType: 'subEvent',
    }).then((r) => {
      if (r.code === 200) {
        setSubEventCodeState(r.data);
      }
    });
  }, [1]);

  const handleCancel = () => {
    setEditVisibleState(false);
    setHistoryVisibleState(false);
    setDetailVisibleState(false);
    setAddVisibleState(false);
  };

  const handleAddSubmit = (values: subEventSubmitData) => {
    const data = { eventCode: undefined, ...values };
    if (values && values.eventCode && values.eventCode.includes(DROP_LIST_SEPARATOR)) {
      const [eventCode] = values.eventCode.split(DROP_LIST_SEPARATOR);
      data.eventCode = eventCode;
    }
    addSubEvent({
      ...data,
    }).then((r) => {
      if (r.code === 200) {
        message.success('子事件新增成功');
        if (actionRef.current) {
          actionRef.current.reload();
        }
      } else {
        message.error(r.msg);
      }
    });
    setAddVisibleState(false);
  };

  const rollbackRowInit = (values: subEventListData) => {
    querySubEventHistory({
      code: values.subEventCode,
      ruleType: 2,
    }).then((r) => {
      setSubEventRollbackRowDataState({ ...values, ...r.data });
    });
  };

  const handleRollbackSubmit = (values: subEventHistoryData) => {
    rollbackSubEvent({
      code: values.code,
      ruleType: 2,
    }).then((r) => {
      if (r.code === 200) {
        message.success('子事件回滚成功');
        if (actionRef.current) {
          actionRef.current.reload();
        }
      } else {
        message.error(r.msg);
      }
    });
    setHistoryVisibleState(false);
  };

  const handleEditSubmit = (values: subEventSubmitData) => {
    const subEventCode = subEventRowDataState ? subEventRowDataState.subEventCode : '';
    updateSubEvent({
      subEventCode,
      ...values,
    }).then((r) => {
      if (r.code === 200) {
        message.success('子事件修改成功');
        if (actionRef.current) {
          actionRef.current.reload();
        }
      } else {
        message.error(r.msg);
      }
    });
    setEditVisibleState(false);
  };

  const eventCodeRenderFormItem = (
    table: ProColumns<subEventListData>,
    props: { value?: any; onChange?: (value: any) => void },
  ) => {
    let options;
    if (eventCodeState) {
      options = eventCodeState.map((item: { key: string; val: string }) => (
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

  const subEventCodeRenderFormItem = (
    table: ProColumns<subEventListData>,
    props: { value?: any; onChange?: (value: any) => void },
  ) => {
    let options;
    if (subEventCodeState) {
      options = subEventCodeState.map((item: { key: string; val: string }) => (
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
    params?: subEventQueryParamsData & { pageSize?: number; current?: number },
  ) => {
    const data = { subEventCode: undefined, eventCode: undefined, ...params };
    if (params && params.subEventCode && params.subEventCode.includes(DROP_LIST_SEPARATOR)) {
      const [subEventCode] = params.subEventCode.split(DROP_LIST_SEPARATOR);
      data.subEventCode = subEventCode;
    }
    if (params && params.eventCode && params.eventCode.includes(DROP_LIST_SEPARATOR)) {
      const [eventCode] = params.eventCode.split(DROP_LIST_SEPARATOR);
      data.eventCode = eventCode;
    }
    return querySubEvent({ ...data, ...routeParamsState });
  };

  const columns: ProColumns<subEventListData>[] = [
    {
      title: '事件',
      dataIndex: 'eventCode',
      renderFormItem: eventCodeRenderFormItem,
      hideInTable: true,
    },

    {
      title: '子事件',
      dataIndex: 'subEventCode',
      renderFormItem: subEventCodeRenderFormItem,
      hideInTable: true,
    },
    {
      title: '事件编码',
      dataIndex: 'eventCode',
      hideInSearch: true,
    },
    {
      title: '子事件信息',
      hideInSearch: true,
      render: (text, row) => {
        return (
          <>
            <div>子事件编码：{row.subEventCode}</div>
            <div>子事件名称：{row.subEventName}</div>
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
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (text, row) => (
        <>
          <a
            onClick={() => {
              setDetailVisibleState(true);
              setSubEventRowDataState(row);
            }}
          >
            详情
          </a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              setEditVisibleState(true);
              setSubEventRowDataState(row);
            }}
          >
            修改
          </a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              setHistoryVisibleState(true);
              rollbackRowInit(row);
            }}
          >
            回滚
          </a>
        </>
      ),
    },
  ];
  return (
    <PageHeaderWrapper>
      <ProTable<subEventListData>
        pagination={{
          showSizeChanger: true,
        }}
        onSubmit={() => {
          setRouteParamsState({});
        }}
        form={{ initialValues: { ...routeParamsState } }}
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
            type="primary"
            onClick={() => {
              setAddVisibleState(true);
            }}
          >
            <PlusOutlined />
            新增
          </Button>,
        ]}
      />
      <DetailSubEvent
        eventEnums={eventCodeState}
        visible={detailVisibleState}
        onCancel={handleCancel}
        data={subEventRowDataState}
      />
      <HistorySubEvent
        eventEnums={eventCodeState}
        visible={historyVisibleState}
        onCancel={handleCancel}
        data={subEventRollbackRowDataState}
        onRollback={handleRollbackSubmit}
      />
      <EditSubEvent
        visible={editVisibleState}
        onCancel={handleCancel}
        data={subEventRowDataState}
        onSubmit={handleEditSubmit}
      />
      <AddSubEvent
        eventEnums={eventCodeState}
        visible={addVisibleState}
        onCancel={handleCancel}
        onSubmit={handleAddSubmit}
      />
    </PageHeaderWrapper>
  );
};

export default TableList;
