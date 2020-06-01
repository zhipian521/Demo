// eslint-disable-next-line import/no-extraneous-dependencies
import { Request, Response } from 'express';

import { parse } from 'url';
import { subEventListData, subEventQueryParamsData } from './data.d';

let dataSource: subEventListData[] = [];

function dataSourceInit() {
  dataSource.push({
    id: `1`,
    subjectCode: 'PAYMENT',
    eventCode: 'paylog-update',
    subEventCode: 'paylog-status-success',
    subEventName: '支付成功数据核对',
    modifier: 'system',
    subEventRuleVersion: '1.0',
    subEventRule: 'subEventRule',
    gmtCreated: new Date(),
  });
}

dataSourceInit();

function getSubEventList(req: Request, res: Response, u: string) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    // eslint-disable-next-line prefer-destructuring
    url = req.url;
  }

  const params = (parse(url, true).query as unknown) as subEventQueryParamsData;

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

function addSubEvent(req: Request, res: Response) {
  const body = (req && req.body) || req.body;
  const addBody = {
    id: `${dataSource.length + 1}`,
    subjectCode: 'PAYMENT',
    createdAt: new Date(),
    owner: 'system',
    version: '1.0',
    ...body,
  };
  dataSource.push(addBody);
  const resultData = {
    code: 200,
    msg: '成功',
    result: '',
  };
  return res.json(resultData);
}

function updateSubEvent(req: Request, res: Response) {
  const body = (req && req.body) || req.body;
  dataSource = dataSource.map((item) => {
    if (item.id === body.id) {
      // eslint-disable-next-line no-param-reassign
      item = { ...item, ...body };
    }
    return item;
  });
  const resultData = {
    code: 200,
    msg: '成功',
    result: '',
  };
  return res.json(resultData);
}

function rollback(req: Request, res: Response) {
  const body = (req && req.body) || req.body;
  dataSource = dataSource.map((item) => {
    if (item.id === body.id) {
      // eslint-disable-next-line no-param-reassign
      item = { ...item, ...body };
    }
    return item;
  });
  const resultData = {
    code: 200,
    msg: '成功',
    result: '',
  };
  return res.json(resultData);
}

export default {
  'GET  /api/event/pageSelectSubEventList': getSubEventList,
  'POST  /api/event/createSubEvent': addSubEvent,
  'PUT  /api/event/updateSubEvent': updateSubEvent,
  'PUT /api/version/rollBack': rollback,
  'GET /api/version/obtainLastVersion': dataSource[0],
};
