import React, { FC, useEffect } from 'react';
import { Modal, Form, Select, DatePicker } from 'antd';
import moment from 'moment';
import { enumsRespData } from '@/data/common';
import { DROP_LIST_SEPARATOR } from '@/constant';
import { StateType as EnumsStateType } from '@/models/enums';
import { Dispatch } from '@@/plugin-dva/connect';
import { SubjectInfoData } from '@/pages/check-worktable/data';
import { format } from '@/utils/momentUtils';
import { StateType } from '../../model';

interface SubjectDemoteProps {
  worktableModel: StateType;
  dispatch: Dispatch;
  enumsModel: EnumsStateType;
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: SubjectInfoData) => void;
}

const { RangePicker } = DatePicker;
const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 15 },
};

const SubjectDemoteModal: FC<SubjectDemoteProps> = ({
  worktableModel,
  visible,
  onCancel,
  onSubmit,
  enumsModel,
  dispatch,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (worktableModel.subjectInfoData) {
      form.setFieldsValue({
        validTime: [
          moment(worktableModel.subjectInfoData.validStartTime, 'YYYY-MM-DD HH-mm-ss'),
          moment(worktableModel.subjectInfoData.validEndTime, 'YYYY-MM-DD HH-mm-ss'),
        ],
      });
    }
  }, [worktableModel.subjectInfoData]);

  const handleFinish = (values: { [key: string]: any }) => {
    if (onSubmit) {
      const data = {
        ...values,
        subjectType: worktableModel.subjectInfoData?.subjectType,
        subjectCode: values.subjectCode.split(DROP_LIST_SEPARATOR)[0],
        validTime: [format(values.validTime[0]), format(values.validTime[1])],
      };
      onSubmit(data as SubjectInfoData);
    }
  };

  const handleSelectChange = (val: any) => {
    dispatch({
      type: 'worktableModel/fetchSubjectInfo',
      payload: { subjectCode: val.split(DROP_LIST_SEPARATOR)[0], current: 1, pageSize: 1 },
    });
  };

  return (
    <Modal
      maskClosable={false}
      width={640}
      destroyOnClose
      visible={visible}
      title="主题降级"
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
          name="subjectCode"
          label="主题编码"
          rules={[{ required: true, message: '请输入主题编码' }]}
        >
          <Select placeholder="请选择主题类型" onSelect={handleSelectChange} showSearch>
            {enumsModel.subjectEnums
              ? enumsModel.subjectEnums.map((item: enumsRespData) => (
                  <Select.Option
                    key={item.key}
                    value={`${item.key}${DROP_LIST_SEPARATOR}${item.val}`}
                  >
                    {item.key}——{item.val}
                  </Select.Option>
                ))
              : null}
          </Select>
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
      </Form>
    </Modal>
  );
};

export default SubjectDemoteModal;
