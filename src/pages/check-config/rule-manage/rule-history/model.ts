import { Effect, Reducer } from 'umi';
import { message } from 'antd';
import { ruleHistoryData } from '../data';
import { queryRuleHistory, filterRollBack, checkRollBack } from '../service';

export interface StateType {
  ruleHistoryData: ruleHistoryData;
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
    filterRollBack: Effect;
    checkRollBack: Effect;
    scriptRollBack: Effect;
  };
  reducers: {
    show: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'ruleHistoryModel',

  state: {
    ruleHistoryData: {},
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryRuleHistory, payload);
      yield put({
        type: 'show',
        payload: response,
      });
    },
    *filterRollBack({ payload }, { call }) {
      const response = yield call(filterRollBack, payload);
      if (response.code === 200) {
        message.success('过滤脚本回滚成功');
      }
    },
    *checkRollBack({ payload }, { call }) {
      const response = yield call(checkRollBack, payload);
      if (response.code === 200) {
        message.success('核对脚本回滚成功');
      }
    },
    *scriptRollBack({ payload }, { call }) {
      const response = yield call(checkRollBack, payload);
      if (response.code === 200) {
        message.success('Groovy扩展类脚本回滚成功');
      }
    },
  },

  reducers: {
    show(state, { payload }) {
      return {
        ...state,
        ruleHistoryData: { ...payload.data },
      };
    },
  },
};

export default Model;
