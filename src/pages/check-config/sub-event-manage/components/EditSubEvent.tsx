import React, { FC, useEffect } from 'react';
import { Modal, Form, Input } from 'antd';
import { subEventSubmitData, subEventListData } from '@/pages/check-config/sub-event-manage/data';

const { TextArea } = Input;

interface AddSubEventModalProps {
  visible: boolean;
  onCancel: () => void;
  data: Partial<subEventListData> | undefined;
  onSubmit: (values: subEventSubmitData) => void;
}

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 14 },
};
const EditSubEvent: FC<AddSubEventModalProps> = (props) => {
  const { visible, onCancel, data, onSubmit } = props;
  const [form] = Form.useForm();

  const handleFinish = (values: { [key: string]: any }) => {
    if (onSubmit) {
      onSubmit(values as subEventSubmitData);
    }
  };

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        ...data,
      });
    }
  }, [data, visible]);

  const getModalContent = () => (
    <Modal
      maskClosable={false}
      width={640}
      visible={visible}
      getContainer={false}
      destroyOnClose
      title="子事件修改"
      okText="保存"
      cancelText="取消"
      onCancel={onCancel}
      onOk={() => {
        if (!form) return;
        form.submit();
      }}
      afterClose={form.resetFields}
    >
      <Form {...formLayout} form={form} onFinish={handleFinish}>
        <Form.Item
          name="subEventName"
          label="子事件名称"
          rules={[{ required: true, message: '请输入主题名称' }]}
        >
          <Input placeholder="请输入主题名称" />
        </Form.Item>

        <Form.Item
          name="subEventRule"
          label="子事件规则"
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
  return <>{getModalContent()}</>;
};

export default EditSubEvent;
