import request from '@/utils/request';
import { dataQualityQueryParamsData } from './data.d';

export async function queryDataQuality(params?: dataQualityQueryParamsData) {
  return request('/api/statics/pageSelect', {
    params,
  });
}
