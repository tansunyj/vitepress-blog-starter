---
title: 2025零成本搭建个人无广告影视网站：LibreTV+VerceI一键部署（纯前端永久免费）
description: 2025最新纯前端无广告影视聚合神器LibreTV！无需服务器、无需备案、5分钟Vercel一键部署，永久免费拥有私人影院，支持手机电脑同步观看！已内置虎牙+非凡+豆瓣热播资源，彻底告别开屏广告、会员弹窗、强制登录，真正的观影自由！
date: 2025-12-01 17:39:02
author: 杰哥
cover: /images/covers/cover-article-1764580181499.jpg
tags:
  - 搭建
  - 网站
  - hellosAI公众号
  - 教程
category: "blog"

---

您好，我是Hellos AI，一个10年+互联网从业者，现在专注于自媒体。希望我的文章能够为您带来更多精彩。如果您觉得我的文章对您有帮助，可以关注、点赞，谢谢！

![图片](/images/blog/tutorials/2.jpg)

当我们打开一些视频网站想放松一下享受片刻的闲暇时，开屏广告、视频中广告还有一些会员专属会打断我们的观影体验；

当我们看一些视频时，动不动就要注册/登陆或者会员专属，把勾起的兴致瞬间浇灭；

那么有没有一个能够免费的视频网站能够规避掉满屏的广告并且不需要注册/登陆就能实现我们观影自由呢？

答案是有的，我们可以使用LibreTV搭建我们自己专属的影视网站。下面描述LibreTV的搭建过程非常适合于普通人来操作，让你免费拥有海量视频资源，实现看片自由！

## LibreTV

## 一、概述

对于我们一般人来说，可能想象的是一个视频网站那可是无数的视频资源，那可得多大呀，而实际上，它可以很小，这个LibreTV就是一个纯前端技术开发得开源视频聚合平台。

我们可以在LibreTV里面随意搜索我们想要得东西，无需注册/完全免费，想看就看，并且还支持多种访问方式（电脑、手机）

## 二、特点

### 1.不需要在不同的网站之间跳跃；

### 2.一个纯前端应用，资源占用少，运行速度快；

### 3.纯净无广告，无需注册；

### 4.轻松添加最佳播放资源；

## 三、地址

代码：<https://github.com/yangjerry2025/LibreTV>

## 搭建

在我们已经拥有一个github项目的前提下，我们可以按照我之前的文章描述的步骤来搭建这个项目。[白嫖vercel.com部署前端项目](https://mp.weixin.qq.com/s?__biz=MzUyMjEyMDcyOQ==\&mid=2247492095\&idx=1\&sn=3ca4e5c8f625d8bfeddc3b98c3d29bb5\&scene=21#wechat_redirect)(注：每个vercel免费账号只能添加5个项目)

### 一、打开vercel个人看板

<https://vercel.com/>

![图片](/images/blog/tutorials/5.jpg)

### 二、新建项目

![图片](/images/blog/tutorials/6.jpg)

选择底下红色框内的"Select repositories"，从里面选择这个LibreTV

![图片](/images/blog/tutorials/7.jpg)

![图片](/images/blog/tutorials/8.jpg)

选择好之后，点击底下绿色的"Save"按钮，效果如下

![图片](/images/blog/tutorials/9.jpg)

### 三、设置vercel

点击上图红色框中的"Import"进入设置页面

![图片](/images/blog/tutorials/10.jpg)

接着点击黑色的"Deploy"按钮进行项目的部署，很快就部署完毕，接着我们回到个人项目看板

![图片](/images/blog/tutorials/11.jpg)

![图片](/images/blog/tutorials/12.jpg)

注：如果我们想要该视频网站访问时输入密码，那么我们可以在Settings-->Environment Variables 中添加环境变量，如下图

![图片](/images/blog/tutorials/13.jpg)

注：我在发布当前文章时已经删除了这个密码，所以大家如果访问底下的链接，那么就不需要密码了！

## 体验

## 设置

访问<https://libre-tv-zeta-sooty.vercel.app/，如下：>

![图片](/images/blog/tutorials/15.jpg)

![图片](/images/blog/tutorials/16.jpg)

这里我们需要点击右上角的设置图标，设置资源，添加一些自定义API，如下：

### 1.添加自定义API

虎牙资源：

名称随意

地址：<https://www.huyaapi.com/api.php/provide/vod/from/hyyun/at/xml>

非凡资源：

名称随意

地址：<https://svip.ffzyplay.com/?url=>

### 2.数据源：全部选上

![图片](/images/blog/tutorials/17.jpg)

打开"豆瓣热门推荐"然后就能看到页面主体中刷新出大量视频了！

![图片](/images/blog/tutorials/18.jpg)

这是我们就能愉快的观影了！例如我们打开"浪浪山小妖怪"

![图片](/images/blog/tutorials/19.jpg)

![图片](/images/blog/tutorials/20.jpg)

![图片](/images/blog/tutorials/21.jpg)

## **最后**

这个搭建过程是不是很简单呢？有手就行，不用花一分钱，我们就拥有了自己的私人影院！

当然了这个私人影院最重要的是找到一些影视资源添加到自定义API中，有了这些，我们就能实现观影自由啦！

希望这篇文章对您有所收获，请不要吝惜您的支持——**点赞、转发、在看**，都是对我最大的鼓励与认可。

感谢您的陪伴与共鸣，让我们共同期待更多优秀的作品诞生！
