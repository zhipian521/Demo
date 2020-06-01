import { paginationReqData } from '@/data/common';

export interface checkErrorTrackData {
  id: number;
  ruleCode: string;
  questionDesc: string;
  questionTrack: string;
  solution: string;
  status: number;
  gmtCreated: Date;
  modifier: string;
  gmtModified: Date;
  beginTime: string;
  endTime: string;
}

export interface ErrorTrackSubmitData {
  id: number;
  ruleCode: string;
  questionDesc: string;
  questionTrack: string;
  solution: string;
  status: number;
}

export interface errorTrackQueryParamsData extends paginationReqData {
  id?: string;
  ruleCode?: string;
}
