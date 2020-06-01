import { Effect, Reducer } from 'umi';

import { ruleDetailData } from '../data';
import { queryRuleDetail, queryRuleMockData } from '../service';

export interface StateType {
  ruleDetailData: ruleDetailData;
}
export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
  };
  reducers: {
    show: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'ruleDetailModel',

  state: {
    ruleDetailData: {
      validTime: [],
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryRuleDetail, payload);
      const res = yield call(queryRuleMockData, payload);
      yield put({
        type: 'show',
        payload: { ...response.data, ...res.data },
      });
    },
  },

  reducers: {
    show(state, { payload }) {
      return {
        ...state,
        ruleDetailData: { ...payload },
      };
    },
  },
};

export default Model;
