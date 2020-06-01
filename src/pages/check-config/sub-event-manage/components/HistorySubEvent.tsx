import React, { FC } from 'react';
import { Modal, Popconfirm, Card, Descriptions, Button } from 'antd';
import { enumsRespData } from '@/data/common';
import { subEventHistoryData } from '../data';

interface AddSubEventModalProps {
  eventEnums: enumsRespData[];
  visible: boolean;
  onCancel: () => void;
  onRollback: (values: subEventHistoryData) => void;
  data: subEventHistoryData | undefined;
}

const HistorySubEvent: FC<AddSubEventModalProps> = (props) => {
  const { eventEnums, visible, onCancel, data, onRollback } = props;
  const getModalContent = () => {
    if (eventEnums === undefined) {
      return null;
    }
    return (
      <Modal
        width={640}
        destroyOnClose
        visible={visible}
        title="子事件回滚"
        onOk={() => {}}
        onCancel={() => {
          onCancel();
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              onCancel();
            }}
          >
            取消
          </Button>,
          <Popconfirm
            key="rollback"
            title="请再次确认是否回滚"
            onConfirm={() => {
              onRollback(data as subEventHistoryData);
            }}
            onCancel={onCancel}
            okText="是"
            cancelText="否"
          >
            <Button key="submit" type="danger">
              回滚
            </Button>
          </Popconfirm>,
        ]}
      >
        <Card bordered={false}>
          <Descriptions bordered style={{ marginBottom: 32 }} column={2}>
            <Descriptions.Item label="事件编码">{data?.eventCode}</Descriptions.Item>
            <Descriptions.Item label="子事件编码">{data?.code}</Descriptions.Item>
            <Descriptions.Item label="子事件名称">{data?.subEventName}</Descriptions.Item>
            <Descriptions.Item label="版本号">{data?.lastVersion}</Descriptions.Item>
            <Descriptions.Item label="创建时间" span={2}>
              {data?.gmtCreated}
            </Descriptions.Item>
            <Descriptions.Item label="子事件规则" span={2}>
              {data?.ruleContent}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Modal>
    );
  };
  return <>{getModalContent()}</>;
};

export default HistorySubEvent;
