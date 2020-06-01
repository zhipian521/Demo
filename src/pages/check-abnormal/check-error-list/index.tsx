import React, { useEffect, useRef, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { message, Button, Divider, Select, Typography, Tooltip } from 'antd';
import { queryEnums } from '@/services/enums';
import { useLocation } from 'umi';
import * as qs from 'query-string';
import moment from 'moment';
import { DROP_LIST_SEPARATOR } from '@/constant';
import BatchCloseModal from '@/pages/check-abnormal/check-error-list/components/BatchCloseModal';
import { queryCheckErrorList, retry, close, batchCloseFailedByTimeRange } from './service';
import { batchCloseReqParams, checkErrorListData, checkErrorQueryParamsData } from './data.d';

const { Paragraph } = Typography;

interface RouteParams {
  ruleCode?: string;
  startTime?: string;
  endTime?: string;
}

const CheckErrorList: React.FC<{}> = () => {
  const location = useLocation();
  const actionRef = useRef<ActionType>();
  const [ruleCodeState, setRuleCodeState] = useState<any>();
  const [routeParamsState, setRouteParamsState] = useState<RouteParams>({
    ...qs.parse(location.search),
    ...location.state,
  } as RouteParams);

  const [ruleCodeEnumState, setRuleCodeEnumState] = useState<any>();
  const [batchCloseVisibleState, setBatchCloseVisibleState] = useState<boolean>(false);

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
    table: ProColumns<checkErrorListData>,
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

  const onRetryClick = (e: React.MouseEvent | React.KeyboardEvent, ids: (string | number)[]) => {
    e.preventDefault();
    retry({
      ids,
    }).then((r) => {
      if (r.code === 200) {
        message.success('重发成功');
        if (actionRef.current) {
          actionRef.current.reload();
        }
      } else {
        message.error('重发失败');
      }
    });
  };

  const onCloseClick = (e: React.MouseEvent | React.KeyboardEvent, ids: (string | number)[]) => {
    e.preventDefault();
    close({
      ids,
    }).then((r) => {
      if (r.code === 200) {
        message.success('关闭成功');
        if (actionRef.current) {
          actionRef.current.reload();
        } else {
          message.error('关闭失败');
        }
      }
    });
  };

  const getCheckboxProps = (record: checkErrorListData) => ({
    disabled: record && record.handleStatus !== 0 && record.handleStatus !== 9,
  });

  const handleBatchCloseCancel = () => {
    setBatchCloseVisibleState(false);
  };

  const handleBatchCloseSubmit = (values: batchCloseReqParams) => {
    batchCloseFailedByTimeRange({
      ...values,
    }).then((r) => {
      if (r.code === 200) {
        setBatchCloseVisibleState(false);
        message.success('批量关闭成功');
        if (actionRef.current) {
          actionRef.current.reload();
        }
      } else {
        message.error('批量关闭失败');
      }
    });
  };

  const handleSubmit = (
    params?: checkErrorQueryParamsData & { pageSize?: number; current?: number },
  ) => {
    const data = { ruleCode: undefined, handleStatus: undefined, ...params };
    if (params && params.ruleCode && params.ruleCode.includes(DROP_LIST_SEPARATOR)) {
      const [ruleCode] = params.ruleCode.split(DROP_LIST_SEPARATOR);
      data.ruleCode = ruleCode;
    }
    if (params?.handleStatus === '处理失败') {
      data.handleStatus = '9';
    }
    return queryCheckErrorList({ ...data, ...routeParamsState });
  };

  const columns: ProColumns<checkErrorListData>[] = [
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
      dataIndex: 'ruleInfo',
      width: 210,
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
      title: '详情描述',
      dataIndex: 'failContent',
      hideInSearch: true,
      width: 100,
    },
    {
      title: '请求数据',
      dataIndex: 'request',
      hideInSearch: true,
      ellipsis: true,
      copyable: true,
      width: 180,
      render: (text, row) => {
        return (
          <>
            <Tooltip title={row.request} placement="left">
              <Paragraph
                copyable
                ellipsis={{
                  rows: 1,
                  expandable: false,
                }}
                style={{ width: 180 }}
              >
                {row.request}
              </Paragraph>
            </Tooltip>
          </>
        );
      },
    },
    {
      title: '处理信息',
      dataIndex: 'gmtModifiedInfo',
      valueType: 'dateTime',
      hideInSearch: true,
      width: 220,
      render: (text, row) => {
        return (
          <>
            <div>处理人：{row.modifier}</div>
            <div>创建时间：{row.gmtCreated}</div>
            <div>处理时间：{row.gmtModified}</div>
          </>
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'handleStatus',
      width: 80,
      valueEnum: {
        0: '未处理',
        1: '处理中',
        2: '处理成功',
        8: '关闭',
        9: '处理失败',
      },
      formItemProps: { showSearch: false, allowClear: true },
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
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 130,
      render: (text, row) => {
        if (row.handleStatus === 0 || row.handleStatus === 9) {
          return (
            <>
              <a
                onClick={(e) => {
                  onRetryClick(e, [row.id]);
                }}
              >
                重发
              </a>
              <Divider type="vertical" />
              <a
                onClick={(e) => {
                  onCloseClick(e, [row.id]);
                }}
              >
                关闭
              </a>
            </>
          );
        }
        return null;
      },
    },
  ];
  const rowSelection = {
    getCheckboxProps,
  };
  return (
    <PageHeaderWrapper>
      <ProTable<checkErrorListData>
        onSubmit={() => {
          setRouteParamsState({});
        }}
        pagination={{
          showSizeChanger: true,
          // pageSizeOptions: ['1', '5', '10', '50', '100', '500', '1000', '5000'],
        }}
        form={{
          initialValues: {
            ruleCode: routeParamsState.ruleCode ? routeParamsState.ruleCode : undefined,
            startTime: routeParamsState.endTime
              ? moment(routeParamsState.startTime, 'YYYY-MM-DD HH:mm:ss')
              : '',
            endTime: routeParamsState.endTime
              ? moment(routeParamsState.endTime, 'YYYY-MM-DD HH:mm:ss')
              : '',
            handleStatus: routeParamsState.startTime ? undefined : '9',
          },
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
        rowSelection={rowSelection}
        headerTitle="批量操作"
        toolBarRender={(_, { selectedRowKeys }) => [
          selectedRowKeys && selectedRowKeys.length && (
            <>
              <Button
                type="primary"
                danger
                key="batchRetry"
                onClick={(e) => onRetryClick(e, selectedRowKeys)}
              >
                批量重发
              </Button>
              <Divider type="vertical" />
              <Button
                type="primary"
                danger
                key="batchClose"
                onClick={(e) => onCloseClick(e, selectedRowKeys)}
              >
                批量关闭
              </Button>
            </>
          ),
          <Button
            type="primary"
            danger
            key="batchRetry"
            onClick={() => {
              setBatchCloseVisibleState(true);
            }}
          >
            时间段批量关闭
          </Button>,
        ]}
      />
      <BatchCloseModal
        visible={batchCloseVisibleState}
        onCancel={handleBatchCloseCancel}
        onSubmit={handleBatchCloseSubmit}
        ruleCode={routeParamsState.ruleCode}
        startTime={routeParamsState.startTime}
        endTime={routeParamsState.endTime}
      />
    </PageHeaderWrapper>
  );
};

export default CheckErrorList;
