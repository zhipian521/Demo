import React, { FC, useState } from 'react';
import { Modal, Form, Input, Select, Checkbox, DatePicker } from 'antd';
import moment from 'moment';
import { subjectSubmitData } from '@/pages/check-config/subject-manage/data';

interface AddSubEventModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: subjectSubmitData) => void;
}

const { RangePicker } = DatePicker;
const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 15 },
};

const AddSubjectModal: FC<AddSubEventModalProps> = (props) => {
  const { visible, onCancel, onSubmit } = props;
  const [filterVisibleState, setFilterVisibleState] = useState<boolean>(true);
  const [form] = Form.useForm();

  const handleFinish = (values: { [key: string]: any }) => {
    if (onSubmit) {
      onSubmit(values as subjectSubmitData);
    }
  };

  const handleSelectChange = (val: any) => {
    if (val === 0) {
      setFilterVisibleState(true);
    } else if (val === 1) {
      setFilterVisibleState(false);
    }
  };

  return (
    <Modal
      maskClosable={false}
      width={640}
      destroyOnClose
      visible={visible}
      title="主题新增"
      okText="保存"
      cancelText="取消"
      onCancel={onCancel}
      onOk={() => {
        if (!form) return;
        form.submit();
      }}
      afterClose={() => {
        form.resetFields();
        setFilterVisibleState(true);
      }}
    >
      <Form
        {...formLayout}
        form={form}
        onFinish={handleFinish}
        initialValues={{
          subjectType: 0,
          filterInsert: true,
          validTime: [
            moment('2020-01-01 00:00:00', 'YYYY-MM-DD HH:mm:ss'),
            moment('2099-12-01 23:59:59', 'YYYY-MM-DD HH:mm:ss'),
          ],
        }}
      >
        <Form.Item name="topic" label="Topic" rules={[{ required: true, message: '请输入Topic' }]}>
          <Input placeholder="请输入Topic" />
        </Form.Item>
        <Form.Item
          name="subjectType"
          label="主题类型"
          rules={[{ required: true, message: '请选择主题类型' }]}
        >
          <Select placeholder="请选择主题类型" onSelect={handleSelectChange}>
            <Select.Option value={0}>binlog</Select.Option>
            <Select.Option value={1}>自定义MQ</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="subjectCode"
          label="主题编码"
          rules={[{ required: true, message: '请输入主题编码' }]}
        >
          <Input placeholder="请输入主题编码" />
        </Form.Item>

        <Form.Item
          name="subjectName"
          label="主题名称"
          rules={[{ required: true, message: '请输入主题名称' }]}
        >
          <Input placeholder="请输入主题名称" />
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
          name="nameServerAddr"
          label="MQ实例地址"
          rules={[{ required: true, message: '请输入MQ实例地址' }]}
        >
          <Input placeholder="请输入MQ实例地址" />
        </Form.Item>
        {filterVisibleState ? (
          <Form.Item name="filterInsert" label="过滤" valuePropName="checked">
            <Checkbox>是否过滤insert消息</Checkbox>
          </Form.Item>
        ) : null}
      </Form>
    </Modal>
  );
};

export default AddSubjectModal;
