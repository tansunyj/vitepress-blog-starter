---
title: 2025电视手机投屏观影自由终极方案：MoonTV+OrionTV+Cloudflare Pages一键部署（支持安卓TV/Apple TV）
description: 电脑版不够爽？2025最新电视端私人影院！MoonTV（Next.js纯前端）+OrionTV（安卓/Apple TV专用播放器）+Cloudflare Pages国内直连5分钟部署，自动跳广告、支持离线缓存、投屏秒开！已实测完美替代爱优腾电视VIP，附老版本可部署分支+密码保护+完整演示站，真正的全平台观影自由！
date: 2025-12-01 17:50:17
author: Hellos AI
cover: /images/covers/cover-article-1764580200364.jpg
tags:
  - 私人影院
  - 搭建
  - 网站
  - 出海
  - 教程
category: "blog"

---

您好，我是Hellos AI，一个10年+互联网从业者，现在专注于自媒体。希望我的文章能够为您带来更多精彩。如果您觉得我的文章对您有帮助，可以关注、点赞，谢谢！

![图片](/images/blog/tutorials/2.jpg)

[3分钟搭建一个私人影院：实现观影自由](https://mp.weixin.qq.com/s?__biz=MzUyMjEyMDcyOQ==\&mid=2247492138\&idx=1\&sn=87fdf5c1b4242b35ae77746a3c4cedda\&scene=21#wechat_redirect)

[3分钟搭建一个私人影院：实现观影自由2](https://mp.weixin.qq.com/s?__biz=MzUyMjEyMDcyOQ==\&mid=2247492186\&idx=1\&sn=d42cd3291fca5ddbed73adddf8765b42\&scene=21#wechat_redirect)

[3分钟搭建一个私人影院：实现手机端/电视端观影自由](https://mp.weixin.qq.com/s?__biz=MzUyMjEyMDcyOQ==\&mid=2247492162\&idx=1\&sn=42b29585bada37ddba6fe1c53d7fc9f5\&scene=21#wechat_redirect)

前面文章中有朋友说搭建的libreTV都是在电脑上看或者手机上看节目的私人影院，那么有没有能够在手机上、电视上实现观影自由的方法呢？答案是有的。

这里我们就一起来实现一个可以在手机上/电视机上的私人影院,通过MoonTV+OrionTV配合来实现观影自由！

## MoonTV

## 一、概要

MoonTV是一个跨平台的影视资源播放器，包括数十个免费的影视资源站点，支持按剧、演员、年份、简介等完整的展示影视资源信息；

地址：<https://github.com/tansunyj/MoonTV>

## 二、特点

1.采用**Next.js 14**+**Tailwind CSS**+**TypeScript** 开发；

2.集成HLS.js和ArtPlayer在线播放；

3.支持离线缓存，安装到桌面等，并且通过OrionTV可以在电视上播放；

4.自动跳过视频中的广告；

下面我们一起来看看这个MoonTV的详细搭建过程

## 三、搭建

在前面的文章中我们曾经描述过如何在怎么样在cloudflare中搭建libreTV,这里我们详细描述一下怎么部署MoonTV

1.进入菜单中，点击"创建"

![图片](/images/blog/tutorials/4.jpg)

2.进入到pages tab页面中

![图片](/images/blog/tutorials/5.jpg)

3.导入git仓库中的MoonTV项目

![图片](/images/blog/tutorials/6.jpg)

选中MoonTV，点击右下角开始设置按钮；

4.设置

分支：这里选择cloudflare构建命令：**pnpm install --frozen-lockfile && pnpm run pages:build**

构建输出目录：.vercel/output/static

添加一个环境变量：PASSWORD = 123456

![图片](/images/blog/tutorials/7.jpg)

再点击右下角的按钮，进入下一步；

5.构建和部署

![图片](/images/blog/tutorials/8.jpg)

到这里我们会发现它构建和部署成功，接着还需要改一个设置如下：

6.兼容性设置

在设置-->运行时-->兼容性标志  中设置其值为nodejs\_compat

![图片](/images/blog/tutorials/9.jpg)

7\. 接着重新部署这个项目

![图片](/images/blog/tutorials/10.jpg)

然后访问该项目分配的域名地址

![图片](/images/blog/tutorials/11.jpg)

输入密码后，我们就能够正常的看到各种视频啦！

![图片](/images/blog/tutorials/12.jpg)

访问地址如下：<https://moontv-f1z.pages.dev/>

访问密码123456，想直接看的朋友可以直接用这个域名！

在moontv部署完成后，我们接下来在手机上/电视上安装OrionTV

## OrionTV

## 一、概述

项目地址：<https://github.com/zimplexing/OrionTV>

apk地址：<https://pan.quark.cn/s/ee02d3f9baf0>

OrionTV是一个跨平台的播放器，它可以支持Apple tv也能够支持Android tv，它的宗旨是提供流畅的视频观看体验！

## 二、特征

1.跨平台支持：可以在Apple tv和Android tv上运行；

2.性能卓越，它基于Expo、React Native TVOS 和 TypeScript 构建；

3.专为TV优化UI；

## 三、安装和配置

由于我手头没有电视机，所以这里我以我本地的模拟器为例进行安装和配置

1.安装后启动如下

![图片](/images/blog/tutorials/14.jpg)

2.设置

点击上图右上角的小齿轮，进入设置页面把前面步骤中安装得到的<https://moontv-f1z.pages.dev/贴进去，如图>

![图片](/images/blog/tutorials/15.jpg)

![图片](/images/blog/tutorials/16.jpg)

![图片](/images/blog/tutorials/17.jpg)

到这里我们就把在电视上的安卓apk和配置都设置好了，现在我们就可以愉快的观影了！

![图片](/images/blog/tutorials/18.jpg)

![图片](/images/blog/tutorials/19.jpg)

## **最后**

好了，对于之前一些朋友说的实现电视机的观影自由，这里就达成了！
另外：大家一定要注意MoonTV官方最新版本已经改了，并不支持cloudflare进行部署，我这里部署成功是使用的一个老版本，也就是我在MoonTV部署过程中设置的那个cloudflare代码分支版本！

希望这篇文章对您有所收获，请不要吝惜您的支持——**点赞、转发、在看**，都是对我最大的鼓励与认可。

感谢您的陪伴与共鸣，让我们共同期待更多优秀的作品诞生！
