import request from '@/utils/request';
import { subjectSubmitData, subjectQueryParamsData } from './data.d';

export async function querySubjectList(params?: subjectQueryParamsData) {
  return request('/api/subject/pageSelectAllSubject', {
    params,
  });
}

export async function addSubject(params: subjectSubmitData) {
  return request('/api/subject/createSubject', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateSubject(params: subjectSubmitData) {
  return request('/api/subject/updateSubject', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
