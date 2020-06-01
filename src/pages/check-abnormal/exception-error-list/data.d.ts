import { paginationReqData } from '@/data/common';

export interface exceptionErrorListData {
  id: string;
  subjectCode: string;
  ruleCode: string;
  ruleName: string;
  exceptionContent: string;
  gmtCreated: Date;
  modifier: string;
}

export interface exceptionErrorQueryParamsData extends paginationReqData {
  ruleCode?: string;
  ruleName?: string;
  startTime?: string;
  endTime?: string;
}
