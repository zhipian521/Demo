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
  namespace: 'flowMockModel',

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
      if (resp.code === 200) {
        message.success('流程MOCK成功');
      } else {
        message.error('流程MOCK失败');
      }
      yield put({
        type: 'submitReducers',
        payload: resp,
      });
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
