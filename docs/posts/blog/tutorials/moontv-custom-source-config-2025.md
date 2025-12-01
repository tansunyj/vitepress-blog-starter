---
title: 2025MoonTV自定义添加影视资源教程：轻松解决官方不让加源问题（config.json一键修改）
description: MoonTV官方不让加资源？2025最新最全破解玩法！手把手教你直接修改config.json永久添加如意、天涯、暴风、虎牙、非凡等任意影视源，GitHub在线编辑1分钟生效+本地git提交双方法，配合Cloudflare Pages自动部署，彻底拥有无限片源私人影院！
date: 2025-12-01 18:08:05
author: 杰哥
cover: /images/covers/cover-article-1764583209670.jpg
tags:
  - 搭建
  - 网站
  - 私人影院
  - 教程
category: "blog"

---

您好，我是Hellos AI，一个10年+互联网从业者，现在专注于自媒体。希望我的文章能够为您带来更多精彩。如果您觉得我的文章对您有帮助，可以关注、点赞，谢谢！

[3分钟搭建一个私人影院：实现观影自由](https://mp.weixin.qq.com/s?__biz=MzUyMjEyMDcyOQ==\&mid=2247492138\&idx=1\&sn=87fdf5c1b4242b35ae77746a3c4cedda\&scene=21#wechat_redirect)

[3分钟搭建一个私人影院：实现手机端/电视端观影自由](https://mp.weixin.qq.com/s?__biz=MzUyMjEyMDcyOQ==\&mid=2247492162\&idx=1\&sn=42b29585bada37ddba6fe1c53d7fc9f5\&scene=21#wechat_redirect)

[3分钟搭建一个私人影院：实现观影自由2](https://mp.weixin.qq.com/s?__biz=MzUyMjEyMDcyOQ==\&mid=2247492186\&idx=1\&sn=d42cd3291fca5ddbed73adddf8765b42\&scene=21#wechat_redirect)

[3分钟搭建一个私人影院MoonTV：实现手机、电视端观影自由2](https://mp.weixin.qq.com/s?__biz=MzUyMjEyMDcyOQ==\&mid=2247492222\&idx=1\&sn=1aab973ee094e9f3b6092458b26100f4\&scene=21#wechat_redirect)

![图片](/images/blog/tutorials/2.jpg)

在前面的文章中我介绍过LibreTV也介绍过MoonTV，它们当前各有优缺点。

## 类型

LibreTV

MoonTV

优点

1.代码开源；2.灵活，可以自行添加视频采集点；3.可以在电脑端、手机浏览器端使用；4.包含电影、电视节目；5.支持搜索；

1.代码开源；2.可以使用到OrionTV作为源数据，在手机app、安卓电视中使用；3.可以在电脑端、手机浏览器端使用；4.除了电影、电视还包含综艺节目；5.支持搜索

缺点

不能在电视端移动端使用

不能添加数据采集点

那么作为开源软件的MoonTV确实不能添加视频采集点了嘛？

答案是否定的，下面我们一起来看看怎么在MoonTV中添加自己的视频采集点！

## 如何改

## 一、分析

项目地址：<https://github.com/tansunyj/MoonTV>

在MoonTV的功能特征中原作者说MoonTV内置了十数种免费的资源站点，嗯，这个信息很重要！

![图片](/images/blog/tutorials/4.jpg)

而我们在访问MoonTV内的视频节目时，它也会显示说什么如意资源、暴风资源、天涯资源等等，如下

![图片](/images/blog/tutorials/5.jpg)

## 二、源码

我们把这个项目下载到本地，这里有2种下载方式，1.下载zip压缩包；2.git命令下载；

例如我们使用最简单的方式下载zip包：

![图片](/images/blog/tutorials/6.jpg)

![图片](/images/blog/tutorials/7.jpg)

我们在当前源代码种按照前面步骤种分析得到的一些关键词：如意资源、天涯资源、暴风资源等等在源代码中进行搜索，最终它们指向了一个共同的文件——config.json

注：当然作者我是在开发工具visual studio code中进行搜索的，您自己的话记住改这个文件就好了，不需要安装visual studio code!

我们使用文本工具打开后检查这个文件，该文件详细内容如下：

![图片](/images/blog/tutorials/8.jpg)

## 三、修改

例如：我们自己通过某些渠道找到了一个资源，我想把这个资源加到config.json文件中，这里编辑和上传该文件有2种方式，这里我分别介绍如下：

### 方式1：直接在github上修改（推荐）

#### 1.分支

![图片](/images/blog/tutorials/9.jpg)

#### 2.config.json

![图片](/images/blog/tutorials/10.jpg)

#### 3.点击该文件，进入查看文件页面

![图片](/images/blog/tutorials/11.jpg)

#### 4.点击右上角的铅笔图标编辑它

![图片](/images/blog/tutorials/12.jpg)

例如我把这个如意资源复制了一份，改了一下名字，如果说添加多个资源采集点，可以如法炮制，在这里一次性弄多行就可以了！

最后点击右上角的绿色按钮保存

![图片](/images/blog/tutorials/13.jpg)

点击底下的commit changes后cloudflare会自动部署当前代码

#### 5.部署

cloudflare会自动监听github的代码变更，并自动构建和发布

![图片](/images/blog/tutorials/14.jpg)

待cloudflare部署好之后，我们回到MoonTV，检查同样的资源采集点名称，发现添加成功，如下：

![图片](/images/blog/tutorials/15.jpg)

到这里，我们就完成了自行添加资源采集点！

### 方式2：在本地编辑后上传到github项目中

这个方法会稍微简单一些，但是需要您本地电脑安装了git，并且您还要知道对应的一些命令，详细命令如下：

```
## 添加需要上传的文件
```

注：这里方法2适合于一些有一定技术能力的朋友！

**最后**

好了，对于这个MoonTV如何来添加自己的视频资源采集点详细操作方法就介绍到这里了！

这样您就能够享受到MoonTV带来的优点，同时也能够手动弥补它暂时无法添加视频资源采集点的小问题了。

希望这篇文章对您有所收获，请不要吝惜您的支持——**点赞、转发、在看**，都是对我最大的鼓励与认可。

感谢您的陪伴与共鸣，让我们共同期待更多优秀的作品诞生！
