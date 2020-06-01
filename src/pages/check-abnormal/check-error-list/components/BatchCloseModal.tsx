import React, { FC, useEffect, useState } from 'react';
import { Modal, Form, Select, DatePicker, Button, Popconfirm } from 'antd';
import { batchCloseReqParams } from '../data';
import { queryEnums } from '@/services/enums';
import moment from 'moment';
import { countByRuleCodeAndTime } from '@/pages/check-abnormal/check-error-list/service';
import { format } from '@/utils/momentUtils';

interface BatchCLoseModalProps {
  visible?: boolean;
  onCancel?: () => void;
  onSubmit?: (values: batchCloseReqParams) => void;
  ruleCode?: string;
  startTime?: string;
  endTime?: string;
}

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 15 },
};

const BatchCloseModal: FC<BatchCLoseModalProps> = (props) => {
  const { visible, onCancel, onSubmit, ruleCode, startTime, endTime } = props;
  const [form] = Form.useForm();
  const [ruleCodeState, setRuleCodeState] = useState<any>();
  const [countState, setCountState] = useState<number>(0);

  useEffect(() => {
    queryEnums({
      dropType: 'rule',
    }).then((r) => {
      if (r.code === 200) {
        const data = {};
        r.data.map((item: { key: string; val: string }) => {
          data[item.key] = item.val;
          return null;
        });
        setRuleCodeState(r.data);
      }
    });
  }, [1]);

  useEffect(() => {
    setCountState(0);
  }, [visible]);

  const count = (params: batchCloseReqParams) => {
    const temp = {
      ...params,
      startTime: format(params.startTime),
      endTime: format(params.endTime),
    };
    countByRuleCodeAndTime(temp as batchCloseReqParams).then((r) => {
      if (r.code === 200) {
        setCountState(r.data);
      }
    });
  };

  const firstSubmit = () => {
    const a = form.getFieldValue('startTime');
    const b = form.getFieldValue('endTime');
    const c = form.getFieldValue('ruleCode');
    if (a && b && c) {
      count({ startTime: a, endTime: b, ruleCode: c } as batchCloseReqParams);
    }
  };

  const handleFinish = (values: { [key: string]: any }) => {
    const temp = {
      ...values,
      startTime: format(values.startTime),
      endTime: format(values.endTime),
    };
    if (onSubmit) {
      onSubmit(temp as batchCloseReqParams);
    }
  };

  return (
    <Modal
      maskClosable={false}
      width={640}
      destroyOnClose
      visible={visible}
      title="批量关闭"
      afterClose={form.resetFields}
      footer={[
        <Button
          key="cancel"
          onClick={() => {
            if (onCancel) {
              onCancel();
            }
          }}
        >
          取消
        </Button>,
        <Popconfirm
          key="batchClose"
          title={`确认关闭${countState}条数据`}
          onConfirm={() => {
            if (!form) return;
            form.submit();
          }}
          onCancel={() => {}}
          okText="是"
          cancelText="否"
        >
          <Button key="submit" type="danger" onClick={firstSubmit}>
            确认
          </Button>
        </Popconfirm>,
      ]}
    >
      <Form
        {...formLayout}
        form={form}
        onFinish={handleFinish}
        initialValues={{
          ruleCode,
          startTime: moment(startTime || new Date().toLocaleDateString(), 'YYYY-MM-DD HH:mm:ss'),
          endTime: moment(
            endTime || moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
            'YYYY-MM-DD HH:mm:ss',
          ),
        }}
      >
        <Form.Item name="ruleCode" label="规则" rules={[{ required: true, message: '请选择规则' }]}>
          <Select placeholder="请选择规则" showSearch allowClear>
            {ruleCodeState?.map((item: { key: string; val: string }) => (
              <Select.Option key={item.key} value={item.key}>
                {item.val}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="startTime"
          label="开始时间"
          rules={[{ required: true, message: '请选择开始时间' }]}
        >
          <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" placeholder="请选择开始时间" />
        </Form.Item>
        <Form.Item
          name="endTime"
          label="结束时间"
          rules={[{ required: true, message: '请选择结束时间' }]}
        >
          <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" placeholder="请选择结束时间" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BatchCloseModal;
