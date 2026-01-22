import fs from 'node:fs'
import path from 'node:path'
import Unocss from 'unocss/vite'
import { defineConfig } from 'vitepress'

// 读取 Google 服务配置
const googleConfigPath = path.resolve(__dirname, 'google-config.json')
let googleConfig = { analytics: '', searchConsole: '', adsense: '' }
if (fs.existsSync(googleConfigPath)) {
  try {
    googleConfig = JSON.parse(fs.readFileSync(googleConfigPath, 'utf-8'))
  }
  catch (error) {
    console.warn('无法读取 google-config.json:', error)
  }
}

// @ts-expect-error - VitePress支持函数形式的配置
export default defineConfig(({ command }: { command: 'serve' | 'build' }) => ({
  // command: 'serve' (开发环境 pnpm dev) 或 'build' (构建环境 pnpm build)
  base: '/',
  lang: 'zh-CN',
  title: '杰哥的技术小站',
  description: '字段专注VPN科学上网、AI人工智能、Web开发教程和免费资源分享的技术博客。提供免费VPN节点、AI工具推荐、编程教程等优质内容。',
  ignoreDeadLinks: true, // 忽略死链接检查，允许构建成功
  appearance: false, // 禁用外观切换按钮

  // Sitemap 配置 - 构建时自动生成 sitemap.xml
  sitemap: {
    hostname: 'https://hellosai.cc', // 网站域名
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

    // Google Analytics (GA4) - 从 google-config.json 读取
    ...(googleConfig.analytics
      ? [
          ['script', { async: '', src: `https://www.googletagmanager.com/gtag/js?id=${googleConfig.analytics}` }],
          ['script', {}, `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${googleConfig.analytics}');
      `],
        ]
      : []),

    // Google AdSense - 从 google-config.json 读取
    ...(googleConfig.adsense
      ? [
          ['script', {
            async: '',
            src: `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${googleConfig.adsense}`,
            crossorigin: 'anonymous',
          }],
        ]
      : []),

    // Google Search Console验证 - 从 google-config.json 读取
    ...(googleConfig.searchConsole
      ? [
          ['meta', { name: 'google-site-verification', content: googleConfig.searchConsole }],
        ]
      : []),

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
      banner: '/images/banner/banner.png',
    },
  },
  vite: {
    plugins: [
      Unocss({
        configFile: '../../unocss.config.ts',
      }),
    ],
    server: {
      host: true, // 绑定到所有接口，包括IPv4，解决localhost无法访问的问题
      watch: {
        // 忽略草稿箱和文章目录的文件变化，避免触发 HMR 刷新
        ignored: [
          '**/drafts/**',
          '**/docs/posts/**/*.md',
        ],
      },
    },
  },
  // 构建钩子：复制Google配置到public目录
  buildEnd: async () => {
    const publicGoogleConfigPath = path.resolve(__dirname, '../public/google-config.json')

    // 复制配置文件到public目录，供运行时访问
    if (fs.existsSync(googleConfigPath)) {
      fs.copyFileSync(googleConfigPath, publicGoogleConfigPath)
      console.warn('✅ Google配置已复制到public目录')
    }
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
              link,
              activeMatch: link,
            }
          }),
        },
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
