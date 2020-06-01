import React, { FC } from 'react';
import { Modal, Form, Input, Select, InputNumber } from 'antd';
import { alarmSubmitData } from '@/pages/check-system-config/alarm-manage/data';

interface AddSubEventModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: alarmSubmitData) => void;
}

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 15 },
};

const AddAlarmModal: FC<AddSubEventModalProps> = (props) => {
  const { visible, onCancel, onSubmit } = props;
  const [form] = Form.useForm();

  const handleFinish = (values: { [key: string]: any }) => {
    if (onSubmit) {
      onSubmit(values as alarmSubmitData);
    }
  };

  return (
    <Modal
      maskClosable={false}
      width={640}
      destroyOnClose
      visible={visible}
      title="告警规则新增"
      okText="新增"
      cancelText="取消"
      onCancel={onCancel}
      onOk={() => {
        if (!form) return;
        form.submit();
      }}
      afterClose={form.resetFields}
    >
      <Form
        {...formLayout}
        form={form}
        onFinish={handleFinish}
        initialValues={{
          alarmMode: 1,
          lastMinutes: 5,
          coolingTime: 30,
        }}
      >
        <Form.Item
          name="alarmCode"
          label="告警编码"
          rules={[{ required: true, message: '请输入告警编码' }]}
        >
          <Input placeholder="请输入告警编码" />
        </Form.Item>
        <Form.Item
          name="alarmName"
          label="告警名称"
          rules={[{ required: true, message: '请输入告警名称' }]}
        >
          <Input placeholder="请输入告警名称" id="addAlarmName" />
        </Form.Item>

        <Form.Item
          name="alarmMode"
          label="告警模式"
          rules={[{ required: true, message: '请选择告警模式' }]}
        >
          <Select placeholder="请选择告警模式">
            <Select.Option value={1}>按照最近分钟数计算</Select.Option>
            <Select.Option value={2}>按照当日累计失败数计算</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="lastMinutes"
          label="最近几分钟"
          rules={[{ required: true, message: '请输入lastMinutes' }]}
        >
          <InputNumber placeholder="请输入lastMinutes" />
        </Form.Item>

        <Form.Item
          name="coolingTime"
          label="冷却时间(分钟)"
          rules={[{ required: true, message: '请输入冷却时间' }]}
        >
          <InputNumber placeholder="请输入冷却时间" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddAlarmModal;
