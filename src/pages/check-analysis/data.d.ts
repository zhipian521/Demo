export interface SummaryData {
  index: number;
  keyword: string;
  count: number;
  range: number;
  status: number;
}
export interface ruleChartData {
  collectTime: any;
  samplingCount: number;
  failedCount: number;
}
export interface ruleAnalysisData {
  ruleChartData: ruleChartData[];
  timeSpan: number;
}

export interface analysisReqParams {
  ruleCode: string;
  startTime: string;
  endTime: string;
}
