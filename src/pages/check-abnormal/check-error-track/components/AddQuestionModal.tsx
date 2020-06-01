import React, { FC } from 'react';
import { Form, Input, Modal, Select } from 'antd';
import { ErrorTrackSubmitData } from '@/pages/check-abnormal/check-error-track/data';
import { DROP_LIST_SEPARATOR } from '@/constant';
import { enumsRespData } from '@/data/common';

interface AddQuestionModalProps {
  visible?: boolean;
  onCancel?: () => void;
  onSubmit?: (values: ErrorTrackSubmitData) => void;
  ruleEnums: enumsRespData[];
}

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 15 },
};

const { Option } = Select;

const AddQuestionModal: FC<AddQuestionModalProps> = (props) => {
  const { visible, onCancel, onSubmit, ruleEnums } = props;
  const [form] = Form.useForm();

  const handleFinish = (values: { [key: string]: any }) => {
    const temp = {
      ...values,
      ruleCode: values.ruleCode.split(DROP_LIST_SEPARATOR)[0],
      solution: '',
      status: 0,
    };
    if (onSubmit) {
      onSubmit(temp as ErrorTrackSubmitData);
    }
  };

  return (
    <Modal
      maskClosable={false}
      width={640}
      destroyOnClose
      visible={visible}
      title="问题新增"
      afterClose={form.resetFields}
      onCancel={onCancel}
      onOk={() => {
        if (!form) return;
        form.submit();
      }}
    >
      <Form {...formLayout} form={form} onFinish={handleFinish}>
        <Form.Item label="规则" name="ruleCode" rules={[{ required: true, message: '请选择规则' }]}>
          <Select placeholder="支持编码和名称搜索" showSearch>
            {ruleEnums
              ? ruleEnums.map((item) => (
                  <Option key={item.key} value={`${item.key}${DROP_LIST_SEPARATOR}${item.val}`}>
                    {item.val}
                  </Option>
                ))
              : null}
          </Select>
        </Form.Item>
        <Form.Item
          name="questionDesc"
          label="问题描述"
          rules={[{ required: true, message: '请输入问题描述' }]}
        >
          <Input.TextArea autoSize={{ minRows: 5 }} placeholder="请输入问题描述" />
        </Form.Item>

        <Form.Item
          name="questionTrack"
          label="问题追踪"
          rules={[{ required: true, message: '请输入解决方案' }]}
        >
          <Input.TextArea autoSize={{ minRows: 5 }} placeholder="请输入解决方案" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddQuestionModal;
