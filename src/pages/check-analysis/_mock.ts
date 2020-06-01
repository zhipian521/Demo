const ruleChartData = [];
for (let i = 0; i < 20; i += 1) {
  ruleChartData.push({
    collectTime: new Date().getTime() + 1000 * 60 * i,
    samplingCount: Math.floor(Math.random() * 10000) + 10,
    failedCount: Math.floor(Math.random() * 10000) + 10,
  });
}
const getRuleAnalysisData = {
  data: ruleChartData,
};

export default {
  'GET  /api/index': getRuleAnalysisData,
};
