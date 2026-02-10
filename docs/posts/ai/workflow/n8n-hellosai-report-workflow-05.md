---
title: 【n8n教程】n8n Hellos AI 自动化日报工作流深度拆解（五）
description: 【n8n教程】n8n Hellos AI 自动化日报工作流深度拆解（五）
date: 2026-02-10 11:10:38
author: Hellos AI
cover: /images/covers/cover-article-1770690645025.png
tags:
  - "爬取文章"
  - n8n
  - AI
  - 工具
  - 效率
  - 搭建
  - hellosAI公众号
  - ai智能体
category: "blog"

---

![Image](/images/ai/workflow/article-1770690645025/1.jpg)***您好，我是Hellos AI，擅长AI编程、分享AI工具资讯等，立志让更多普通人了解AI、学会AI，利用AI找到人生的第二曲线。***[【n8n教程】n8n Hellos AI 自动化日报工作流深度拆解（一）](https://mp.weixin.qq.com/s?__biz=MzUyMjEyMDcyOQ==\&mid=2247498626\&idx=1\&sn=cee305e8ca328f88e4ced97b847c6ccf\&scene=21#wechat_redirect)

[【n8n教程】n8n Hellos AI 自动化日报工作流深度拆解（二）](https://mp.weixin.qq.com/s?__biz=MzUyMjEyMDcyOQ==\&mid=2247498687\&idx=1\&sn=0d0a3465fcc88d0f9cd188ec0aab1809\&scene=21#wechat_redirect)

[【n8n教程】n8n Hellos AI 自动化日报工作流深度拆解（三）](https://mp.weixin.qq.com/s?__biz=MzUyMjEyMDcyOQ==\&mid=2247498729\&idx=1\&sn=08efdd23f00992d0ff3b147da0cb087b\&scene=21#wechat_redirect)

[【n8n教程】n8n Hellos AI 自动化日报工作流深度拆解（四）](https://mp.weixin.qq.com/s?__biz=MzUyMjEyMDcyOQ==\&mid=2247498812\&idx=1\&sn=9d11bead52537fddbc5d717af086482c\&scene=21#wechat_redirect)

经过前面的步骤，我们已经通过n8n节点把封面图片生成了，接下来，我们需要把新闻详情信息写到详情页图片上，这里该怎么做呢？

这里我将给大家详细的介绍生成详情页图片的逻辑！

**0\*\*\*\*1****思路拆解**

经过前面AI处理后，我们已经把数据都筛选出来了，但是他们还无法直接写到新闻详情页的图片上，还需要从里面提取够得劲的标题和美观的排版；

**&#x30;****1****&#x4FEF;瞰图**![图片](/images/ai/workflow/article-1770690645025/2.jpg)

![图片](/images/ai/workflow/article-1770690645025/3.jpg)**&#x30;****2****&#x41;I处理**

这里，我们需要使用AI Agent4再次处理一下，这里使用如下的提示词，如：

![图片](/images/ai/workflow/article-1770690645025/4.jpg)

这里虽然说是详情页，但是我们也需要让详情页中的新闻排版美观、标题精炼和抓人眼球！所以就需要把输入的那些新闻详情列表交给AI，让它处理，然后输出成一个新闻列表、正文开头，当然还有一堆的tags！

![图片](/images/ai/workflow/article-1770690645025/5.jpg)

当然这些数据都是输出到一个格式化的json数据结构中！

**&#x30;****3****&#x63;ode处理**

因为AI返回的数据里面它都是以json字符串返回，所以我想要获得新闻详情页数据，我就必须要用js进行处理，所以就要加这个节点，如：

![图片](/images/ai/workflow/article-1770690645025/6.jpg)

好了，经过这个code节点，我就得到了一个干净的方便我处理的新闻详情列表items！

**&#x30;****4****&#x4E8C;维码**

在我原来版本中，我是把新闻链接地址二维码放到右下角的，使用qrcode节点把链接生成图片，然后使用extract from file节点把二维码变成base64字符串！ 

![图片](/images/ai/workflow/article-1770690645025/7.jpg)

![图片](/images/ai/workflow/article-1770690645025/8.jpg)

不过，这里为了在一些平台上合规，所以把这2个节点都注释掉了！

**&#x30;****5****&#x68;tml模板**

在这些数据都准备好之后，然后就可以把准备好的html模板放到generate html节点中，当然你一定要注意，你必须把数据位都改成占位符，然后就可以在这里处理了！

![图片](/images/ai/workflow/article-1770690645025/9.jpg)

你看，我的新闻的标题、时间、内容都是根据不同时间、内容进行变化，秘密就在这里了！

![图片](/images/ai/workflow/article-1770690645025/10.jpg)

好了，html已经就位，接着就是准备截图了！

**&#x30;****6****&#x68;tml截图**

跟前面封面一样，我截图同样使用的puppeteer，

![图片](/images/ai/workflow/article-1770690645025/11.jpg)

这里，我采用的是在url中注入base64的形式，所以在该节点前面还有一个吧字符串转换成base64的code节点，如：

![图片](/images/ai/workflow/article-1770690645025/12.jpg)

注：puppeteer节点中必须配置如：--window-size=1280,1706

（该参数是配置窗口大小，尽量与需要发的社交媒体平台的尺寸一致）、--no-sandbox，对于不太明白的朋友可以直接按我这个配置来就行了！

**&#x30;****7****&#x622A;图上传S3**

这里，我还是把图片上传到cloudflare的R2保存，所以这里需要添加一个S3节点，不过上传前需要设置好文件名，因为该文件名我还要在后续节点使用，所以在S3前添加了一个set节点！

![图片](/images/ai/workflow/article-1770690645025/13.jpg)

set节点配置如下：

![图片](/images/ai/workflow/article-1770690645025/14.jpg)

这里使用时间和一些序号来对图片名称进行命名，方便归集和排序！

**0\*\*\*\*2****写在最后**

经过这些步骤，我终于把所有的图片都上传到cloudflare S3，至此图片准备完毕，然后接下来就是其他文字内容的格式化和最终内容的保存，这些我将在下一篇文章中详细说明。想要了解的朋友敬请关注！

另欢迎大家来我的个人博客网站<https://hellosai.cc/逛逛！>**关注杰哥不迷路**，每天给你分享不一样的实用好工具。

免责声明：本公众号分享的内容以及软件等来自互联网，仅供大家学习交流，同时请遵守你当地的法律法规，否则造成的一切后果自负，与本公众号无关。如有侵权联删！部分知识难免有时效性，若内容过期失效，请见谅,感谢！

******喜欢这篇干货？如果觉得不错，请帮我一键三连，转发给您的朋友，都是对我最大的鼓励与认可。******如果想第一时间收到推送，可以把我的公众号加个星标🌟方便后面我们一起探讨AI或有意思的东西，还能够快速找到我！我们明天见！******—*****END*****—******图 | 来源网络侵删******欢迎点赞，在看，转发给我鼓励\~******👇👇关注我👇👇******👇👇扫码加入粉丝群领取福利👇👇***
