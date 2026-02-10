---
title: 【手把手教程】openclaw安装、创建skills的3种姿势！
description: 【手把手教程】openclaw安装、创建skills的3种姿势！
date: 2026-02-10 11:31:57
author: Hellos AI
cover: /images/covers/cover-article-1770690700079.png
tags:
  - "爬取文章"
  - openclaw
  - 效率
  - ai智能体
  - 搭建
  - 教程
  - AI
  - 工具
  - hellosAI公众号
category: "blog"

---

![Image](/images/ai/agent/article-1770690700079/1.jpg)***您好，我是Hellos AI，擅长AI编程、分享AI工具资讯等，立志让更多普通人了解AI、学会AI，利用AI找到人生的第二曲线。***[【手把手教程】自定义docker镜像安装openclaw图文教程](https://mp.weixin.qq.com/s?__biz=MzUyMjEyMDcyOQ==\&mid=2247499561\&idx=1\&sn=6deaa1925926d958d8f09f07bf912eb5\&scene=21#wechat_redirect)

[我实现了在clawdbot中用嘴创建skills并发布微信公众号文章！](https://mp.weixin.qq.com/s?__biz=MzUyMjEyMDcyOQ==\&mid=2247499531\&idx=1\&sn=37e246f33a2ee803a3ce8d6a8ee71547\&scene=21#wechat_redirect)

[【手把手教程】docker安装moltbot图文教程](https://mp.weixin.qq.com/s?__biz=MzUyMjEyMDcyOQ==\&mid=2247499511\&idx=1\&sn=1304e21f729c192a80f31e91941f4a6b\&scene=21#wechat_redirect)

当我们的openclaw安装好了，但是它还没办法给我们来做事，那该怎么办呢？

我们可以给它安装各种skills！

那该如何安装呢？这里我介绍几种方法！

创建skills的方法见我前几天的文章，这里就不再废话了！

**0\*\*\*\*1****方法1：安装官方仓库skill**

这里，我们可以打开左侧skills菜单，然后找到目标skill，然后点击安装，如：

![图片](/images/ai/agent/article-1770690700079/2.jpg)

右侧有安装按钮，安装后显示如：

![图片](/images/ai/agent/article-1770690700079/3.jpg)

好了，现在已经安装好了，那么我们就可以指挥它给我来干活了，如：

![图片](/images/ai/agent/article-1770690700079/4.jpg)

![图片](/images/ai/agent/article-1770690700079/5.jpg)

![图片](/images/ai/agent/article-1770690700079/6.jpg)

然后，我就在我的外挂目录底下找到这个git项目啦！

![图片](/images/ai/agent/article-1770690700079/7.jpg)**0\*\*\*\*2****方法2：安装开源skills**

例如我在github上找到了一个开源的skills，那么我可以通过如下的2种方法来安装skills，如：

**&#x30;****1****&#x901A;过聊天安装**

例如我发现github中skill-seekers用来搜索skills非常好用，我想安装它，如：

![图片](/images/ai/agent/article-1770690700079/8.jpg)

![图片](/images/ai/agent/article-1770690700079/9.jpg)

然后在本地文件夹底下，我就看到了它安装的skills，如：

![图片](/images/ai/agent/article-1770690700079/10.jpg)

测试效果：

![图片](/images/ai/agent/article-1770690700079/11.jpg)

![图片](/images/ai/agent/article-1770690700079/12.jpg)

![图片](/images/ai/agent/article-1770690700079/13.jpg)**&#x30;****2****&#x4E0B;载代码安装**

不想让它在安装skills方面消耗大量token，我们也可以把skills下载到本地然后剪切到/home/node/.openclaw/workspace/skills/文件夹下，如：

![图片](/images/ai/agent/article-1770690700079/14.jpg)

![图片](/images/ai/agent/article-1770690700079/15.jpg)

我把文件夹剪切到E:\docker\openclaw\_custom\data\workspace\skills文件夹底下如：

![图片](/images/ai/agent/article-1770690700079/16.jpg)

好了，接着我们需要看看openclaw是否可以动态加载和发现这个skill，如：

![图片](/images/ai/agent/article-1770690700079/17.jpg)

![图片](/images/ai/agent/article-1770690700079/18.jpg)

非常好，这种复制进去也可以动态识别，省的我们像某些软件加载一些东西还要重启的那种尴尬！

**0\*\*\*\*3****写在最后**

好了，上面这些是在openclaw上生成和安装skill的方式，你学会了吗？既然通过聊天、或者在线的方式都可以创建、安装skills，那么剩下的事情就比较简单，重点就是如何开发或者迭代我们的skills了！

另欢迎大家来我的个人博客网站<https://hellosai.cc/逛逛！>**关注杰哥不迷路**，每天给你分享不一样的实用好工具。

免责声明：本公众号分享的内容以及软件等来自互联网，仅供大家学习交流，同时请遵守你当地的法律法规，否则造成的一切后果自负，与本公众号无关。如有侵权联删！部分知识难免有时效性，若内容过期失效，请见谅,感谢！

******喜欢这篇干货？如果觉得不错，请帮我一键三连，转发给您的朋友，都是对我最大的鼓励与认可。******如果想第一时间收到推送，可以把我的公众号加个星标🌟方便后面我们一起探讨AI或有意思的东西，还能够快速找到我！我们明天见！******—*****END*****—******图 | 来源网络侵删******欢迎点赞，在看，转发给我鼓励\~******👇👇关注我👇👇******👇👇扫码加入粉丝群领取福利👇👇***
