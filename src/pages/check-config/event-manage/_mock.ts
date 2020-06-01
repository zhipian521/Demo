// eslint-disable-next-line import/no-extraneous-dependencies
import { Request, Response } from 'express';

import { parse } from 'url';
import { eventListData, eventQueryParamsData } from './data.d';

const dataSource: eventListData[] = [];

function dataSourceInit() {
  dataSource.push({
    id: `1`,
    eventCode: 'paylog-update',
    eventName: '支付域-更新事件',
    subjectCode: 'PAYMENT',
    eventSubCount: 1,
    gmtCreated: new Date(),
    modifier: 'system',
    eventRule: '111111',
    subjectType: 1,
  });
}

dataSourceInit();

function getEventList(req: Request, res: Response, u: string) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    // eslint-disable-next-line prefer-destructuring
    url = req.url;
  }

  const params = (parse(url, true).query as unknown) as eventQueryParamsData;

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

function addEvent(req: Request, res: Response) {
  const body = (req && req.body) || req.body;
  const addBody = {
    id: `${dataSource.length + 1}`,
    eventSubCount: 1,
    gmtCreated: new Date(),
    modifier: 'system',
    eventCode: 'paylog-update',
    eventName: '支付域-更新事件',
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

function updateEvent(req: Request, res: Response) {
  const body = (req && req.body) || req.body;
  for (let i = 0; i < dataSource.length; i += 1) {
    if (body.id === dataSource[i].id) {
      dataSource[i] = { ...dataSource[i], ...body };
    }
  }
  const resultData = {
    code: 200,
    msg: '成功',
    result: '',
  };
  return res.json(resultData);
}

function queryEventByCode(req: Request, res: Response, u: string) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    // eslint-disable-next-line prefer-destructuring
    url = req.url;
  }

  const params = (parse(url, true).query as unknown) as eventQueryParamsData;

  let event = {};
  dataSource.map((item) => {
    if (item.eventCode === params.eventCode) {
      event = item;
    }
    return item;
  });
  return res.json(event);
}

export default {
  'GET  /api/event/pageSelectEvent': getEventList,
  'GET  /api/event/obtainEventByCode': queryEventByCode,
  'POST /api/event/createEvent': addEvent,
  'PUT /api/event/updateEvent': updateEvent,
};
