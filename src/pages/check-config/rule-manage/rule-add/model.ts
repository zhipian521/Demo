import { Effect } from 'umi';
import { message } from 'antd';
import { history } from '@@/core/history';
import { addRule, addRuleMockData } from '../service';

export interface ModelType {
  namespace: string;
  state: {};
  effects: {
    submit: Effect;
  };
}

const Model: ModelType = {
  namespace: 'ruleAddModel',

  state: {},

  effects: {
    *submit({ payload }, { call }) {
      console.log(payload);
      const resp = yield call(addRule, payload);
      const res = yield call(addRuleMockData, payload);
      if (resp.code === 200 && res.code === 200) {
        message.success('规则提交成功');
        history.push({ pathname: '/check-config/rule-manage' });
      } else {
        message.error('规则提交失败');
      }
    },
  },
};

export default Model;
