import { paginationReqData } from '@/data/common';

export interface eventListData {
  id: string;
  eventCode: string;
  eventName: string;
  subjectCode: string;
  modifier: string;
  eventSubCount: number;
  gmtCreated: Date;
  gmtModified: Date;
  eventRule: string;
  subjectType: number;
}

export interface eventSubmitData {
  eventCode: string;
  subjectType: number;
  subjectCode: string;
  subjectName: string;
  validTime: string[];
  filterInsert: boolean;
}

export interface eventQueryParamsData extends paginationReqData {
  subjectCode?: string;
  event?: string;
  eventCode?: string;
}
