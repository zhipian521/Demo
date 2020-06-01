import { Button, Card, Col, Form, Row } from 'antd';

import React, { FC, useEffect } from 'react';
import { Dispatch } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { StateType } from './model';
import MyCodeMirror from '@/components/MyCodeMirror';

const styles = require('./style.less');

const fieldLabels = {
  req: '请求参数',
  resp: '响应结果',
};

interface RuleCodeProps {
  dispatch: Dispatch;
  submitting: boolean;
  flowMockModel: StateType;
}

const FlowMock: FC<RuleCodeProps> = ({ submitting, dispatch, flowMockModel }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      respResult: flowMockModel.submitResp.data
        ? JSON.stringify(flowMockModel.submitResp.data)
        : flowMockModel.submitResp.msg,
    });
  }, [flowMockModel.submitResp]);

  useEffect(() => {
    form.resetFields(['respResult']);
  }, [1]);

  const onFinish = (values: { [key: string]: any }) => {
    dispatch({
      type: 'flowMockModel/submit',
      payload: values,
    });
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{}}>
      <PageHeaderWrapper content="">
        <Card className={styles.card} bordered={false}>
          <Row gutter={16}>
            <Col xl={{ span: 10 }} lg={{ span: 12 }} md={{ span: 12 }} sm={24}>
              <Form.Item
                label={fieldLabels.req}
                name="reqParam"
                rules={[{ required: true, message: '请求参数必填' }]}
              >
                <MyCodeMirror
                  modeName="application/json"
                  placeholder="请输入请求参数"
                  onBeforeChange={() => {}}
                  onBlur={(editor, event) => {
                    event.toString();
                    form.setFieldsValue({ reqParam: editor.getValue() });
                    editor.closeHint();
                  }}
                  onCursorActivity={(editor) => {
                    editor.showHint();
                  }}
                />
              </Form.Item>
            </Col>
            <Col xl={{ span: 10, offset: 2 }} lg={{ span: 12 }} md={{ span: 12 }} sm={24}>
              <Form.Item label={fieldLabels.resp} name="respResult">
                <MyCodeMirror
                  readOnly
                  modeName="text/x-groovy"
                  placeholder="响应结果"
                  onBeforeChange={(edit, data, value, next) => {
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
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xl={{ span: 10, offset: 10 }} lg={{ span: 12 }} md={{ span: 12 }} sm={24}>
              <Button
                type="primary"
                onClick={() => (form ? form.submit() : null)}
                loading={submitting}
              >
                提交
              </Button>
            </Col>
          </Row>
        </Card>
      </PageHeaderWrapper>
    </Form>
  );
};

export default connect(
  ({
    loading,
    flowMockModel,
  }: {
    flowMockModel: StateType;
    loading: { effects: { [key: string]: boolean } };
  }) => ({
    flowMockModel,
    submitting: loading.effects['flowMockModel/submit'],
  }),
)(FlowMock);
