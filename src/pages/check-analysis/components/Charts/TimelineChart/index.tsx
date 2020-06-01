import { Axis, Chart, Geom, Legend, Tooltip } from 'bizcharts';

import DataSet from '@antv/data-set';
import React from 'react';
// @ts-ignore
import Slider from 'bizcharts-plugin-slider';
import autoHeight from '../autoHeight';

const styles = require('./index.less');

export interface TimelineChartProps {
  data: {
    collectTime: number;
    samplingCount: number;
    failedCount: number;
  }[];
  timeSpan: number;
  title?: string;
  titleMap: { samplingCount: string; failedCount: string };
  padding?: [number, number, number, number];
  height?: number;
  style?: React.CSSProperties;
  borderWidth?: number;
}

const TimelineChart: React.FC<TimelineChartProps> = (props) => {
  const {
    title,
    height = 400,
    padding = [60, 20, 40, 50] as [number, number, number, number],
    titleMap = {
      samplingCount: 'samplingCount',
      failedCount: 'failedCount',
    },
    borderWidth = 2,
    data: sourceData,
    timeSpan,
  } = props;

  const data = Array.isArray(sourceData)
    ? sourceData
    : [{ collectTime: 0, samplingCount: 0, failedCount: 0 }];

  data.sort((a, b) => a.collectTime - b.collectTime);

  let max;
  if (data[0] && data[0].samplingCount && data[0].failedCount) {
    max = Math.max(
      [...data].sort((a, b) => b.samplingCount - a.samplingCount)[0].samplingCount,
      [...data].sort((a, b) => b.failedCount - a.failedCount)[0].failedCount,
    );
  }

  const ds = new DataSet({
    state: {
      start: data[0].collectTime,
      end: data[data.length - 1].collectTime,
    },
  });

  const dv = ds.createView();
  dv.source(data)
    .transform({
      type: 'filter',
      callback: (obj: { collectTime: string }) => {
        const date = obj.collectTime;
        return date <= ds.state.end && date >= ds.state.start;
      },
    })
    .transform({
      type: 'map',
      callback(row: { samplingCount: string; failedCount: string }) {
        const newRow = { ...row };
        newRow[titleMap.samplingCount] = row.samplingCount;
        newRow[titleMap.failedCount] = row.failedCount;
        return newRow;
      },
    })
    .transform({
      type: 'fold',
      fields: [titleMap.samplingCount, titleMap.failedCount], // 展开字段集
      key: 'key', // key字段
      value: 'value', // value字段
    });

  const timeScale = {
    type: 'time',
    tickInterval: timeSpan,
    mask: 'HH:mm',
    range: [0, 1],
  };

  const cols = {
    collectTime: timeScale,
    value: {
      max,
      min: 0,
    },
  };

  const SliderGen = () => (
    <Slider
      padding={[0, padding[1] + 20, 0, padding[3]]}
      width="auto"
      height={26}
      xAxis="collectTime"
      yAxis="samplingCount"
      scales={{ collectTime: timeScale }}
      data={data}
      start={ds.state.start}
      end={ds.state.end}
      backgroundChart={{ type: 'line' }}
      onChange={({ startValue, endValue }: { startValue: string; endValue: string }) => {
        ds.setState('start', startValue);
        ds.setState('end', endValue);
      }}
    />
  );

  return (
    <div className={styles.timelineChart} style={{ height: height + 30 }}>
      <div>
        {title && <h4>{title}</h4>}
        <Chart height={height} padding={padding} data={dv} scale={cols} forceFit>
          <Axis name="collectTime" />
          <Tooltip />
          <Legend name="key" position="top" />
          <Geom
            type="line"
            position="collectTime*value"
            size={borderWidth}
            color={['key', ['#2ca02c', 'red']]}
          />
        </Chart>
        <div style={{ marginRight: -20 }}>
          <SliderGen />
        </div>
      </div>
    </div>
  );
};

export default autoHeight()(TimelineChart);
