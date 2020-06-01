import request from '@/utils/request';
import { subEventQueryParamsData, subEventSubmitData } from './data.d';

export async function querySubEvent(params?: subEventQueryParamsData) {
  return request('/api/event/pageSelectSubEventList', {
    params,
  });
}

export async function querySubEventByCode(params?: subEventQueryParamsData) {
  return request('/api/event/obtainSubEventByCode', {
    params,
  });
}

export async function querySubEventHistory(params?: {}) {
  return request('/api/version/obtainLastVersion', {
    params,
  });
}

export async function addSubEvent(params: subEventSubmitData) {
  return request('/api/event/createSubEvent', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateSubEvent(params: subEventSubmitData) {
  return request('/api/event/updateSubEvent', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
export async function rollbackSubEvent(params: {}) {
  return request('/api/version/rollBack', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
