import request from '@/utils/request';
import { alarmSubmitData, alarmQueryParamsData } from './data.d';

export async function queryAlarmList(params?: alarmQueryParamsData) {
  return request('/api/alarm/pageSelectAlarm', {
    params,
  });
}

export async function addAlarm(params: alarmSubmitData) {
  return request('/api/alarm/createAlarm', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateAlarm(params: alarmSubmitData) {
  return request('/api/alarm/updateAlarm', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
