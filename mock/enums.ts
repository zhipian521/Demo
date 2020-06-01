// eslint-disable-next-line import/no-extraneous-dependencies
import { Request, Response } from 'express';

import { parse } from 'url';
import { enumsRespData, enumsReqData } from '@/data/common';

function getEnumData(req: Request, res: Response, u: string) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    // eslint-disable-next-line prefer-destructuring
    url = req.url;
  }

  const params = (parse(url, true).query as unknown) as enumsReqData;
  const result: enumsRespData[] = [];
  switch (params.dropType) {
    case 'subject':
      result.push(
        { key: 'PAYMENT', val: 'PAYMENT-val', extra: { type: '0' } },
        {
          key: 'ORDERS',
          val: 'ORDERS-val',
          extra: { type: '1' },
        },
      );
      break;
    case 'event':
      result.push(
        { key: 'paylog-inster', val: 'paylog-inster-val' },
        { key: 'paylog-update', val: 'paylog-update-val' },
      );
      break;
    case 'rule':
      result.push(
        { key: 'paylog-order-succes', val: 'paylog-order-success-val' },
        { key: 'paylog-order-error', val: 'paylog-order-error-val' },
      );
      break;
    case 'subEvent':
      result.push(
        { key: 'subEvent-1', val: 'subEvent-1' },
        { key: 'subEvent-2', val: 'subEvent-2' },
      );
      break;
    case 'alarm':
      result.push({ key: 'alarm-1', val: 'alarm-1' }, { key: 'alarm-2', val: 'alarm-2' });
      break;
    default:
      break;
  }
  const resultData = {
    data: result,
    code: 200,
  };
  return res.json(resultData);
}

export default {
  'GET  /api/dropList': getEnumData,
};
