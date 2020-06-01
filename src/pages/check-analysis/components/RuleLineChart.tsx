import React, { FC, useEffect, useState } from 'react';
import { Card, Col, Row, Select, Form, DatePicker } from 'antd';
import { enumsRespData } from '@/data/common';
import { DROP_LIST_SEPARATOR } from '@/constant';
import moment, { Moment } from 'moment';
import { analysisReqParams, ruleChartData as ruleChart } from '../data.d';
import { TimelineChart } from './Charts';

const styles = require('../style.less');

const { Option } = Select;
const { RangePicker } = DatePicker;

interface RuleLineChartProps {
  timeRange: string[] | undefined;
  defaultValues: analysisReqParams | undefined;
  ruleDataType: enumsRespData[];
  ruleChartData: ruleChart[];
  timeSpan: number;
  loading: boolean;
  handleSearch: (params: analysisReqParams) => void;
  handleAutoRefreshChange: (key: number) => void;
  autoRefreshTimeActiveKey: number | undefined;
  lastTimeActiveKey: number | undefined;
  handleLastTimeChange: (key: number) => void;
}

const autoRefreshTime = [
  { key: 1, value: 0, desc: '关闭' },
  { key: 3, value: 5000, desc: '5秒' },
  { key: 4, value: 10000, desc: '10秒' },
  { key: 5, value: 30000, desc: '30秒' },
  { key: 6, value: 60000, desc: '1分钟' },
  { key: 7, value: 600000, desc: '10分钟' },
  { key: 8, value: 1800000, desc: '30分钟' },
];

const RuleLineChart: FC<RuleLineChartProps> = ({
  timeRange,
  ruleDataType,
  ruleChartData,
  timeSpan,
  loading,
  handleSearch,
  defaultValues,
  handleAutoRefreshChange,
  autoRefreshTimeActiveKey,
  handleLastTimeChange,
}) => {
  const [dates, setDates] = useState<Moment[]>([]);
  const [form] = Form.useForm();

  const disabledDate = (current: Moment) => {
    if (!dates || dates.length === 0) {
      return false;
    }
    const tooLate = dates[0] && current.diff(dates[0], 'days') >= 3;
    const tooEarly = dates[1] && dates[1].diff(current, 'days') >= 3;
    return tooEarly || tooLate;
  };

  useEffect(() => {
    if (timeRange) {
      form.setFieldsValue({
        timeRange: [
          moment(timeRange[0], 'YYYY-MM-DD HH:mm:ss'),
          moment(timeRange[1], 'YYYY-MM-DD HH:mm:ss'),
        ],
      });
    }
  }, [timeRange]);

  const handleFinish = (values: { [key: string]: any }) => {
    const data = { startTime: '', endTime: '', ruleCode: values.ruleCode };
    if (values.timeRange) {
      const [startTime, endTime] = values.timeRange;
      data.startTime = startTime
        ? startTime.format('YYYY-MM-DD HH:mm:ss')
        : moment(moment().add(-30, 'minutes'), 'YYYY-MM-DD HH:mm:ss');
      data.endTime = endTime
        ? endTime.format('YYYY-MM-DD HH:mm:ss')
        : moment(moment(), 'YYYY-MM-DD HH:mm:ss');
    } else {
      delete data.startTime;
      delete data.endTime;
    }
    handleSearch(data as analysisReqParams);
  };

  const handleChange = () => {
    form.submit();
  };

  const CustomTab = (data: enumsRespData[]) => (
    <Form
      form={form}
      onFinish={handleFinish}
      initialValues={{
        ruleCode: defaultValues?.ruleCode || data[0].key,
      }}
    >
      <Row gutter={24}>
        <Col lg={8} md={12} sm={24}>
          <Form.Item
            name="ruleCode"
            label="规则编码"
            rules={[{ required: true, message: '请选择编码' }]}
          >
            <Select placeholder="请选择编码" showSearch onSelect={handleChange}>
              {data.map((item) => (
                <Option key={item.key} value={`${item.key}${DROP_LIST_SEPARATOR}${item.val}`}>
                  {item.val}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col lg={11} md={12} sm={24}>
          <Form.Item
            name="timeRange"
            label="时间范围"
            rules={[{ required: false, message: '请选择开始时间' }]}
          >
            <RangePicker
              allowClear
              disabledDate={disabledDate}
              onCalendarChange={(value) => {
                setDates(value as Moment[]);
                if (value && value[0] && value[1]) {
                  handleLastTimeChange(value[1].diff(value[0], 'minutes'));
                }
              }}
              showTime={{
                defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
              }}
              onChange={handleChange}
              style={{ width: '100%' }}
              ranges={{
                '1分钟': [moment().add(-1, 'minutes'), moment()],
                '10分钟': [moment().add(-10, 'minutes'), moment()],
                '30分钟': [moment().add(-30, 'minutes'), moment()],
                '1小时': [moment().add(-60, 'minutes'), moment()],
                '10小时': [moment().add(-10, 'hours'), moment()],
                '1天': [moment().add(-1, 'days'), moment()],
                '3天': [moment().add(-3, 'days'), moment()],
              }}
            />
          </Form.Item>
        </Col>
        <Col lg={5} md={12} sm={24}>
          <span>自动刷新：</span>
          <Select
            placeholder="请选择时间"
            defaultValue={autoRefreshTimeActiveKey}
            onSelect={handleAutoRefreshChange}
          >
            {autoRefreshTime.map((item: { key: number; value: number; desc: string }) => (
              <Option key={item.key} value={item.value}>
                {item.desc}
              </Option>
            ))}
            ;
          </Select>
        </Col>
      </Row>
    </Form>
  );

  return (
    <Card
      loading={loading}
      className={styles.offlineCard}
      bordered={false}
      style={{ marginTop: 32 }}
    >
      {CustomTab(ruleDataType)}
      <div style={{ padding: '0 24px' }}>
        <TimelineChart
          height={400}
          data={ruleChartData}
          timeSpan={timeSpan}
          titleMap={{
            samplingCount: '采样总数',
            failedCount: '失败笔数',
          }}
        />
      </div>
    </Card>
  );
};

export default RuleLineChart;
