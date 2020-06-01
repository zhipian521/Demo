import { Effect, Reducer } from 'umi';
import { message } from 'antd';
import { resultData } from '@/data/common';
import { scriptMock } from './service';
import { queryRuleDetail, queryRuleMockData } from '../../check-config/rule-manage/service';
import { queryEventByCode } from '../../check-config/event-manage/service';
import { querySubEventByCode } from '../../check-config/sub-event-manage/service';

export interface StateType {
  submitResp: resultData;
  script: string;
  leftData: string;
  rightData: string;
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    submit: Effect;
    fetchRuleByCode: Effect;
    fetchEventByCode: Effect;
    fetchSubEventByCode: Effect;
  };
  reducers: {
    submitReducers: Reducer<StateType>;
    queryRuleByCode: Reducer<StateType>;
    queryEventByCode: Reducer<StateType>;
    querySubEventByCode: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'scriptMockModel',

  state: {
    submitResp: {
      code: 0,
      msg: '',
      data: '',
    },
    script: '',
    leftData: '',
    rightData: '',
  },

  effects: {
    *submit({ payload }, { call, put }) {
      const resp = yield call(scriptMock, payload);
      if (resp.code === 200) {
        message.success('脚本MOCK成功');
      } else {
        message.error('脚本MOCK失败');
      }
      yield put({
        type: 'submitReducers',
        payload: { submitResp: resp },
      });
    },

    *fetchRuleByCode({ payload }, { call, put }) {
      const resp = yield call(queryRuleDetail, payload);
      const res = yield call(queryRuleMockData, payload);
      yield put({
        type: 'queryRuleByCode',
        payload: {
          script: payload.type === 3 ? resp.data.filterRule : resp.data.equalsRule,
          leftData: res.data.leftData,
          rightData: res.data.rightData,
        },
      });
    },

    *fetchEventByCode({ payload }, { call, put }) {
      const resp = yield call(queryEventByCode, payload);
      yield put({
        type: 'queryEventByCode',
        payload: { script: resp.data.eventRule },
      });
    },

    *fetchSubEventByCode({ payload }, { call, put }) {
      const resp = yield call(querySubEventByCode, payload);
      yield put({
        type: 'querySubEventByCode',
        payload: { script: resp.data.subEventRule },
      });
    },
  },

  reducers: {
    submitReducers(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    queryRuleByCode(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    queryEventByCode(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    querySubEventByCode(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

export default Model;
