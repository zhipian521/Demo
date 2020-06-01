// eslint-disable-next-line import/no-extraneous-dependencies
import { Request, Response } from 'express';

import { parse } from 'url';
import { checkErrorTrackData, errorTrackQueryParamsData } from './data.d';

const dataSource: checkErrorTrackData[] = [];

function dataSourceInit() {
  dataSource.push({
    id: 1,
    ruleCode: 'paylog-orders',
    ruleName: '核对支付-订单金额',
    modifier: 'system',
    gmtCreated: new Date(),
    exceptionContent: 'aafgsdg',
    problemDesc: 'as发顺丰萨嘎三等功',
    solution: 'asdasfasfasdf发顺丰萨嘎三等功',
    gmtModified: new Date(),
    beginTime: '2020-04-01 00:00:00',
    endTime: '2020-05-01 00:00:00',
  });
}

dataSourceInit();

function queryErrorTarckList(req: Request, res: Response, u: string) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    // eslint-disable-next-line prefer-destructuring
    url = req.url;
  }

  const params = (parse(url, true).query as unknown) as errorTrackQueryParamsData;

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
  'GET  /api/alarm/pageSelectAlarmLog': queryErrorTarckList,
  'POST  /api/alarm/resolve': (_: Request, res: Response) => {
    res.send({ message: 'Ok', code: 200 });
  },
};
