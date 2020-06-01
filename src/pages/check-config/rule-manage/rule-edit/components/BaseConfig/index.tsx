import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Popover,
  Row,
  Select,
} from 'antd';
import React, { FC, useEffect, useState } from 'react';
import { Dispatch, useLocation } from 'umi';
import { connect } from 'dva';
import moment from 'moment';
import { CloseCircleOutlined } from '@ant-design/icons';
import { StateType as EnumsStateType } from '@/models/enums';
import { format } from '@/utils/momentUtils';
import * as qs from 'query-string';
import FooterToolbar from '../FooterToolbar';
import { StateType } from '../../model';

const styles = require('../../style.less');

type InternalNamePath = (string | number)[];

const { Option } = Select;
const { RangePicker } = DatePicker;

const fieldLabels = {
  eventCode: '事件编码',
  subEventCodes: '子事件编码',
  ruleCode: '规则编码',
  ruleName: '规则名称',
  feishuWebhook: '飞书webHook',
  httpUrl: 'http_url',
  className: '类名',
  alarmCode: '告警编码',

  samplingRate: '采样百分比',
  maxTimeout: '最大超时时间(分)',
  firstDelayTime: '首次延迟时间(秒)',
  validTime: '生效时间',
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

const RuleEdit: FC<RuleEditProps> = ({ submitting, dispatch, enumsModel, ruleEditModel }) => {
  const [form] = Form.useForm();
  const location = useLocation();
  const [error, setError] = useState<ErrorField[]>([]);
  const [routeParamsState] = useState<RouteParams>(qs.parse(location.search) as RouteParams);

  useEffect(() => {
    dispatch({
      type: 'enumsModel/fetchSubEvent',
      payload: { eventCode: routeParamsState.eventCode },
    });
    dispatch({
      type: 'enumsModel/fetchAlarm',
    });
  }, [1]);

  useEffect(() => {
    if (ruleEditModel && ruleEditModel.ruleDetailData) {
      form.setFieldsValue({
        ...ruleEditModel.ruleDetailData,
      });
      if (ruleEditModel.ruleDetailData) {
        form.setFieldsValue({
          validTime: [
            moment(ruleEditModel.ruleDetailData.validTime[0], 'YYYY-MM-DD HH-mm-ss'),
            moment(ruleEditModel.ruleDetailData.validTime[1], 'YYYY-MM-DD HH-mm-ss'),
          ],
        });
      }
    }
  }, [ruleEditModel]);

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
      type: 'ruleEditModel/submit',
      payload: {
        ...ruleEditModel.ruleDetailData,
        ...values,
        ruleCode: routeParamsState.ruleCode,
        validTime,
      },
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    setError(errorInfo.errorFields);
  };

  if (!ruleEditModel.ruleDetailData) {
    return null;
  }

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
      }}
    >
      <Card title="基础信息" className={styles.card} bordered={false}>
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
          <Col xl={{ span: 8, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
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
          <Col xl={{ span: 6 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
            <Form.Item
              label={fieldLabels.ruleName}
              name="ruleName"
              rules={[{ required: true, message: '请输入规则名称' }]}
            >
              <Input placeholder="请输入规则名称" />
            </Form.Item>
          </Col>
          {ruleEditModel.ruleDetailData.exeType === 1 ? (
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
      </Card>

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
              <InputNumber min={0} />
            </Form.Item>
          </Col>
          <Col xl={{ span: 5 }} lg={{ span: 12 }} md={{ span: 24 }} sm={24}>
            <Form.Item
              label={fieldLabels.maxTimeout}
              name="maxTimeout"
              rules={[{ required: true, message: '最大超时时间必填' }]}
            >
              <InputNumber min={0} />
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

      <FooterToolbar>
        {getErrorInfo(error)}
        <Button type="primary" onClick={() => (form ? form.submit() : null)} loading={submitting}>
          提交
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
