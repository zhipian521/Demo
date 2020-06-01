import { Effect, Reducer } from 'umi';
import { ruleAnalysisData } from './data.d';
import { ruleAnalysis } from './service';

export interface StateType {
  ruleAnalysisData: ruleAnalysisData;
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
  };
  reducers: {
    getData: Reducer<StateType>;
  };
}

const initState = {
  ruleAnalysisData: {
    ruleChartData: [],
    timeSpan: 0,
  },
};
const Model: ModelType = {
  namespace: 'ruleAnalysisModel',

  state: initState,

  effects: {
    *fetch({ payload }, { call, put }) {
      const resp = yield call(ruleAnalysis, payload);
      const ruleChartData = [];
      if (resp.data.ruleChartData.length === 0) {
        ruleChartData.push({
          collectTime: new Date().getTime() + 1000 * 60,
          samplingCount: 0,
          failedCount: 0,
        });
      }
      yield put({
        type: 'getData',
        payload: {
          ruleChartData: [...ruleChartData, ...resp.data.ruleChartData],
          timeSpan: resp.data.timeSpan,
        },
      });
    },
  },
  reducers: {
    getData(state, { payload }) {
      return {
        ...state,
        ruleAnalysisData: {
          ruleChartData: payload.ruleChartData,
          timeSpan: payload.timeSpan,
        },
      };
    },
  },
};

export default Model;
