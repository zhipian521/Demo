import { Request, Response } from 'express';
import { CheckErrorTrackData } from './data.d';

function getErrorTrackData(req: Request, res: Response, u: string) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    // eslint-disable-next-line prefer-destructuring
    url = req.url;
  }

  const result: CheckErrorTrackData[] = [
    {
      id: 1,
      ruleName: '扣除保证金校验商户有无记录',
      alarmName: '最近30分钟告警',
      samplingCount: 3000,
      failedCount: 1,
      startTime: '2020-04-12 12:11:22',
      endTime: '2020-04-12 20:11:22',
    },
  ];

  const resultData = {
    data: result,
    code: 200,
  };
  return res.json(resultData);
}

export default {
  'GET  /api/worktable/error-track': getErrorTrackData,
};
