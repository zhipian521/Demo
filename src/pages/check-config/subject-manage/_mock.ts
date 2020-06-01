// eslint-disable-next-line import/no-extraneous-dependencies
import { Request, Response } from 'express';

import { parse } from 'url';
import { subjectListData, subjectQueryParamsData } from './data.d';

let dataSource: subjectListData[] = [];

function dataSourceInit() {
  dataSource.push({
    id: `1`,
    modifier: 'system',
    topic: 'payment',
    subjectCode: 'PAYMENT',
    eventCount: 2,
    gmtCreated: new Date(),
    subjectName: '支付业务域',
    subjectType: 0,
    filterInsert: true,
    validEndTime: '2020-03-16 12:11:11',
    validStartTime: '2020-03-17 12:11:11',
    creator: 'system',
  });
}

dataSourceInit();

function getSubjectList(req: Request, res: Response, u: string) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    // eslint-disable-next-line prefer-destructuring
    url = req.url;
  }

  const params = (parse(url, true).query as unknown) as subjectQueryParamsData;

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

function addSubject(req: Request, res: Response) {
  const body = (req && req.body) || req.body;
  const addBody = {
    id: `${dataSource.length + 1}`,
    eventCount: 2,
    topic: 'payment',
    gmtCreated: new Date(),
    modifier: 'system',
    validEndTime: body.validTime[0],
    validStartTime: body.validTime[0],
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

function updateSubject(req: Request, res: Response) {
  const body = (req && req.body) || req.body;
  dataSource = dataSource.map((item) => {
    if (item.id === body.id) {
      // eslint-disable-next-line no-param-reassign
      item = {
        ...item,
        ...body,
        validEndTime: body.validTime[0],
        validStartTime: body.validTime[1],
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
  'GET  /api/subject/pageSelectAllSubject': getSubjectList,
  'POST /api/subject/createSubject': addSubject,
  'PUT /api/subject/updateSubject': updateSubject,
};
