---
title: 【博客系统】第七篇：VitePress静态博客第4篇：完整使用手册！菜单+文章+标签+网站管理一键搞定（2025最新）
description: 【博客系统】第七篇：2025最新VitePress静态博客终极使用手册！本地管理后台20张图教你自定义一级/子菜单、发布文章、插入图片、公众号一键爬文、标签管理、网站Banner/页脚修改，彻底永不封号，小白也能5分钟发文，搭配Cloudflare秒部署！
date: 2025-12-02 20:54:12
author: 杰哥
cover: /images/covers/cover-article-1764665232243.png
tags:
  - 工具
  - 网站
  - 个人作品
  - 博客系统
  - 搭建
  - 教程
category: "blog"

---

![Image](/images/blog/recommendations/1.jpg)
***您好，我是Hellos AI，擅长AI编程、分享AI工具资讯等，立志让更多普通人了解AI、学会AI，利用AI找到人生的第二曲线。***

[【为实现内容自由】仅用2天！我开发了一个“永不被删”的个人博客!](https://mp.weixin.qq.com/s?__biz=MzUyMjEyMDcyOQ==\&mid=2247496874\&idx=1\&sn=7a10628aa8e7f0981c69030ea787a790\&scene=21#wechat_redirect)

[【为实现内容自由】给博客系统增加管理后台](https://mp.weixin.qq.com/s?__biz=MzUyMjEyMDcyOQ==\&mid=2247496913\&idx=1\&sn=e455925f1be1fad2d3baf6b11c4d7aa7\&scene=21#wechat_redirect)

[【为实现内容自由】cloudflare部署博客系统实现内容发布自动化](https://mp.weixin.qq.com/s?__biz=MzUyMjEyMDcyOQ==\&mid=2247497152\&idx=1\&sn=3f0c48ac7ba51f10db8926505fc1b00b\&scene=21#wechat_redirect)


自从我的博客系统正式上线后，这块的文章还差最后一篇就是：我还要为它写一篇使用手册！

接下来我将详细描述该如何使用它！

该静态博客系统的安装、部署可以参考《[【为实现内容自由】cloudflare部署博客系统实现内容发布自动化](https://mp.weixin.qq.com/s?__biz=MzUyMjEyMDcyOQ==\&mid=2247497152\&idx=1\&sn=3f0c48ac7ba51f10db8926505fc1b00b\&scene=21#wechat_redirect)》

## 定制菜单

在本地电脑部署并启动后，点击右上角的"管理工具"进入如下管理后台页面，如：

![图片](/images/blog/recommendations/2.jpg)

在这个dashboard中点击"菜单管理"菜单页面，如：

![图片](/images/blog/recommendations/3.jpg)

图中这些菜单是我自己需要的菜单，所以是这样新建的，对于读者你可能不合适，你可以自己新建后把上面这些菜单删除掉就好了。

### 1.新增一级菜单

![图片](/images/blog/recommendations/4.jpg)

新建后结果如下：

![图片](/images/blog/recommendations/5.jpg)

### 2.新增子菜单

![图片](/images/blog/recommendations/6.jpg)

例如，我想把google作为一个子菜单，如：

![图片](/images/blog/recommendations/7.jpg)

![图片](/images/blog/recommendations/8.jpg)

点击该功能菜单顶部的"保存配置"后，再重启博客系统，你在看！

![图片](/images/blog/recommendations/9.jpg)

![图片](/images/blog/recommendations/10.jpg)

再看看现在是不是有一个子菜单"好用工具"、"谷歌"，点击谷歌就打开谷歌官网，打开好用工具就能看到"好用工具"子菜单的文章列表界面，如：

![图片](/images/blog/recommendations/11.jpg)

![图片](/images/blog/recommendations/12.jpg)

这里就看到的是文章卡片列表，点击卡片后就可以打开文章详情了

![图片](/images/blog/recommendations/13.jpg)

好了，你能自定义第一个菜单，那么就可以自定义第二个、第三个.........

## 文章

在把导航菜单、子菜单都定义好之后，接下来就是为各个菜单填充内容，也就是发表文章了！

### 01新建文章

进入到文章管理"草稿箱"，在这里点击"新增"按钮，可以新增一篇文章如：

![图片](/images/blog/recommendations/14.jpg)

文章编辑完成后，可以保存为草稿，也可以直接发布到指定子菜单底下，如：

![图片](/images/blog/recommendations/15.jpg)

文章发布后，我们都可以在"已上线"->"好用工具"底下找到他并且还可以看到它的预览效果，如：

![图片](/images/blog/recommendations/16.jpg)**&#x30;****2****&#x6587;章插入图片**

例如我有一篇文章，里面需要使用到图片，那么我们可以如下来处理：

图片可以使用本地上传的图片也可以使用网上的图片

![图片](/images/blog/recommendations/17.jpg)

![图片](/images/blog/recommendations/18.jpg)

好了，接着这篇文章我们改改后发布，再看看发布后的效果：

![图片](/images/blog/recommendations/19.jpg)

最后在前端博客页面效果如下：

![图片](/images/blog/recommendations/20.jpg)
### 02文章插入图片

例如这里我爬取我今天写的微信公众号文章，然后把它发表在这个好用工具子菜单内：

![图片](/images/blog/recommendations/21.jpg)

它会默认保存在草稿箱中，我们在草稿箱中编辑好之后，发布，如：

![图片](/images/blog/recommendations/22.jpg)

好了，对文章的介绍就到这里，接下来我们来看看其他的功能！

## 标签管理

像这里文章中用到的tags都是在"标签管理"中进行管理的，如：

![图片](/images/blog/recommendations/23.jpg)

对于不需要的标签还可以删除掉。。。

## 网站管理

进入"网站管理"菜单后，可以在这些界面中对网站的名称、banner图片、欢迎词、页脚等等进行编辑

### 功能介绍：

![图片](/images/blog/recommendations/24.jpg)

例如，我做一下修改，修改为如下的这些新的值，如：

![图片](/images/blog/recommendations/25.jpg)

回到前端首页，我们看到改动的效果如下：

![图片](/images/blog/recommendations/26.jpg)

![图片](/images/blog/recommendations/27.jpg)

当然对于这个管理后台来说，网站管理、tags等等都不是那种需要高频进行编辑的功能，只有文章管理那里才是最主要的操作页面了！

## 写在最后

好了，对于这个静态博客系统的介绍就到这里了！对于该博客系统有任何问题欢迎过来讨论哦！

需要获取源代码的朋友可以访问：<https://github.com/tansunyj/vitepress-blog-starter>
