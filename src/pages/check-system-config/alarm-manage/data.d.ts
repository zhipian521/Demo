import { paginationReqData } from '@/data/common';

export interface alarmListData {
  id: string;
  alarmCode: string;
  alarmName: string;
  alarmMode: number;
  lastMinutes: number;
  modifier: string;
  coolingTime: number;
  gmtCreated: Date;
}

export interface alarmSubmitData {
  id: string;
  alarmCode: string;
  alarmName: string;
  alarmMode: number;
  lastMinutes: number;
  modifier: string;
  coolingTime: number;
  gmtCreated: Date;
}

export interface alarmQueryParamsData extends paginationReqData {
  alarmCode?: string;
  alarmName?: string;
}
