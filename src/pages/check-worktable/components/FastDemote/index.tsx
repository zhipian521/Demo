import React, { FC } from 'react';
import { Modal, Form, InputNumber, Checkbox, Row, Col } from 'antd';
import { Dispatch } from '@@/plugin-dva/connect';
import { FastDemoteInfoData } from '@/pages/check-worktable/data';

interface RuleDemoteProps {
  dispatch: Dispatch;
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: FastDemoteInfoData) => void;
}

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 15 },
};

const FastDemoteModal: FC<RuleDemoteProps> = ({ visible, onCancel, onSubmit }) => {
  const [form] = Form.useForm();

  const handleFinish = (values: { [key: string]: any }) => {
    if (onSubmit) {
      const data = {
        ...values,
      };
      onSubmit(data as FastDemoteInfoData);
    }
  };
  return (
    <Modal
      maskClosable={false}
      width={400}
      destroyOnClose
      visible={visible}
      title="快速降级"
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
          name="types"
          label="降级类型"
          valuePropName="checked"
          rules={[{ required: true, message: '降级类型必选' }]}
        >
          <Checkbox.Group>
            <Row>
              <Col span={12}>
                <Checkbox value="subject" style={{ lineHeight: '32px' }}>
                  主题
                </Checkbox>
              </Col>
              <Col span={12}>
                <Checkbox value="rule" style={{ lineHeight: '32px' }}>
                  规则
                </Checkbox>
              </Col>
            </Row>
          </Checkbox.Group>
        </Form.Item>
        <Form.Item
          extra="往后调整时间"
          label="延迟时间"
          name="days"
          rules={[{ required: true, message: '延迟时间必填' }]}
        >
          <InputNumber min={0} max={100} formatter={(value) => `${value}天`} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FastDemoteModal;
