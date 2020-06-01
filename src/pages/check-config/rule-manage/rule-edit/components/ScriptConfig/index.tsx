import { Button, Card, Col, Form, Input, message, Popover, Row, Tag, notification } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import { Dispatch, useLocation } from 'umi';
import { connect } from 'dva';
import { CloseCircleOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { StateType as EnumsStateType } from '@/models/enums';
import MyCodeMirror from '@/components/MyCodeMirror';
import { scriptMock } from '@/pages/check-mock/script-mock/service';
import * as qs from 'query-string';
import FooterToolbar from '../FooterToolbar';
import { StateType } from '../../model';

const styles = require('../../style.less');

type InternalNamePath = (string | number)[];

const fieldLabels = {
  filterRule: '过滤脚本',
  classContent: 'Groovy扩展脚本',
  equalsRule: '核对脚本',

  leftData: 'binlog数据',
  rightData: '目标数据',
};

interface RuleEditProps {
  dispatch: Dispatch;
  submitting: boolean;
  enumsModel: EnumsStateType;
  ruleEditModel: StateType;
}

interface ErrorField {
  name: InternalNamePath;
  errors: string[];
}

interface RouteParams {
  ruleCode?: string;
  eventCode?: string;
}

const RuleEdit: FC<RuleEditProps> = (props) => {
  const [scriptConfigForm] = Form.useForm();
  const location = useLocation();
  const [error, setError] = useState<ErrorField[]>([]);
  const [routeParamsState] = useState<RouteParams>(qs.parse(location.search) as RouteParams);
  const [filterMockResultState, setFilterMockResultState] = useState<number>(0);
  const [equalsMockResultState, setEqualsMockResultState] = useState<number>(0);

  useEffect(() => {
    if (props.ruleEditModel && props.ruleEditModel.ruleDetailData) {
      scriptConfigForm.setFieldsValue({
        ...props.ruleEditModel.ruleDetailData,
      });
    }
  }, [props.ruleEditModel]);

  const getErrorInfo = (errors: ErrorField[]) => {
    const errorCount = errors.filter((item) => item.errors.length > 0).length;
    if (!errors || errorCount === 0) {
      return null;
    }
    const scrollToField = (fieldKey: string) => {
      const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
      if (labelNode) {
        labelNode.scrollIntoView(true);
      }
    };
    const errorList = errors.map((err) => {
      if (!err || err.errors.length === 0) {
        return null;
      }
      const key = err.name[0] as string;
      return (
        <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
          <CloseCircleOutlined className={styles.errorIcon} />
          <div className={styles.errorMessage}>{err.errors[0]}</div>
          <div className={styles.errorField}>{fieldLabels[key]}</div>
        </li>
      );
    });
    return (
      <span className={styles.errorIcon}>
        <Popover
          title="表单校验信息"
          content={errorList}
          overlayClassName={styles.errorPopover}
          trigger="click"
          getPopupContainer={(trigger: HTMLElement) => {
            if (trigger && trigger.parentNode) {
              return trigger.parentNode as HTMLElement;
            }
            return trigger;
          }}
        >
          <CloseCircleOutlined />
        </Popover>
        {errorCount}
      </span>
    );
  };

  const onFinish = (values: { [key: string]: any }) => {
    setError([]);
    props.dispatch({
      type: 'ruleEditModel/submit',
      payload: {
        ...props.ruleEditModel.ruleDetailData,
        ...values,
        ruleCode: routeParamsState.ruleCode,
        type: 'baseConfig',
      },
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    setError(errorInfo.errorFields);
  };

  const filterMockResult = () => {
    const temp =
      filterMockResultState === 1 ? (
        <Tag color="#87d068">SUCCESS</Tag>
      ) : (
        <Tag color="#f50">脚本错误</Tag>
      );
    return filterMockResultState === 0 ? <Tag color="orange">未验证</Tag> : temp;
  };

  const equalsMockResult = () => {
    const temp =
      equalsMockResultState === 1 ? (
        <Tag color="#87d068">SUCCESS</Tag>
      ) : (
        <Tag color="#f50">脚本错误</Tag>
      );
    return equalsMockResultState === 0 ? <Tag color="orange">未验证</Tag> : temp;
  };

  const openNotificationWithIcon = (type: string, msg: string, desc: string) => {
    notification[type]({
      message: msg,
      description: desc,
    });
  };

  const mockCheck = () => {
    const filterRule = scriptConfigForm.getFieldValue('filterRule');
    const equalsRule = scriptConfigForm.getFieldValue('equalsRule');
    const leftData = scriptConfigForm.getFieldValue('leftData');
    const rightData = scriptConfigForm.getFieldValue('rightData');
    scriptMock({ script: filterRule, binlogData: leftData, scriptType: 3 }).then((res) => {
      if (res.code === 200) {
        setFilterMockResultState(1);
        message.success('过滤脚本mock成功');
      } else {
        setFilterMockResultState(-1);
        openNotificationWithIcon('error', '过滤脚本mock失败，请检查语法', `错误信息：${res.msg}`);
      }
    });
    scriptMock({
      script: equalsRule,
      binlogData: leftData,
      targetData: rightData,
      scriptType: 4,
    }).then((res) => {
      if (res.code === 200) {
        setEqualsMockResultState(1);
        message.success('匹配脚本mock成功');
      } else {
        setEqualsMockResultState(-1);
        openNotificationWithIcon('error', '匹配脚本mock失败，请检查语法', `错误信息：${res.msg}`);
      }
    });
  };

  return (
    <Form
      form={scriptConfigForm}
      layout="vertical"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      initialValues={{
        samplingRate: 50,
        maxTimeout: 0,
        firstDelayTime: 0,
      }}
    >
      {props.ruleEditModel.ruleDetailData.exeType === 1 ? (
        <>
          <Card title="核对配置" className={styles.card} bordered={false}>
            <Row gutter={0}>
              <Col xl={{ span: 24 }} lg={{ span: 24 }} md={{ span: 24 }} sm={24}>
                <Form.Item
                  label={fieldLabels.filterRule}
                  name="filterRule"
                  rules={[{ required: true, message: '匹配脚本必填' }]}
                >
                  <MyCodeMirror
                    modeName="text/x-java"
                    placeholder="格式:obj.{binlog中字段名},number类型需加上toInteger(),varchar类型加上toString()，可用脚本MOCK进行验证"
                    onBeforeChange={(edit, data, value, next) => {
                      edit.setSize('100%', 'auto');
                      data.toString();
                      value.toString();
                      next.toString();
                    }}
                    onBlur={(editor, event) => {
                      event.toString();
                      scriptConfigForm.setFieldsValue({ filterRule: editor.getValue() });
                      // editor.closeHint();
                    }}
                    onCursorActivity={(editor) => {
                      editor.toString();
                      // editor.showHint();
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={0}>
              <Col xl={{ span: 24 }} lg={{ span: 24 }} md={{ span: 24 }} sm={24}>
                <Form.Item
                  label={fieldLabels.equalsRule}
                  name="equalsRule"
                  rules={[{ required: true, message: '核对脚本必填' }]}
                >
                  <MyCodeMirror
                    modeName="text/x-java"
                    placeholder="格式:left.{binlog中的字段名},right.{目标系统响应中的字段名},number类型需加上toInteger(),varchar类型加上toString()，可用脚本MOCK进行验证"
                    onBeforeChange={(edit, data, value, next) => {
                      edit.setSize('100%', 'auto');
                      data.toString();
                      value.toString();
                      next.toString();
                    }}
                    onBlur={(editor, event) => {
                      event.toString();
                      scriptConfigForm.setFieldsValue({ equalsRule: editor.getValue() });
                      // editor.closeHint();
                    }}
                    onCursorActivity={(editor) => {
                      // editor.showHint();
                      editor.toString();
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={0}>
              <Col xl={{ span: 24 }} lg={{ span: 24 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={fieldLabels.leftData} name="leftData">
                  <MyCodeMirror
                    modeName="application/json"
                    placeholder="请输入binlog数据"
                    onBeforeChange={(edit, data, value, next) => {
                      edit.setSize('100%', 'auto');
                      data.toString();
                      value.toString();
                      next.toString();
                    }}
                    onBlur={(editor, event) => {
                      event.toString();
                      scriptConfigForm.setFieldsValue({ leftData: editor.getValue() });
                      editor.closeHint();
                    }}
                    onCursorActivity={(editor) => {
                      editor.showHint();
                      editor.toString();
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={0}>
              <Col xl={{ span: 24 }} lg={{ span: 24 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={fieldLabels.rightData} name="rightData">
                  <MyCodeMirror
                    modeName="application/json"
                    placeholder="请输入目标数据"
                    onBeforeChange={(edit, data, value, next) => {
                      edit.setSize('100%', 'auto');
                      data.toString();
                      value.toString();
                      next.toString();
                    }}
                    onBlur={(editor, event) => {
                      event.toString();
                      scriptConfigForm.setFieldsValue({ rightData: editor.getValue() });
                      editor.closeHint();
                    }}
                    onCursorActivity={(editor) => {
                      editor.showHint();
                      editor.toString();
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={0}>
              <Col
                xl={{ span: 24 }}
                lg={{ span: 24 }}
                md={{ span: 24 }}
                sm={24}
                style={{ textAlign: 'right' }}
              >
                <span>过滤脚本MOCK结果：</span>
                <span style={{ marginRight: '20px' }}>{filterMockResult()}</span>
                <span>核对脚本MOCK结果：</span>
                <span style={{ marginRight: '20px' }}>{equalsMockResult()}</span>
                <Button type="primary" onClick={mockCheck}>
                  MOCK验证
                </Button>
              </Col>
            </Row>
          </Card>

          <Card title="字段映射关系" className={styles.card} bordered={false}>
            <Row gutter={16}>
              <Col xl={{ span: 12, offset: 6 }} lg={{ span: 12 }} md={{ span: 12 }} sm={24}>
                <Form.List name="fieldMapping">
                  {(fields, { add, remove }) => (
                    <div>
                      {fields.map((field) => (
                        <Row key={field.key}>
                          <Col xl={{ span: 11 }}>
                            <Form.Item
                              name={[field.name, 'sourceField']}
                              key={field.key}
                              rules={[{ required: true, message: '源字段必填' }]}
                            >
                              <Input placeholder="源字段" />
                            </Form.Item>
                          </Col>
                          <Col xl={{ span: 11 }}>
                            <Form.Item
                              name={[field.name, 'targetField']}
                              key={field.key}
                              rules={[{ required: true, message: '目标字段必填' }]}
                            >
                              <Input placeholder="目标字段" />
                            </Form.Item>
                          </Col>
                          <Col flex="none" xl={{ offset: 1 }}>
                            <MinusCircleOutlined
                              className="dynamic-delete-button"
                              onClick={() => {
                                remove(field.name);
                              }}
                            />
                          </Col>
                        </Row>
                      ))}
                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => {
                            add();
                          }}
                          style={{ width: '100%' }}
                        >
                          <PlusOutlined /> 添加映射关系
                        </Button>
                      </Form.Item>
                    </div>
                  )}
                </Form.List>
              </Col>
            </Row>
          </Card>

          <Card title="固定字段" className={styles.card} bordered={false}>
            <Row gutter={16}>
              <Col xl={{ span: 12, offset: 6 }} lg={{ span: 12 }} md={{ span: 12 }} sm={24}>
                <Form.List name="baseField">
                  {(fields, { add, remove }) => (
                    <div>
                      {fields
                        ? fields.map((field) => (
                            <Row key={field.key}>
                              <Col xl={{ span: 11 }}>
                                <Form.Item
                                  name={[field.name, 'key']}
                                  key={field.key}
                                  rules={[{ required: true, message: 'key必填' }]}
                                >
                                  <Input placeholder="key" />
                                </Form.Item>
                              </Col>
                              <Col xl={{ span: 11 }}>
                                <Form.Item
                                  name={[field.name, 'value']}
                                  key={field.key}
                                  rules={[{ required: true, message: 'value必填' }]}
                                >
                                  <Input placeholder="value" />
                                </Form.Item>
                              </Col>
                              <Col flex="none" xl={{ offset: 1 }}>
                                <MinusCircleOutlined
                                  className="dynamic-delete-button"
                                  onClick={() => {
                                    remove(field.name);
                                  }}
                                />
                              </Col>
                            </Row>
                          ))
                        : null}
                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => {
                            add();
                          }}
                          style={{ width: '100%' }}
                        >
                          <PlusOutlined /> 添加固定字段
                        </Button>
                      </Form.Item>
                    </div>
                  )}
                </Form.List>
              </Col>
            </Row>
          </Card>
        </>
      ) : (
        <Card title="核对配置" className={styles.card} bordered={false}>
          <Row gutter={0}>
            <Col xl={{ span: 24 }} lg={{ span: 24 }} md={{ span: 24 }} sm={24}>
              <Form.Item
                label={fieldLabels.classContent}
                name="classContent"
                rules={[{ required: true, message: '匹配脚本必填' }]}
              >
                <MyCodeMirror
                  modeName="text/x-java"
                  placeholder="格式:obj.{binlog中字段名},number类型需加上toInteger(),varchar类型加上toString()，可用脚本MOCK进行验证"
                  onBeforeChange={(edit, data, value, next) => {
                    edit.setSize('100%', 600);
                    data.toString();
                    value.toString();
                    next.toString();
                  }}
                  onBlur={(editor, event) => {
                    event.toString();
                    scriptConfigForm.setFieldsValue({ classContent: editor.getValue() });
                    // editor.closeHint();
                  }}
                  onCursorActivity={(editor) => {
                    editor.toString();
                    // editor.showHint();
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      )}

      <FooterToolbar>
        {getErrorInfo(error)}
        <Button
          type="primary"
          onClick={() => (scriptConfigForm ? scriptConfigForm.submit() : null)}
          loading={props.submitting}
        >
          提交修改
        </Button>
      </FooterToolbar>
    </Form>
  );
};

export default connect(
  ({
    loading,
    ruleEditModel,
    enumsModel,
  }: {
    ruleEditModel: StateType;
    enumsModel: EnumsStateType;
    loading: { effects: { [key: string]: boolean } };
  }) => ({
    ruleEditModel,
    enumsModel,
    submitting: loading.effects['ruleEditModel/submit'],
  }),
)(RuleEdit);
