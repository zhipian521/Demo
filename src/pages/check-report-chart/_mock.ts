// eslint-disable-next-line import/no-extraneous-dependencies
import { Request, Response } from 'express';
import { reportChartListData } from './data.d';

const Mock = require('mockjs');

const { Random } = Mock;

// mock tableListDataSource
const dataSource: reportChartListData[] = [];

for (let i = 0; i < 100; i += 1) {
  dataSource.push({
    id: i + 1,
    ruleCode: `pay-order-status-${i}`,
    samplingCount: Random.integer(300000, 500000),
    failedCount: Random.integer(10000, 100000),
  });
}

function queryReportChartData(req: Request, res: Response) {
  return res.json({ data: dataSource, code: 200 });
}

export default {
  'POST /api/getReportChartData': queryReportChartData,
};
