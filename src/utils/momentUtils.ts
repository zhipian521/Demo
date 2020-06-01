import moment, { Moment } from 'moment';

export const isValid = (val: Moment) => (val.isValid() ? val : undefined);
export const format = (val: string | undefined) =>
  isValid(moment(val)) ? moment(val).format('YYYY-MM-DD HH:mm:ss') : undefined;
export const formatDate = (val: string, _format: string) => moment(val).format(_format);

/**
 * 时间差计算
 * 示例：diffTime(data.createTime, new Date())
 * @param startTime 开始时间
 * @param endTime   结束时间
 */
export const diffTime = (startTime: string, endTime: string) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const diff = end.getTime() - start.getTime();

  // 计算出相差天数
  const days = Math.floor(diff / (24 * 3600 * 1000));

  // 计算出小时数
  const leave1 = diff % (24 * 3600 * 1000); // 计算天数后剩余的毫秒数
  const hours = Math.floor(leave1 / (3600 * 1000));
  // 计算相差分钟数
  const leave2 = leave1 % (3600 * 1000); // 计算小时数后剩余的毫秒数
  const minutes = Math.floor(leave2 / (60 * 1000));

  // 计算相差秒数
  const leave3 = leave2 % (60 * 1000); // 计算分钟数后剩余的毫秒数
  const seconds = Math.round(leave3 / 1000);

  let returnStr = `${seconds}秒`;
  if (minutes > 0) {
    returnStr = `${minutes}分钟`; // + returnStr;
  }
  if (hours > 0) {
    returnStr = `${hours}小时`; // + returnStr;
  }
  if (days > 0) {
    returnStr = `${days}天`; // + returnStr;
  }
  return returnStr;
};
