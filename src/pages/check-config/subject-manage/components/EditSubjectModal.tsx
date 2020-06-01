import React, { FC, useEffect, useState } from 'react';
import { Modal, Form, Input, Checkbox, DatePicker } from 'antd';
import moment from 'moment';
import { subjectSubmitData, subjectListData } from '@/pages/check-config/subject-manage/data';

interface AddSubEventModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: subjectSubmitData) => void;
  data: Partial<subjectListData> | undefined;
}

const { RangePicker } = DatePicker;
const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 15 },
};

const EditSubjectModal: FC<AddSubEventModalProps> = (props) => {
  const { visible, onCancel, onSubmit, data } = props;
  const [filterVisibleState, setFilterVisibleState] = useState<boolean>(true);
  const [form] = Form.useForm();

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        ...data,
      });
      form.setFieldsValue({
        validTime: [
          moment(data.validStartTime, 'YYYY-MM-DD HH-mm-ss'),
          moment(data.validEndTime, 'YYYY-MM-DD HH-mm-ss'),
        ],
      });
      setFilterVisibleState(data.subjectType === 0);
    }
  }, [data, visible]);

  const handleFinish = (values: { [key: string]: any }) => {
    if (onSubmit) {
      onSubmit(values as subjectSubmitData);
    }
  };

  return (
    <Modal
      maskClosable={false}
      width={640}
      getContainer={false}
      visible={visible}
      title="主题修改"
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
              defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
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

export default EditSubjectModal;
