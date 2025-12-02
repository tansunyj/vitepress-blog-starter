---
title: 【博客系统】第五篇：VitePress静态博客第2篇：本地启动+GitHub一键部署Cloudflare Pages全流程（2025最新）
description: 【博客系统】第五篇：2025最新VitePress-blog-starter本地运行+Cloudflare Pages零成本部署保姆级教程！Node.js+pnpm install+pnpm build 3分钟搞定，自动生成纯静态页面+自定义域名+SEO完美，支持无限文章，彻底永不封号！小白20张图复制即用。
date: 2025-12-02 20:50:43
author: 杰哥
cover: /images/covers/cover-5博客系统article-1764665202664.jpg
tags:
  - 博客系统
  - 网站
  - 工具
  - 搭建
  - 教程
  - 个人作品
category: "blog"

---

![Image](/images/drafts/article-1764665202664/1.jpg)
***您好，我是Hellos AI，擅长AI编程、分享AI工具资讯等，立志让更多普通人了解AI、学会AI，利用AI找到人生的第二曲线。***

距离上次发布静态博客系统已经过了几天了，经过几天的努力终于把博客系统的管理后台优化完成。当前可以在本地启动并编辑文章等，但是部署到服务器上之后这个管理后台是不显示的。

好，接下来我们一起来看看怎么部署这个博客系统！

部署好之后，后续想写静态博客的朋友就都能在本地写博客，并且推送博客后就可以在cloudflare上看到啦！

## 本地部署

### 01下载源代码

首先从github：<https://github.com/tansunyj/vitepress-blog-starter下载源代码，如：>

![图片](/images/drafts/article-1764665202664/2.jpg)

这种就可以直接下载一个zip包，包括当前项目的最新的源代码；

也可以使用命令：git clone <https://github.com/tansunyj/vitepress-blog-starter.git> 来把代码拉到本地，如：

![图片](/images/drafts/article-1764665202664/3.jpg)

这样就可以把所有代码都下载到本地啦！

### 02安装软件

运行这个博客系统需要安装几个小软件，如：

1.nodejs:可以在<https://nodejs.org/en/download下载比较新的版本，如：>

![图片](/images/drafts/article-1764665202664/4.jpg)

下载完毕后安装，一路next下去就完事了！

2.检查nodejs安装:安装完毕后打开一个新的命令行窗口，输入命令：

![图片](/images/drafts/article-1764665202664/5.jpg)

这样就可以看到版本，就是按照成功了！

3.接着安装npm，你可以直接复制命令：

```
npm install -g pnpm #全局安装pnpm工具
```

4.git，访问网站：<https://git-scm.com/install/windows下载>

![图片](/images/drafts/article-1764665202664/6.jpg)

个人根据自己实际情况下载这个工具就好了，安装完毕后如数命令如：

![图片](/images/drafts/article-1764665202664/7.jpg)

好了，现在整个项目的基础软件都具备了，下面还要安装一些依赖库！

### 03安装依赖库

进入到项目根目录下，执行如下命令： pnpm install

![图片](/images/drafts/article-1764665202664/8.jpg)

耐心等待这些都下载完毕就完事了。

### 04启动项目

这个最简单了，直接点击根目录下的""就启动了：

![图片](/images/drafts/article-1764665202664/9.jpg)

![图片](/images/drafts/article-1764665202664/10.jpg)

接着在浏览器访问<http://localhost:5173/，就可以打开这个静态博客系统啦，界面如下：>

![图片](/images/drafts/article-1764665202664/11.jpg)

## fork项目

如果你有github账号，那么直接fork我这个项目到你自己的个人仓库就好了！

![图片](/images/drafts/article-1764665202664/12.jpg)

![图片](/images/drafts/article-1764665202664/13.jpg)

![图片](/images/drafts/article-1764665202664/14.jpg)

好了，到了这里这个项目就到了自己的个人仓库了！

## cloudflare部署

现在到了最关键的阶段了，我之前也写过在cloudflare上部署项目的文章，你可以看：[3分钟搭建一个私人影院MoonTV：实现手机、电视端观影自由2](https://mp.weixin.qq.com/s?__biz=MzUyMjEyMDcyOQ==\&mid=2247492222\&idx=1\&sn=1aab973ee094e9f3b6092458b26100f4\&scene=21#wechat_redirect) 这篇文章，不过现在跟那个也有一点点不同。

### 01创建和部署

登陆cloudflare打开计算和AI菜单，选择workers和pages，点击右上角的蓝色按钮，创建一个应用

![图片](/images/drafts/article-1764665202664/15.jpg)

这里选择"get started"。

![图片](/images/drafts/article-1764665202664/16.jpg)

然后进入如下页面

![图片](/images/drafts/article-1764665202664/17.jpg)

这里点击"开始使用"，进入如下页面：

![图片](/images/drafts/article-1764665202664/18.jpg)

选择好之后，点击"开始设置"按钮，如下：

![图片](/images/drafts/article-1764665202664/19.jpg)

框架选择vitepress，构建命令输入pnpm build，输出目录输入docs/.vitepress/dist，然后点击部署，如下：

![图片](/images/drafts/article-1764665202664/20.jpg)

然后点击继续处理项目回到设置：

![图片](/images/drafts/article-1764665202664/21.jpg)

就能够打开如下的页面了，这就是我们部署的博客系统啦！

![图片](/images/drafts/article-1764665202664/22.jpg)

你看它各个页面是不是都是静态页面？右上角是不是满足预期（没有看到"管理工具"菜单吧？）

### 02域名解析

接着进入自定义域名页面，把自己托管在cloudflare的域名解析到这里就完啦！

![图片](/images/drafts/article-1764665202664/23.jpg)

配置好之后就像我这个域名这样（需添加2条）：

![图片](/images/drafts/article-1764665202664/24.jpg)

你们照着这个操作，那么就需要配置你自己的域名哈，配置好之后，就可以像我自己的博客那样访问了！

## 写在最后

好了，这个cloudflare上部署静态博客系统的操作过程就是本文描述的这样了。然后下一步当然就是自定义导航菜单、子菜单、往里面填充博客文章啦！

要是你也想拥有自己的个人博客，那么我这篇文章值得你好好看看，我的项目已经开源，你直接使用就好了！

另欢迎大家来我的个人博客网站<https://hellosai.cc/逛逛！>

我不生产工具，我只是好工具的搬运工。

**关注杰哥不迷路**，每天给你分享不一样的实用好工具。

免责声明：本公众号分享的内容以及软件等来自互联网，仅供大家学习交流，同时请遵守你当地的法律法规，否则造成的一切后果自负，与本公众号无关。如有侵权联删！部分知识难免有时效性，若内容过期失效，请见谅,感谢！

******喜欢这篇干货？如果觉得不错，请帮我一键三连，转发给您的朋友，都是对我最大的鼓励与认可。******如果想第一时间收到推送，可以把我的公众号加个星标🌟方便后面我们一起探讨AI或有意思的东西，还能够快速找到我！我们明天见！******—*****END*****—******图 | 来源网络侵删******欢迎点赞，在看，转发给我鼓励\~******👇👇关注我👇👇******👇👇扫码加入粉丝群领取福利👇👇***
