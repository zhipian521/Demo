export interface paginationData {
  total: number;
  pageSize: number;
  current: number;
}
export interface paginationReqData {
  pageSize?: number;
  current?: number;
}
export interface resultData {
  code: number;
  msg: string;
  data?: any;
}

export interface enumsRespData {
  key: string;
  val: string;
  extra?: any;
}
export interface enumsReqData {
  dropType: string;
  eventCode?: string;
}
