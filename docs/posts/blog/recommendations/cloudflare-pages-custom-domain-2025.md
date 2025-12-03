---
title: 2025 Cloudflare Pages自定义域名最全教程（5分钟从pages.dev变mydomain.com，LibreTV/MoonTV完美绑定）
description: 2025最新最详细Cloudflare Pages自定义域名绑定教程！手把手教你从GitHub项目部署到购买域名→托管CF→CNAME一键解析→激活自定义域全流程，5分钟让LibreTV、MoonTV、任何前端项目拥有真正属于自己的顶级域名+免费HTTPS+全球CDN，2025白嫖党终极闭环！
date: 2025-12-01 20:33:59
author: 杰哥
cover: /images/covers/cover-article-1764589447555.jpg
tags:
  - AI
  - 网站
  - 出海
category: "blog"

---

![图片](/images/blog/recommendations/article-1764759803052/2.jpg)

你是不是也遇到过这样的问题？

辛辛苦苦的在 Cloudflare 上部署好了前端项目（MoonTV、libreTV），却发现只能用cloudflare分配的二级域名访问。虽然可以用，但总感觉不放心，想用自己的域名，却又不知道怎么办。

在之前的[文章](https://mp.weixin.qq.com/s?__biz=MzUyMjEyMDcyOQ==\&mid=2247492637\&idx=1\&sn=5e43104a8770b1c1621cdb3962aa234f\&scene=21#wechat_redirect)中，我详细描述了怎么样在 Cloudflare 搭建前端项目，但确实留下了一个“坑”——没有详细讲如何配置自定义域名。

今天，这篇文章会用最简单、最直白的方式，手把手教你完成部署和域名解析过程，让你拥有一个真正属于自己的网站。

## 思路

把一个github上的项目完整部署到cloudflare上并配置域名和正常访问我觉得有如下得几个步骤：

### 一、项目

如题，准备好一个正常不报错的项目，在后续章节中会进行列举！

### 二、部署

部署步骤一中项目的完整过程，后续章节会详细列举！

### 三、托管域名

把自己购买的域名托管到cloudflare，后续章节会详细介绍！

### 四、自定义域名解析

在步骤二部署完毕能够正常访问后，把托管到cloudflare的域名解析到cloudflare提供的域名上，后续章节详细列举！

## 项目

例如我这里需要部署一个前端项目，该前端项目如下：

地址：<https://github.com/tansunyj/365coloringpages.git>

本地启动后运行项目，看到页面显示如下：

![图片](/images/blog/recommendations/article-1764759803052/5.jpg)

嗯，看着效果马马虎虎，毕竟是用来做一个demo的嘛！

## 部署

既然项目已经在github上了，那么我先把它部署到cloudflare上吧！

关联github账号之类得可以参考我前面得文章：[5分钟拥有私人影院！免费域名注册全攻略，解锁观影新姿势](https://mp.weixin.qq.com/s?__biz=MzUyMjEyMDcyOQ==\&mid=2247492637\&idx=1\&sn=5e43104a8770b1c1621cdb3962aa234f\&scene=21#wechat_redirect)

### 一、选定项目

![图片](/images/blog/recommendations/article-1764759803052/7.jpg)

![图片](/images/blog/recommendations/article-1764759803052/8.jpg)

![图片](/images/blog/recommendations/article-1764759803052/9.jpg)

![图片](/images/blog/recommendations/article-1764759803052/10.jpg)

二、设置

选择好项目后会进入如下得页面

![图片](/images/blog/recommendations/article-1764759803052/11.jpg)

![图片](/images/blog/recommendations/article-1764759803052/12.jpg)

注：next.js这里应该选Next.js (Static HTML Export)，我的截图有点小错误！其他的配置没有问题

### 三、部署

![图片](/images/blog/recommendations/article-1764759803052/13.jpg)

耐心等待构建完成，如下：

![图片](/images/blog/recommendations/article-1764759803052/14.jpg)

出现这个"成功！您的项目已部署到以下区域：全球"，则表示部署成功，下面我们可以使用cloudflare分配的域名访问看看效果！

### 四、访问预览

![图片](/images/blog/recommendations/article-1764759803052/15.jpg)

点击红线处的链接<https://365coloringpages.pages.dev/> 页面显示如下：

![图片](/images/blog/recommendations/article-1764759803052/16.jpg)

既然已经可以通过cloudflare的域名访问，那么到这里应用部署就完毕了！

## 托管域名

### 一、新增域名托管

![图片](/images/blog/recommendations/article-1764759803052/18.jpg)

![图片](/images/blog/recommendations/article-1764759803052/19.jpg)

![图片](/images/blog/recommendations/article-1764759803052/20.jpg)

![图片](/images/blog/recommendations/article-1764759803052/21.jpg)

![图片](/images/blog/recommendations/article-1764759803052/22.jpg)

![图片](/images/blog/recommendations/article-1764759803052/23.jpg)

### 二、域名解析

这里只需要添加2条结果，如：

![图片](/images/blog/recommendations/article-1764759803052/24.jpg)

a.类型选择CNAME，名称填写@，值填写365coloringpages.pages.dev然后保存！

![图片](/images/blog/recommendations/article-1764759803052/25.jpg)

b.类型选择CNAME，名称填www，值填写365coloringpages.pages.dev然后保存！最后效果如下：

![图片](/images/blog/recommendations/article-1764759803052/26.jpg)

### 三、域名DNS解析服务器配置

回到购买域名的网站，配置域名的DNS服务器配置，如：

![图片](/images/blog/recommendations/article-1764759803052/27.jpg)

这里点击MANAGE按钮，进入域名设置界面中，这里我需要把上面cloudflare中截图中底部那2个NS的配置复制过来，如：

![图片](/images/blog/recommendations/article-1764759803052/28.jpg)

这里配置完毕后需要等待一会，等dns解析完毕，才能进入到后续步骤

![图片](/images/blog/recommendations/article-1764759803052/29.jpg)

等待cloudflare dashboard这里当前域名全部正常后，我们可以继续后续步骤！

## 自定义域名解析

接下来我需要配置自定义域名

### 一、打开自定义域

![图片](/images/blog/recommendations/article-1764759803052/31.jpg)

![图片](/images/blog/recommendations/article-1764759803052/32.jpg)

### 二、添加自定义域名

这里需要添加2条域名配置，因为我已经有域名，所以这里配置如下：

1.添加域名如下：如mydomain.com

![图片](/images/blog/recommendations/article-1764759803052/33.jpg)

![图片](/images/blog/recommendations/article-1764759803052/34.jpg)

接着点击右下角的激活按钮；

2.添加域名如下：如www\.mydomain.com

![图片](/images/blog/recommendations/article-1764759803052/35.jpg)

![图片](/images/blog/recommendations/article-1764759803052/36.jpg)

这2个域名的配置都配置好之后，等待域名激活。如下：激活完毕后，我们就可以使用前面购买的域名来访问前面说的页面了！

![图片](/images/blog/recommendations/article-1764759803052/37.jpg)

使用mydomain.com域名访问我的网站如下：

![图片](/images/blog/recommendations/article-1764759803052/38.jpg)

这就把网站部署好了，接下来的工作就是完善各个页面功能、提高页面的SEO，那就是另外一个问题了！

## **最后**

好了，我这个文章到这里就详细记录了从项目部署、域名解析到绑定的全过程，相信你如果按照我的操作步骤也可以轻松搞定。
