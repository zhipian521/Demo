import React, { FC, Suspense, useEffect, useState } from 'react';
import { Dispatch } from 'umi';
import { GridContent } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { StateType as EnumsStateType } from '@/models/enums';
import { DROP_LIST_SEPARATOR } from '@/constant';
import { analysisReqParams } from '@/pages/check-analysis/data';
import moment from 'moment';
import { StateType } from './model';

const RuleLineChart = React.lazy(() => import('./components/RuleLineChart'));

interface RuleCodeProps {
  ruleAnalysisModel: StateType;
  enumsModel: EnumsStateType;
  dispatch: Dispatch;
  loading: boolean;
}

const RuleAnalysis: FC<RuleCodeProps> = ({ dispatch, ruleAnalysisModel, enumsModel, loading }) => {
  const [currentReqState, setCurrentReqState] = useState<analysisReqParams>();
  const [lastTimeActiveKeyState, setLastTimeActiveKeyState] = useState<number>(30);
  const [autoRefreshTimeState, setAutoRefreshTimeState] = useState<number>(0);
  const [timeRangeState, setTimeRangeState] = useState<string[]>();
  useEffect(() => {
    dispatch({
      type: 'enumsModel/fetchRule',
    });
  }, [1]);

  useEffect(() => {
    if (enumsModel.ruleEnums && enumsModel.ruleEnums.length > 0) {
      const { key } = enumsModel.ruleEnums[0];
      const startTime = moment()
        .add(-lastTimeActiveKeyState, 'minutes')
        .format('YYYY-MM-DD HH:mm:ss');
      const endTime = moment().format('YYYY-MM-DD HH:mm:ss');
      setCurrentReqState({ ruleCode: key, endTime, startTime });
      dispatch({
        type: 'ruleAnalysisModel/fetch',
        payload: { ruleCode: key, endTime, startTime },
      });
    }
  }, [enumsModel.ruleEnums]);

  useEffect(() => {
    if (autoRefreshTimeState <= 0) {
      return () => {};
    }
    const timer = setInterval(() => {
      const startTime = moment()
        .add(-lastTimeActiveKeyState, 'minutes')
        .format('YYYY-MM-DD HH:mm:ss');
      const endTime = moment().format('YYYY-MM-DD HH:mm:ss');
      const timeRangeArray = [startTime, endTime];
      setTimeRangeState(timeRangeArray);
      dispatch({
        type: 'ruleAnalysisModel/fetch',
        payload: {
          ...currentReqState,
          endTime,
          startTime,
        },
      });
    }, autoRefreshTimeState);
    return () => clearTimeout(timer);
  }, [currentReqState, autoRefreshTimeState]);

  if (!ruleAnalysisModel || !enumsModel.ruleEnums || enumsModel.ruleEnums.length === 0) {
    return null;
  }
  const {
    ruleAnalysisData: { ruleChartData, timeSpan },
  } = ruleAnalysisModel;

  const handleSearch = (values: analysisReqParams) => {
    let tabKey = values.ruleCode;
    if (values.ruleCode.includes(DROP_LIST_SEPARATOR)) {
      [tabKey] = values.ruleCode.split(DROP_LIST_SEPARATOR);
    }
    const req = { ...values };
    req.ruleCode = tabKey;
    setCurrentReqState(req);
    dispatch({
      type: 'ruleAnalysisModel/fetch',
      payload: { ...req },
    });
  };

  const handleAutoRefreshChange = (key: number) => {
    setAutoRefreshTimeState(key);
  };

  const handleLastTimeChange = (key: number) => {
    setLastTimeActiveKeyState(key);
  };

  return (
    <GridContent>
      <React.Fragment>
        <Suspense fallback={null}>
          <RuleLineChart
            timeRange={timeRangeState}
            defaultValues={currentReqState}
            loading={loading}
            ruleDataType={enumsModel.ruleEnums}
            ruleChartData={ruleChartData}
            timeSpan={timeSpan}
            handleSearch={handleSearch}
            handleAutoRefreshChange={handleAutoRefreshChange}
            autoRefreshTimeActiveKey={autoRefreshTimeState}
            lastTimeActiveKey={lastTimeActiveKeyState}
            handleLastTimeChange={handleLastTimeChange}
          />
        </Suspense>
      </React.Fragment>
    </GridContent>
  );
};

export default connect(
  ({
    loading,
    enumsModel,
    ruleAnalysisModel,
  }: {
    enumsModel: EnumsStateType;
    ruleAnalysisModel: StateType;
    loading: { effects: { [key: string]: boolean } };
  }) => ({
    enumsModel,
    ruleAnalysisModel,
    loading: loading.effects['ruleAnalysisModel/fetch'],
  }),
)(RuleAnalysis);
