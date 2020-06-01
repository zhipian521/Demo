import request from '@/utils/request';

export async function ruleMock(params: any) {
  return request('/api/mock/mqFlow', {
    method: 'POST',
    data: params,
  });
}
