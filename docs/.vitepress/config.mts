import fs from 'node:fs'
import path from 'node:path'
import Unocss from 'unocss/vite'
import { defineConfig } from 'vitepress'

// @ts-expect-error - VitePress支持函数形式的配置
export default defineConfig(({ command }: { command: 'serve' | 'build' }) => ({
  // command: 'serve' (开发环境 pnpm dev) 或 'build' (构建环境 pnpm build)
  base: '/',
  lang: 'zh-CN',
  title: '杰哥的技术小站',
  description: '专注VPN科学上网、AI人工智能、Web开发教程和免费资源分享的技术博客。提供免费VPN节点、AI工具推荐、编程教程等优质内容。',
  ignoreDeadLinks: true, // 忽略死链接检查，允许构建成功
  appearance: false, // 禁用外观切换按钮
  
  // Sitemap 配置 - 构建时自动生成 sitemap.xml
  sitemap: {
    hostname: 'https://your-domain.com', // 替换为你的网站域名
  },
  head: [
    ['meta', { name: 'keywords', content: 'VPN,科学上网,免费节点,AI工具,ChatGPT,人工智能,Web开发,编程教程,免费资源,技术博客' }],
    ['meta', { name: 'author', content: '杰哥' }],
    ['meta', { name: 'robots', content: 'index,follow' }],
    ['meta', { name: 'googlebot', content: 'index,follow' }],
    // Open Graph
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: '杰哥的技术小站' }],
    ['meta', { property: 'og:locale', content: 'zh_CN' }],
    // Twitter Card
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:site', content: '@jiegejishu' }],
    // Favicon - 网站图标
    ['link', { rel: 'icon', type: 'image/png', href: '/images/favicon.png' }],
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/images/favicon.png' }],

    // Google Analytics (GA4) - 替换为你的测量ID
    ['script', { async: '', src: 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX' }],
    ['script', {}, `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-XXXXXXXXXX');
    `],

    // Google AdSense - 替换为你的发布商ID
    ['script', {
      async: '',
      src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX',
      crossorigin: 'anonymous',
    }],

    // Google Search Console验证 - 替换为你的验证码
    ['meta', { name: 'google-site-verification', content: 'your-verification-code-here' }],

    // 百度站长验证（可选）
    // ['meta', { name: 'baidu-site-verification', content: 'code-xxxxx' }],
  ],
  markdown: {
    headers: {
      level: [2, 3],
    },
  },
  themeConfig: {
    footer: {
      message: '杰哥的技术小站',
      copyright: 'Copyright © 2025 杰哥',
    },
    search: {
      provider: 'local',
    },
    nav: nav(command),
    sidebar: generateSidebar(),
    blog: {
      title: '欢迎来到杰哥的技术小站',
      description: '',
      banner: '/images/banner.png',
    },
  },
  vite: {
    plugins: [
      Unocss({
        configFile: '../../unocss.config.ts',
      }),
    ],
    server: {
      watch: {
        // 忽略草稿箱和文章目录的文件变化，避免触发 HMR 刷新
        ignored: [
          '**/drafts/**',
          '**/docs/posts/**/*.md',
        ],
      },
    },
  },
}))

function getNavConfig() {
  const navConfigPath = path.join(__dirname, '../../nav-config.json')
  try {
    const configContent = fs.readFileSync(navConfigPath, 'utf-8')
    return JSON.parse(configContent)
  }
  catch (error) {
    console.error('❌ 读取导航配置失败:', error)
    return []
  }
}

function nav(command: 'serve' | 'build') {
  const navConfig = getNavConfig()

  // 转换为VitePress格式
  const navItems = navConfig
    .filter((item: any) => {
      // 过滤掉既没有link也没有有效items的菜单
      return item.link || (item.items && item.items.length > 0)
    })
    .map((item: any) => {
      const navItem: any = {
        text: item.text,
      }

      // 如果有直接的link，使用它
      if (item.link) {
        navItem.link = item.link
      }

      // 如果有子菜单，递归转换
      if (item.items && item.items.length > 0) {
        // 添加activeMatch
        if (item.folder) {
          navItem.activeMatch = `/posts/${item.folder}/`
        }

        navItem.items = item.items.map((subItem: any) => {
          const converted: any = {
            text: subItem.text,
          }

          // 优先使用自定义link，否则根据folder生成
          if (subItem.link) {
            converted.link = subItem.link
          }
          else if (subItem.folder) {
            converted.link = `/posts/${subItem.folder}/`
          }

          // 添加activeMatch
          if (subItem.folder) {
            converted.activeMatch = `/posts/${subItem.folder}/`
          }
          else if (subItem.link) {
            converted.activeMatch = subItem.link
          }

          return converted
        })
      }

      return navItem
    })

  // 仅在开发环境显示管理工具菜单
  if (command === 'serve') {
    navItems.push({
      text: '🛠️ 管理工具',
      link: '/tools/admin',
      editable: false,
    })
  }

  return navItems
}

function generateSidebar() {
  const navConfig = getNavConfig()
  const sidebar: any = {}

  navConfig.forEach((item: any) => {
    // 只有带有 folder 且有子项的菜单才生成侧边栏
    if (item.folder && item.items && item.items.length > 0) {
      const sidebarKey = `/posts/${item.folder}/`

      sidebar[sidebarKey] = [
        {
          text: item.text, // 使用菜单名称作为侧边栏标题
          collapsed: false,
          items: item.items.map((subItem: any) => {
            const link = subItem.link || `/posts/${subItem.folder}/`
            return {
              text: subItem.text,
              link: link,
              activeMatch: link
            }
          })
        }
      ]
    }
  })

  // 添加关于页面的侧边栏
  sidebar['/about/'] = [
    {
      text: 'ℹ️ 关于',
      items: [
        { text: '关于本站', link: '/about/' },
      ],
    },
  ]

  return sidebar
}
