import { Card, Descriptions, Divider, Typography, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';

import { Dispatch, useLocation } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import MyCodeMirror from '@/components/MyCodeMirror';
import * as qs from 'query-string';
import { StateType } from './model';

const styles = require('./style.less');

const { Paragraph } = Typography;

interface RuleDetailProps {
  loading: boolean;
  dispatch: Dispatch;
  ruleDetailModel: StateType;
  location: Location;
}

interface RouteParams {
  ruleCode?: string;
}

const RuleDetail: React.FC<RuleDetailProps> = ({ dispatch, ruleDetailModel }) => {
  const location = useLocation();
  const [routeParamsState] = useState<RouteParams>(qs.parse(location.search) as RouteParams);
  const { ruleDetailData } = ruleDetailModel;
  useEffect(() => {
    dispatch({
      type: 'ruleDetailModel/fetch',
      payload: { ...routeParamsState },
    });
  }, [1]);

  return (
    <PageHeaderWrapper>
      <Card bordered={false}>
        <Descriptions title="基础配置" style={{ marginBottom: 32 }}>
          <Descriptions.Item label="事件编码">{ruleDetailData.eventCode}</Descriptions.Item>
          <Descriptions.Item label="规则编码">{ruleDetailData.ruleCode}</Descriptions.Item>
          <Descriptions.Item label="飞书webHook">
            <Tooltip title={ruleDetailData.feishuWebhook}>
              <Paragraph copyable ellipsis={{ rows: 1, expandable: false }}>
                {ruleDetailData.feishuWebhook}
              </Paragraph>
            </Tooltip>
          </Descriptions.Item>
          <Descriptions.Item label="子事件编码">{ruleDetailData.subEventCodes}</Descriptions.Item>
          <Descriptions.Item label="规则名称">{ruleDetailData.ruleName}</Descriptions.Item>
          <Descriptions.Item label="httpUrl">
            <Tooltip title={ruleDetailData.httpUrl}>
              <Paragraph copyable ellipsis={{ rows: 1, expandable: false }}>
                {ruleDetailData.httpUrl}
              </Paragraph>
            </Tooltip>
          </Descriptions.Item>
          <Descriptions.Item label="报警编码">{ruleDetailData.alarmCode}</Descriptions.Item>
        </Descriptions>
        {ruleDetailData.exeType === 1 ? (
          <>
            <Divider style={{ marginBottom: 32 }} />
            <Descriptions
              title="核对配置"
              style={{ marginBottom: 32 }}
              column={1}
              layout="vertical"
            >
              <Descriptions.Item label="过滤脚本">
                <Paragraph className={styles.myParagraph}>
                  <MyCodeMirror
                    readOnly
                    modeName="text/x-java"
                    value={ruleDetailData.filterRule}
                    onBeforeChange={(edit, data, value, next) => {
                      edit.setSize('100%', 'auto');
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
              <Descriptions.Item label="核对脚本">
                <Paragraph className={styles.myParagraph}>
                  <MyCodeMirror
                    readOnly
                    modeName="text/x-java"
                    value={ruleDetailData.equalsRule}
                    onBeforeChange={(edit, data, value, next) => {
                      edit.setSize('100%', 'auto');
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
              <Descriptions.Item label="binlog数据">
                <Paragraph className={styles.myParagraph}>
                  <MyCodeMirror
                    readOnly
                    modeName="application/json"
                    value={ruleDetailData.leftData}
                    onBeforeChange={(edit, data, value, next) => {
                      edit.setSize('100%', 'auto');
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
              <Descriptions.Item label="目标数据">
                <Paragraph className={styles.myParagraph}>
                  <MyCodeMirror
                    readOnly
                    modeName="application/json"
                    value={ruleDetailData.rightData}
                    onBeforeChange={(edit, data, value, next) => {
                      edit.setSize('100%', 'auto');
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
            <Divider style={{ marginBottom: 32 }} />
            <Descriptions title="字段映射关系" style={{ marginBottom: 32 }} column={2}>
              {ruleDetailData.fieldMapping
                ? ruleDetailData.fieldMapping.map((item: any) => (
                    <React.Fragment key={item.sourceField}>
                      <Descriptions.Item label="源字段">
                        <Paragraph copyable>{item.sourceField}</Paragraph>
                      </Descriptions.Item>
                      <Descriptions.Item label="目标字段">
                        <Paragraph copyable>{item.targetField}</Paragraph>
                      </Descriptions.Item>
                    </React.Fragment>
                  ))
                : null}
            </Descriptions>
            <Divider style={{ marginBottom: 32 }} />
            <Descriptions title="固定字段" style={{ marginBottom: 32 }} column={2}>
              {ruleDetailData.baseField
                ? ruleDetailData.baseField.map((item: any) => (
                    <React.Fragment key={item.key}>
                      <Descriptions.Item label="key">
                        <Paragraph copyable>{item.key}</Paragraph>
                      </Descriptions.Item>
                      <Descriptions.Item label="value">
                        <Paragraph copyable>{item.value}</Paragraph>
                      </Descriptions.Item>
                    </React.Fragment>
                  ))
                : null}
            </Descriptions>
          </>
        ) : (
          <>
            <Divider style={{ marginBottom: 32 }} />
            <Descriptions
              title="核对配置"
              style={{ marginBottom: 32 }}
              column={1}
              layout="vertical"
            >
              <Descriptions.Item label={`Groovy扩展类-${ruleDetailData.className}`}>
                <Paragraph className={styles.myParagraph}>
                  <MyCodeMirror
                    readOnly
                    modeName="text/x-java"
                    value={ruleDetailData.classContent}
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
        <Divider style={{ marginBottom: 32 }} />
        <Descriptions title="降级策略" style={{ marginBottom: 32 }}>
          <Descriptions.Item label="采样百分比">{ruleDetailData.samplingRate}%</Descriptions.Item>
          <Descriptions.Item label="首次延迟时间">
            {ruleDetailData.firstDelayTime}秒
          </Descriptions.Item>
          <Descriptions.Item label="最大超时时间">
            {ruleDetailData.maxTimeout}分钟
          </Descriptions.Item>
          <Descriptions.Item label="生效时间">
            {ruleDetailData.validTime.map((item, index) => {
              if (index === ruleDetailData.validTime.length - 1) {
                return `${item}`;
              }
              return `${item}——`;
            })}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </PageHeaderWrapper>
  );
};

export default connect(
  ({
    ruleDetailModel,
    loading,
  }: {
    ruleDetailModel: StateType;
    loading: {
      effects: { [key: string]: boolean };
    };
  }) => ({
    ruleDetailModel,
    loading: loading.effects['ruleDetailModel/fetchBasic'],
  }),
)(RuleDetail);
