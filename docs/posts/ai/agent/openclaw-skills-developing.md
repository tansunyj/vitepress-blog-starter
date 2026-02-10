---
title: 【神操作】用AI造AI！OpenClaw Skills开发实录
description: 【神操作】用AI造AI！OpenClaw Skills开发实录
date: 2026-02-10 11:32:56
author: Hellos AI
cover: /images/covers/cover-article-1770690702963.png
tags:
  - "爬取文章"
  - openclaw
  - 工具
  - AI
  - 教程
  - hellosAI公众号
  - 搭建
  - ai智能体
  - 效率
category: "blog"

---

![Image](/images/ai/agent/article-1770690702963/1.jpg)***您好，我是Hellos AI，擅长AI编程、分享AI工具资讯等，立志让更多普通人了解AI、学会AI，利用AI找到人生的第二曲线。***

为了更好的使用openclaw，我必须给它安装各种功能的skills，但是我想要的一些skills找不到或者搜索后也是找不到完全匹配的，那我该怎么办呢？

这里我就分享一下我是如何用antigravity来给我造skills的！

**0\*\*\*\*1****明确需求**

那我的需求是什么呢？

**&#x30;****1****&#x9700;求**

主要是需要它来给我搜集各种资料，例如：openclaw的、n8n的等等！

搜集后，我需要skills能够把搜集到的这些东西都上传到google sheet，这样就方便我来统一查看和处理了！

既然需求大体确定了，那我就可以把这些交给antigravity来为我实现了！

为啥要antigravity来开发skills呢？

因为里面gemini、opus4.5功能强大还免费，开发和调试速度比openclaw快的不是一星半点！

**0\*\*\*\*2****生成skills**

打开antigravity，然后告诉我他我的详细需求，如：

**&#x30;****1****&#x6C9F;通需求**![图片](/images/ai/agent/article-1770690702963/2.jpg)

发送后AI给我一个提示，让我在心间的sheet中增加这样的一些字段信息，然后，我就按照它的建议新建如下：

![图片](/images/ai/agent/article-1770690702963/3.jpg)**&#x30;****2****&#x6388;权**

在excel表格设置完毕后，我还需要让这个skills能够正常的访问它，这样后续它执行才能把数据正确上传到表格中，如：

![图片](/images/ai/agent/article-1770690702963/4.jpg)

然后授权失败，继续跟它进行对话，如：

![图片](/images/ai/agent/article-1770690702963/5.jpg)

这里要求我在google cloud中添加正确的回调链接，如：

![图片](/images/ai/agent/article-1770690702963/6.jpg)

这里回调设置好之后保存，然后浏览器中进行授权操作！

![图片](/images/ai/agent/article-1770690702963/7.jpg)**&#x30;****3****&#x6D4B;试**

在授权完成后，我命令该skills进行测试，看看它是否可以正确的把像openclaw等关键词的数据都搜集并写入到google sheet中，如：

![图片](/images/ai/agent/article-1770690702963/8.jpg)

然后，我发现这个skills的一些bug接着就是让它按照我的要求进行修复！

![图片](/images/ai/agent/article-1770690702963/9.jpg)

经过多轮对话这个skills终于工作正常了，最后，我再测试一下，看看它搜索github上有哪些关于一人公司的skills：

![图片](/images/ai/agent/article-1770690702963/10.jpg)

然后，我们看看google sheet中增加的数据如下：

![图片](/images/ai/agent/article-1770690702963/11.jpg)

嗯，既然这个skills功能是正确的，那我把它复制到openclaw，然后调用试试看效果如何呢？

**0\*\*\*\*3****opencla&#x77;****0****&#x31;\*\*\*\*安装skill**

我需要把antigravity中这个skill复制到E:\docker\openclaw\_custom\data\workspace\skills文件夹下，如：

![图片](/images/ai/agent/article-1770690702963/12.jpg)

![图片](/images/ai/agent/article-1770690702963/13.jpg)**&#x30;****2****&#x9A8C;证**

启动openclaw然后看它是否能够正确的发现该skills，然后让它来搜索目标数据，如：

![图片](/images/ai/agent/article-1770690702963/14.jpg)

从这里说明，我把这个skills复制过去后，它能够正常的加载该skills，然后我就可以使用它来完成我的任务了！

![图片](/images/ai/agent/article-1770690702963/15.jpg)

然后，我们在google sheet中检查数据是否正确的上传，如：

![图片](/images/ai/agent/article-1770690702963/16.jpg)**0\*\*\*\*4****写在最后**

好了，上面这些就是我为openclaw来开发全新的skills的过程。

总的来说就是使用更快的模型和工具来开发skills并调试（毕竟openclaw一下子返回那么多数据，太烧token了，我们使用自己搞的antigravity学生账号来开发和调试，这个速度就快多啦），待skills功能正常后，我们可以把它复制到openclaw的workspace/skills/文件夹下，我们就可以愉快的使用啦！

好了，对于skills的开发和调试，我就介绍到这里了！对skills有兴趣的朋友，我们可以在评论区多讨论讨论哈！

另欢迎大家来我的个人博客网站<https://hellosai.cc/逛逛！>**关注杰哥不迷路**，每天给你分享不一样的实用好工具。

免责声明：本公众号分享的内容以及软件等来自互联网，仅供大家学习交流，同时请遵守你当地的法律法规，否则造成的一切后果自负，与本公众号无关。如有侵权联删！部分知识难免有时效性，若内容过期失效，请见谅,感谢！

******喜欢这篇干货？如果觉得不错，请帮我一键三连，转发给您的朋友，都是对我最大的鼓励与认可。******如果想第一时间收到推送，可以把我的公众号加个星标🌟方便后面我们一起探讨AI或有意思的东西，还能够快速找到我！我们明天见！******—*****END*****—******图 | 来源网络侵删******欢迎点赞，在看，转发给我鼓励\~******👇👇关注我👇👇******👇👇扫码加入粉丝群领取福利👇👇***
