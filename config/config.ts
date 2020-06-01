// https://umijs.org/config/
import { defineConfig, utils } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import webpackPlugin from './plugin.config';
const { winPath } = utils; // preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。

const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION, REACT_APP_ENV, GA_KEY } = process.env;
export default defineConfig({
  hash: true,
  antd: {},
  analytics: GA_KEY
    ? {
        ga: GA_KEY,
      }
    : false,
  dva: {
    hmr: true,
  },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    // default true, when it is true, will use `navigator.language` overwrite default
    antd: true,
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      routes: [
        {
          path: '/',
          component: '../layouts/BasicLayout',
          authority: ['admin', 'user'],
          routes: [
            {
              name: 'check-worktable',
              icon: 'HomeOutlined',
              path: '/check-worktable',
              component: './check-worktable',
            },
            {
              name: 'check-analysis',
              icon: 'LineChartOutlined',
              path: '/check-analysis',
              component: './check-analysis',
            },
            {
              name: 'check-report-chart',
              icon: 'BarChartOutlined',
              path: '/check-report-chart',
              component: './check-report-chart',
            },
            {
              name: 'check-data-quality',
              icon: 'HeatMapOutlined',
              path: '/check-data-quality',
              component: './check-data-quality',
            },
            {
              name: 'check-abnormal',
              icon: 'AimOutlined',
              path: '/check-abnormal',
              routes: [
                {
                  name: 'check-error-list',
                  icon: 'AlertOutlined',
                  path: '/check-abnormal/check-error-list',
                  component: './check-abnormal/check-error-list',
                },
                {
                  name: 'check-error-track',
                  icon: 'IssuesCloseOutlined',
                  path: '/check-abnormal/check-error-track',
                  component: './check-abnormal/check-error-track',
                },
                {
                  name: 'exception-error-list',
                  icon: 'BugOutlined',
                  path: '/check-abnormal/exception-error-list',
                  component: './check-abnormal/exception-error-list',
                },
              ],
            },
            {
              name: 'check-config',
              icon: 'SettingOutlined',
              path: '/check-config',
              routes: [
                {
                  name: 'subject-manage',
                  icon: 'DeploymentUnitOutlined',
                  path: '/check-config/subject-manage',
                  component: './check-config/subject-manage',
                },
                {
                  name: 'event-manage',
                  icon: 'SubnodeOutlined',
                  path: '/check-config/event-manage',
                  component: './check-config/event-manage',
                },
                {
                  name: 'sub-event-manage',
                  icon: 'SisternodeOutlined',
                  path: '/check-config/sub-event-manage',
                  component: './check-config/sub-event-manage',
                },
                {
                  name: 'rule-manage',
                  icon: 'ForkOutlined',
                  path: '/check-config/rule-manage',
                  component: './check-config/rule-manage',
                },
                {
                  name: 'rule-add',
                  icon: 'smile',
                  path: '/check-config/rule-manage/rule-add',
                  component: './check-config/rule-manage/rule-add',
                  hideInMenu: true,
                },
                {
                  name: 'rule-edit',
                  icon: 'smile',
                  path: '/check-config/rule-manage/rule-edit',
                  component: './check-config/rule-manage/rule-edit',
                  hideInMenu: true,
                },
                {
                  name: 'rule-detail',
                  icon: 'smile',
                  path: '/check-config/rule-manage/rule-detail',
                  component: './check-config/rule-manage/rule-detail',
                  hideInMenu: true,
                },
                {
                  name: 'rule-history',
                  icon: 'smile',
                  path: '/check-config/rule-manage/rule-history',
                  component: './check-config/rule-manage/rule-history',
                  hideInMenu: true,
                },
              ],
            },
            {
              name: 'check-system-config',
              icon: 'ToolOutlined',
              path: '/check-system-config',
              routes: [
                {
                  name: 'alarm-manager',
                  icon: 'AlertOutlined',
                  path: '/check-system-config/alarm-manage',
                  component: './check-system-config/alarm-manage',
                },
              ],
            },
            {
              name: 'mock',
              icon: 'CodeOutlined',
              path: '/mock',
              routes: [
                {
                  name: 'rule-mock',
                  icon: 'NodeExpandOutlined',
                  path: '/mock/rule-mock',
                  component: './check-mock/rule-mock',
                },
                {
                  name: 'flow-mock',
                  icon: 'GatewayOutlined',
                  path: '/mock/flow-mock',
                  component: './check-mock/flow-mock',
                },
                {
                  name: 'script-mock',
                  icon: 'SendOutlined',
                  path: '/mock/script-mock',
                  component: './check-mock/script-mock',
                },
                {
                  name: 'mq-mock',
                  icon: 'NotificationOutlined',
                  path: '/mock/mq-mock',
                  component: './check-mock/mq-mock',
                },
              ],
            },
            {
              path: '/',
              redirect: '/check-worktable',
            },
            {
              component: './404',
            },
          ],
        },
      ],
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  define: {
    REACT_APP_ENV: REACT_APP_ENV || false,
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION:
      ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION || '', // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  },
  ignoreMomentLocale: true,
  lessLoader: {
    javascriptEnabled: true,
  },
  cssLoader: {
    modules: {
      getLocalIdent: (
        context: {
          resourcePath: string;
        },
        _: string,
        localName: string,
      ) => {
        if (
          context.resourcePath.includes('node_modules') ||
          context.resourcePath.includes('ant.design.pro.less') ||
          context.resourcePath.includes('global.less')
        ) {
          return localName;
        }

        const match = context.resourcePath.match(/src(.*)/);

        if (match && match[1]) {
          const antdProPath = match[1].replace('.less', '');
          const arr = winPath(antdProPath)
            .split('/')
            .map((a: string) => a.replace(/([A-Z])/g, '-$1'))
            .map((a: string) => a.toLowerCase());
          return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
        }

        return localName;
      },
    },
  },
  manifest: {
    basePath: '/',
  },
  proxy: proxy[REACT_APP_ENV || 'dev'],
  chainWebpack: webpackPlugin,
});
