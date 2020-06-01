import React, { FC } from 'react';
import { Modal, Card, Descriptions } from 'antd';
import { enumsRespData } from '@/data/common';
import { subEventListData } from '@/pages/check-config/sub-event-manage/data';

interface AddSubEventModalProps {
  eventEnums: enumsRespData[];
  visible: boolean;
  onCancel: () => void;
  data: Partial<subEventListData> | undefined;
}

const DetailSubEvent: FC<AddSubEventModalProps> = (props) => {
  const { eventEnums, visible, onCancel, data } = props;

  const getModalContent = () => {
    if (eventEnums === undefined) {
      return null;
    }
    return (
      <Modal
        width={640}
        destroyOnClose
        visible={visible}
        title="子事件详情"
        cancelText="取消"
        onCancel={() => {
          onCancel();
        }}
        footer={null}
      >
        <Card bordered={false}>
          <Descriptions bordered style={{ marginBottom: 32 }} column={2}>
            <Descriptions.Item label="事件编码">{data?.eventCode}</Descriptions.Item>
            <Descriptions.Item label="子事件编码">{data?.subEventCode}</Descriptions.Item>
            <Descriptions.Item label="子事件名称">{data?.subEventName}</Descriptions.Item>
            <Descriptions.Item label="版本号">{data?.subEventRuleVersion}</Descriptions.Item>
            <Descriptions.Item label="创建时间" span={2}>
              {data?.gmtCreated}
            </Descriptions.Item>
            <Descriptions.Item label="子事件规则" span={2}>
              {data?.subEventRule}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Modal>
    );
  };
  return <>{getModalContent()}</>;
};

export default DetailSubEvent;
