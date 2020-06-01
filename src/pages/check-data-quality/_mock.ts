// eslint-disable-next-line import/no-extraneous-dependencies
import { Request, Response } from 'express';
import { parse } from 'url';
import { dataQualityListData, dataQualityQueryParamsData } from './data.d';

// mock tableListDataSource
const dataSource: dataQualityListData[] = [];

for (let i = 0; i < 40; i += 1) {
  dataSource.push({
    id: `${i + 1}`,
    ruleCode: 'paylog-order-success',
    receivedCount: i,
    samplingCount: i,
    failedCount: i,
    sentinelCount: i,
    costTime: 1141,
    collectTime: new Date(),
  });
}

function queryDataQuality(req: Request, res: Response, u: string) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    // eslint-disable-next-line prefer-destructuring
    url = req.url;
  }

  const params = (parse(url, true).query as unknown) as dataQualityQueryParamsData;

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = parseInt(`${params.pageSize}`, 0);
  }
  const paginationData = {
    total: dataSource.length,
    pageSize,
    current: parseInt(`${params.current}`, 10) || 1,
  };
  let current = 0;
  if (paginationData.current > 1) {
    current = paginationData.current - 1;
  }
  const result = {
    data: dataSource.slice(current * paginationData.pageSize, paginationData.current * pageSize),
    ...paginationData,
  };

  return res.json(result);
}

export default {
  'GET /api/statics/pageSelect': queryDataQuality,
};
