// eslint-disable-next-line import/no-extraneous-dependencies
import { Request, Response } from 'express';
import { parse } from 'url';
import { exceptionErrorListData, exceptionErrorQueryParamsData } from './data.d';

// mock tableListDataSource
const dataSource: exceptionErrorListData[] = [];

for (let i = 0; i < 20; i += 1) {
  dataSource.push({
    id: `${i}`,
    subjectCode: `PAYMENT${i}`,
    ruleCode: 'paylog-order-succes',
    ruleName: '订单和支付金额核对',
    exceptionContent:
      '11fkoafkjdsafkjfkajsfkajfkjasfkjffjfklajfkdsajfkasjfkasjfkjafjaksfjksajfkjsfkajfkajsfkjskfjaksdfjasfj11fkoafkjdsafkjfkajsfkajfkjasfkjffjfklajfkdsajfkasjfkasjfkjafjaksfjksajfkjsfkajfkajsfkjskfjaksdfjasfj11fkoafkjdsafkjfkajsfkajfkjasfkjffjfklajfkdsajfkasjfkasjfkjafjaksfjksajfkjsfkajfkajsfkjskfjaksdfjasfj11fkoafkjdsafkjfkajsfkajfkjasfkjffjfklajfkdsajfkasjfkasjfkjafjaksfjksajfkjsfkajfkajsfkjskfjaksdfjasfj11fkoafkjdsafkjfkajsfkajfkjasfkjffjfklajfkdsajfkasjfkasjfkjafjaksfjksajfkjsfkajfkajsfkjskfjaksdfjasfj;asfjsjfkajfl',
    gmtCreated: new Date(),
  });
}

function getExceptionErrorList(req: Request, res: Response, u: string) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    // eslint-disable-next-line prefer-destructuring
    url = req.url;
  }

  const params = (parse(url, true).query as unknown) as exceptionErrorQueryParamsData;

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
  'GET /api/exception/select': getExceptionErrorList,
};
