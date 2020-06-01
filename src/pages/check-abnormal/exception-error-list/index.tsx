import React, { useEffect, useRef, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { Select } from 'antd';
import { queryEnums } from '@/services/enums';
import { exceptionErrorListData, exceptionErrorQueryParamsData } from './data.d';
import { queryExceptionErrorList } from './service';
import { DROP_LIST_SEPARATOR } from '@/constant';

const CheckErrorList: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const [ruleCodeState, setRuleCodeState] = useState<any>();
  const [ruleCodeEnumState, setRuleCodeEnumState] = useState<any>();

  useEffect(() => {
    queryEnums({
      dropType: 'rule',
    }).then((r) => {
      if (r.code === 200) {
        const data = {};
        r.data.map((item: { key: string; val: string }) => {
          data[item.key] = item.val;
          return null;
        });
        setRuleCodeState(r.data);
        setRuleCodeEnumState(data);
      }
    });
  }, [1]);

  const ruleCodeRenderFormItem = (
    table: ProColumns<exceptionErrorListData>,
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
      <Select placeholder="支持编码或名称搜索" showSearch allowClear onChange={props.onChange}>
        {options}
      </Select>
    );
  };

  const handleSubmit = (
    params?: exceptionErrorQueryParamsData & { pageSize?: number; current?: number },
  ) => {
    const data = { ruleCode: undefined, ...params };
    if (params && params.ruleCode && params.ruleCode.includes(DROP_LIST_SEPARATOR)) {
      const [ruleCode] = params.ruleCode.split(DROP_LIST_SEPARATOR);
      data.ruleCode = ruleCode;
    }
    return queryExceptionErrorList(data);
  };

  const columns: ProColumns<exceptionErrorListData>[] = [
    {
      title: '规则名称',
      dataIndex: 'ruleCode',
      valueEnum: ruleCodeEnumState,
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: '规则编码',
      dataIndex: 'ruleCode',
      renderFormItem: ruleCodeRenderFormItem,
      hideInTable: true,
    },
    {
      title: '规则信息',
      hideInSearch: true,
      width: 220,
      render: (text, row) => {
        return (
          <>
            <div>规则编码：{row.ruleCode}</div>
            <div>规则名称：{ruleCodeEnumState ? ruleCodeEnumState[row.ruleCode] : null}</div>
          </>
        );
      },
    },
    {
      title: '异常信息',
      dataIndex: 'exceptionContent',
      hideInSearch: true,
      ellipsis: true,
      copyable: true,
      width: 500,
    },
    {
      title: '操作信息',
      dataIndex: 'gmtCreated',
      valueType: 'dateTime',
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
      title: '开始时间',
      dataIndex: 'startTime',
      valueType: 'dateTime',
      hideInTable: true,
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      valueType: 'dateTime',
      hideInTable: true,
    },
  ];

  return (
    <PageHeaderWrapper>
      <ProTable<exceptionErrorListData>
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
      />
    </PageHeaderWrapper>
  );
};

export default CheckErrorList;
