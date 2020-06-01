import { Button, Card, Col, Form, Row, Select } from 'antd';

import React, { FC, useEffect, useState } from 'react';
import { Dispatch } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { DROP_LIST_SEPARATOR } from '@/constant';
import { enumsRespData } from '@/data/common';
import MyCodeMirror from '@/components/MyCodeMirror';
import { StateType } from './model';
import { StateType as EnumsStateType } from '../../../models/enums';

const styles = require('./style.less');

const { Option } = Select;
const fieldLabels = {
  scriptType: '脚本类型',
  eventCode: '事件编码',
  subEventCode: '子事件编码',
  ruleCode: '规则编码',
  script: '脚本',
  binlogData: 'binlog数据',
  targetData: '目标数据',
  resp: '响应结果',
};

const scriptTypeEnum = [
  { key: 1, value: '事件' },
  { key: 2, value: '子事件' },
  { key: 3, value: '规则-过滤脚本' },
  { key: 4, value: '规则-核对脚本' },
];

const defaultScriptType = 0;

interface ScriptProps {
  dispatch: Dispatch;
  submitting: boolean;
  scriptMockModel: StateType;
  enumsModel: EnumsStateType;
}

const ScriptMock: FC<ScriptProps> = ({ submitting, dispatch, scriptMockModel, enumsModel }) => {
  const [form] = Form.useForm();
  const [filterVisibleState, setFilterVisibleState] = useState<boolean>(false);
  const [respHeightState, setRespHeightState] = useState<string>('120px');
  const [scriptState, setScriptState] = useState<number>(120);
  const [binlogState, setBinLogState] = useState<number>(120);
  const [showSelectState, setShowSelectState] = useState<number>(defaultScriptType);

  useEffect(() => {
    dispatch({
      type: 'enumsModel/fetchRule',
    });
    dispatch({
      type: 'enumsModel/fetchEvent',
    });
    dispatch({
      type: 'enumsModel/fetchSubEvent',
    });
  }, [1]);

  useEffect(() => {
    form.setFieldsValue({
      respResult: scriptMockModel.submitResp.data
        ? JSON.stringify(scriptMockModel.submitResp.data)
        : scriptMockModel.submitResp.msg,
    });
  }, [scriptMockModel.submitResp]);

  useEffect(() => {
    form.setFieldsValue({
      script: scriptMockModel.script,
    });
  }, [scriptMockModel.script]);

  useEffect(() => {
    form.setFieldsValue({
      binlogData: scriptMockModel.leftData,
    });
  }, [scriptMockModel.leftData]);

  useEffect(() => {
    form.setFieldsValue({
      targetData: scriptMockModel.rightData,
    });
  }, [scriptMockModel.rightData]);

  useEffect(() => {
    form.resetFields(['respResult', 'script', 'binlogData', 'targetData']);
  }, [1]);

  const onFinish = (values: { [key: string]: any }) => {
    dispatch({
      type: 'scriptMockModel/submit',
      payload: values,
    });
  };

  const onChangeScriptType = (val: any) => {
    setShowSelectState(val);
    if (val === 4) {
      setRespHeightState('500px');
      setFilterVisibleState(true);
    } else {
      setRespHeightState('120px');
      setFilterVisibleState(false);
    }
    form.resetFields([
      'respResult',
      'eventCode',
      'subEventCode',
      'ruleCode',
      'script',
      'binlogData',
      'targetData',
    ]);
  };

  const onChangeScript = (val: any) => {
    if (val <= 80) {
      if (scriptState / 24 <= val) {
        setScriptState(120 + val * 24);
      } else if (val < 5) {
        setScriptState(120);
      }
    }
    form.resetFields(['respResult']);
  };

  const onChangeBinlog = (val: any) => {
    if (val <= 80) {
      if (scriptState / 24 <= val) {
        setBinLogState(120 + val * 24);
      } else if (val < 5) {
        setBinLogState(120);
      }
    }
    form.resetFields(['respResult']);
  };

  const onChangeEventCode = async (val: string) => {
    const eventCode =
      val && val.includes(DROP_LIST_SEPARATOR) ? val.split(DROP_LIST_SEPARATOR) : [''];
    dispatch({
      type: 'scriptMockModel/fetchEventByCode',
      payload: { eventCode: eventCode[0] },
    });
  };

  const onChangeSubEventCode = async (val: string) => {
    const subEventCode =
      val && val.includes(DROP_LIST_SEPARATOR) ? val.split(DROP_LIST_SEPARATOR) : [''];
    dispatch({
      type: 'scriptMockModel/fetchSubEventByCode',
      payload: { subEventCode: subEventCode[0] },
    });
  };

  const onChangeRuleCode = async (val: string) => {
    const ruleCode =
      val && val.includes(DROP_LIST_SEPARATOR) ? val.split(DROP_LIST_SEPARATOR) : [''];
    dispatch({
      type: 'scriptMockModel/fetchRuleByCode',
      payload: { ruleCode: ruleCode[0], type: showSelectState },
    });
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <PageHeaderWrapper content="">
        <Card className={styles.card} bordered={false}>
          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item
                label={fieldLabels.scriptType}
                name="scriptType"
                rules={[{ required: true, message: '请选择脚本类型' }]}
              >
                <Select placeholder="请选择脚本类型" onChange={onChangeScriptType} allowClear>
                  {scriptTypeEnum.map((item: any) => (
                    <Option key={item.key} value={item.key}>
                      {item.value}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            {showSelectState === 1 ? (
              <Col lg={6} md={12} sm={24}>
                <Form.Item
                  label={fieldLabels.eventCode}
                  name="eventCode"
                  rules={[{ required: false, message: '请选择事件编码' }]}
                >
                  <Select placeholder="支持编码和名称搜索" onChange={onChangeEventCode}>
                    {enumsModel.eventEnums?.map((item: enumsRespData) => (
                      <Option key={item.key} value={`${item.key}${DROP_LIST_SEPARATOR}${item.val}`}>
                        {item.val}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            ) : null}

            {showSelectState === 2 ? (
              <Col lg={6} md={12} sm={24}>
                <Form.Item
                  label={fieldLabels.subEventCode}
                  name="subEventCode"
                  rules={[{ required: false, message: '请选择子事件编码' }]}
                >
                  <Select placeholder="支持编码和名称搜索" onChange={onChangeSubEventCode}>
                    {enumsModel.subEventEnums?.map((item: enumsRespData) => (
                      <Option key={item.key} value={`${item.key}${DROP_LIST_SEPARATOR}${item.val}`}>
                        {item.val}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            ) : null}

            {showSelectState === 3 || showSelectState === 4 ? (
              <Col lg={6} md={12} sm={24}>
                <Form.Item
                  label={fieldLabels.ruleCode}
                  name="ruleCode"
                  rules={[{ required: false, message: '请选择规则编码' }]}
                >
                  <Select placeholder="支持编码和名称搜索" onChange={onChangeRuleCode}>
                    {enumsModel.ruleEnums?.map((item: enumsRespData) => (
                      <Option key={item.key} value={`${item.key}${DROP_LIST_SEPARATOR}${item.val}`}>
                        {item.val}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            ) : null}
          </Row>
          <Row gutter={16}>
            <Col xl={{ span: 10 }} lg={{ span: 12 }} md={{ span: 12 }} sm={24}>
              <Row gutter={16}>
                <Col xl={{ span: 24 }} lg={{ span: 24 }} md={{ span: 24 }} sm={24}>
                  <Form.Item
                    label={fieldLabels.script}
                    name="script"
                    rules={[{ required: true, message: '脚本必填' }]}
                  >
                    <MyCodeMirror
                      modeName="text/x-groovy"
                      placeholder={
                        !filterVisibleState
                          ? '格式:obj.{binlog中字段名},number类型需加上toInteger(),varchar类型加上toString()，可用脚本MOCK进行验证'
                          : '格式:left.{binlog中的字段名},right.{目标系统响应中的字段名},number类型需加上toInteger(),varchar类型加上toString()，可用脚本MOCK进行验证'
                      }
                      onBeforeChange={(edit, data, value, next) => {
                        onChangeScript(edit.doc.size);
                        edit.setSize('auto', scriptState);
                        data.toString();
                        value.toString();
                        next.toString();
                      }}
                      onBlur={(editor, event) => {
                        event.toString();
                        form.setFieldsValue({ script: editor.getValue() });
                        // editor.closeHint()
                      }}
                      onCursorActivity={(editor) => {
                        editor.toString();
                        // editor.showHint()
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xl={{ span: 24 }} lg={{ span: 24 }} md={{ span: 24 }} sm={24}>
                  <Form.Item
                    label={fieldLabels.binlogData}
                    name="binlogData"
                    rules={[{ required: true, message: 'binlog数据必填' }]}
                  >
                    <MyCodeMirror
                      modeName="application/json"
                      placeholder="请输入binlog数据"
                      onBeforeChange={(edit, data, value, next) => {
                        onChangeBinlog(edit.doc.size);
                        edit.setSize('auto', binlogState);
                        data.toString();
                        value.toString();
                        next.toString();
                      }}
                      onBlur={(editor, event) => {
                        event.toString();
                        form.setFieldsValue({ binlogData: editor.getValue() });
                        editor.closeHint();
                      }}
                      onCursorActivity={(editor) => {
                        editor.toString();
                        editor.showHint();
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xl={{ span: 24 }} lg={{ span: 24 }} md={{ span: 24 }} sm={24}>
                  {filterVisibleState ? (
                    <Form.Item
                      label={fieldLabels.targetData}
                      name="targetData"
                      rules={[{ required: true, message: '目标数据必填' }]}
                    >
                      <MyCodeMirror
                        modeName="application/json"
                        placeholder="请输入目标数据"
                        onBeforeChange={(edit, data, value, next) => {
                          edit.setSize('auto', '120px');
                          data.toString();
                          value.toString();
                          next.toString();
                        }}
                        onBlur={(editor, event) => {
                          event.toString();
                          form.setFieldsValue({ targetData: editor.getValue() });
                          editor.closeHint();
                        }}
                        onCursorActivity={(editor) => {
                          editor.showHint();
                        }}
                      />
                    </Form.Item>
                  ) : null}
                </Col>
              </Row>
            </Col>
            <Col xl={{ span: 10, offset: 2 }} lg={{ span: 12 }} md={{ span: 12 }} sm={24}>
              <Form.Item label={fieldLabels.resp} name="respResult">
                <MyCodeMirror
                  readOnly
                  modeName="text/x-groovy"
                  placeholder="响应结果"
                  onBeforeChange={(edit, data, value, next) => {
                    edit.setSize('auto', respHeightState);
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
                执行
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
    enumsModel,
    scriptMockModel,
    loading,
  }: {
    enumsModel: EnumsStateType;
    scriptMockModel: StateType;
    loading: { effects: { [key: string]: boolean } };
  }) => ({
    enumsModel,
    scriptMockModel,
    submitting: loading.effects['scriptMockModel/submit'],
  }),
)(ScriptMock);
