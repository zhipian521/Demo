import request from '@/utils/request';
import { enumsReqData } from '@/data/common';

export async function queryEnums(params: enumsReqData) {
  return request('/api/dropList', {
    params,
  });
}
