import { Effect, Reducer } from 'umi';
import { message } from 'antd';
import { history } from '@@/core/history';
import { queryRuleDetail, queryRuleMockData, updateRule, updateRuleMockData } from '../service';
import { ruleDetailData } from '../data';

export interface StateType {
  ruleDetailData: ruleDetailData;
}

export interface ModelType {
  namespace: string;
  state: {};
  effects: {
    fetch: Effect;
    submit: Effect;
  };
  reducers: {
    show: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'ruleEditModel',

  state: {},

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryRuleDetail, payload);
      const res = yield call(queryRuleMockData, payload);
      yield put({
        type: 'show',
        payload: { ...response.data, ...res.data },
      });
    },
    *submit({ payload }, { call }) {
      const resp = yield call(updateRule, payload);
      const res = yield call(updateRuleMockData, payload);
      if (resp.code === 200 && res.code === 200) {
        message.success('规则编辑成功');
        history.push({ pathname: '/check-config/rule-manage' });
      } else {
        message.error('规则编辑失败');
      }
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
