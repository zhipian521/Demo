import { Card, Descriptions, Divider, Button, Typography } from 'antd';
import React, { useEffect, useState } from 'react';

import { Dispatch, useLocation } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import MyCodeMirror from '@/components/MyCodeMirror';
import * as qs from 'query-string';
import { StateType } from './model';

const styles = require('./style.less');

const { Paragraph } = Typography;

interface RuleHistoryProps {
  loading: boolean;
  dispatch: Dispatch;
  ruleHistoryModel: StateType;
}

interface RouteParams {
  ruleCode?: string;
}

const RuleDetail: React.FC<RuleHistoryProps> = ({ dispatch, ruleHistoryModel }) => {
  const location = useLocation();
  const [routeParamsState] = useState<RouteParams>(qs.parse(location.search) as RouteParams);
  const { ruleHistoryData } = ruleHistoryModel;
  useEffect(() => {
    dispatch({
      type: 'ruleHistoryModel/fetch',
      payload: { ruleCode: routeParamsState.ruleCode },
    });
  }, [1]);

  const onFilterRollBackClick = () => {
    dispatch({
      type: 'ruleHistoryModel/filterRollBack',
      payload: {
        ruleCode: ruleHistoryData.ruleCode,
        ruleType: 3,
      },
    });
  };
  const onCheckRollBackClick = () => {
    dispatch({
      type: 'ruleHistoryModel/checkRollBack',
      payload: {
        ruleCode: ruleHistoryData.ruleCode,
        ruleType: 4,
      },
    });
  };
  const onScriptRollBackClick = () => {
    dispatch({
      type: 'ruleHistoryModel/scriptRollBack',
      payload: {
        ruleCode: ruleHistoryData.ruleCode,
        ruleType: 5,
      },
    });
  };
  return (
    <PageHeaderWrapper>
      <Card bordered={false}>
        {ruleHistoryData.exeType === 1 ? (
          <>
            <Descriptions
              title={
                <>
                  过滤脚本-{ruleHistoryData.filterRuleVersion}
                  <Button
                    size="small"
                    type="primary"
                    style={{ marginLeft: '10px' }}
                    onClick={() => onFilterRollBackClick()}
                  >
                    回滚
                  </Button>
                </>
              }
              className={styles.descriptions}
              column={1}
            >
              <Descriptions.Item>
                <MyCodeMirror
                  readOnly
                  modeName="text/x-java"
                  value={ruleHistoryData.filterRule}
                  onBeforeChange={(edit, data, value, next) => {
                    edit.setSize('70vw', '100%');
                    data.toString();
                    value.toString();
                    next.toString();
                  }}
                  onBlur={(editor, event) => {
                    event.toString();
                  }}
                  onCursorActivity={(editor) => {
                    editor.toString();
                  }}
                />
              </Descriptions.Item>
            </Descriptions>
            <Divider style={{ marginBottom: 32 }} />
            <Descriptions
              title={
                <>
                  核对脚本-{ruleHistoryData.equalsRuleVersion}
                  <Button
                    size="small"
                    type="primary"
                    style={{ marginLeft: '10px' }}
                    onClick={() => onCheckRollBackClick()}
                  >
                    回滚
                  </Button>
                </>
              }
              className={styles.descriptions}
              column={1}
            >
              <Descriptions.Item>
                <MyCodeMirror
                  readOnly
                  modeName="text/x-java"
                  value={ruleHistoryData.equalsRule}
                  onBeforeChange={(edit, data, value, next) => {
                    edit.setSize('70vw', '100%');
                    data.toString();
                    value.toString();
                    next.toString();
                  }}
                  onBlur={(editor, event) => {
                    event.toString();
                  }}
                  onCursorActivity={(editor) => {
                    editor.toString();
                  }}
                />
              </Descriptions.Item>
            </Descriptions>
            <Divider style={{ marginBottom: 32 }} />
            <Descriptions title="字段映射关系" style={{ marginBottom: 32 }} column={2}>
              {ruleHistoryData.fieldMapping?.map((item) => (
                <React.Fragment key={item.sourceField}>
                  <Descriptions.Item label="源字段">{item.sourceField}</Descriptions.Item>
                  <Descriptions.Item label="目标字段">{item.targetField}</Descriptions.Item>
                </React.Fragment>
              ))}
            </Descriptions>
          </>
        ) : (
          <>
            <Descriptions
              title={
                <>
                  Groovy扩展类-{ruleHistoryData.className}-{ruleHistoryData.filterRuleVersion}
                  <Button
                    size="small"
                    type="primary"
                    style={{ marginLeft: '10px' }}
                    onClick={() => onScriptRollBackClick()}
                  >
                    回滚
                  </Button>
                </>
              }
            >
              <Descriptions.Item>
                <Paragraph className={styles.myParagraph}>
                  <MyCodeMirror
                    readOnly
                    modeName="text/x-java"
                    value={ruleHistoryData.classContent}
                    onBeforeChange={(edit, data, value, next) => {
                      edit.setSize('100%', 500);
                      data.toString();
                      value.toString();
                      next.toString();
                    }}
                    onBlur={(editor, event) => {
                      event.toString();
                    }}
                    onCursorActivity={(editor) => {
                      editor.toString();
                    }}
                  />
                </Paragraph>
              </Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Card>
    </PageHeaderWrapper>
  );
};

export default connect(
  ({
    ruleHistoryModel,
    loading,
  }: {
    ruleHistoryModel: StateType;
    loading: {
      effects: { [key: string]: boolean };
    };
  }) => ({
    ruleHistoryModel,
    loading: loading.effects['ruleHistoryModel/fetchBasic'],
  }),
)(RuleDetail);
