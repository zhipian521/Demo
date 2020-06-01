import { Effect, Reducer } from '@@/plugin-dva/connect';
import { fetchData } from '@/pages/check-report-chart/service';
import { reportChartListData } from '@/pages/check-report-chart/data';

export interface StateType {
  reportChartData: reportChartListData[];
  top10ExceptionData: reportChartListData[];
  samplingCount: number;
  failedCount: number;
}

export interface ModelType {
  namespace: string;
  state: StateType;

  effects: {
    fetchData: Effect;
  };

  reducers: {
    fetchDataReducers: Reducer<StateType>;
  };
}

const ReportChartModel: ModelType = {
  namespace: 'reportChartModel',

  state: {
    reportChartData: [],
    top10ExceptionData: [],
    samplingCount: 0,
    failedCount: 0,
  },

  effects: {
    *fetchData({ payload }, { call, put }) {
      const resp = yield call(fetchData, payload);
      if (resp.code === 200) {
        yield put({
          type: 'fetchDataReducers',
          payload: {
            reportChartData: resp.data.allData,
            top10ExceptionData: resp.data.top10ExceptionData,
            samplingCount: resp.data.samplingCount,
            failedCount: resp.data.failedCount,
          },
        });
      }
    },
  },

  reducers: {
    fetchDataReducers(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

export default ReportChartModel;
