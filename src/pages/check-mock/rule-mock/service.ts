import request from '@/utils/request';

export async function ruleMock(params: any) {
  return request('/api/mock/check', {
    method: 'POST',
    data: params,
  });
}
