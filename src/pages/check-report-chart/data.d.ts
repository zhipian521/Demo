export interface reportChartListData {
  id: number;
  ruleCode: string;
  samplingCount: number;
  failedCount: number;
}

export interface getReportChartReqParam {
  startTime: string;
  endTime: string;
}
