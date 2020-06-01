import React, { FC, useEffect } from 'react';
import { Modal, Form, Input, Select, InputNumber } from 'antd';
import { alarmSubmitData, alarmListData } from '@/pages/check-system-config/alarm-manage/data';

interface EditAlarmModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: alarmSubmitData) => void;
  data: Partial<alarmListData> | undefined;
}

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 15 },
};

const EditAlarmModal: FC<EditAlarmModalProps> = (props) => {
  const { visible, onCancel, onSubmit, data } = props;
  const [form] = Form.useForm();

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        ...data,
      });
    }
  }, [data, visible]);

  const handleFinish = (values: { [key: string]: any }) => {
    if (onSubmit) {
      onSubmit(values as alarmSubmitData);
    }
  };

  return (
    <Modal
      maskClosable={false}
      width={640}
      getContainer={false}
      visible={visible}
      title="报警规则修改"
      okText="修改"
      cancelText="取消"
      onCancel={onCancel}
      onOk={() => {
        if (!form) return;
        form.submit();
      }}
      afterClose={form.resetFields}
    >
      <Form {...formLayout} form={form} onFinish={handleFinish} initialValues={{}}>
        <Form.Item
          name="id"
          label="id"
          rules={[{ required: true, message: '请输入id' }]}
          style={{ display: 'none' }}
        >
          <Input placeholder="请输入id" />
        </Form.Item>
        <Form.Item
          name="alarmName"
          label="告警名称"
          rules={[{ required: true, message: '请输入告警名称' }]}
        >
          <Input placeholder="请输入告警名称" id="editAlarmName" />
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

export default EditAlarmModal;
