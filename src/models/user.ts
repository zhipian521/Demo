import { Effect, Reducer } from 'umi';
// @ts-ignore
import decode from 'jsonwebtoken/decode';
import { Cookies } from 'react-cookie';
import { checkToken } from '@/utils/SSOUtils';

export interface StateType {
  currentUser: CurrentUser;
}

export interface CurrentUser {
  avatar?: string;
  name?: string;
  title?: string;
  group?: string;
  signature?: string;
  tags?: {
    key: string;
    label: string;
  }[];
  userId?: string;
  unreadCount?: number;
}

export interface UserModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetchCurrent: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<StateType>;
  };
}

const UserModel: UserModelType = {
  namespace: 'userModel',

  state: {
    currentUser: {
      userId: '1',
      name: 'system',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
    },
  },

  effects: {
    *fetchCurrent(_, { put }) {
      const cookie = new Cookies();
      const userInfo = decode(cookie.get('accessToken'));
      if (!userInfo) {
        checkToken();
      } else {
        yield put({
          type: 'saveCurrentUser',
          payload: {
            name: userInfo.username,
            userId: userInfo.userid,
            avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
          },
        });
      }
    },
  },

  reducers: {
    saveCurrentUser(state, { payload }) {
      return {
        ...state,
        currentUser: { ...payload },
      };
    },
  },
};

export default UserModel;
