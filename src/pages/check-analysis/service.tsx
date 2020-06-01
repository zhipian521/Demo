import request from '@/utils/request';

export async function ruleAnalysis(params?: any) {
  return request('/api/index', {
    params,
  });
}
