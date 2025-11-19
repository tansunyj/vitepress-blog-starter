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
      level: [0, 0],
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
    sidebar: {
      '/posts/vpn-proxy/': sidebarVpn(),
      '/posts/ai/': sidebarAi(),
      '/posts/blog/': sidebarBlog(),
      '/posts/resources/': sidebarResources(),
      '/about/': sidebarAbout(),
    },
    // @ts-expect-error 自定义配置字段
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
  },
}))

function nav(command: 'serve' | 'build') {
  // 从JSON文件读取导航配置
  const navConfigPath = path.join(__dirname, '../../nav-config.json')
  let navConfig = []

  try {
    const configContent = fs.readFileSync(navConfigPath, 'utf-8')
    navConfig = JSON.parse(configContent)
  }
  catch (error) {
    console.error('❌ 读取导航配置失败:', error)
  }

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

function sidebarVpn() {
  return [
    {
      text: '🚀 网络加速',
      collapsed: false,
      items: [
        { text: '免费节点', link: '/posts/vpn-proxy/free-nodes/' },
        { text: 'VPN教程', link: '/posts/vpn-proxy/tutorial/' },
        { text: '机场', link: '/posts/vpn-proxy/airport-review/' },
      ],
    },
  ]
}

function sidebarAi() {
  return [
    {
      text: '🤖 AI探索',
      items: [
        { text: 'AI工具', link: '/posts/ai/tools/ai-tools-navigation', activeMatch: '/posts/ai/tools/' },
        { text: '提示词', link: '/posts/ai/prompts/', activeMatch: '/posts/ai/prompts/' },
        { text: 'AI教程', link: '/posts/ai/tutorial/', activeMatch: '/posts/ai/tutorial/' },
        { text: '进阶', link: '/posts/ai/advanced/', activeMatch: '/posts/ai/advanced/' },
        { text: '大模型', link: '/posts/ai/llm/', activeMatch: '/posts/ai/llm/' },
        { text: '工作流', link: '/posts/ai/workflow/', activeMatch: '/posts/ai/workflow/' },
      ],
    },
  ]
}

function sidebarBlog() {
  return [
    {
      text: '📚 博客',
      items: [
        { text: '教程', link: '/posts/blog/tutorials/', activeMatch: '/posts/blog/tutorials/' },
        { text: '白嫖', link: '/posts/blog/freebies/', activeMatch: '/posts/blog/freebies/' },
        { text: '推荐', link: '/posts/blog/recommendations/', activeMatch: '/posts/blog/recommendations/' },
      ],
    },
  ]
}

function sidebarResources() {
  return [
    {
      text: '📦 资源宝库',
      items: [
        { text: '夸克资料', link: '/posts/resources/quark/', activeMatch: '/posts/resources/quark/' },
        { text: '学习资料', link: '/posts/resources/learning-materials/', activeMatch: '/posts/resources/learning-materials/' },
      ],
    },
  ]
}

function sidebarAbout() {
  return [
    {
      text: 'ℹ️ 关于',
      items: [
        { text: '关于本站', link: '/about/' },
      ],
    },
  ]
}
