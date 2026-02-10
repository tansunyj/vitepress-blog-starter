---
title: 【手把手教程】openclaw如何接入和使用反重力内置大模型？
description: 【手把手教程】openclaw如何接入和使用反重力内置大模型？
date: 2026-02-10 11:35:25
author: Hellos AI
cover: /images/covers/cover-article-1770690710752.png
tags:
  - "爬取文章"
  - openclaw
  - 效率
  - ai智能体
  - 搭建
  - AI
  - 工具
  - hellosAI公众号
  - 教程
category: "blog"

---

![Image](/images/ai/agent/article-1770690710752/1.jpg)***您好，我是Hellos AI，擅长AI编程、分享AI工具资讯等，立志让更多普通人了解AI、学会AI，利用AI找到人生的第二曲线。***

这几天用openclaw，发现这token是哐哐的耗，那是否有问题能够解决这种问题呢？

通过阅读官网帮助和搜索，我发现openclaw可以接入和使用google antigravity，这不就巧了吗？我手头就有antigravity账号，我直接用这个antigravity账号不就行了么！

那到底该如何把antigravity接入到openclaw呢？下面看我一步一步操作，让大家早日也能够摆脱这个小问题！

**0\*\*\*\*1****帮助**

我们可以打开官网的帮助文档，如：<https://docs.openclaw.ai/zh-CN/concepts/model-providers,界面如下：>

![图片](/images/ai/agent/article-1770690710752/2.jpg)

这里有2个命令，第一个是启用google-antigravity-auth，这是openclaw开发的一个插件，默认是禁用状态，我们需要启用它，然后再使用第二条命令来获得antigravity的用户登录凭证！

好了，我们既然已经知道了怎么做了，我们先检查一下看看我当前这个版本是否有这个插件呢？这里，我们看看代码，如：

![图片](/images/ai/agent/article-1770690710752/3.jpg)

这里是我的源代码的目录，因为我这个自定义镜像是我自己打的，当前是从github拉取的官方仓库代码，当然，这里我也可以在容器中看看，例如：

![图片](/images/ai/agent/article-1770690710752/4.jpg)

从这2方面来校验，我这个自定义镜像是支持这个antigravity的，所以我们可以进行下一步了！

**0\*\*\*\*2****操&#x4F5C;****0****&#x31;\*\*\*\*执行命令1**

我们在cmd命令行中，使用命令docker exec -it my\_container bash，如：

![图片](/images/ai/agent/article-1770690710752/5.jpg)

当前我用户进入到docker容器内之后，默认处于/app/文件夹底下，当前文件夹下有openclaw\.mjs，但是没有全局的openclaw命令，所以执行命令如下：

```
./openclaw.mjs plugins enable google-antigravity-auth
```

执行结果如下：

![图片](/images/ai/agent/article-1770690710752/6.jpg)

这里第一个命令执行成功，我们已经正常启用了google-antigravity-auth插件，并且程序提醒需要重启gateway，这里暂时不重启，等命令都执行完毕再说！

**&#x30;****2****&#x6267;行命令2**

然后我们需要执行官网帮助文档中第二条命令，如：

```
./openclaw.mjs models auth login --provider google-antigravity --set-default
```

执行结果如下：

![图片](/images/ai/agent/article-1770690710752/7.jpg)

这里命令行中提醒，我们需要把红色框内的链接复制到浏览器执行，如：

![图片](/images/ai/agent/article-1770690710752/8.jpg)

这里我选择上面打码的账号，然后点击它，然后google提示输入2步验证码，如：

![图片](/images/ai/agent/article-1770690710752/9.jpg)

然后我们继续点击next按钮进入下一步，如：

![图片](/images/ai/agent/article-1770690710752/10.jpg)

这里我们需要点击sign in按钮，然后就登录成功啦，接着就是把如下界面的链接地址复制并粘贴到命令行窗口中，如：

![图片](/images/ai/agent/article-1770690710752/11.jpg)

![图片](/images/ai/agent/article-1770690710752/12.jpg)

然后就配置好了，配置完成之后，这里还会显示说默认模型是claude opus 4.5thinking，如：

![图片](/images/ai/agent/article-1770690710752/13.jpg)

好了，到这里，我们的openclaw就配置好了，接下来就需要把我这个容器重启一下了！

**&#x30;****3****&#x91CD;启容器**

这里，我们打开docker desktop，然后找到这个openclaw-custom容器，然他重启！

![图片](/images/ai/agent/article-1770690710752/14.jpg)

![图片](/images/ai/agent/article-1770690710752/15.jpg)

等待openclaw\_custom启动完毕之后，我们在openclaw中问它看他现在使用的是什么大模型？如：

![图片](/images/ai/agent/article-1770690710752/16.jpg)

到这里，我们就把这个openclaw的模型就换成了claude的顶级模型啦！

**0\*\*\*\*3****写在最后**

好了，当我们把openclaw默认模型换成claude顶级模型之后，这个openclaw就如虎添翼啦，然后我们就可以愉快的玩耍了！

另欢迎大家来我的个人博客网站<https://hellosai.cc/逛逛！>**关注杰哥不迷路**，每天给你分享不一样的实用好工具。

免责声明：本公众号分享的内容以及软件等来自互联网，仅供大家学习交流，同时请遵守你当地的法律法规，否则造成的一切后果自负，与本公众号无关。如有侵权联删！部分知识难免有时效性，若内容过期失效，请见谅,感谢！

******喜欢这篇干货？如果觉得不错，请帮我一键三连，转发给您的朋友，都是对我最大的鼓励与认可。******如果想第一时间收到推送，可以把我的公众号加个星标🌟方便后面我们一起探讨AI或有意思的东西，还能够快速找到我！我们明天见！******—*****END*****—******图 | 来源网络侵删******欢迎点赞，在看，转发给我鼓励\~******👇👇关注我👇👇******👇👇扫码加入粉丝群领取福利👇👇***
