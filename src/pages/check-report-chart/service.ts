import request from '@/utils/request';

export async function fetchData(params: { startTime: string; endTime: string }) {
  return request('/api/getReportChartData', {
    method: 'POST',
    data: params,
  });
}
