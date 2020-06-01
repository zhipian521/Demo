import {
  ErrorTrackSubmitData,
  errorTrackQueryParamsData,
} from '@/pages/check-abnormal/check-error-track/data';
import request from '@/utils/request';

export async function queryErrorTrackList(params?: errorTrackQueryParamsData) {
  return request('/api/question/pageSelect', {
    params,
  });
}

export async function createQuestion(params?: ErrorTrackSubmitData) {
  return request('/api/question/create', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
export async function updateQuestion(params?: ErrorTrackSubmitData) {
  return request('/api/question/update', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}

export async function resolveQuestion(params?: ErrorTrackSubmitData) {
  return request('/api/question/resolve', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
