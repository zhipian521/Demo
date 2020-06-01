import React, { FC, useEffect } from 'react';
import { Modal, Form, Input } from 'antd';
import { eventSubmitData } from '../data';

const { TextArea } = Input;

interface AddSubEventModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: eventSubmitData) => void;
  data: Partial<eventSubmitData> | undefined;
}

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 15 },
};

const EditEventModal: FC<AddSubEventModalProps> = (props) => {
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
      onSubmit(values as eventSubmitData);
    }
  };

  return (
    <Modal
      maskClosable={false}
      width={640}
      visible={visible}
      getContainer={false}
      destroyOnClose
      title="事件修改"
      okText="保存"
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
          subjectType: 0,
        }}
      >
        <Form.Item
          name="eventName"
          label="事件名称"
          rules={[{ required: true, message: '请输入主题名称' }]}
        >
          <Input placeholder="请输入主题名称" />
        </Form.Item>

        <Form.Item
          name="eventRule"
          label="事件规则"
          rules={[{ required: true, message: '请输入事件规则' }]}
        >
          <TextArea
            placeholder="格式:obj.{binlog中字段名},number类型需加上toInteger(),varchar类型加上toString()，可用脚本MOCK进行验证"
            autoSize={{ minRows: 3, maxRows: 5 }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditEventModal;
