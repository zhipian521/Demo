import { Cookies } from 'react-cookie';

const checkHostNames = ['t1-dcheck.shizhuang-inc.com', 'dcheck.shizhuang-inc.com'];
export const checkToken = () => {
  checkHostNames.forEach((t) => {
    if (t === window.location.hostname) {
      const cookies = new Cookies();
      cookies.remove('accessToken', { path: '/', domain: '.shizhuang-inc.com' });
      window.location.href = `https://sso.shizhuang-inc.com/?returnUrl=${window.location.href}`;
    }
  });
};
