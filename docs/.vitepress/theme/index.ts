import type { App } from 'vue'
import DefaultTheme from 'vitepress/theme'
import AuthorDetail from './components/blog/AuthorDetail.vue'
import CategoryPosts from './components/blog/CategoryPosts.vue'
import Post from './components/blog/Post.vue'
import PostAuthor from './components/blog/PostAuthor.vue'
import PostDetail from './components/blog/PostDetail.vue'
import PostIcon from './components/blog/PostIcon.vue'
import PostList from './components/blog/PostList.vue'
import PostNav from './components/blog/PostNav.vue'
import Posts from './components/blog/Posts.vue'
import Feature from './components/uno/Feature.vue'
import Layout from './Layout.vue'
import 'uno.css'
import './custom.css'

// 动态加载 Google 服务配置并插入标准代码
function loadGoogleServices() {
  // 仅在浏览器环境下加载
  if (typeof window === 'undefined')
    return

  // 只在生产环境加载 Google 服务
  // @ts-expect-error - VitePress 环境变量
  if (!import.meta.env.PROD)
    return

  try {
    // 尝试读取配置文件
    fetch('/google-config.json')
      .then(res => res.json())
      .then((config) => {
        // Google Analytics (GA4) 标准代码
        if (config.analytics) {
          const gaScript = document.createElement('script')
          gaScript.async = true
          gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${config.analytics}`
          document.head.appendChild(gaScript)

          const gaConfig = document.createElement('script')
          gaConfig.innerHTML = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${config.analytics}');
          `
          document.head.appendChild(gaConfig)
        }

        // Google AdSense 标准代码
        if (config.adsense) {
          const adsenseScript = document.createElement('script')
          adsenseScript.async = true
          adsenseScript.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${config.adsense}`
          adsenseScript.setAttribute('crossorigin', 'anonymous')
          document.head.appendChild(adsenseScript)
        }

        // Google Search Console 验证 meta 标签
        if (config.searchConsole) {
          const verificationCodes = config.searchConsole.split(',').map((code: string) => code.trim()).filter((code: string) => code)
          verificationCodes.forEach((code: string) => {
            const meta = document.createElement('meta')
            meta.name = 'google-site-verification'
            meta.content = code
            document.head.appendChild(meta)
          })
        }
      })
      .catch(() => {
        // 配置文件不存在是正常的，不需要处理
      })
  }
  catch (error) {
    console.error('❌ 加载 Google 服务配置失败:', error)
  }
}

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }: { app: App }) {
    app.component('Feature', Feature)
    app.component('Posts', Posts)
    app.component('CategoryPosts', CategoryPosts)
    app.component('Post', Post)
    app.component('PostList', PostList)
    app.component('PostDetail', PostDetail)
    app.component('PostNav', PostNav)
    app.component('PostIcon', PostIcon)
    app.component('PostAuthor', PostAuthor)
    app.component('AuthorDetail', AuthorDetail)

    // 加载 Google 服务
    if (typeof window !== 'undefined') {
      loadGoogleServices()
    }
  },
}
