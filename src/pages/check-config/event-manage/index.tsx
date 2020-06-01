import React, { useEffect, useRef, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { Select } from 'antd';
import { RouteComponentProps } from 'react-router';
import { queryEnums } from '@/services/enums';
import { history, useLocation } from 'umi';
import { DROP_LIST_SEPARATOR } from '@/constant';
import { eventListData, eventQueryParamsData } from './data.d';
import { queryEventList } from './service';

interface RouteParams {
  subjectCode?: string;
}

const TableList: React.FC<RouteComponentProps> = () => {
  const location = useLocation();
  const actionRef = useRef<ActionType>();
  const [subjectCodeState, setSubjectCodeState] = useState<any>();
  const [eventCodeState, setEventCodeState] = useState<any>();
  const [routeParamsState, setRouteParamsState] = useState<RouteParams>(
    location.state as RouteParams,
  );

  useEffect(() => {
    queryEnums({
      dropType: 'subject',
    }).then((r) => {
      const data = {};
      if (r.code === 200) {
        r.data.map((item: { key: string; val: string }) => {
          data[item.key] = item.val;
          return item;
        });
        setSubjectCodeState(r.data);
      }
    });
    queryEnums({
      dropType: 'event',
    }).then((r) => {
      if (r.code === 200) {
        setEventCodeState(r.data);
      }
    });
  }, [1]);

  const subjectCodeRenderFormItem = (
    table: ProColumns<eventListData>,
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

  const eventCodeRenderFormItem = (
    table: ProColumns<eventListData>,
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

  const handleSubmit = (
    params?: eventQueryParamsData & { pageSize?: number; current?: number },
  ) => {
    const data = { subjectCode: undefined, eventCode: undefined, ...params };
    if (params && params.subjectCode && params.subjectCode.includes(DROP_LIST_SEPARATOR)) {
      const [subjectCode] = params.subjectCode.split(DROP_LIST_SEPARATOR);
      data.subjectCode = subjectCode;
    }
    if (params && params.eventCode && params.eventCode.includes(DROP_LIST_SEPARATOR)) {
      const [eventCode] = params.eventCode.split(DROP_LIST_SEPARATOR);
      data.eventCode = eventCode;
    }
    return queryEventList({ ...data, ...routeParamsState });
  };

  const columns: ProColumns<eventListData>[] = [
    {
      title: '主题',
      dataIndex: 'subjectCode',
      hideInTable: true,
      renderFormItem: subjectCodeRenderFormItem,
    },
    {
      title: '事件',
      dataIndex: 'eventCode',
      hideInTable: true,
      renderFormItem: eventCodeRenderFormItem,
    },
    {
      title: '主题编码',
      dataIndex: 'subjectCode',
      hideInSearch: true,
    },
    {
      title: '事件信息',
      hideInSearch: true,
      render: (text, row) => {
        return (
          <>
            <div>事件编码：{row.eventCode}</div>
            <div>事件名称：{row.eventName}</div>
          </>
        );
      },
    },
    {
      title: '事件规则',
      dataIndex: 'eventRule',
      hideInSearch: true,
      width: 240,
      copyable: true,
      ellipsis: true,
    },
    {
      title: '子事件总数',
      dataIndex: 'eventSubCount',
      render: (_, row) => (
        <a
          onClick={() => {
            history.push({
              pathname: '/check-config/sub-event-manage',
              state: {
                eventCode: row.eventCode,
              },
            });
          }}
        >
          {row.eventSubCount}
        </a>
      ),
      hideInSearch: true,
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
  ];

  return (
    <PageHeaderWrapper>
      <ProTable<eventListData>
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
      />
    </PageHeaderWrapper>
  );
};

export default TableList;
