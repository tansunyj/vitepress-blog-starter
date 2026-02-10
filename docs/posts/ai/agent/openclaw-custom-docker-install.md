---
title: 【手把手教程】自定义docker镜像安装openclaw图文教程
description: 【手把手教程】自定义docker镜像安装openclaw图文教程
date: 2026-02-10 11:31:19
author: Hellos AI
cover: /images/covers/cover-article-1770690697266.png
tags:
  - "爬取文章"
  - openclaw
  - 工具
  - AI
  - 教程
  - hellosAI公众号
  - 搭建
  - 效率
  - ai智能体
category: "blog"

---

![Image](/images/ai/agent/article-1770690697266/1.jpg)***您好，我是Hellos AI，擅长AI编程、分享AI工具资讯等，立志让更多普通人了解AI、学会AI，利用AI找到人生的第二曲线。***

这几天我使用这个openclaw发现一个问题就是——官方默认的镜像它没有带brew，而我们安装控制面板中skills底下的某些skills就玩不转，你就只能干着急，这可咋办呢？

诶，有了，既然官方镜像不提供，我是否可以自己build一个镜像呢？

答案是可以的，下面我将给大家分享一下，我是如何来构建一个自己的镜像，还带着brew的那种！

**0\*\*\*\*1****需求分析**

其实对于我自己来说，我对于镜像的构建等语法也是不是那么熟悉的，那这个问题该怎么办呢？当然是交给AI啦！

**&#x30;****1****&#x6C9F;通需求**

其实我的目标挺简单：

a.我需要这个Dockerfile定义的镜像是可以包括brew、git、python3等等的基础镜像；

b.我使用docker-compose.yml启动后，我就能够得到一个可用的基础版本镜像；

c.如果我需要在本地搞图像处理、调AI呢？那就可以搞一个shell脚本来安装对应的库；

嗯，既然我的目标清晰了，那我直接把这个告诉gemini，然后让它给我生成这3个文件！

**&#x30;****2****&#x7ED3;果**

既然gemini已经把文件提供给我了，这里我就分享如下：

Dockerfile:

![图片](/images/ai/agent/article-1770690697266/2.jpg)

docker-compose.yml:

![图片](/images/ai/agent/article-1770690697266/3.jpg)

`install_all.sh:`

![图片](/images/ai/agent/article-1770690697266/4.jpg)**0\*\*\*\*2****构建**

前面我有了Dockerfile文件，那么我们就能够开始构建了：

**&#x30;****1****&#x8FD0;行命令**

在我们拉取了openclaw源代码后，我们在当前目录下执行构建命令，如：

![图片](/images/ai/agent/article-1770690697266/5.jpg)

![图片](/images/ai/agent/article-1770690697266/6.jpg)

构建后，我们检查docker desktop看到镜像，那么就可以了！如：

![图片](/images/ai/agent/article-1770690697266/7.jpg)**&#x30;****2****&#x542F;动容器**

既然镜像有了，启动容器就很简单了，直接执行如下命令：

![图片](/images/ai/agent/article-1770690697266/8.jpg)

这里，我们也可以在docker desktop中看到如下的容器实例：

![图片](/images/ai/agent/article-1770690697266/9.jpg)

它处于启动状态！

**&#x30;****3****&#x8BBF;问密码、设置配对**

容器启动后，我们还无法正常来使用这个openclaw，还需要做如下的2件事情：

a.当然你打开这个控制台页面时需要带着密码，以<http://localhost:18789/?token=admin123456> 这种方式来访问（密码见前面docker-compose.yml中OPENCLAW\_GATEWAY\_TOKEN的值）

b.让控制台<http://localhost:18789/chat中的请求和后端进行配对，如：>

![图片](/images/ai/agent/article-1770690697266/10.jpg)

我们打开F12找到requestid，然后复制它，接着在命令行中执行如下命令：

![图片](/images/ai/agent/article-1770690697266/11.jpg)

配对结束，那么我们在控制台中就看不到那种1008 pairing方面的报错了；

**&#x30;****4****&#x6A21;型凭证**

像我这种方式安装，默认是没有模型凭证授权的，那么这里该怎么办呢？

我们需要在命令行中（当然也可以在容器中）执行命令./openclaw\.mjs configure然后就可以选择对应的模型进行配对和授权了！

![图片](/images/ai/agent/article-1770690697266/12.jpg)

好，既然模型凭证已经有了，那么我们就可以跟openclaw进行聊天啦！

![图片](/images/ai/agent/article-1770690697266/13.jpg)**0\*\*\*\*3****安装brew**

最重要的事情是什么呢？当然是安装brew了，嗯？在Dockerfile不是有了吗？

**&#x30;****1****&#x5B89;装brew**

我也不知道具体原因，但是即使镜像有了，但是openclaw还是显示没有安装brew，所以，我们可以去控制台skills菜单底下让openclaw安装一下brew，如：

![图片](/images/ai/agent/article-1770690697266/14.jpg)

嗯，上图是我已经安装过后的，因为openclaw默认是支持像mac电脑，像linux、windows等部分skills的适配还不是那么好，所以这些skills基本都要依赖于brew，我想要用这里的部分skills所以，我就费了老大的劲来搞这个Dockerfile、docker-compose.yml。

好了，既然这里brew已经安装好了，那么某些依赖于brew的skills我们就可以点击安装和启用了！

**0\*\*\*\*4****注意**

这里还有一点要注意，因为像我们自己生成和升级、迭代的skills和记忆之类的东西，都是存储在像.openclaw文件夹里面的，所以，我们一定要注意在docker-compose.yml中当我们启动容器时，一定要使用外部文件夹来挂在到容器中，这样即使后续我们不小心容器崩溃、删除，那么我们的skills、记忆等都还存在于我们的电脑上，避免容器崩溃导致这些数据资产丢失！

![图片](/images/ai/agent/article-1770690697266/15.jpg)

![图片](/images/ai/agent/article-1770690697266/16.jpg)**0\*\*\*\*5****写在最后**

好了，关于如何自定义镜像和安装brew等等的基础openclaw内容就介绍到这里了！后续我们就可以愉快的玩耍啦！

另欢迎大家来我的个人博客网站<https://hellosai.cc/逛逛！>**关注杰哥不迷路**，每天给你分享不一样的实用好工具。

免责声明：本公众号分享的内容以及软件等来自互联网，仅供大家学习交流，同时请遵守你当地的法律法规，否则造成的一切后果自负，与本公众号无关。如有侵权联删！部分知识难免有时效性，若内容过期失效，请见谅,感谢！

******喜欢这篇干货？如果觉得不错，请帮我一键三连，转发给您的朋友，都是对我最大的鼓励与认可。******如果想第一时间收到推送，可以把我的公众号加个星标🌟方便后面我们一起探讨AI或有意思的东西，还能够快速找到我！我们明天见！******—*****END*****—******图 | 来源网络侵删******欢迎点赞，在看，转发给我鼓励\~******👇👇关注我👇👇******👇👇扫码加入粉丝群领取福利👇👇***
