import React, { FC, useEffect, useState } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { enumsRespData } from '@/data/common';
import { eventSubmitData } from '../data';

const { TextArea } = Input;

interface AddSubEventModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: eventSubmitData) => void;
  subjectEnums: enumsRespData[];
}

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 15 },
};

const AddEventModal: FC<AddSubEventModalProps> = (props) => {
  const { visible, onCancel, onSubmit, subjectEnums } = props;
  const [form] = Form.useForm();
  const [subjectTypeState, setSubjectTypeState] = useState<boolean>(false);

  useEffect(() => {
    setSubjectTypeState(false);
  }, [visible]);

  const handleFinish = (values: { [key: string]: any }) => {
    if (onSubmit) {
      onSubmit(values as eventSubmitData);
    }
  };

  const handleSelectChange = (val: any) => {
    const type = val.split(':')[1];
    if (type === '0') {
      setSubjectTypeState(false);
    } else if (type === '1') {
      setSubjectTypeState(true);
    }
  };

  if (subjectEnums === undefined) {
    return null;
  }
  return (
    <Modal
      maskClosable={false}
      width={640}
      destroyOnClose
      visible={visible}
      title="事件新增"
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
          name="subjectCode"
          label="主题"
          rules={[{ required: true, message: '请选择主题类型' }]}
          extra="主题类型为binlog时，系统自动生成事件配置"
        >
          <Select placeholder="请选择主题类型" onSelect={handleSelectChange} showSearch>
            {subjectEnums.map((item: enumsRespData) => (
              <Select.Option key={item.key} value={`${item.key}:${item.extra.type}`}>
                {item.key}——{item.val}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        {subjectTypeState ? (
          <>
            <Form.Item
              name="eventCode"
              label="事件编码"
              rules={[{ required: true, message: '请输入主题编码' }]}
            >
              <Input placeholder="请输入主题编码" />
            </Form.Item>

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
          </>
        ) : null}
      </Form>
    </Modal>
  );
};

export default AddEventModal;
