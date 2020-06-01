import React, { useRef, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import { alarmListData, alarmSubmitData } from './data.d';
import { queryAlarmList, updateAlarm, addAlarm } from './service';
import AddAlarmModal from './components/AddAlarmModal';
import EditAlarmModal from './components/EditAlarmModal';

const TableList: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const [addVisibleState, setAddVisibleState] = useState<boolean>(false);
  const [editVisibleState, setEditVisibleState] = useState<boolean>(false);
  const [alarmRowDataState, setAlarmRowDataState] = useState<alarmListData>();

  const handleCancel = () => {
    setAddVisibleState(false);
    setEditVisibleState(false);
  };

  const handleAddSubmit = (values: alarmSubmitData) => {
    addAlarm({
      ...values,
    }).then((r) => {
      if (r.code === 200) {
        message.success('报警规则新增成功');
        if (actionRef.current) {
          actionRef.current.reload();
          setAddVisibleState(false);
        }
      } else {
        message.error('报警规则新增失败');
      }
    });
  };

  const handleEditSubmit = (values: alarmSubmitData) => {
    updateAlarm({
      ...values,
    }).then((r) => {
      if (r.code === 200) {
        message.success('报警规则更新成功');
        if (actionRef.current) {
          actionRef.current.reload();
          setEditVisibleState(false);
        }
      } else {
        message.error('报警规则更新失败');
      }
    });
  };

  const columns: ProColumns<alarmListData>[] = [
    {
      title: '告警编码',
      dataIndex: 'alarmCode',
      hideInTable: true,
    },
    {
      title: '告警名称',
      dataIndex: 'alarmName',
      hideInTable: true,
    },
    {
      title: '告警信息',
      render: (text, row) => {
        return (
          <>
            <div>告警编码：{row.alarmCode}</div>
            <div>告警名称：{row.alarmName}</div>
          </>
        );
      },
    },
    {
      title: '告警模式',
      dataIndex: 'alarmMode',
      hideInSearch: true,
      valueEnum: {
        1: '按照最近分钟数计算',
        2: '按照当日累计失败数计算',
      },
    },
    {
      title: '时间周期(分)',
      dataIndex: 'lastMinutes',
      hideInSearch: true,
    },
    {
      title: '冷却时间',
      dataIndex: 'coolingTime',
      hideInSearch: true,
    },
    {
      title: '操作信息',
      dataIndex: 'modifier',
      hideInSearch: true,
      render: (text, row) => {
        return (
          <>
            <div>操作员：{row.modifier}</div>
            <div>时间：{row.gmtCreated}</div>
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
              setEditVisibleState(true);
              setAlarmRowDataState(row);
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
      <ProTable<alarmListData>
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
        request={(params) => queryAlarmList(params)}
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
      <AddAlarmModal visible={addVisibleState} onCancel={handleCancel} onSubmit={handleAddSubmit} />
      <EditAlarmModal
        visible={editVisibleState}
        onCancel={handleCancel}
        onSubmit={handleEditSubmit}
        data={alarmRowDataState}
      />
    </PageHeaderWrapper>
  );
};

export default TableList;
