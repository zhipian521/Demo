import React, { useEffect, useRef, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Tooltip, Select } from 'antd';
import { queryEnums } from '@/services/enums';
import moment from 'moment';
import { dataQualityListData, dataQualityQueryParamsData } from './data.d';
import { queryDataQuality } from './service';
import { history } from 'umi';
import { DROP_LIST_SEPARATOR } from '@/constant';

// const { Option } = AutoComplete;

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

  const handleSubmit = (
    params?: dataQualityQueryParamsData & { pageSize?: number; current?: number },
  ) => {
    const data = { ruleCode: undefined, ...params };
    if (params && params.ruleCode && params.ruleCode.includes(DROP_LIST_SEPARATOR)) {
      const [ruleCode] = params.ruleCode.split(DROP_LIST_SEPARATOR);
      data.ruleCode = ruleCode;
    }
    return queryDataQuality({ bizDate: moment(new Date()).format('YYYY-MM-DD'), ...data });
  };

  const ruleCodeRenderFormItem = (
    table: ProColumns<dataQualityListData>,
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

  const columns: ProColumns<dataQualityListData>[] = [
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
      dataIndex: 'ruleCode',
      hideInSearch: true,
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
      title: '接收到总数',
      dataIndex: 'receivedCount',
      hideInSearch: true,
    },
    {
      title: '采样总数',
      dataIndex: 'samplingCount',
      hideInSearch: true,
    },
    {
      title: '核对失败总数',
      dataIndex: 'failedCount',
      hideInSearch: true,
      render: (_, row) => (
        <Tooltip title="查看详情">
          <a
            onClick={() => {
              history.push({
                pathname: '/check-abnormal/check-error-list',
                state: {
                  ruleCode: row.ruleCode,
                  // handleStatus: 9,
                  startTime: moment(new Date(row.collectTime).toLocaleDateString()).format(
                    'YYYY-MM-DD HH:mm:ss',
                  ),
                  endTime: moment(new Date(row.collectTime).setHours(23, 59, 59)).format(
                    'YYYY-MM-DD HH:mm:ss',
                  ),
                },
              });
            }}
          >
            {row.failedCount}
          </a>
        </Tooltip>
      ),
    },
    {
      title: '限流总数',
      dataIndex: 'sentinelCount',
      hideInSearch: true,
    },
    // {
    //   title: '花费时间(ms)',
    //   dataIndex: 'costTime',
    //   hideInSearch: true,
    // },
    {
      title: '采集时间',
      dataIndex: 'collectTime',
      valueType: 'date',
      hideInSearch: true,
    },
    {
      title: '日期',
      dataIndex: 'bizDate',
      valueType: 'date',
      hideInTable: true,
    },
  ];

  return (
    <PageHeaderWrapper>
      <ProTable<dataQualityListData>
        pagination={{
          showSizeChanger: true,
        }}
        form={{ initialValues: { bizDate: moment(new Date(), 'YYYY/MM/DD') } }}
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
