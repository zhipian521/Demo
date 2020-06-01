// eslint-disable-next-line import/no-extraneous-dependencies
import { Request, Response } from 'express';

import { parse } from 'url';
import { mappingData, ruleDetailData, ruleListData, ruleQueryParamsData } from './data.d';

const dataSource: ruleListData[] = [];

function dataSourceInit() {
  dataSource.push({
    feishuWebhook: '',
    gmtModified: new Date(),
    httpUrl: '',
    id: `1`,
    subjectCode: 'PAYMENT',
    eventCode: 'paylog-update',
    ruleCode: 'paylog-orders',
    ruleName: '核对支付-订单金额',
    modifier: 'system',
    gmtCreated: new Date(),
    validTime: ['2020-04-01 00:00:00', '2020-05-01 00:00:00'],
    creator: 'system',
    samplingRate: '40',
  });
}

dataSourceInit();

function getRuleList(req: Request, res: Response, u: string) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    // eslint-disable-next-line prefer-destructuring
    url = req.url;
  }

  const params = (parse(url, true).query as unknown) as ruleQueryParamsData;

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

const mappingDataInit: mappingData[] = [
  {
    sourceField: '2',
    targetField: '3',
  },
  {
    sourceField: '4',
    targetField: '5',
  },
];

const getProfileBasicData: ruleDetailData = {
  eventCode: 'aaa',
  ruleCode: '222',
  feishuWebhook: 'http://webhook',
  subEventCodes: ['1', '2', '3'],
  ruleName: 'ruleName',
  httpUrl: 'http://httpurl',
  alarmCode: '1111',
  exeType: 2,
  classContent: `import com.alibaba.fastjson.JSONObject
import org.springframework.stereotype.Component
import com.poizon.check.domain.check.entity.BaseScript

/**
 * <p>
 * 1.
 * </p>
 *
 * @author : jiangwenzhe
 * @version : 1.0.0
 * @date : 2020/5/6
 */
class GroovyScriptTest implements BaseScript {

    /**
     * 过滤
     *
     * @param donCleanData 完成清洗的数据
     * @return 过滤状态
     */
    @Override
    boolean filter(JSONObject donCleanData) {
        return true;
    }

    /**
     * 核对
     *
     * @param donCleanData 完成清洗的数据
     * @return 核对状态
     */
    @Override
    String check(JSONObject donCleanData) {
        return "1001".equals(donCleanData.getString("money")) ? "SUCCESS" : "金额错误";
    }
}`,
  classVersion: '202020',
  className: '21212',
  fieldMapping: mappingDataInit,

  filterRule: 'if(11)222',
  equalsRule: 'if(22)3333',

  samplingRate: '10',
  firstDelayTime: '1',
  maxTimeout: '2',
  validTime: ['2019-12-12-21 12:11:22', '2019-12-12-21 12:11:22'],
  leftData: '{"": ""}',
  rightData: '{"": ""}',
};

export default {
  'GET  /api/rule/pageSelectRule': getRuleList,
  'GET  /api/rule/selectRuleByRuleCode': { data: getProfileBasicData },
  'GET  /api/rule/obtainLastVersion': { data: getProfileBasicData },
  'POST  /api/rule/createRule': (_: Request, res: Response) => {
    res.send({ message: 'Ok' });
  },
  'PUT  /api/rule/updateRule': (_: Request, res: Response) => {
    res.send({ message: 'Ok' });
  },
};
