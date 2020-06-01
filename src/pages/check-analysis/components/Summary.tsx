import React, { FC } from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Col, Row, Tooltip } from 'antd';
import { ChartCard } from '@/pages/check-analysis/components/Charts';
import { FormattedMessage } from 'umi';
import { SummaryData } from '../data.d';

interface SummaryModalProps {
  data: Partial<SummaryData> | undefined;
  loading: boolean;
}

const colStyle = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: { marginBottom: 24 },
};

const Summary: FC<SummaryModalProps> = (props) => {
  const { loading } = props;

  const subjectSummary = () => (
    <Col {...colStyle}>
      <ChartCard
        bordered={false}
        title={
          <FormattedMessage
            id="dashboardanalysis.analysis.total-sales"
            defaultMessage="Total Sales"
          />
        }
        action={
          <Tooltip
            title={
              <FormattedMessage
                id="dashboardanalysis.analysis.introduce"
                defaultMessage="Introduce"
              />
            }
          >
            <InfoCircleOutlined />
          </Tooltip>
        }
        loading={loading}
        total={() => 126560}
        contentHeight={46}
      />
    </Col>
  );
  const eventSummary = () => (
    <Col {...colStyle}>
      <ChartCard
        bordered={false}
        title={
          <FormattedMessage
            id="dashboardanalysis.analysis.total-sales"
            defaultMessage="Total Sales"
          />
        }
        action={
          <Tooltip
            title={
              <FormattedMessage
                id="dashboardanalysis.analysis.introduce"
                defaultMessage="Introduce"
              />
            }
          >
            <InfoCircleOutlined />
          </Tooltip>
        }
        loading={loading}
        total={() => 126560}
        contentHeight={46}
      />
    </Col>
  );
  const ruleSummary = () => (
    <Col {...colStyle}>
      <ChartCard
        bordered={false}
        title={
          <FormattedMessage
            id="dashboardanalysis.analysis.total-sales"
            defaultMessage="Total Sales"
          />
        }
        action={
          <Tooltip
            title={
              <FormattedMessage
                id="dashboardanalysis.analysis.introduce"
                defaultMessage="Introduce"
              />
            }
          >
            <InfoCircleOutlined />
          </Tooltip>
        }
        loading={loading}
        total={() => 126560}
        contentHeight={46}
      />
    </Col>
  );
  return (
    <Row gutter={24}>
      {subjectSummary()}
      {eventSummary()}
      {ruleSummary()}
    </Row>
  );
};

export default Summary;
