import request from '@/utils/request';
import { exceptionErrorQueryParamsData } from './data.d';

export async function queryExceptionErrorList(params?: exceptionErrorQueryParamsData) {
  return request('/api/exception/select', {
    params,
  });
}
