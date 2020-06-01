import { Avatar, Card, Col, List, Row, Skeleton, Statistic } from 'antd';
import React, { useEffect, useState } from 'react';

import { connect, Dispatch, Link } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { history } from '@@/core/history';
import moment from 'moment';
import { StateType as UserStateType } from '@/models/user';
import { StateType as EnumsStateType } from '@/models/enums';
import { StateType } from './model';
import EditableLinkGroup, { EditableLink } from './components/EditableLinkGroup';
import SubjectDemoteModal from './components/SubjectDemote';
import RuleDemoteModal from './components/RuleDemote';
import FastDemoteModal from './components/FastDemote';
import FastRestoreModal from './components/FastRestore';
import SamplingDemoteModal from './components/SamplingDemote';
import styles from './style.less';
import {
  CheckErrorTrackData,
  FastDemoteInfoData,
  RuleInfoData,
  SamplingDemoteInfoData,
  SubjectInfoData,
} from './data.d';

interface DashboardWorkplaceProps {
  dispatch: Dispatch;
  worktableModel: StateType;
  userModel: UserStateType;
  enumsModel: EnumsStateType;
  currentUserLoading: boolean;
  projectLoading: boolean;
  activitiesLoading: boolean;
  quickActionsLoading: boolean;
}

const DashboardWorkplace: React.FC<DashboardWorkplaceProps> = ({
  dispatch,
  worktableModel,
  userModel,
  enumsModel,
  projectLoading,
  activitiesLoading,
}) => {
  const [subjectDemoteVisibleState, setSubjectDemoteVisibleState] = useState<boolean>(false);
  const [ruleDemoteVisibleState, setRuleDemoteVisibleState] = useState<boolean>(false);
  const [fastDemoteVisibleState, setFastDemoteVisibleState] = useState<boolean>(false);
  const [fastRestoreVisibleState, setFastRestoreVisibleState] = useState<boolean>(false);
  const [samplingDemoteVisibleState, setSamplingDemoteVisibleState] = useState<boolean>(false);
  const { currentUser } = userModel;
  useEffect(() => {
    dispatch({
      type: 'userModel/fetchCurrent',
    });
    dispatch({
      type: 'enumsModel/fetchSubject',
    });
    dispatch({
      type: 'enumsModel/fetchRule',
    });
    dispatch({
      type: 'enumsModel/fetchAlarm',
    });
    dispatch({
      type: 'worktableModel/init',
    });
  }, [1]);

  const convert = (data: CheckErrorTrackData[]) => {
    if (!data) {
      return [];
    }
    return data.map((item) => {
      let alarmName = '';
      let ruleName = '';
      enumsModel.alarmEnums.forEach((a) => {
        if (item.alarmCode === a.key) {
          alarmName = a.val;
        }
      });
      enumsModel.ruleEnums.forEach((b) => {
        if (item.ruleCode === b.key) {
          ruleName = b.val;
        }
      });
      return {
        alarmName,
        ruleName,
        ...item,
      };
    });
  };

  const handleModelOpen = (id: string) => {
    switch (id) {
      case '3':
        setSubjectDemoteVisibleState(true);
        break;
      case '4':
        setRuleDemoteVisibleState(true);
        break;
      case '5':
        setFastDemoteVisibleState(true);
        break;
      case '6':
        setFastRestoreVisibleState(true);
        break;
      case '7':
        setSamplingDemoteVisibleState(true);
        break;
      default:
        break;
    }
  };

  const handleCancel = () => {
    setSubjectDemoteVisibleState(false);
    setRuleDemoteVisibleState(false);
    setFastDemoteVisibleState(false);
    setFastRestoreVisibleState(false);
    setSamplingDemoteVisibleState(false);
  };

  const handleSubjectDemoteSubmit = (values: SubjectInfoData) => {
    dispatch({
      type: 'worktableModel/fetchSubjectDemote',
      payload: values,
    });
    setSubjectDemoteVisibleState(false);
  };

  const handleRuleDemoteSubmit = (values: RuleInfoData) => {
    dispatch({
      type: 'worktableModel/fetchRuleDemote',
      payload: values,
    });
    setRuleDemoteVisibleState(false);
  };

  const handleFastDemoteSubmit = (values: FastDemoteInfoData) => {
    dispatch({
      type: 'worktableModel/fetchFastDemote',
      payload: values,
    });
    setFastDemoteVisibleState(false);
  };
  const handleFastRestoreSubmit = (values: FastDemoteInfoData) => {
    dispatch({
      type: 'worktableModel/fetchFastRestore',
      payload: values,
    });
    setFastRestoreVisibleState(false);
  };
  const handleSamplingDemoteSubmit = (values: SamplingDemoteInfoData) => {
    dispatch({
      type: 'worktableModel/fetchSampling',
      payload: values,
    });
    setSamplingDemoteVisibleState(false);
  };

  const ExtraContent = () => (
    <div className={styles.extraContent}>
      <div className={styles.statItem}>
        <Statistic
          title="主题数"
          value={enumsModel.subjectEnums ? enumsModel.subjectEnums.length : 0}
        />
      </div>
      <div className={styles.statItem}>
        <Statistic
          title="规则总数"
          value={enumsModel.ruleEnums ? enumsModel.ruleEnums.length : 0}
        />
      </div>
    </div>
  );

  const PageHeaderContent = () => {
    const loading = currentUser && Object.keys(currentUser).length;
    if (!loading) {
      return <Skeleton avatar paragraph={{ rows: 1 }} active />;
    }
    return (
      <div className={styles.pageHeaderContent}>
        <div className={styles.avatar}>
          <Avatar size="large" src={currentUser.avatar} />
        </div>
        <div className={styles.content}>
          <div className={styles.contentTitle}>
            Hi，
            {currentUser.name}
            ，祝你开心每一天！
          </div>
        </div>
      </div>
    );
  };

  const renderActivities = (item: CheckErrorTrackData) => {
    return (
      <List.Item key={item.id}>
        <List.Item.Meta
          title={
            <span>
              <a
                className={styles.username}
                onClick={() => {
                  history.push({
                    pathname: '/check-abnormal/check-error-track',
                    state: {
                      id: item.id,
                    },
                  });
                }}
              >{`${item.ruleName}`}</a>
              &nbsp;
            </span>
          }
          description={
            <span className={styles.datetime}>
              <span className={styles.event}>{`告警规则：${item.alarmName}`}</span>
              <br />
              <span className={styles.event}>
                {' '}
                {`告警时间：${moment(item.gmtModified).fromNow()}`}
              </span>
            </span>
          }
        />
      </List.Item>
    );
  };

  if (!userModel || !userModel.currentUser.userId) {
    return null;
  }

  return (
    <PageHeaderWrapper content={<PageHeaderContent />} extraContent={<ExtraContent />}>
      <Row gutter={24}>
        <Col xl={16} lg={24} md={24} sm={24} xs={24}>
          <Card
            className={styles.projectList}
            style={{ marginBottom: 24 }}
            title="快捷操作"
            bordered={false}
            loading={projectLoading}
            bodyStyle={{ padding: 0 }}
          >
            {worktableModel.quickActionsData
              ? worktableModel.quickActionsData.map((item) => (
                  // @ts-ignore
                  <Card.Grid
                    className={styles.projectGrid}
                    key={item.id}
                    onClick={() => handleModelOpen(item.id)}
                  >
                    <Card bodyStyle={{ padding: 0 }} bordered={false}>
                      <Card.Meta
                        title={
                          <div className={styles.cardTitle}>
                            <Link to={item.href}>{item.title}</Link>
                          </div>
                        }
                      />
                    </Card>
                  </Card.Grid>
                ))
              : null}
          </Card>
          <Card
            bodyStyle={{ padding: 0 }}
            bordered={false}
            className={styles.activeCard}
            title="问题列表"
            loading={activitiesLoading}
          >
            <List<CheckErrorTrackData>
              loading={activitiesLoading}
              renderItem={(item) => renderActivities(item)}
              dataSource={convert(worktableModel.errorTrackData)}
              className={styles.activitiesList}
              size="large"
            />
          </Card>
        </Col>
        <Col xl={8} lg={24} md={24} sm={24} xs={24}>
          <Card
            style={{ marginBottom: 24 }}
            title="关注列表(主题)"
            bordered={false}
            bodyStyle={{ padding: 0 }}
          >
            <EditableLinkGroup
              onAdd={() => {}}
              links={
                enumsModel.subjectEnums
                  ? enumsModel.subjectEnums.map((item) => {
                      const result: EditableLink = {
                        title: item.val,
                        id: item.key,
                        href: '#',
                      };
                      return result;
                    })
                  : []
              }
              linkElement={Link}
            />
          </Card>
        </Col>
      </Row>
      <SubjectDemoteModal
        dispatch={dispatch}
        worktableModel={worktableModel}
        enumsModel={enumsModel}
        visible={subjectDemoteVisibleState}
        onCancel={handleCancel}
        onSubmit={handleSubjectDemoteSubmit}
      />
      <RuleDemoteModal
        worktableModel={worktableModel}
        dispatch={dispatch}
        enumsModel={enumsModel}
        visible={ruleDemoteVisibleState}
        onCancel={handleCancel}
        onSubmit={handleRuleDemoteSubmit}
      />
      <FastDemoteModal
        dispatch={dispatch}
        visible={fastDemoteVisibleState}
        onCancel={handleCancel}
        onSubmit={handleFastDemoteSubmit}
      />
      <FastRestoreModal
        dispatch={dispatch}
        visible={fastRestoreVisibleState}
        onCancel={handleCancel}
        onSubmit={handleFastRestoreSubmit}
      />
      <SamplingDemoteModal
        dispatch={dispatch}
        visible={samplingDemoteVisibleState}
        onCancel={handleCancel}
        onSubmit={handleSamplingDemoteSubmit}
      />
    </PageHeaderWrapper>
  );
};

export default connect(
  ({
    loading,
    worktableModel,
    userModel,
    enumsModel,
  }: {
    worktableModel: StateType;
    enumsModel: EnumsStateType;
    userModel: UserStateType;
    loading: { effects: { [key: string]: boolean } };
  }) => ({
    worktableModel,
    userModel,
    enumsModel,
    currentUserLoading: loading.effects['dashboardWorkplace/fetchUserCurrent'],
    projectLoading: loading.effects['dashboardWorkplace/fetchProjectNotice'],
    activitiesLoading: loading.effects['dashboardWorkplace/fetchActivitiesList'],
    quickActionsLoading: loading.effects['dashboardWorkplace/fetchQuickActionsData'],
  }),
)(DashboardWorkplace);
