---
title: 【建议收藏】玩OpenClaw的必装4个Skills！省token还能去AI味
description: 【建议收藏】玩OpenClaw的必装4个Skills！省token还能去AI味
date: 2026-02-10 11:33:31
author: Hellos AI
cover: /images/covers/cover-article-1770690705942.png
tags:
  - "爬取文章"
  - openclaw
  - 工具
  - AI
  - 搭建
  - ai智能体
  - 效率
  - hellosAI公众号
category: "blog"

---

![Image](/images/ai/agent/article-1770690705942/1.jpg)***您好，我是Hellos AI，擅长AI编程、分享AI工具资讯等，立志让更多普通人了解AI、学会AI，利用AI找到人生的第二曲线。***

我一直想找一个能够控制浏览器进行工作的skills，但是一直也没找到合适的，不过呢今天我在找skills时找到几个有用的skills，这里我把发现的这几个skills分享给大家！

**0\*\*\*\*1****降AI味skill&#x73;****0****&#x31;\*\*\*\*简介**

项目地址：<https://github.com/sundial-org/awesome-openclaw-skills/tree/main/skills/humanizer>

功能：

a.它可以识别和修复AI写作的文档；

b.可以去除过度的象征性语言；

c.消除促销语言和陈词滥调；

d.让文字看起来更加像人写；

**&#x30;****2****&#x5B89;装**

我在前面的公众号文章中对这个openclaw如何安装skills做了介绍的，这里就不做详细描述了，想了解的朋友可以看文章：[【手把手教程】openclaw安装、创建skills的3种姿势！](https://mp.weixin.qq.com/s?__biz=MzUyMjEyMDcyOQ==\&mid=2247499587\&idx=1\&sn=9eba010a40d570389096c5affcbac9b3\&scene=21#wechat_redirect)**&#x30;****3****&#x4F7F;用**

这里我们测试一下看看这个skills改造AI生成文本的效果怎么样！

![图片](/images/ai/agent/article-1770690705942/2.jpg)

我把这段文字复制，然后让openclaw对文字进行处理，看看效果到底如何？

![图片](/images/ai/agent/article-1770690705942/3.jpg)**0\*\*\*\*2****自我进化skill&#x73;****0****&#x31;\*\*\*\*self-improvement skills**

项目地址：<https://github.com/sundial-org/awesome-openclaw-skills/blob/main/skills/self-improvement/>

功能：

a.该skills会捕获报错信息；

b.进行知识升级；

c.模式识别、技能提取；

**&#x30;****2****&#x5B89;装**

略。

**&#x30;****3****&#x4F7F;用**

我让这个skills扫描全部的聊天记录，然后让它总结和进化该进化的skills如：

![图片](/images/ai/agent/article-1770690705942/4.jpg)

![图片](/images/ai/agent/article-1770690705942/5.jpg)**0\*\*\*\*3****n8n skills**

然后我还发现了一个非常适合我的skills——n8n相关的skills

**&#x30;****1****&#x6E;8n workflow automation**

项目地址：<https://github.com/sundial-org/awesome-openclaw-skills/tree/main/skills/n8n-workflow-automation>

功能：

a.它可以设计和输出n8n工作流；

注：这个可太有用了，因为我自己设计过一些工作流，发现弄工作流还算是比较耗时的！

**&#x30;****2****&#x5B89;装**

略。

**&#x30;****3****&#x4F7F;用**![图片](/images/ai/agent/article-1770690705942/6.jpg)

![图片](/images/ai/agent/article-1770690705942/7.jpg)

从输出结果上看它是有生成一个工作流文件，然后，我在workspace文件夹底下，可以找到它， 如：

![图片](/images/ai/agent/article-1770690705942/8.jpg)

接着，我把这个工作流导入到n8n，看看效果怎么样？

![图片](/images/ai/agent/article-1770690705942/9.jpg)

嗯，感觉这个skills效果还不行，估计也只能生成简单的n8n工作流，复杂的工作流、遇到一些技术难点的，估计也搞不定，不过对于简单的n8n工作流，倒是可以节省一点拖n8n节点的时间！

**0\*\*\*\*4****qmd**

这是一个可以节省token消耗的skills

**&#x30;****1****&#x71;md**

核心痛点：玩openclaw的人会有一个最大的痛点就是Openclaw会返回一大堆的东西，然后这token哐哐的耗，这些都是钱啊，那么这个qmd就应运而生！

项目地址：<https://github.com/tobi/qmd>

功能：

a.超级省token；

b.响应速度快；

c.语义搜索、关键词搜索、重排序，提高准确性；

![图片](/images/ai/agent/article-1770690705942/10.jpg)**&#x30;****2****&#x5B89;装**

在docker中执行命令：bun install -g github:tobi/qmd

![图片](/images/ai/agent/article-1770690705942/11.jpg)**0\*\*\*\*5****写在最后**

好了，今天发现的一些跟openclaw相关的skills和对应内容的分享就到这里了！

另欢迎大家来我的个人博客网站<https://hellosai.cc/逛逛！>**关注杰哥不迷路**，每天给你分享不一样的实用好工具。

免责声明：本公众号分享的内容以及软件等来自互联网，仅供大家学习交流，同时请遵守你当地的法律法规，否则造成的一切后果自负，与本公众号无关。如有侵权联删！部分知识难免有时效性，若内容过期失效，请见谅,感谢！

******喜欢这篇干货？如果觉得不错，请帮我一键三连，转发给您的朋友，都是对我最大的鼓励与认可。******如果想第一时间收到推送，可以把我的公众号加个星标🌟方便后面我们一起探讨AI或有意思的东西，还能够快速找到我！我们明天见！******—*****END*****—******图 | 来源网络侵删******欢迎点赞，在看，转发给我鼓励\~******👇👇关注我👇👇******👇👇扫码加入粉丝群领取福利👇👇***
