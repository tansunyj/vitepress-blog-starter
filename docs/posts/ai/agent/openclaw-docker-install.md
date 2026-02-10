---
title: 【手把手教程】docker安装moltbot图文教程
description: 【手把手教程】docker安装moltbot图文教程
date: 2026-02-10 11:29:44
author: Hellos AI
cover: /images/covers/cover-article-1770690691440.png
tags:
  - "爬取文章"
  - openclaw
  - 工具
  - 教程
  - 搭建
  - hellosAI公众号
category: "blog"

---

![Image](/images/ai/agent/article-1770690691440/1.jpg)***您好，我是Hellos AI，擅长AI编程、分享AI工具资讯等，立志让更多普通人了解AI、学会AI，利用AI找到人生的第二曲线。***

这几天各社交媒体平台上clawdbot/moltbot刷屏了，到处都是使用它来各种用嘴干活的视频，那很多人也想跃跃欲试。

这里你遇到的第一个难关就是——如何部署它呢？

网上有很多教程，这些朋友安装也都很顺利，直接就一通到底，那如果说在安装过程中遇到1006、1008之类的错误，又该怎么办呢？

下面，我将把我的安装过程详细的记录下来，以便大家参考！

**0\*\*\*\*1****moltbot**

这个工具本来叫clawdbot，在火爆之后被claude告了，然后现在改名叫moltbot，今天发现又改名叫openclaw了。

官网：<https://www.molt.bot/>

官方仓库：<https://github.com/moltbot/moltbot>

视频安装教程：

官方docker镜像：moltbot/moltbot

安装命令：

windows：iwr -useb <https://molt.bot/install.ps1> | iex

npm: npm i -g clawdbot

linux:curl -fsSL <https://molt.bot/install.sh> | bash -s -- --install-method git

**0\*\*\*\*2****docker安装**

这里我选择docker安装，过程如下：

**&#x30;****1****&#x6784;建ps脚本**

如下脚本会拉取github官方仓库，然后自定义镜像，接着进行构建！

脚本代码如下：

![图片](/images/ai/agent/article-1770690691440/2.jpg)**&#x30;****2****&#x5B9A;义镜像**

接着再Dockerfile中对镜像进行如下定义：

![图片](/images/ai/agent/article-1770690691440/3.jpg)**&#x30;****3****&#x914D;置docker-compose.yml**

接着定义docker-compose.yml，如：

![图片](/images/ai/agent/article-1770690691440/4.jpg)**&#x30;****5****&#x6784;建镜像**

然后在powershell中执行build.ps1脚本构建镜像，如：

![图片](/images/ai/agent/article-1770690691440/5.jpg)

镜像构建成功，然后，我们可以启动容器了！

**&#x30;****6****&#x542F;动容器**

在命令行中执行命令：docker-compose up -d，结果如下：

![图片](/images/ai/agent/article-1770690691440/6.jpg)

![图片](/images/ai/agent/article-1770690691440/7.jpg)**&#x30;****7****&#x6D4F;览器访问**

然后点击18789:18789就可以正式进入浏览器访问模式了，如：

![图片](/images/ai/agent/article-1770690691440/8.jpg)

这里就进入了我遇到的这种头疼的问题。。。这个就是request id没有授权导致的。request\_id这个东西可以在F12中看到它，然后在docker中执行命令，让moltbot接受这个request\_id，如：

![图片](/images/ai/agent/article-1770690691440/9.jpg)

```
moltbot devices approve 0baaf519-19d0-43c7-ac49-589f733e2635
```

执行结果如下：

![图片](/images/ai/agent/article-1770690691440/10.jpg)

Approved之后web页面就不会报告1008错误了！

**&#x30;****8****&#x8BBE;置模型auth**

但是此时，我们还不能聊天，我们还需要继续设置大模型的auth，这里在web页面中是没法直接设置的，我们需要在docker中执行如下命令，如：

![图片](/images/ai/agent/article-1770690691440/11.jpg)

授权之后，我们在chat菜单中就可以跟openclaw（也就是clawdbot）聊天了！

![图片](/images/ai/agent/article-1770690691440/12.jpg)**&#x30;****9****&#x8BBE;置TG**

那么接下来，我们也可以设置一下TG，例如我还是在docker中运行

./openclaw\.mjs configure命令，如下：

![图片](/images/ai/agent/article-1770690691440/13.jpg)

这里选择channels菜单，然后我们可以回车，接着配置TG。。

![图片](/images/ai/agent/article-1770690691440/14.jpg)

![图片](/images/ai/agent/article-1770690691440/15.jpg)

这里在TG中随便发送一个消息就一会弹出要求进行配对的回答，这里我们要在openclaw中执行命令：openclaw pairing approve telegram Q97GDRFS，执行结果如下：

![图片](/images/ai/agent/article-1770690691440/16.jpg)

好了openclaw跟TG配对成功了，接着就可以愉快的聊天啦！

![图片](/images/ai/agent/article-1770690691440/17.jpg)

好了，现在我们的openclaw以docker就搭建完成啦！

**0\*\*\*\*3****写在最后**

好了，这就是我在docker中搭建openclaw的全过程啦！

对openclaw有兴趣的朋友，我们可以多讨论讨论哈！

需要build.ps1、Dockerfile、docker-compose.yml的朋友可以关注我哈！

另欢迎大家来我的个人博客网站<https://hellosai.cc/逛逛！>**关注杰哥不迷路**，每天给你分享不一样的实用好工具。

免责声明：本公众号分享的内容以及软件等来自互联网，仅供大家学习交流，同时请遵守你当地的法律法规，否则造成的一切后果自负，与本公众号无关。如有侵权联删！部分知识难免有时效性，若内容过期失效，请见谅,感谢！

******喜欢这篇干货？如果觉得不错，请帮我一键三连，转发给您的朋友，都是对我最大的鼓励与认可。******如果想第一时间收到推送，可以把我的公众号加个星标🌟方便后面我们一起探讨AI或有意思的东西，还能够快速找到我！我们明天见！******—*****END*****—******图 | 来源网络侵删******欢迎点赞，在看，转发给我鼓励\~******👇👇关注我👇👇******👇👇扫码加入粉丝群领取福利👇👇***
