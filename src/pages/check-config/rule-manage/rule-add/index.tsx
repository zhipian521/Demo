import React, { FC, useEffect, useState } from 'react';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  notification,
  Popover,
  Row,
  Select,
  Tag,
} from 'antd';
import { Dispatch } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import moment from 'moment';
import { MinusCircleOutlined, PlusOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { StateType as EnumsStateType } from '@/models/enums';
import { format } from '@/utils/momentUtils';
import MyCodeMirror from '@/components/MyCodeMirror';
import { scriptMock } from '@/pages/check-mock/script-mock/service';
import FooterToolbar from './components/FooterToolbar';

const styles = require('./style.less');

type InternalNamePath = (string | number)[];

const { Option } = Select;
const { RangePicker } = DatePicker;

const fieldLabels = {
  eventCode: '事件',
  subEventCodes: '子事件',
  ruleCode: '规则编码',
  ruleName: '规则名称',
  feishuWebhook: '飞书webHook',
  httpUrl: 'http_url',
  alarmCode: '告警编码',

  samplingRate: '采样百分比',
  maxTimeout: '最大超时时间(分)',
  firstDelayTime: '首次延迟时间(秒)',
  validTime: '生效时间',

  filterRule: '过滤脚本',
  equalsRule: '核对脚本',

  leftData: 'binlog数据',
  rightData: '目标数据',

  exeType: '脚本类型',
  className: '类名',
  classContent: 'Groovy扩容脚本',
};

interface RuleAddProps {
  dispatch: Dispatch;
  submitting: boolean;
  enumsModel: EnumsStateType;
}

interface ErrorField {
  name: InternalNamePath;
  errors: string[];
}

const RuleAdd: FC<RuleAddProps> = ({ submitting, dispatch, enumsModel }) => {
  const [form] = Form.useForm();
  const [error, setError] = useState<ErrorField[]>([]);
  const [filterMockResultState, setFilterMockResultState] = useState<number>(0);
  const [equalsMockResultState, setEqualsMockResultState] = useState<number>(0);
  const [exeTypeState, setExeTypeState] = useState<number>(1);

  useEffect(() => {
    dispatch({
      type: 'enumsModel/fetchEvent',
    });
    dispatch({
      type: 'enumsModel/fetchAlarm',
    });
  }, [1]);

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
    const validTime = [];
    if (values.validTime) {
      validTime.push(format(values.validTime[0]));
      validTime.push(format(values.validTime[1]));
    }
    dispatch({
      type: 'ruleAddModel/submit',
      payload: {
        ...values,
        validTime,
        leftData: values.leftData ? values.leftData : '',
        rightData: values.rightData ? values.rightData : '',
      },
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    setError(errorInfo.errorFields);
  };

  const onChangeExeType = (val: number) => {
    setExeTypeState(val);
  };

  const handelEventOnSelect = (val: any) => {
    form.resetFields(['subEventCodes']);
    dispatch({
      type: 'enumsModel/fetchSubEvent',
      payload: { eventCode: val },
    });
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
    const filterRule = form.getFieldValue('filterRule');
    const equalsRule = form.getFieldValue('equalsRule');
    const leftData = form.getFieldValue('leftData');
    const rightData = form.getFieldValue('rightData');
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
      form={form}
      layout="vertical"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      initialValues={{
        samplingRate: 50,
        maxTimeout: 0,
        firstDelayTime: 0,
        validTime: [
          moment(new Date(), 'YYYY-MM-DD HH:mm:ss'),
          moment('2099-12-31 23:59:59', 'YYYY-MM-DD HH:mm:ss'),
        ],
      }}
    >
      <PageHeaderWrapper content="">
        <Card title="基础配置" className={styles.card} bordered={false}>
          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item
                label={fieldLabels.eventCode}
                name="eventCode"
                rules={[{ required: true, message: '请输入事件' }]}
              >
                <Select placeholder="请选择事件" onSelect={handelEventOnSelect} showSearch>
                  {enumsModel.eventEnums.map((item) => (
                    <Option key={item.key} value={item.key}>
                      {item.val}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
              <Form.Item
                label={fieldLabels.ruleCode}
                name="ruleCode"
                rules={[{ required: true, message: '请输入规则编码' }]}
              >
                <Input placeholder="请输入规则编码" />
              </Form.Item>
            </Col>
            <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
              <Form.Item
                label={fieldLabels.feishuWebhook}
                name="feishuWebhook"
                rules={[{ required: true, message: '请输入飞书webHook' }]}
              >
                <Input placeholder="请输入飞书webHook" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item
                label={fieldLabels.subEventCodes}
                name="subEventCodes"
                rules={[{ required: true, message: '请选择子事件' }]}
              >
                <Select placeholder="请选择子事件" mode="multiple">
                  {enumsModel.subEventEnums.map((item) => (
                    <Option key={item.key} value={item.key}>
                      {item.val}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
              <Form.Item
                label={fieldLabels.ruleName}
                name="ruleName"
                rules={[{ required: true, message: '请输入规则名称' }]}
              >
                <Input placeholder="请输入规则名称" />
              </Form.Item>
            </Col>
            {exeTypeState !== 2 ? (
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item
                  label={fieldLabels.httpUrl}
                  name="httpUrl"
                  rules={[{ required: true, message: '请输入httpUrl' }]}
                >
                  <Input placeholder="请输入httpUrl" />
                </Form.Item>
              </Col>
            ) : (
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item
                  label={fieldLabels.className}
                  name="className"
                  rules={[{ required: true, message: '请输入ClassName' }]}
                >
                  <Input placeholder="请输入类名" />
                </Form.Item>
              </Col>
            )}
          </Row>
          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item
                label={fieldLabels.alarmCode}
                name="alarmCode"
                rules={[{ required: true, message: '请选择告警规则' }]}
              >
                <Select placeholder="请选择告警规则">
                  {enumsModel.alarmEnums.map((item) => (
                    <Option key={item.key} value={item.key}>
                      {item.val}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
              <Form.Item
                label={fieldLabels.exeType}
                name="exeType"
                rules={[{ required: true, message: '请输入脚本类型' }]}
              >
                <Select placeholder="请选择脚本类型" onChange={onChangeExeType}>
                  <Option value={1}>Groovy脚本</Option>
                  <Option value={2}>Groovy扩展类</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Card>
        {exeTypeState === 1 ? (
          <>
            <Card title="核对配置" className={styles.card} bordered={false}>
              <Row>
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
                        edit.setSize('auto', 'auto');
                        data.toString();
                        value.toString();
                        next.toString();
                      }}
                      onBlur={(editor, event) => {
                        event.toString();
                        form.setFieldsValue({ filterRule: editor.getValue() });
                        editor.closeHint();
                      }}
                      onCursorActivity={(editor) => {
                        editor.showHint();
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row>
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
                        edit.setSize('auto', 'auto');
                        data.toString();
                        value.toString();
                        next.toString();
                      }}
                      onBlur={(editor, event) => {
                        event.toString();
                        form.setFieldsValue({ equalsRule: editor.getValue() });
                        editor.closeHint();
                      }}
                      onCursorActivity={(editor) => {
                        editor.showHint();
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
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
                        form.setFieldsValue({ leftData: editor.getValue() });
                        editor.closeHint();
                      }}
                      onCursorActivity={(editor) => {
                        editor.showHint();
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col xl={{ span: 24 }} lg={{ span: 24 }} md={{ span: 24 }} sm={24}>
                  <Form.Item label={fieldLabels.rightData} name="rightData">
                    <MyCodeMirror
                      modeName="application/json"
                      placeholder="请输入目标数据"
                      onBeforeChange={(edit, data, value, next) => {
                        edit.setSize('auto', 'auto');
                        data.toString();
                        value.toString();
                        next.toString();
                      }}
                      onBlur={(editor, event) => {
                        event.toString();
                        form.setFieldsValue({ rightData: editor.getValue() });
                        editor.closeHint();
                      }}
                      onCursorActivity={(editor) => {
                        editor.showHint();
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
                        {fields.map((field) => (
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
                        ))}
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
            <Row>
              <Col xl={{ span: 24 }} lg={{ span: 24 }} md={{ span: 24 }} sm={24}>
                <Form.Item
                  label={fieldLabels.classContent}
                  name="classContent"
                  rules={[{ required: true, message: '脚本内容必填' }]}
                >
                  <MyCodeMirror
                    modeName="text/x-java"
                    placeholder=""
                    onBeforeChange={(edit, data, value, next) => {
                      edit.setSize('auto', 500);
                      data.toString();
                      value.toString();
                      next.toString();
                    }}
                    onBlur={(editor, event) => {
                      event.toString();
                      form.setFieldsValue({ classContent: editor.getValue() });
                      editor.closeHint();
                    }}
                    onCursorActivity={(editor) => {
                      editor.showHint();
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        )}

        <Card title="降级策略" className={styles.card} bordered={false}>
          <Row gutter={16}>
            <Col lg={5} md={12} sm={24}>
              <Form.Item
                label={fieldLabels.samplingRate}
                name="samplingRate"
                rules={[{ required: true, message: '采样百分比必填' }]}
              >
                <InputNumber min={0} max={100} />
              </Form.Item>
            </Col>
            <Col xl={{ span: 5 }} lg={{ span: 12 }} md={{ span: 24 }} sm={24}>
              <Form.Item
                label={fieldLabels.firstDelayTime}
                name="firstDelayTime"
                rules={[{ required: true, message: '首次延迟时间必填' }]}
              >
                <InputNumber min={0} max={9999} />
              </Form.Item>
            </Col>
            <Col xl={{ span: 5 }} lg={{ span: 12 }} md={{ span: 24 }} sm={24}>
              <Form.Item
                label={fieldLabels.maxTimeout}
                name="maxTimeout"
                rules={[{ required: true, message: '最大超时时间必填' }]}
              >
                <InputNumber min={0} max={9999} />
              </Form.Item>
            </Col>
            <Col xl={{ span: 9 }} lg={{ span: 12 }} md={{ span: 24 }} sm={24}>
              <Form.Item
                label={fieldLabels.validTime}
                name="validTime"
                rules={[{ required: true, message: '生效时间必填' }]}
              >
                <RangePicker
                  allowEmpty={[true, true]}
                  showTime={{
                    defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
                  }}
                  format="YYYY-MM-DD HH:mm:ss"
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </PageHeaderWrapper>
      <FooterToolbar>
        {getErrorInfo(error)}
        <Button type="primary" onClick={() => form.submit()} loading={submitting}>
          提交
        </Button>
      </FooterToolbar>
    </Form>
  );
};

export default connect(
  ({
    loading,
    enumsModel,
  }: {
    enumsModel: EnumsStateType;
    loading: { effects: { [key: string]: boolean } };
  }) => ({
    enumsModel,
    submitting: loading.effects['ruleAddModel/submit'],
  }),
)(RuleAdd);
