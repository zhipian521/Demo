import { paginationReqData } from '@/data/common';

export interface ruleListData {
  id: string;
  subjectCode: string;
  eventCode: string;
  ruleCode: string;
  ruleName: string;
  samplingRate: string;
  validTime: string[];
  gmtCreated: Date;
  gmtModified: Date;
  modifier: string;
  feishuWebhook: string;
  httpUrl: string;
  creator: string;
}

export interface mappingData {
  sourceField: string;
  targetField: string;
}

export interface ruleDetailData {
  eventCode?: string;
  ruleCode?: string;
  feishuWebhook?: string;
  subEventCodes?: string[];
  ruleName?: string;
  httpUrl?: string;
  exeType?: number;
  classContent?: string;
  className?: string;
  classVersion?: string;
  alarmCode?: string;

  fieldMapping?: mappingData[];
  baseField?: mappingData[];

  filterRule?: string;
  equalsRule?: string;

  leftData?: string;
  rightData?: string;

  samplingRate?: string;
  firstDelayTime?: string;
  maxTimeout?: string;
  validTime: string[];
}

export interface ruleHistoryData {
  eventCode?: string;
  ruleCode?: string;
  webHook?: string;
  subEventCodes?: string;
  ruleName?: string;
  httpUrl?: string;
  alarmCode?: string;

  fieldMapping?: mappingData[];

  filterRule?: string;
  equalsRule?: string;

  samplingRate?: string;
  firstDelayTime?: string;
  maxTimeout?: string;
  validTime?: string;
  equalsRuleVersion?: string;
  filterRuleVersion?: string;
  exeType?: number;
  classContent?: string;
  className?: string;
  classVersion?: string;
}

export interface ruleQueryParamsData extends paginationReqData {
  subject?: string;
  status?: string;
  ruleCode?: string;
  eventCode?: string;
}
