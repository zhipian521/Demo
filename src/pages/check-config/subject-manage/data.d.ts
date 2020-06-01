import { paginationReqData } from '@/data/common';

export interface subjectListData {
  id: string;
  topic: string;
  subjectCode: string;
  subjectType: number;
  filterInsert: boolean;
  subjectName: string;
  modifier: string;
  eventCount: number;
  gmtCreated: Date;
  gmtModified: Date;
  creator: string;
  validStartTime: string;
  validEndTime: string;
}

export interface subjectSubmitData {
  id: string;
  topic: string;
  subjectType: number;
  subjectCode: string;
  subjectName: string;
  validTime: (string | undefined)[];
  filterInsert: boolean;
}

export interface subjectQueryParamsData extends paginationReqData {
  subjectType?: string;
  subjectCode?: string;
  subjectStatus?: string;
}
