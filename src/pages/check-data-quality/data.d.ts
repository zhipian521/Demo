import { paginationReqData } from '@/data/common';

export interface dataQualityListData {
  id: string;
  ruleCode: string;
  receivedCount: number;
  samplingCount: number;
  failedCount: number;
  sentinelCount: number;
  costTime: number;
  collectTime: Date;
}

export interface dataQualityQueryParamsData extends paginationReqData {
  ruleCode?: string;
  bizDate?: string;
}
