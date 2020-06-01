import React from 'react';
import { Axis, Chart, Coord, Geom, Label, Legend, Tooltip } from 'bizcharts';
import DataSet from '@antv/data-set';
import { reportChartListData } from '@/pages/check-report-chart/data';

interface ReportChartProps {
  data: reportChartListData[];
  height?: number;
  padding?: [number, number, number, number];
}

const ReportChart: React.FC<ReportChartProps> = (props) => {
  const {
    data,
    height = data.length * 45 + 40,
    padding = ['auto', 'auto', 'auto', 'auto'] as [string, string, string, string],
  } = props;
  const ds = new DataSet();
  const dv = ds.createView().source(data);

  dv.transform({
    type: 'map',
    callback(row: { samplingCount: string; failedCount: string }) {
      const newRow = { ...row };
      newRow['采样总数'] = row.samplingCount;
      newRow['失败总数'] = row.failedCount;
      return newRow;
    },
  }).transform({
    type: 'fold',
    fields: ['采样总数', '失败总数'], // 展开字段集
    key: 'key', // key字段
    value: 'value', // value字段
  });

  const scale = {
    ruleCode: {
      alias: '规则编码', // 别名
    },
  };

  return (
    <Chart height={height} padding={padding} data={dv} scale={scale} forceFit>
      <Legend name="key" position="top" />
      <Coord transpose scale={[1, -1]} />
      <Axis
        name="ruleCode"
        label={{ offset: 12, textStyle: { fontSize: '13' } }}
        // title={{ autoRotate: true }}
      />
      <Axis name="value" position="right" />
      <Tooltip />
      <Geom
        type="interval"
        position="ruleCode*value"
        adjust={[
          {
            type: 'dodge',
            marginRatio: 1 / 32,
          },
        ]}
        color={['key', ['#01c901', 'red']]}
      >
        <Label content={['ruleCode*value', (name, value) => value]} offset={5} />
      </Geom>
    </Chart>
  );
};

export default ReportChart;
