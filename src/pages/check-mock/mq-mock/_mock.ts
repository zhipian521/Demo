// eslint-disable-next-line import/no-extraneous-dependencies
import { Request, Response } from 'express';

function ruleMock(req: Request, res: Response) {
  const resultData = {
    code: 200,
    msg: '成功',
    result: 'success',
  };
  return res.json(resultData);
}

export default {
  'POST  /api/mock/check': ruleMock,
};
