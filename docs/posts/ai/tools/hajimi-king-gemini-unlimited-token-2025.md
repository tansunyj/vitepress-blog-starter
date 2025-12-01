---
title: 2025本地批量获取Gemini无限token神器Hajimi King（700+star开源项目，一键扫描GitHub泄露密钥）
description: 2025最新最强Gemini无限次数神器Hajimi King！700+star开源项目，5分钟本地部署，自动扫描GitHub全站泄露的Gemini API Key，每天轻松获取几十上百个有效token！支持代理轮换+断点续传+智能过滤，彻底告别Gemini每日50次限制，实测DeepSeek、Gemini 2.5 Pro无限畅玩！
date: 2025-12-01 18:46:34
author: 杰哥
cover: /images/covers/cover-article-1764583240228.jpg
tags:
  - AI
  - 搭建
  - 教程
  - 白嫖
category: "blog"

---

您好，我是Hellos AI，一个10年+互联网从业者，现在专注于自媒体。希望我的文章能够为您带来更多精彩。如果您觉得我的文章对您有帮助，可以关注、点赞，谢谢！

![图片](/images/ai/tools/2.jpg)

我个人经常会使用gemini、deepseek之类的来处理工作和生活中的一些小问题，但是在使用gemini时经常会受到它每日次数限制的问题，那有没大量的这种gemini token可以供我使用呢？

答案是有的，这里我介绍一种能够在本地来批量获取一些gemini token的方法。

## Hajimi King简介

## 一、网址

<https://github.com/GakkiNoOne/hajimi-king>

## 二、概要

这是一个可以通过在github上扫描各种开源项目而获得gemini token的开源项目，它使用python开发而成并且在github上已经有了700+的star和230多的fork！

## 三功能

该项目的最主要核心功能如下

### a.搜索gemini token：基于自定义查询表达式搜索github中一些开源代码中的api密钥；

### b.代理支持：支持多轮代理轮换，提高访问稳定性和成功率；

### c.增量扫描：支持断点续传，避免重复扫描已处理的文件；

### d.智能过滤：自动过滤文档、示例、测试文件，专注有效代码；

### e.外部同步：支持向gemini-balancer和gpt-load同步发现的密钥；

想要通过这个开源项目获得大量的gemini token，那么我们就需要在本地或者服务器上部署它！下面我们来看看吧

## Hajimi King部署

## 一、检查本地环境

1.检查git(可选安装)

如下您不想安装git，那这个步骤可以略过；

如果想安装git，那么可以在网站<https://git-scm.com/downloads下载对应的安装包，安装即可；>

2.检查python(必须安装)

在<https://www.python.org/downloads/上下载对应的版本并安装即可；>

安装完毕后检查python sdk如下：

```
E:\一些开源项目>py
```

3.检查uv组件(必须安装)

```
E:\一些开源项目>py -m pip install uv
```

安装好之后，在环境吧变量中设置如下（就是把scripts添加进来）：

![图片](/images/ai/tools/5.jpg)

## 二、下载源码

```
E:\一些开源项目>git clone https://github.com/GakkiNoOne/hajimi-king.git
```

## 三、项目配置

复制文件env.example成.env并配置如下：

我们需要在<https://github.com/settings/tokens中创建token>

![图片](/images/ai/tools/6.jpg)

```
## GitHub API tokens配置 (逗号分隔)
```

复制queries.example并取名queries.txt如下：

```
# GitHub搜索查询配置文件
```

安装依赖

```
## 执行如下命令
```

## 四、运行

运行当前的项目

```
2025-08-24 10:35:52,854 | INFO | GPT_LOAD_SYNC_ENABLED: False
```

执行中它扫描到的gemini token如下：

![图片](/images/ai/tools/7.jpg)

把这些日志中这种VALID关键词的行都过滤出来，后面的这种一大串字符串就是gemini的token了!**最后**

好了，教程到此结束。从现在起，Gemini 的每日用量限制，对您来说或许将成为一个过去式。

您掌握的不再仅仅是一套部署流程，而是一种能够持续获取 AI 生产力燃料的能力。这感觉如何？是不是棒极了！

希望这篇文章对您有所收获，请不要吝惜您的支持——**点赞、转发、在看**，都是对我最大的鼓励与认可。

感谢您的陪伴与共鸣，让我们共同期待更多优秀的作品诞生！
