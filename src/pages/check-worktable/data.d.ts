export interface QuickActionsData {
  id: string;
  title: string;
  href: string;
}

export interface CheckErrorTrackData {
  id: number;
  ruleCode: string;
  alarmCode: string;
  ruleName?: string;
  alarmName?: string;
  samplingCount: number;
  failedCount: number;
  startTime: string;
  gmtModified: string;
}

export interface SubjectInfoData {
  id?: number;
  subjectCode?: string;
  subjectType?: string;
  validStartTime?: string;
  validEndTime?: string;
}

export interface RuleInfoData {
  id?: number;
  samplingRate?: string;
  validTime: string[];
  ruleCode: string;
}
export interface FastDemoteInfoData {
  days?: number;
  types: string[];
}
export interface SamplingDemoteInfoData {
  samplingRate?: number;
}
