import React, { useEffect, useRef, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import {
  ErrorTrackSubmitData,
  checkErrorTrackData,
  errorTrackQueryParamsData,
} from '@/pages/check-abnormal/check-error-track/data';
import {
  createQuestion,
  queryErrorTrackList,
  updateQuestion,
  resolveQuestion,
} from '@/pages/check-abnormal/check-error-track/service';
import { diffTime } from '@/utils/momentUtils';
import { StateType as EnumsStateType, StateType } from '@@/plugin-dva/connect';
import { connect } from 'dva';
import { queryEnums } from '@/services/enums';
import ResolveQuestionModal from '@/pages/check-abnormal/check-error-track/components/ResolveQuestionModal';
import AddQuestionModal from '@/pages/check-abnormal/check-error-track/components/AddQuestionModal';
import UpdateQuestionModal from '@/pages/check-abnormal/check-error-track/components/UpdateQuestionModal.tsx';
import { Button, Divider, message, Select } from 'antd';
import { DROP_LIST_SEPARATOR } from '@/constant';
import { useLocation } from 'umi';

interface ErrorTrackParams {
  id?: string;
}

const CheckErrorTrack: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const location = useLocation();
  const [ruleEnumsState, setRuleEnumsState] = useState<any>();
  const [resolvePanelVisibleState, setResolvePanelVisibleState] = useState<boolean>(false);
  const [rowDataState, setRowDataState] = useState<checkErrorTrackData>();
  const [ruleCodeState, setRuleCodeState] = useState<any>();
  const [errorTrackParamsState, setErrorTrackParamsState] = useState<ErrorTrackParams>(
    location.state as ErrorTrackParams,
  );
  const [addQuestionVisibleState, setAddQuestionVisibleState] = useState<boolean>(false);
  const [updateQuestionVisibleState, setUpdateQuestionVisibleState] = useState<boolean>(false);

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
        setRuleEnumsState(data);
        setRuleCodeState(r.data);
      }
    });
  }, [1]);

  const handleSubmit = (
    params?: errorTrackQueryParamsData & { pageSize?: number; current?: number },
  ) => {
    const data = { ruleCode: undefined, ...params };
    if (params && params.ruleCode && params.ruleCode.includes(DROP_LIST_SEPARATOR)) {
      const [ruleCode] = params.ruleCode.split(DROP_LIST_SEPARATOR);
      data.ruleCode = ruleCode;
    }
    return queryErrorTrackList({ ...data, ...errorTrackParamsState });
  };

  const handleResolve = () => {
    setResolvePanelVisibleState(true);
  };
  const handleUpdate = () => {
    setUpdateQuestionVisibleState(true);
  };
  const handleCancel = () => {
    setResolvePanelVisibleState(false);
    setAddQuestionVisibleState(false);
    setUpdateQuestionVisibleState(false);
  };

  const handleCreateSubmit = (params: ErrorTrackSubmitData) => {
    createQuestion(params).then((r) => {
      if (r.code === 200) {
        message.success('新增问题成功');
        setAddQuestionVisibleState(false);
        if (actionRef.current) {
          actionRef.current.reload();
        }
      } else {
        message.error('新增问题失败');
      }
    });
  };
  const handleResolveSubmit = (params: ErrorTrackSubmitData) => {
    resolveQuestion(params).then((r) => {
      if (r.code === 200) {
        message.success('问题已解决');
        setResolvePanelVisibleState(false);
        if (actionRef.current) {
          actionRef.current.reload();
        }
      } else {
        message.error('提交失败');
      }
    });
  };
  const handleUpdateSubmit = (params: ErrorTrackSubmitData) => {
    updateQuestion(params).then((r) => {
      if (r.code === 200) {
        message.success('修改成功');
        setUpdateQuestionVisibleState(false);
        if (actionRef.current) {
          actionRef.current.reload();
        }
      } else {
        message.error('修改失败');
      }
    });
  };

  const ruleCodeRenderFormItem = (
    table: ProColumns<checkErrorTrackData>,
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

  const columns: ProColumns<checkErrorTrackData>[] = [
    {
      title: '规则',
      dataIndex: 'ruleCode',
      hideInTable: true,
      renderFormItem: ruleCodeRenderFormItem,
    },
    {
      title: '规则信息',
      hideInSearch: true,
      width: 220,
      render: (text, row) => {
        return (
          <>
            <div>规则编码：{row.ruleCode}</div>
            <div>规则名称：{ruleEnumsState ? ruleEnumsState[row.ruleCode] : null}</div>
          </>
        );
      },
    },
    {
      title: '问题描述',
      dataIndex: 'questionDesc',
      hideInSearch: true,
      ellipsis: true,
      copyable: true,
      width: 110,
    },
    {
      title: '问题追踪',
      dataIndex: 'questionTrack',
      hideInSearch: true,
      ellipsis: true,
      copyable: true,
      width: 110,
    },
    {
      title: '解决方案',
      dataIndex: 'solution',
      hideInSearch: true,
      ellipsis: true,
      copyable: true,
      width: 100,
    },
    {
      title: '处理时长',
      hideInSearch: true,
      width: 80,
      render: (text, row) => {
        if (row.status === 1 && row.gmtModified !== row.gmtCreated) {
          return diffTime(row.gmtCreated.toString(), row.gmtModified.toString());
        }
        return '待处理';
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      valueEnum: {
        0: '未解决',
        1: '已解决',
      },
      formItemProps: { showSearch: false, allowClear: true },
    },
    {
      title: '处理信息',
      hideInSearch: true,
      width: 220,
      render: (text, row) => {
        if (row.status === 1) {
          return (
            <>
              <div>处理人：{row.modifier}</div>
              <div>发生时间：{row.gmtCreated}</div>
              <div>处理时间：{row.gmtModified !== row.gmtCreated ? row.gmtModified : null}</div>
            </>
          );
        }
        return (
          <>
            <div>处理人：{row.modifier}</div>
            <div>发生时间：{row.gmtCreated}</div>
            <div>更新时间：{row.gmtModified !== row.gmtCreated ? row.gmtModified : null}</div>
          </>
        );
      },
    },
    {
      title: '操作',
      hideInSearch: true,
      width: 110,
      render: (text, row) => {
        if (row.status === 0) {
          return (
            <>
              <a
                onClick={() => {
                  handleUpdate();
                  setRowDataState(row);
                }}
              >
                编辑
              </a>
              <Divider type="vertical" />
              <a
                onClick={() => {
                  handleResolve();
                  setRowDataState(row);
                }}
              >
                处理
              </a>
            </>
          );
        }
        return (
          <a
            onClick={() => {
              handleUpdate();
              setRowDataState(row);
            }}
          >
            编辑
          </a>
        );
      },
    },
  ];

  return (
    <PageHeaderWrapper>
      <ProTable<checkErrorTrackData>
        rowKey="id"
        columns={columns}
        actionRef={actionRef}
        request={handleSubmit}
        onSubmit={() => {
          setErrorTrackParamsState({});
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="create"
            onClick={() => {
              setAddQuestionVisibleState(true);
            }}
          >
            新增问题
          </Button>,
        ]}
      />

      <ResolveQuestionModal
        visible={resolvePanelVisibleState}
        onCancel={handleCancel}
        onSubmit={handleResolveSubmit}
        ruleEnums={ruleCodeState}
        rowData={rowDataState}
        ruleObjEnums={ruleEnumsState}
      />
      <AddQuestionModal
        visible={addQuestionVisibleState}
        onCancel={handleCancel}
        onSubmit={handleCreateSubmit}
        ruleEnums={ruleCodeState}
      />
      <UpdateQuestionModal
        visible={updateQuestionVisibleState}
        rowData={rowDataState}
        onCancel={handleCancel}
        onSubmit={handleUpdateSubmit}
        ruleEnums={ruleCodeState}
        ruleObjEnums={ruleEnumsState}
      />
    </PageHeaderWrapper>
  );
};

export default connect(
  ({
    enumsModel,
    checkErrorTrackModel,
  }: {
    enumsModel: EnumsStateType;
    checkErrorTrackModel: StateType;
  }) => ({
    enumsModel,
    checkErrorTrackModel,
  }),
)(CheckErrorTrack);
