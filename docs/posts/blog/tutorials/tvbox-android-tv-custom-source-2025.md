---
title: 2025电视端私人影院最强方案：TVBox自建无限片源（支持安卓TV/海信/投影仪，秒换几百个源）
description: 2025最强电视端影视APP TVBox全版本+最简单配置教程！无需MoonTV/OrionTV复杂操作，一键导入现成m.json或自建无限片源（ikun/暴风/非凡/虎牙随意加），支持安卓电视盒子、海信VIDAA、投影仪，纯本地配置永不失效，真正的电视观影自由终极闭环！
date: 2025-12-01 18:54:44
author: 杰哥
cover: /images/covers/cover-article-1764583245313.jpg
tags:
  - 搭建
  - 私人影院
  - 网站
  - 教程
  - hellosAI公众号
category: "blog"

---
![图片](/images/blog/tutorials/1.jpg)

您好，我是Hellos AI，一个10年+互联网从业者，现在专注于自媒体。希望我的文章能够为您带来更多精彩。如果您觉得我的文章对您有帮助，可以关注、点赞，谢谢！

[3分钟搭建一个私人影院：实现观影自由](https://mp.weixin.qq.com/s?__biz=MzUyMjEyMDcyOQ==\&mid=2247492138\&idx=1\&sn=87fdf5c1b4242b35ae77746a3c4cedda\&scene=21#wechat_redirect)

[3分钟搭建一个私人影院：实现手机端/电视端观影自由](https://mp.weixin.qq.com/s?__biz=MzUyMjEyMDcyOQ==\&mid=2247492162\&idx=1\&sn=42b29585bada37ddba6fe1c53d7fc9f5\&scene=21#wechat_redirect)

[3分钟搭建一个私人影院：实现观影自由2](https://mp.weixin.qq.com/s?__biz=MzUyMjEyMDcyOQ==\&mid=2247492186\&idx=1\&sn=d42cd3291fca5ddbed73adddf8765b42\&scene=21#wechat_redirect)

[3分钟搭建一个私人影院MoonTV：实现手机、电视端观影自由2](https://mp.weixin.qq.com/s?__biz=MzUyMjEyMDcyOQ==\&mid=2247492222\&idx=1\&sn=1aab973ee094e9f3b6092458b26100f4\&scene=21#wechat_redirect)

在我前面的文章中有说自己搭建web类型的私人影院，配置OrionTV实现手机端、电视端私人影院，但是OrionTV背后的MoonTV想实现灵活的视频源采集点配置不是那么容易。

那有没有那种可以灵活配置视频源的电视端应用呢？答案是有的，这里我给大家介绍一种可以支持灵活配置的电视端应用——TVBox！

![图片](/images/blog/tutorials/2.jpg)

## TVBOX简介

## 一、概要

TVBox是一款基于开源项目tvmovie修改后发布的影视APP，它本身是一个空壳，不包括任何视频采集点数据，需要我们个人配置视频源后才能使用。

## 二、特点

1.开源、免费；2.兼容性好；3.完美移植了"猫影视TV"的核心功能；

## 三、下载地址夸克地址：<https://pan.quark.cn/s/5ce7117e74bb>

![图片](/images/blog/tutorials/3.jpg)

说明如下：1.arm64适配当前主流的电视盒子；2.armeabi适配于老旧低端盒子；3.generic适配于通用盒子；4.hisense适配于海信电视盒子；5.带java关键字的是java纯净版、体积小；6.带python关键字的是python版体积大，但是高级功能会多一些；

![图片](/images/blog/tutorials/4.jpg)

## 安装配置

## 一、安装

对于安卓电视，我们可以安装TVBox\_takagen99\_20250706-1456-arm64-generic-python.apk：a.generic表示它是通用安装包，不是那种仅适配海信电视的；b.arm64表示它是比较新电视盒子的安装包；c.python表示它是具备较多高级功能的包；

安装后界面显示如下

![图片](/images/blog/tutorials/5.jpg)

注：由于我这没有电视机，所以这个app就暂时安装到了模拟器上；

## 二、配置(最简单的配置方法)

最简单的配置方法，按照我截图所示来配置即可

资源采集点地址：

```
https://ghcy.eu.org/https://raw.githubusercontent.com/cyao2q/files/master/m.json
```

### 步骤1：点击右上角的小齿轮图标

![图片](/images/blog/tutorials/6.jpg)

### 步骤2：点击页面顶部的配置地址

![图片](/images/blog/tutorials/7.jpg)

### 步骤3：在那个二维码右边红色框内填写前面的那个链接地址

![图片](/images/blog/tutorials/8.jpg)

### 步骤4：点击右下角"确定"按钮

![图片](/images/blog/tutorials/9.jpg)

### 步骤5：以上步骤都配置好了之后，接着我们就可以回到首页，愉快的看视频啦！

![图片](/images/blog/tutorials/10.jpg)

![图片](/images/blog/tutorials/11.jpg)

![图片](/images/blog/tutorials/12.jpg)

## 三、可选配置方法

注：该方法只适合于对软件的开发有一定基础的朋友，对于用电脑不是那么熟悉的朋友来说会有一些难度！

### 步骤1：找到数据采集接口

我前面的文章中列举了[一些数据采集网站](https://mp.weixin.qq.com/s?__biz=MzUyMjEyMDcyOQ==\&mid=2247492162\&idx=1\&sn=42b29585bada37ddba6fe1c53d7fc9f5\&scene=21#wechat_redirect)，打开那些网站后，可以按照下面的方法进行

例如，我打开ikun资源的站点，发现它们有多种格式的视频资源采集接口

<https://www.ikunzy.com/ikun/help.html>

![图片](/images/blog/tutorials/13.jpg)

我找到里面一种，例如说xml格式的接口地址<https://ikunzyapi.com/api.php/provide/vod/at/xml，接下来我们进行配置：>

### 步骤2：自定义tvbox源地址，这里就需要一个工具：<https://www.xyba.cn/tvboxtool，下面我们就来配置它>

#### 1.例如上面我们复制了xml格式的接口地址<https://ikunzyapi.com/api.php/provide/vod/at/xml备用，接着在这个tvboxtool中我们这样来使用；>

#### 2.配置

![图片](/images/blog/tutorials/14.jpg)

如法炮制，我们可以再添加一个暴风资源站点

![图片](/images/blog/tutorials/15.jpg)

#### 步骤3：导出tvboxtool中的配置

![图片](/images/blog/tutorials/16.jpg)

点击页面顶部的"保存"按钮，会弹出一个小对话框，选择"复制到剪贴板"就能把那些内容都复制出来了，如下：

```
{
```

上面的这一大段内容需要保存到一个json文件中，如：

![图片](/images/blog/tutorials/17.jpg)

#### 步骤4：本地启动一个http服务

如何启动一个http服务，我们可以询问ai，例如：

![图片](/images/blog/tutorials/18.jpg)

启动本地http服务器：

![图片](/images/blog/tutorials/19.jpg)

得到访问链接<http://192.168.0.104:8000/myown.json，访问结果如下：>

![图片](/images/blog/tutorials/20.jpg)

#### 步骤5：

这里就是在电视上（博主我这里是模拟器）的APP中设置链接了，操作步骤跟前面方法一完全相同了！

例如

![图片](/images/blog/tutorials/21.jpg)

![图片](/images/blog/tutorials/22.jpg)

注：使用自定义的视频采集点站点，那么就需要自己好好找和配置了，因为有一些资源站点它的视频不是那么多！

![图片](/images/blog/tutorials/23.jpg)

## **最后**

好了终于把一些朋友关注的能够自行配置安卓电视的手把手教程都完成了！通过这篇文章中最简单的那种配置方法，您就可以自定义您自己的视频资源站点，那么也就是实现了电视端观影自由啦！

希望这篇文章对您有所收获，请不要吝惜您的支持——**点赞、转发、在看**，都是对我最大的鼓励与认可。

感谢您的陪伴与共鸣，让我们共同期待更多优秀的作品诞生！
