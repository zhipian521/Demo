import request from '@/utils/request';
import { eventSubmitData, eventQueryParamsData } from './data.d';

export async function queryEventList(params?: eventQueryParamsData) {
  return request('/api/event/pageSelectEvent', {
    params,
  });
}

export async function queryEventByCode(params?: eventQueryParamsData) {
  return request('/api/event/obtainEventByCode', {
    params,
  });
}

export async function addEvent(params: eventSubmitData) {
  return request('/api/event/createEvent', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateEvent(params: eventSubmitData) {
  return request('/api/event/updateEvent', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
