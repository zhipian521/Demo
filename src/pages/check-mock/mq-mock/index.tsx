import { Button, Card, Col, Form, Input, Row, Select } from 'antd';

import React, { FC, useEffect } from 'react';
import { Dispatch } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { StateType as EnumsStateType } from '@/models/enums';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/lib/codemirror.js';
import 'codemirror/theme/idea.css';
import 'codemirror/mode/cmake/cmake';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/mode/clike/clike.js';
import 'codemirror/mode/css/css.js';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/show-hint.js';
import 'codemirror/addon/hint/anyword-hint.js';
import 'codemirror/addon/hint/javascript-hint.js';
import 'codemirror/addon/lint/lint.css';
import 'codemirror/addon/lint/lint.js';
import 'codemirror/addon/lint/json-lint.js';
import 'codemirror/addon/lint/css-lint.js';
import 'codemirror/addon/lint/javascript-lint.js';
import 'codemirror/addon/edit/matchbrackets.js';
import 'codemirror/addon/edit/closebrackets.js';
import { DROP_LIST_SEPARATOR } from '@/constant';
import { StateType } from './model';

const styles = require('./style.less');

const { Option } = Select;

const fieldLabels = {
  subjectCode: '主题',
  req: '请求参数',
  resp: '响应结果',
};

interface RuleCodeProps {
  dispatch: Dispatch;
  submitting: boolean;
  mqMockModel: StateType;
  enumsModel: EnumsStateType;
}

const MqMock: FC<RuleCodeProps> = ({ submitting, dispatch, enumsModel, mqMockModel }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      respResult: mqMockModel.submitResp.data
        ? JSON.stringify(mqMockModel.submitResp.data)
        : mqMockModel.submitResp.msg,
    });
  }, [mqMockModel.submitResp]);

  useEffect(() => {
    dispatch({
      type: 'enumsModel/fetchSubject',
    });
    return form.resetFields(['respResult']);
  }, [1]);

  const onFinish = (values: { [key: string]: any }) => {
    let params = values;
    if (values.ruleCode.includes(DROP_LIST_SEPARATOR)) {
      const [newRuleCode] = values.ruleCode.split(DROP_LIST_SEPARATOR);
      params = { ...values, subjectCode: newRuleCode };
    }
    dispatch({
      type: 'mqMockModel/submit',
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
                label={fieldLabels.subjectCode}
                name="ruleCode"
                rules={[{ required: true, message: '请选择主题' }]}
              >
                <Select placeholder="支持编码和名称搜索" onChange={onChange} showSearch>
                  {enumsModel.subjectEnums
                    ? enumsModel.subjectEnums.map((item) => {
                        if (item.extra.type === '1') {
                          return (
                            <Option
                              key={item.key}
                              value={`${item.key}${DROP_LIST_SEPARATOR}${item.val}`}
                            >
                              {item.val}
                            </Option>
                          );
                        }
                        return null;
                      })
                    : []}
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
                <CodeMirror
                  options={{
                    mode: { name: 'application/json', globalVars: true },
                    theme: 'idea',
                    lineNumbers: true,
                    matchBrackets: true,
                    spellcheck: true,
                    gutters: [
                      'CodeMirror-linenumbers',
                      'CodeMirror-foldgutter',
                      'CodeMirror-lint-markers',
                    ],
                    // lint: true,
                    smartIndent: true,
                    autoCloseBrackets: true,
                    placeholder: '请输入请求参数',
                  }}
                  onBeforeChange={() => {}}
                  onBlur={(editor, event) => {
                    event.toString();
                    form.setFieldsValue({ reqParam: editor.getValue() });
                    // editor.closeHint();
                  }}
                  onCursorActivity={(editor) => {
                    editor.toString();
                    // editor.showHint();
                  }}
                />
              </Form.Item>
            </Col>
            <Col xl={{ span: 10, offset: 2 }} lg={{ span: 12 }} md={{ span: 12 }} sm={24}>
              <Form.Item label={fieldLabels.resp} name="respResult">
                <Input.TextArea readOnly autoSize={{ minRows: 13.2, maxRows: 13.2 }} />
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
    mqMockModel,
  }: {
    enumsModel: EnumsStateType;
    mqMockModel: StateType;
    loading: { effects: { [key: string]: boolean } };
  }) => ({
    enumsModel,
    mqMockModel,
    submitting: loading.effects['mqMockModel/submit'],
  }),
)(MqMock);
