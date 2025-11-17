import Unocss from 'unocss/vite'
import { defineConfig } from 'vitepress'
import { version } from '../../package.json'

export default defineConfig({
  base: '/',
  lang: 'zh-CN',
  title: '杰哥的技术小站',
  description: '专注VPN科学上网、AI人工智能、Web开发教程和免费资源分享的技术博客。提供免费VPN节点、AI工具推荐、编程教程等优质内容。',
  ignoreDeadLinks: true, // 忽略死链接检查，允许构建成功
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
    nav: nav(),
    sidebar: {
      '/posts/vpn-proxy/': sidebarVpn(),
      '/posts/ai/': sidebarAi(),
      '/posts/blog/': sidebarBlog(),
      '/posts/resources/': sidebarResources(),
      '/about/': sidebarAbout(),
    },
    // @ts-expect-error - 自定义配置字段，VitePress类型定义中不存在
    blog: {
      title: '你好，旅行者！',
      description: '欢迎来到杰哥的技术小站！',
      banner: '/images/banner.png',
    },
  },
  ignoreDeadLinks: true,
  vite: {
    plugins: [
      Unocss({
        configFile: '../../unocss.config.ts',
      }),
    ],
  },
})

function nav() {
  return [
    {
      text: '🚀 网络加速',
      activeMatch: '/posts/vpn-proxy/',
      items: [
        { text: '每日节点', link: '/posts/vpn-proxy/free-nodes/', activeMatch: '/posts/vpn-proxy/free-nodes/' },
        { text: 'VPN教程', link: '/posts/vpn-proxy/tutorial/', activeMatch: '/posts/vpn-proxy/tutorial/' },
        { text: '机场', link: '/posts/vpn-proxy/airport-review/', activeMatch: '/posts/vpn-proxy/airport-review/' },
      ],
    },
    {
      text: '🤖 AI',
      activeMatch: '/posts/ai/',
      items: [
        { text: 'AI工具', link: '/posts/ai/tools/ai-tools-navigation', activeMatch: '/posts/ai/tools/' },
        { text: '提示词', link: '/posts/ai/prompts/', activeMatch: '/posts/ai/prompts/' },
        { text: 'AI教程', link: '/posts/ai/tutorial/', activeMatch: '/posts/ai/tutorial/' },
        { text: '进阶', link: '/posts/ai/advanced/', activeMatch: '/posts/ai/advanced/' },
        { text: '大模型', link: '/posts/ai/llm/', activeMatch: '/posts/ai/llm/' },
        { text: '工作流', link: '/posts/ai/workflow/', activeMatch: '/posts/ai/workflow/' },
      ],
    },
    {
      text: '📚 博客',
      activeMatch: '/posts/blog/',
      items: [
        { text: '教程', link: '/posts/blog/tutorials/', activeMatch: '/posts/blog/tutorials/' },
        { text: '白嫖', link: '/posts/blog/freebies/', activeMatch: '/posts/blog/freebies/' },
        { text: '推荐', link: '/posts/blog/recommendations/', activeMatch: '/posts/blog/recommendations/' },
      ],
    },
    {
      text: '📦 资源宝库',
      activeMatch: '/posts/resources/',
      items: [
        { text: '夸克资料', link: '/posts/resources/quark/', activeMatch: '/posts/resources/quark/' },
        { text: '学习资料', link: '/posts/resources/learning-materials/', activeMatch: '/posts/resources/learning-materials/' },
      ],
    },
    {
      text: 'ℹ️ 关于',
      link: '/about/',
    },
  ]
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
