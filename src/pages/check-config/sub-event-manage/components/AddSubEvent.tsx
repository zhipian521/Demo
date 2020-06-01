import React, { FC } from 'react';
import { Modal, Form, Input, Select } from 'antd';

import { enumsRespData } from '@/data/common';
import { subEventSubmitData } from '@/pages/check-config/sub-event-manage/data';
import { DROP_LIST_SEPARATOR } from '@/constant';

const { TextArea } = Input;

interface AddSubEventModalProps {
  eventEnums: enumsRespData[];
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: subEventSubmitData) => void;
}

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 14 },
};

const AddSubEvent: FC<AddSubEventModalProps> = (props) => {
  const { eventEnums, visible, onCancel, onSubmit } = props;
  const [form] = Form.useForm();

  const handleFinish = (values: { [key: string]: any }) => {
    if (onSubmit) {
      onSubmit(values as subEventSubmitData);
    }
  };

  const getModalContent = () => {
    if (eventEnums === undefined) {
      return null;
    }
    return (
      <Modal
        maskClosable={false}
        width={640}
        destroyOnClose
        visible={visible}
        title="子事件新增"
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
            name="eventCode"
            label="事件"
            rules={[{ required: true, message: '请选择主题类型' }]}
          >
            <Select placeholder="请选择事件" showSearch>
              {eventEnums.map((a) => (
                <Select.Option key={a.key} value={`${a.key}${DROP_LIST_SEPARATOR}${a.val}`}>
                  {a.val}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="subEventCode"
            label="子事件编码"
            rules={[{ required: true, message: '请输入主题编码' }]}
          >
            <Input placeholder="请输入主题编码" />
          </Form.Item>

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
  };
  return <>{getModalContent()}</>;
};

export default AddSubEvent;
