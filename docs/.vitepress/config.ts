import { getThemeConfig, defineConfig } from '@sugarat/theme/node'

const blogTheme = getThemeConfig({

  // 文章默认作者
  author: 'Hao Long',
  // @ts-ignore
  date: false,
  // 友链
  friend: [
    {
      nickname: '小林Coding',
      des: '小林 x 图解计算机基础',
      avatar:
        'https://xiaolincoding.com/logo.png',
      url: 'https://xiaolincoding.com/'
    },
    {
      nickname: 'bugstack 虫洞栈 ',
      des: '小傅哥网站',
      avatar:
        'https://bugstack.cn/images/system/blog-03.png',
      url: 'https://bugstack.cn/'
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
  method: 'history',
  base: '/code/',
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
      message: '坚持，坚持，在坚持',
      copyright:
        'MIT Licensed | <a target="_blank" href="https://theme.sugarat.top/"> @sugarat/theme </a>'
    },
    logo: '/logo.png',
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/freedom0123'
      }
    ],
    nav: [                  //右上角的导航栏
      {
        text: "框架",             //导航标签的名字
        items: [                  //这种格式是有下拉菜单的版本+
          { text: "MyBatis", link: "/MyBatis/学习笔记/01.回顾JDBC" },
          { text: "Spring", link: "/Spring/源码/01.Spring中的工厂" },
          { text: "SpringSecurity", link: "/SpringSecurity/01.SpringSecurity" },
          { text: "SpringBoot", link: "/SpringBoot/01.Starter开发" },
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
          { text: "二分", link: "/算法/01.二分"},
        ]
      },
      {
          text: "工作积累", link: "/项目/01.日志"
      }
    ],
    // @ts-ignore
    outline: [2,3,4]
  }
})
