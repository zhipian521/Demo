import React, { FC } from 'react';
import { Modal, Form, InputNumber } from 'antd';
import { Dispatch } from '@@/plugin-dva/connect';
import { SamplingDemoteInfoData } from '@/pages/check-worktable/data';

interface RuleDemoteProps {
  dispatch: Dispatch;
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: SamplingDemoteInfoData) => void;
}

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 15 },
};

const FastRestoreModal: FC<RuleDemoteProps> = ({ visible, onCancel, onSubmit }) => {
  const [form] = Form.useForm();

  const handleFinish = (values: { [key: string]: any }) => {
    if (onSubmit) {
      const data = {
        ...values,
      };
      onSubmit(data as SamplingDemoteInfoData);
    }
  };
  return (
    <Modal
      maskClosable={false}
      width={400}
      destroyOnClose
      visible={visible}
      title="采样调整"
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
          label="规则采样率"
          name="samplingRate"
          rules={[{ required: true, message: '规则采样率必填' }]}
        >
          <InputNumber min={0} max={100} formatter={(value) => `${value}%`} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FastRestoreModal;
