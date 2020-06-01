import { paginationReqData } from '@/data/common';

export interface checkErrorListData {
  id: string;
  subjectCode: string;
  ruleCode: string;
  failContent: string;
  handleStatus: number;
  request: string;
  gmtModified: Date;
  gmtCreated: Date;
  modifier: string;
}

export interface batchCloseReqParams {
  ruleCode: string;
  startTime: string;
  endTime: string;
}

export interface checkErrorQueryParamsData extends paginationReqData {
  ruleCode?: string;
  handleStatus?: string;
  startTime?: string;
  endTime?: string;
}
