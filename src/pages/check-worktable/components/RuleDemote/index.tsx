import React, { FC, useEffect } from 'react';
import { Modal, Form, Select, DatePicker, InputNumber } from 'antd';
import moment from 'moment';
import { enumsRespData } from '@/data/common';
import { DROP_LIST_SEPARATOR } from '@/constant';
import { Dispatch } from '@@/plugin-dva/connect';
import { StateType as EnumsStateType } from '@/models/enums';
import { RuleInfoData } from '@/pages/check-worktable/data';
import { format } from '@/utils/momentUtils';
import { StateType } from '../../model';

interface RuleDemoteProps {
  worktableModel: StateType;
  dispatch: Dispatch;
  enumsModel: EnumsStateType;
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: RuleInfoData) => void;
}

const { RangePicker } = DatePicker;
const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 15 },
};

const RuleDemoteModal: FC<RuleDemoteProps> = ({
  worktableModel,
  visible,
  enumsModel,
  onCancel,
  onSubmit,
  dispatch,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (worktableModel.ruleInfoData) {
      form.setFieldsValue({
        validTime: [
          moment(worktableModel.ruleInfoData.validTime[0], 'YYYY-MM-DD HH-mm-ss'),
          moment(worktableModel.ruleInfoData.validTime[1], 'YYYY-MM-DD HH-mm-ss'),
        ],
        samplingRate: worktableModel.ruleInfoData.samplingRate,
      });
    }
  }, [worktableModel.ruleInfoData]);

  const handleFinish = (values: { [key: string]: any }) => {
    if (onSubmit) {
      const data = {
        ...values,
        subjectCode: values.subjectCode.split(DROP_LIST_SEPARATOR)[0],
        ruleCode: values.ruleCode.split(DROP_LIST_SEPARATOR)[0],
        validTime: [format(values.validTime[0]), format(values.validTime[1])],
      };
      onSubmit(data as RuleInfoData);
    }
  };
  const handleSelectChange = (val: any) => {
    form.resetFields(['ruleCode', 'validTime', 'samplingRate']);
    dispatch({
      type: 'enumsModel/fetchRuleBySubject',
      payload: { eventCode: val.split(DROP_LIST_SEPARATOR)[0] },
    });
  };

  const handleRuleSelectChange = (val: any) => {
    dispatch({
      type: 'worktableModel/fetchRuleInfo',
      payload: { ruleCode: val.split(DROP_LIST_SEPARATOR)[0], current: 1, pageSize: 1 },
    });
  };
  return (
    <Modal
      maskClosable={false}
      width={640}
      destroyOnClose
      visible={visible}
      title="规则降级"
      okText="保存"
      cancelText="取消"
      onCancel={onCancel}
      onOk={() => {
        if (!form) return;
        form.submit();
      }}
      afterClose={() => {
        form.resetFields();
      }}
    >
      <Form {...formLayout} form={form} onFinish={handleFinish}>
        <Form.Item
          name="subjectCode"
          label="主题"
          rules={[{ required: true, message: '请输入主题编码' }]}
        >
          <Select placeholder="请选择主题" onSelect={handleSelectChange} showSearch>
            {enumsModel.subjectEnums
              ? enumsModel.subjectEnums.map((item: enumsRespData) => (
                  <Select.Option
                    key={item.key}
                    value={`${item.key}${DROP_LIST_SEPARATOR}${item.val}`}
                  >
                    {item.key}——{item.val}
                  </Select.Option>
                ))
              : null}
          </Select>
        </Form.Item>
        <Form.Item
          name="ruleCode"
          label="规则"
          rules={[{ required: true, message: '请输入规则编码' }]}
        >
          <Select placeholder="请选择规则" onSelect={handleRuleSelectChange} showSearch>
            {enumsModel.ruleBySubjectEnums.map((item: enumsRespData) => (
              <Select.Option key={item.key} value={`${item.key}${DROP_LIST_SEPARATOR}${item.val}`}>
                {item.key}——{item.val}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="validTime"
          label="执行时间"
          rules={[{ required: true, message: '请输入生效时间' }]}
        >
          <RangePicker
            showTime={{
              defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
            }}
            format="YYYY-MM-DD HH:mm:ss"
          />
        </Form.Item>
        <Form.Item
          label="采样百分比"
          name="samplingRate"
          rules={[{ required: true, message: '采样百分比必填' }]}
        >
          <InputNumber min={0} max={100} formatter={(value) => `${value}%`} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RuleDemoteModal;
