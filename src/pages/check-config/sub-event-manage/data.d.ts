import { paginationReqData } from '@/data/common';

export interface subEventListData {
  id: string;
  subjectCode: string;
  eventCode: string;
  subEventCode: string;
  subEventName: string;
  subEventRule: string;
  gmtCreated: Date;
  gmtModified: Date;
  subEventRuleVersion: string;
  modifier: string;
}

export interface subEventHistoryData {
  id: string;
  subjectCode: string;
  eventCode: string;
  code: string;
  subEventName: string;
  ruleContent: string;
  gmtCreated: Date;
  lastVersion: string;
  modifier: string;
}

export interface subEventSubmitData {
  id: string;
  eventCode: string;
  version: string;
  subEventCode: string;
  subEventName: string;
  subEventRule: string;
}

export interface subEventQueryParamsData extends paginationReqData {
  eventCode?: string;
  subEventCode?: string;
}
