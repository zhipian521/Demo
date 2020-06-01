import React, { useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ReportChart from '@/pages/check-report-chart/components/ReportChart';
import { Affix, Card, Col, DatePicker, Row, Statistic } from 'antd';
import { Dispatch } from '@@/plugin-dva/connect';
import { StateType } from './model';
import { connect } from 'dva';
import moment from 'moment';

const { RangePicker } = DatePicker;

export interface CheckReportChart {
  dispatch: Dispatch;
  reportChartModel: StateType;
}

const CheckReportChart: React.FC<CheckReportChart> = (props) => {
  const affixOffsetTopState = 0;

  useEffect(() => {
    props.dispatch({
      type: 'reportChartModel/fetchData',
    });
  }, [1]);

  const handleTimeChange = (event: any) => {
    const startTime = event[0].format('YYYY-MM-DD HH:mm:ss');
    const endTime = event[1].format('YYYY-MM-DD HH:mm:ss');
    props.dispatch({
      type: 'reportChartModel/fetchData',
      payload: { startTime, endTime },
    });
  };

  return (
    <PageHeaderWrapper>
      <Affix offsetTop={affixOffsetTopState}>
        <Card style={{ marginBottom: '20px' }}>
          <Row>
            <Col
              xl={{ span: 14 }}
              lg={{ span: 12 }}
              md={{ span: 24 }}
              sm={24}
              style={{ height: '60px', lineHeight: '60px' }}
            >
              <RangePicker
                defaultValue={[
                  moment().add(-1, 'days').set({ hour: 9, minute: 0, second: 0 }),
                  moment().set({ hour: 9, minute: 0, second: 0 }),
                ]}
                ranges={{
                  昨天: [
                    moment().add(-1, 'days').set({ hour: 9, minute: 0, second: 0 }),
                    moment().set({ hour: 9, minute: 0, second: 0 }),
                  ],
                  一周: [moment().add(-7, 'days'), moment()],
                  本月: [moment().startOf('month'), moment()],
                  '30天': [moment().add(-30, 'days'), moment()],
                  '90天': [moment().add(-90, 'days'), moment()],
                  今年: [moment().startOf('year'), moment()],
                  一年: [moment().add(-1, 'year'), moment()],
                }}
                style={{ marginRight: '10px' }}
                onChange={handleTimeChange}
              />
            </Col>
            <Col xl={{ span: 4, offset: 2 }} lg={{ span: 12 }} md={{ span: 24 }} sm={24}>
              <Statistic
                title="采样总数"
                value={props.reportChartModel.samplingCount}
                valueStyle={{ color: '#3f8600' }}
              />
            </Col>
            <Col xl={{ span: 4 }} lg={{ span: 12 }} md={{ span: 24 }} sm={24}>
              <Statistic
                title="失败总数"
                value={props.reportChartModel.failedCount}
                valueStyle={{ color: '#cf1322' }}
              />
            </Col>
          </Row>
        </Card>
      </Affix>

      <Row>
        <Col
          xl={{ span: 24 }}
          lg={{ span: 24 }}
          md={{ span: 24 }}
          sm={24}
          style={{ padding: '0px 0px 0px 0px' }}
        >
          <Card title="异常TOP10" size="small">
            <ReportChart data={props.reportChartModel.top10ExceptionData} />
          </Card>
        </Col>
      </Row>

      <Row>
        <Col
          xl={{ span: 24 }}
          lg={{ span: 24 }}
          md={{ span: 24 }}
          sm={24}
          style={{ padding: '0px 0px 0px 0px', marginTop: '20px' }}
        >
          <Card title="数据报表" size="small">
            <ReportChart data={props.reportChartModel.reportChartData} />
          </Card>
        </Col>
      </Row>
    </PageHeaderWrapper>
  );
};

export default connect(
  ({
    reportChartModel,
    loading,
  }: {
    reportChartModel: StateType;
    loading: { effects: { [key: string]: boolean } };
  }) => ({
    reportChartModel,
    submitting: loading.effects['reportChartModel/fetchData'],
  }),
)(CheckReportChart);
