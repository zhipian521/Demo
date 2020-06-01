import { Effect, Reducer } from 'umi';
import { queryErrorTrackList } from '@/pages/check-abnormal/check-error-track/service';
import { querySubjectList, updateSubject } from '@/pages/check-config/subject-manage/service';
import { message } from 'antd';
import { fastDemote, fastRestore, samplingDemote } from '@/pages/check-worktable/service';
import { QuickActionsData, CheckErrorTrackData, SubjectInfoData, RuleInfoData } from './data.d';
import { queryRule, updateRule } from '../check-config/rule-manage/service';

export interface StateType {
  quickActionsData: QuickActionsData[];
  errorTrackData: CheckErrorTrackData[];
  subjectInfoData?: SubjectInfoData;
  ruleInfoData?: RuleInfoData;
}

export interface ModelType {
  namespace: string;
  state: StateType;
  reducers: {
    save: Reducer<StateType>;
    clear: Reducer<StateType>;
  };
  effects: {
    init: Effect;
    fetchQuickActionsData: Effect;
    fetchErrorTrack: Effect;
    fetchSubjectInfo: Effect;
    fetchSubjectDemote: Effect;
    fetchRuleInfo: Effect;
    fetchRuleDemote: Effect;
    fetchFastDemote: Effect;
    fetchFastRestore: Effect;
    fetchSampling: Effect;
  };
}

const Model: ModelType = {
  namespace: 'worktableModel',
  state: {
    quickActionsData: [],
    errorTrackData: [],
  },
  effects: {
    *init(_, { put }) {
      yield put({ type: 'fetchQuickActionsData' });
      yield put({ type: 'fetchErrorTrack' });
    },
    *fetchQuickActionsData(_, { put }) {
      yield put({
        type: 'save',
        payload: {
          quickActionsData: [
            // {
            //   id: '1',
            //   title: '配置binlog规则',
            //   href: '#',
            // },
            // {
            //   id: '2',
            //   title: '配置自定义MQ规则',
            //   href: '#',
            // },
            {
              id: '5',
              title: '快速降级',
              href: '#',
            },
            {
              id: '6',
              title: '快速恢复',
              href: '#',
            },
            {
              id: '7',
              title: '采样调整',
              href: '#',
            },
            {
              id: '3',
              title: '主题降级',
              href: '#',
            },
            {
              id: '4',
              title: '规则降级',
              href: '#',
            },
          ],
        },
      });
    },
    *fetchErrorTrack(_, { call, put }) {
      const response = yield call(queryErrorTrackList);
      yield put({
        type: 'save',
        payload: {
          errorTrackData: response.data,
        },
      });
    },
    *fetchSubjectInfo({ payload }, { call, put }) {
      const response = yield call(querySubjectList, payload);
      yield put({
        type: 'save',
        payload: {
          subjectInfoData: response.data[0],
        },
      });
    },
    *fetchSubjectDemote({ payload }, { call }) {
      const response = yield call(updateSubject, payload);
      if (response.code === 200) {
        message.success('主题降级成功');
      } else {
        message.error('主题降级失败');
      }
    },
    *fetchRuleInfo({ payload }, { call, put }) {
      const response = yield call(queryRule, payload);
      yield put({
        type: 'save',
        payload: {
          ruleInfoData: response.data[0],
        },
      });
    },
    *fetchRuleDemote({ payload }, { call }) {
      const response = yield call(updateRule, payload);
      if (response.code === 200) {
        message.success('规则降级成功');
      } else {
        message.error('规则降级失败');
      }
    },
    *fetchFastDemote({ payload }, { call }) {
      const response = yield call(fastDemote, payload);
      if (response.code === 200) {
        message.success('快速降级成功');
      } else {
        message.error('快速降级失败');
      }
    },
    *fetchFastRestore({ payload }, { call }) {
      const response = yield call(fastRestore, payload);
      if (response.code === 200) {
        message.success('快速恢复成功');
      } else {
        message.error('快速恢复失败');
      }
    },
    *fetchSampling({ payload }, { call }) {
      const response = yield call(samplingDemote, payload);
      if (response.code === 200) {
        message.success('采样调整成功');
      } else {
        message.error('采样调整失败');
      }
    },
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clear() {
      return {
        quickActionsData: [],
        errorTrackData: [],
      };
    },
  },
};

export default Model;
