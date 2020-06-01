import { Button, Card, Col, Form, Row, Select } from 'antd';

import React, { FC, useEffect } from 'react';
import { Dispatch } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { StateType as EnumsStateType } from '@/models/enums';
import { DROP_LIST_SEPARATOR } from '@/constant';
import MyCodeMirror from '@/components/MyCodeMirror';
import { StateType } from './model';

const styles = require('./style.less');

const { Option } = Select;

const fieldLabels = {
  ruleCode: '规则',
  req: '请求参数',
  resp: '响应结果',
};

interface RuleCodeProps {
  dispatch: Dispatch;
  submitting: boolean;
  ruleMockModel: StateType;
  enumsModel: EnumsStateType;
}

const RuleMock: FC<RuleCodeProps> = ({ submitting, dispatch, enumsModel, ruleMockModel }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      respResult: ruleMockModel.submitResp.data
        ? JSON.stringify(ruleMockModel.submitResp.data)
        : ruleMockModel.submitResp.msg,
    });
  }, [ruleMockModel.submitResp]);

  useEffect(() => {
    dispatch({
      type: 'enumsModel/fetchRule',
    });
    return form.resetFields(['respResult']);
  }, [1]);

  const onFinish = (values: { [key: string]: any }) => {
    let params = values;
    if (values.ruleCode.includes(DROP_LIST_SEPARATOR)) {
      const [newRuleCode] = values.ruleCode.split(DROP_LIST_SEPARATOR);
      params = { ...values, ruleCode: newRuleCode };
    }
    dispatch({
      type: 'ruleMockModel/submit',
      payload: params,
    });
  };

  const onChange = () => {
    form.resetFields(['respResult']);
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{}}>
      <PageHeaderWrapper content="">
        <Card className={styles.card} bordered={false}>
          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item
                label={fieldLabels.ruleCode}
                name="ruleCode"
                rules={[{ required: true, message: '请选择规则' }]}
              >
                <Select placeholder="支持编码和名称搜索" onChange={onChange} showSearch>
                  {enumsModel.ruleEnums?.map((item) => (
                    <Option key={item.key} value={`${item.key}${DROP_LIST_SEPARATOR}${item.val}`}>
                      {item.val}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
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
    enumsModel,
    ruleMockModel,
  }: {
    enumsModel: EnumsStateType;
    ruleMockModel: StateType;
    loading: { effects: { [key: string]: boolean } };
  }) => ({
    enumsModel,
    ruleMockModel,
    submitting: loading.effects['ruleMockModel/submit'],
  }),
)(RuleMock);
