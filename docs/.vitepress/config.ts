import { getThemeConfig, defineConfig } from '@sugarat/theme/node'

const blogTheme = getThemeConfig({
  // 文章默认作者
  author: 'Hao Long',
  // @ts-ignore
  date: false,
  // 友链
  friend: [
    {
      nickname: '粥里有勺糖',
      des: '你的指尖用于改变世界的力量',
      avatar:
        'https://img.cdn.sugarat.top/mdImg/MTY3NDk5NTE2NzAzMA==674995167030',
      url: 'https://sugarat.top'
    },
    {
      nickname: 'Vitepress',
      des: 'Vite & Vue Powered Static Site Generator',
      avatar:
        'https://img.cdn.sugarat.top/mdImg/MTY3NDk5NTI2NzY1Ng==674995267656',
      url: 'https://vitepress.vuejs.org/'
    }
  ],
  recommend: {
    showSelf: true
  },
  // 开启离线的全文搜索支持（如构建报错可注释下面的配置再次尝试）
  search: 'pagefind',
  /*popover: {
    title: '公告',
    body: [
      {
        type: 'text',
        content: 'QQ交流群：681489336 🎉🎉'
      },
      { type: 'text', content: '👇公众号👇---👇 微信 👇' },
      {
        type: 'image',
        src: 'https://img.cdn.sugarat.top/mdImg/MTYxNTAxODc2NTIxMA==615018765210'
      },
      {
        type: 'text',
        content: '欢迎大家加群&私信交流'
      },
      {
        type: 'button',
        content: '博客',
        link: 'https://sugarat.top'
      }
    ],
    duration: 0
  }*/
})

// @ts-ignore
export default defineConfig({
  extends: blogTheme,
  lang: 'zh-cn',
  title: 'Hao Long',
  description: '粥里有勺糖的博客主题，基于 vitepress 实现',
  vite: {
    optimizeDeps: {
      include: ['element-plus'],
      exclude: ['@sugarat/theme']
    }
  },
  lastUpdated: true,
  themeConfig: {
    lastUpdatedText: '上次更新于',
    footer: {
      message: '一步一步向前走',
      copyright:
        'MIT Licensed | <a target="_blank" href="https://theme.sugarat.top/"> @sugarat/theme </a>'
    },
    logo: '/logo.png',
    /*socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/ATQQ/sugar-blog/tree/master/packages/theme'
      }
    ],*/
    nav: [                  //右上角的导航栏
      {
        text: "框架",             //导航标签的名字
        items: [                  //这种格式是有下拉菜单的版本+
          { text: "MyBatis", link: "/MyBatis/学习笔记/01.回顾JDBC" }
        ]
      },
      {
        text: "分布式系列",
        items: [
          { text: "Netty", link: "/Netty/01.NIO基础"},
          { text: "RPC", link: "/RPC/01.概述"}
        ]
      },
      {
        text: "前端",
        items: [
          { text: "React", link: "/前端/React/01.React简介"}
        ]
      },
      {
        text: "算法",
        items: [
          { text: "算法学习", link: "/前端/React/01.React简介"},
          { text: "刷题", link: "/算法/刷题/01.剑指Offer"}
        ]
      },
      {
        text: "项目",
        items: [
          { text: "芋道开发平台", link: "/前端/React/01.React简介"},
          { text: "工作积累", link: "/前端/React/01.React简介"}
        ]
      }
    ],
    // @ts-ignore
    outline: [2,3,4]
  }
})
