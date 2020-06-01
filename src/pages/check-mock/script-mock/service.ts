import request from '@/utils/request';

export async function scriptMock(params: any) {
  return request('/api/mock/script', {
    method: 'POST',
    data: params,
  });
}
