// eslint-disable-next-line import/no-extraneous-dependencies
import { Request, Response } from 'express';
import { parse } from 'url';
import { checkErrorListData, checkErrorQueryParamsData } from './data.d';

// mock tableListDataSource
const dataSource: checkErrorListData[] = [];

for (let i = 0; i < 20; i += 1) {
  dataSource.push({
    id: `${i + 1}`,
    subjectCode: `PAYMENT${i}`,
    ruleCode: 'paylog-order-succes',
    failContent: '状态不对',
    handleStatus: 0,
    request:
      '121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212',
    gmtModified: new Date(),
    gmtCreated: new Date(),
    modifier: 'system',
  });
}

function getCheckErrorList(req: Request, res: Response, u: string) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    // eslint-disable-next-line prefer-destructuring
    url = req.url;
  }

  const params = (parse(url, true).query as unknown) as checkErrorQueryParamsData;

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

function retry(req: Request, res: Response) {
  const resultData = {
    code: 200,
    msg: '成功',
    result: '',
  };
  return res.json(resultData);
}

export default {
  'GET /api/failed/select': getCheckErrorList,
  'GET /api/failed/countByRuleCodeAndTime': (_: Request, res: Response) => {
    res.send({ data: 4, code: 200 });
  },
  'POST /api/failed/batchRetry': retry,
  'POST /api/failed/batchClose': retry,
};
