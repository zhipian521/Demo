import React, { useEffect, useState } from 'react';
import { PageLoading } from '@ant-design/pro-layout';
import { connect } from 'umi';
import { StateType as UserStateType } from '@/models/user';
import { Dispatch } from '@@/plugin-dva/connect';

interface SecurityLayoutProps {
  dispatch: Dispatch;
  loading: boolean;
  userModel: UserStateType;
  isReady: boolean;
  children: any;
}

const SecurityLayout: React.FC<SecurityLayoutProps> = ({
  dispatch,
  userModel,
  loading,
  children,
}) => {
  const [isReadyState, setIsReadyState] = useState<boolean>(false);

  useEffect(() => {
    setIsReadyState(true);
    dispatch({
      type: 'userModel/fetchCurrent',
    });
  }, [1]);

  const isLogin = userModel.currentUser && userModel.currentUser.userId;

  if ((!isLogin && loading) || !isReadyState) {
    return <PageLoading />;
  }
  return children;
};

export default connect(
  ({
    loading,
    userModel,
  }: {
    userModel: UserStateType;
    loading: { effects: { [key: string]: boolean } };
  }) => ({
    loading: loading.effects['userModel/fetchCurrent'],
    userModel,
  }),
)(SecurityLayout);
