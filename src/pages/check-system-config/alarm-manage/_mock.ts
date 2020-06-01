// eslint-disable-next-line import/no-extraneous-dependencies
import { Request, Response } from 'express';

import { parse } from 'url';
import { alarmListData, alarmQueryParamsData } from './data.d';

let dataSource: alarmListData[] = [];

function dataSourceInit() {
  dataSource.push(
    {
      id: `1`,
      modifier: 'system',
      gmtCreated: new Date(),
      alarmCode: 'LAST_5_M',
      alarmName: '最近五分钟',
      alarmMode: 1,
      lastMinutes: 5,
      coolingTime: 15,
    },
    {
      id: `2`,
      modifier: 'system',
      gmtCreated: new Date(),
      alarmCode: 'LAST_10_M',
      alarmName: '最近10分钟',
      alarmMode: 1,
      lastMinutes: 10,
      coolingTime: 15,
    },
  );
}

dataSourceInit();

function queryAlarmList(req: Request, res: Response, u: string) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    // eslint-disable-next-line prefer-destructuring
    url = req.url;
  }
  const params = (parse(url, true).query as unknown) as alarmQueryParamsData;

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

function addAlarm(req: Request, res: Response) {
  const body = (req && req.body) || req.body;
  const addBody = {
    id: `${dataSource.length + 1}`,
    gmtCreated: new Date(),
    modifier: 'system',
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

function updateAlarm(req: Request, res: Response) {
  const body = (req && req.body) || req.body;
  dataSource = dataSource.map((item) => {
    if (item.id === body.id) {
      // eslint-disable-next-line no-param-reassign
      item = {
        ...item,
        ...body,
      };
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
  'GET  /api/alarm/pageSelectAlarm': queryAlarmList,
  'POST /api/alarm/createAlarm': addAlarm,
  'PUT /api/alarm/updateAlarm': updateAlarm,
};
