import { Effect, Reducer } from 'umi';
import { queryEnums } from '@/services/enums';
import { enumsRespData } from '@/data/common';

export interface StateType {
  subjectEnums: enumsRespData[];
  eventEnums: enumsRespData[];
  subEventEnums: enumsRespData[];
  ruleEnums: enumsRespData[];
  ruleBySubjectEnums: enumsRespData[];
  alarmEnums: enumsRespData[];
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetchSubject: Effect;
    fetchEvent: Effect;
    fetchRule: Effect;
    fetchSubEvent: Effect;
    fetchAlarm: Effect;
    fetchRuleBySubject: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'enumsModel',

  state: {
    subjectEnums: [],
    eventEnums: [],
    subEventEnums: [],
    ruleEnums: [],
    ruleBySubjectEnums: [],
    alarmEnums: [],
  },

  effects: {
    *fetchSubject(_, { call, put }) {
      const enums = yield call(queryEnums, { dropType: 'subject' });
      yield put({
        type: 'save',
        payload: { subjectEnums: enums.data },
      });
    },
    *fetchEvent(_, { call, put }) {
      const enums = yield call(queryEnums, { dropType: 'event' });
      yield put({
        type: 'save',
        payload: { eventEnums: enums.data },
      });
    },
    *fetchSubEvent({ payload }, { call, put }) {
      const enums = yield call(queryEnums, { dropType: 'subEvent', ...payload });
      yield put({
        type: 'save',
        payload: { subEventEnums: enums.data },
      });
    },
    *fetchRule({ payload }, { call, put }) {
      const enums = yield call(queryEnums, { dropType: 'rule', ...payload });
      yield put({
        type: 'save',
        payload: { ruleEnums: enums.data },
      });
    },
    *fetchRuleBySubject({ payload }, { call, put }) {
      const enums = yield call(queryEnums, { dropType: 'ruleBySubject', ...payload });
      yield put({
        type: 'save',
        payload: { ruleBySubjectEnums: enums.data },
      });
    },
    *fetchAlarm(_, { call, put }) {
      const enums = yield call(queryEnums, { dropType: 'alarm' });
      yield put({
        type: 'save',
        payload: { alarmEnums: enums.data },
      });
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

export default Model;
