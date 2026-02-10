---
title: 【n8n教程】google OAuth client创建
description: 【n8n教程】google OAuth client创建
date: 2026-02-10 10:54:49
author: Hellos AI
cover: /images/covers/cover-article-1770690586031.png
tags:
  - "爬取文章"
  - n8n
  - 教程
  - ai智能体
  - 效率
  - 工具
category: "blog"

---

![Image](/images/ai/workflow/article-1770690586031/1.jpg)***您好，我是Hellos AI，擅长AI编程、分享AI工具资讯等，立志让更多普通人了解AI、学会AI，利用AI找到人生的第二曲线。***

因为我的取名网站已经在pinterest上进行推广了，不过现在起步阶段每天发的pin数量少，人工发，后续数量多了肯定不能这么做，所以我需要实现一个工作流来自动化的做这个事情！

我已经使用windsurf生成了大量的pin，后续肯定需要使用n8n工作流来做这个事情，不过现在当务之急是把这些pin放到一个地方以便n8n工作流可以很容易的进行读取，这里我选择的是google sheet！

那我就面临着一个问题——我的n8n工作流需要能够在线读取google sheet！

接下来，我将分几期来详细说说这个过程！

这一期暂且只介绍google sheet的注册！

**0\*\*\*\*1****google sheet注册**

想要使用google sheet，那么就需要有一个正常可用的gmail账户，对于gmail注册，可以看我博客文章<https://hellosai.cc/posts/blog/tutorials/antigravity-duo-zhanghao-leidian-jie-ma-2025.html>**&#x30;****1****&#x67;oogle cloud**

打开网址：<https://console.cloud.google.com/welcome，打开后页面显示如下：>

![图片](/images/ai/workflow/article-1770690586031/2.jpg)

这里点击"my first project"可以创建新的项目！

**&#x30;****2****&#x521B;建项目**

点击这个按钮后弹出如下的界面，然后这里可以点击"new project"创建新项目

![图片](/images/ai/workflow/article-1770690586031/3.jpg)

进入如下界面后，填写项目名称，然后就有项目了：

![图片](/images/ai/workflow/article-1770690586031/4.jpg)

然后在如下页面中点击"APIs & Service"。

![图片](/images/ai/workflow/article-1770690586031/5.jpg)

进入如下的页面：

![图片](/images/ai/workflow/article-1770690586031/6.jpg)**&#x30;****3****&#x542F;用google sheet api**

在上图中选择"Library"，然后在搜索框中输入sheet，如：

![图片](/images/ai/workflow/article-1770690586031/7.jpg)

![图片](/images/ai/workflow/article-1770690586031/8.jpg)

在上图搜索框中输入关键词: sheet

![图片](/images/ai/workflow/article-1770690586031/9.jpg)

点击这个卡片，然后打开如下页面：

![图片](/images/ai/workflow/article-1770690586031/10.jpg)

点击"Enable"按钮，启用google sheet API

好了，到这里我们就已经开启了google sheet的API了！然后接下来我们就需要配置和申请google credentials相关的配置了！

**0\*\*\*\*2****申请google credential&#x73;****0****&#x31;\*\*\*\*OAuth Consent Screen**

点击如下截图左侧的OAuth Consent Screen菜单，如：

![图片](/images/ai/workflow/article-1770690586031/11.jpg)

然后进入如下页面：

![图片](/images/ai/workflow/article-1770690586031/12.jpg)**&#x30;****2****&#x521B;建应用**

在这里点击"Get started"按钮，然后进入如下页面填写新建应用的各个表单字段，如：

![图片](/images/ai/workflow/article-1770690586031/13.jpg)

第一步：需要填写应用名称、邮箱，然后点击Next按钮

![图片](/images/ai/workflow/article-1770690586031/14.jpg)

第二步：在当前页面中需要选择External，因为我们本地n8n工作流相对于google cloud来说就是外部应用，然后继续点击Next按钮

![图片](/images/ai/workflow/article-1770690586031/15.jpg)

第三步：这里还是填写邮箱，选自己的gmail邮箱就好了，当然也可以填其他邮箱地址，接着点击Next按钮

![图片](/images/ai/workflow/article-1770690586031/16.jpg)

第四步：这里勾选checkbox，然后点击"Continue"按钮

![图片](/images/ai/workflow/article-1770690586031/17.jpg)

创建：这里点击创建，就完成了一个应用的创建工作！

![图片](/images/ai/workflow/article-1770690586031/18.jpg)

这里可以看到页面底部有一个黑色的toast提示！

**&#x30;****3****&#x521B;建OAuth Client**

前面步骤完成后，就进入如下页面了，如：

![图片](/images/ai/workflow/article-1770690586031/19.jpg)

这里选择"Create OAuth client"，然后继续：

![图片](/images/ai/workflow/article-1770690586031/20.jpg)

在这个页面中，我们需要添加一个授权前转地址，这个地址是从n8n中复制得到的，如下：

![图片](/images/ai/workflow/article-1770690586031/21.jpg)

保存后就创建成功啦，如：

![图片](/images/ai/workflow/article-1770690586031/22.jpg)

在这个截图中这里是clientID，这里需要点击download JSON按钮把clientID、client Secret都下载下来，当然也可以在列表页面中点击编辑，也可以获得client Secret，如：

![图片](/images/ai/workflow/article-1770690586031/23.jpg)

好了，你现在有了clientID、client Secret，不过还不能直接使用，还要在如下页面中把你自己的邮箱添加为测试邮箱，如：

![图片](/images/ai/workflow/article-1770690586031/24.jpg)

然后点击确定，如：

![图片](/images/ai/workflow/article-1770690586031/25.jpg)

这样，就可以在google sheet这个n8n节点中放心的使用啦！

**0\*\*\*\*3****写在最后**

好了，现在我们已经成功的在google cloud中开启了google sheet API，还有获得了OAuth client Secret。后续文章中我将详细的说说怎么样通过google sheet节点来读写在线文档了！

欢迎关注我的后续文章哦！

另欢迎大家来我的个人博客网站<https://hellosai.cc/逛逛！>

我不生产工具，我只是好工具的搬运工。

**关注杰哥不迷路**，每天给你分享不一样的实用好工具。

免责声明：本公众号分享的内容以及软件等来自互联网，仅供大家学习交流，同时请遵守你当地的法律法规，否则造成的一切后果自负，与本公众号无关。如有侵权联删！部分知识难免有时效性，若内容过期失效，请见谅,感谢！

******喜欢这篇干货？如果觉得不错，请帮我一键三连，转发给您的朋友，都是对我最大的鼓励与认可。******如果想第一时间收到推送，可以把我的公众号加个星标🌟方便后面我们一起探讨AI或有意思的东西，还能够快速找到我！我们明天见！******—*****END*****—******图 | 来源网络侵删******欢迎点赞，在看，转发给我鼓励\~******👇👇关注我👇👇******👇👇扫码加入粉丝群领取福利👇👇***
