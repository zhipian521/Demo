import { Effect, Reducer } from 'umi';
import { message } from 'antd';
import { resultData } from '@/data/common';
import { ruleMock } from './service';

export interface StateType {
  submitResp: resultData;
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    submit: Effect;
  };
  reducers: {
    submitReducers: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'ruleMockModel',

  state: {
    submitResp: {
      code: 0,
      msg: '',
      data: '',
    },
  },

  effects: {
    *submit({ payload }, { call, put }) {
      const resp = yield call(ruleMock, payload);
      yield put({
        type: 'submitReducers',
        payload: resp,
      });
      if (resp.code === 200) {
        message.success('规则MOCK成功');
      } else {
        message.error('规则MOCK失败');
      }
    },
  },
  reducers: {
    submitReducers(state, { payload }) {
      return {
        ...state,
        submitResp: { ...payload },
      };
    },
  },
};

export default Model;
