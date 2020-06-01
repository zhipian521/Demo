import React, { useEffect, useRef, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ActionType, ProColumns, ColumnsState } from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Select } from 'antd';
import { queryEnums } from '@/services/enums';
import { history } from 'umi';
import { DROP_LIST_SEPARATOR } from '@/constant';
import { ruleListData, ruleQueryParamsData } from './data.d';
import { queryRule } from './service';

const TableList: React.FC<{}> = () => {
  const [eventCodeState, setEventCodeState] = useState<any>();
  const [ruleCodeState, setRuleCodeState] = useState<any>();
  const [columnsStateMap, setColumnsStateMap] = useState<{
    [key: string]: ColumnsState;
  }>({
    feishuWebhook: {
      show: false,
    },
    httpUrl: {
      show: false,
    },
  });
  useEffect(() => {
    queryEnums({
      dropType: 'event',
    }).then((r) => {
      if (r.code === 200) {
        setEventCodeState(r.data);
      }
    });
    queryEnums({
      dropType: 'rule',
    }).then((r) => {
      const data = {};
      if (r.code === 200) {
        r.data.map((a: { key: string; val: string }) => {
          data[a.key] = a.val;
          return null;
        });
        setRuleCodeState(r.data);
      }
    });
  }, [1]);

  const eventCodeRenderFormItem = (
    table: ProColumns<ruleListData>,
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
      <Select
        placeholder="支持编码或名称搜索"
        showSearch
        allowClear
        onChange={(key: string) => {
          if (props.onChange) props.onChange(key);
        }}
      >
        {options}
      </Select>
    );
  };

  const ruleCodeRenderFormItem = (
    table: ProColumns<ruleListData>,
    props: { value?: any; onChange?: (value: any) => void },
  ) => {
    let options;
    if (ruleCodeState) {
      options = ruleCodeState.map((item: { key: string; val: string }) => (
        <Select.Option key={item.key} value={`${item.key}${DROP_LIST_SEPARATOR}${item.val}`}>
          {item.val}
        </Select.Option>
      ));
    }
    return (
      <Select
        placeholder="支持编码或名称搜索"
        showSearch
        allowClear
        onChange={props.onChange}
        style={{ width: 270 }}
      >
        {options}
      </Select>
    );
  };

  const handleSubmit = (params?: ruleQueryParamsData & { pageSize?: number; current?: number }) => {
    const data = { ruleCode: undefined, eventCode: undefined, ...params };
    if (params && params.ruleCode && params.ruleCode.includes(DROP_LIST_SEPARATOR)) {
      const [ruleCode] = params.ruleCode.split(DROP_LIST_SEPARATOR);
      data.ruleCode = ruleCode;
    }
    if (params && params.eventCode && params.eventCode.includes(DROP_LIST_SEPARATOR)) {
      const [eventCode] = params.eventCode.split(DROP_LIST_SEPARATOR);
      data.eventCode = eventCode;
    }
    return queryRule(data);
  };

  const actionRef = useRef<ActionType>();
  const columns: ProColumns<ruleListData>[] = [
    {
      title: '事件',
      dataIndex: 'eventCode',
      renderFormItem: eventCodeRenderFormItem,
      hideInTable: true,
    },
    {
      title: '事件编码',
      dataIndex: 'eventCode',
      hideInSearch: true,
      width: 180,
    },
    {
      title: '规则',
      dataIndex: 'ruleCode',
      renderFormItem: ruleCodeRenderFormItem,
      hideInTable: true,
    },
    {
      title: '规则信息',
      hideInSearch: true,
      width: 200,
      render: (text, row) => {
        return (
          <>
            <div>规则编码：{row.ruleCode}</div>
            <div>规则名称：{row.ruleName}</div>
          </>
        );
      },
    },
    {
      title: '采样率',
      hideInSearch: true,
      width: 60,
      render: (text, row) => `${row.samplingRate}%`,
    },
    {
      title: 'httpUrl',
      dataIndex: 'httpUrl',
      hideInSearch: true,
      width: 180,
      copyable: true,
      ellipsis: true,
    },
    {
      title: '飞书webHook',
      dataIndex: 'feishuWebhook',
      hideInSearch: true,
      width: 180,
      copyable: true,
      ellipsis: true,
    },
    {
      title: '生效时间',
      hideInSearch: true,
      width: 210,
      render: (text, row) => {
        return (
          <>
            <div>from:{row.validTime[0]}</div>
            <div>to:&nbsp;&nbsp;&nbsp;&nbsp;{row.validTime[1]}</div>
          </>
        );
      },
    },
    {
      title: '操作信息',
      dataIndex: 'creatorInfo',
      hideInSearch: true,
      width: 210,
      render: (text, row) => {
        return (
          <>
            <div>操作员：{row.modifier}</div>
            <div>时间：{row.gmtModified}</div>
          </>
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 180,
      render: (text, row) => (
        <>
          <a
            onClick={() => {
              history.push({
                pathname: `/check-config/rule-manage/rule-detail`,
                query: {
                  ruleCode: row.ruleCode,
                },
              });
            }}
          >
            详情
          </a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              history.push({
                pathname: `/check-config/rule-manage/rule-edit`,
                query: {
                  ruleCode: row.ruleCode,
                },
              });
            }}
          >
            修改
          </a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              history.push({
                pathname: `/check-config/rule-manage/rule-history`,
                query: {
                  ruleCode: row.ruleCode,
                },
              });
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
      <ProTable<ruleListData>
        pagination={{
          showSizeChanger: true,
        }}
        columnsStateMap={columnsStateMap}
        onColumnsStateChange={(map) => setColumnsStateMap(map)}
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
              history.push(`/check-config/rule-manage/rule-add`);
            }}
          >
            <PlusOutlined />
            新建
          </Button>,
        ]}
      />
    </PageHeaderWrapper>
  );
};

export default TableList;
