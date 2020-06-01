import request from '@/utils/request';

export async function fastDemote(params: any) {
  return request('/api/demote/fastDemote', {
    method: 'PUT',
    data: params,
  });
}

export async function fastRestore(params: any) {
  return request('/api/demote/fastRestore', {
    method: 'PUT',
    data: params,
  });
}

export async function samplingDemote(params: any) {
  return request('/api/demote/samplingDemote', {
    method: 'PUT',
    data: params,
  });
}
