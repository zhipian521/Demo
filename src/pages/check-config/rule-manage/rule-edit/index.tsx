import { Tabs } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import { Dispatch, useLocation } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { StateType as EnumsStateType } from '@/models/enums';
import * as qs from 'query-string';
import { StateType } from './model';
import BaseConfig from './components/BaseConfig';
import ScriptConfig from './components/ScriptConfig';

const { TabPane } = Tabs;

interface RuleEditProps {
  dispatch: Dispatch;
  submitting: boolean;
  enumsModel: EnumsStateType;
  ruleEditModel: StateType;
}

interface RouteParams {
  ruleCode?: string;
}

const RuleEdit: FC<RuleEditProps> = (props) => {
  const location = useLocation();
  const [routeParamsState] = useState<RouteParams>(qs.parse(location.search) as RouteParams);
  useEffect(() => {
    props.dispatch({
      type: 'ruleEditModel/fetch',
      payload: routeParamsState,
    });
  }, [1]);

  return (
    <PageHeaderWrapper content="">
      <div className="card-container">
        <Tabs defaultActiveKey="1" type="card" size="large">
          <TabPane tab={<span>基础配置</span>} key="1">
            <BaseConfig />
          </TabPane>

          <TabPane tab={<span>脚本配置</span>} key="2">
            <ScriptConfig />
          </TabPane>
        </Tabs>
      </div>
    </PageHeaderWrapper>
  );
};

export default connect(
  ({
    loading,
    ruleEditModel,
    enumsModel,
  }: {
    ruleEditModel: StateType;
    enumsModel: EnumsStateType;
    loading: { effects: { [key: string]: boolean } };
  }) => ({
    ruleEditModel,
    enumsModel,
    submitting: loading.effects['ruleEditModel/submit'],
  }),
)(RuleEdit);
