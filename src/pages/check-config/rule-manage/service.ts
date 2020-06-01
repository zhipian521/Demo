import request from '@/utils/request';
import { ruleQueryParamsData } from './data.d';

export async function queryRule(params?: ruleQueryParamsData) {
  return request('/api/rule/pageSelectRule', {
    params,
  });
}

export async function queryRuleDetail(params: any) {
  return request('/api/rule/selectRuleByRuleCode', {
    params,
  });
}

export async function queryRuleMockData(params: any) {
  return request('/api/mock/obtainRuleMockData', {
    params,
  });
}

export async function updateRuleMockData(params: any) {
  return request('/api/mock/updateRuleMockData', {
    method: 'POST',
    data: params,
  });
}

export async function addRuleMockData(params: any) {
  return request('/api/mock/createRuleMockData', {
    method: 'POST',
    data: params,
  });
}

export async function addRule(params: any) {
  return request('/api/rule/createRule', {
    method: 'POST',
    data: params,
  });
}

export async function updateRule(params: any) {
  return request('/api/rule/updateRule', {
    method: 'PUT',
    data: params,
  });
}

export async function queryRuleHistory(params?: {}) {
  return request('/api/rule/obtainLastVersion', {
    params,
  });
}

export async function filterRollBack(params: any) {
  return request('/api/rule/rollBack', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function checkRollBack(params: any) {
  return request('/api/rule/rollBack', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
