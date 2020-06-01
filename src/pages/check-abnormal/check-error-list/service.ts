import request from '@/utils/request';
import { batchCloseReqParams, checkErrorQueryParamsData } from './data.d';

export async function queryCheckErrorList(params?: checkErrorQueryParamsData) {
  return request('/api/failed/select', {
    params,
  });
}

export async function retry(params: { ids: (string | number)[] }) {
  return request('/api/failed/batchRetry', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function close(params: { ids: (string | number)[] }) {
  return request('/api/failed/batchClose', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function countByRuleCodeAndTime(params: batchCloseReqParams) {
  return request('/api/failed/countByRuleCodeAndTime', {
    params,
  });
}

export async function batchCloseFailedByTimeRange(params: batchCloseReqParams) {
  return request('/api/failed/batchCloseFailedByTimeRange', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
