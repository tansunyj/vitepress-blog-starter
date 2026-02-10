---
title: 【n8n教程】n8n Hellos AI 自动化日报工作流深度拆解（六）
description: 【n8n教程】n8n Hellos AI 自动化日报工作流深度拆解（六）
date: 2026-02-10 11:12:08
author: Hellos AI
cover: /images/covers/cover-article-1770690648548.png
tags:
  - "爬取文章"
  - n8n
  - 搭建
  - ai智能体
  - 效率
  - hellosAI公众号
  - AI
  - 工具
category: "blog"

---

![Image](/images/ai/workflow/article-1770690648548/1.jpg)***您好，我是Hellos AI，擅长AI编程、分享AI工具资讯等，立志让更多普通人了解AI、学会AI，利用AI找到人生的第二曲线。***[【n8n教程】n8n Hellos AI 自动化日报工作流深度拆解（一）](https://mp.weixin.qq.com/s?__biz=MzUyMjEyMDcyOQ==\&mid=2247498626\&idx=1\&sn=cee305e8ca328f88e4ced97b847c6ccf\&scene=21#wechat_redirect)

[【n8n教程】n8n Hellos AI 自动化日报工作流深度拆解（二）](https://mp.weixin.qq.com/s?__biz=MzUyMjEyMDcyOQ==\&mid=2247498687\&idx=1\&sn=0d0a3465fcc88d0f9cd188ec0aab1809\&scene=21#wechat_redirect)

[【n8n教程】n8n Hellos AI 自动化日报工作流深度拆解（三）](https://mp.weixin.qq.com/s?__biz=MzUyMjEyMDcyOQ==\&mid=2247498729\&idx=1\&sn=08efdd23f00992d0ff3b147da0cb087b\&scene=21#wechat_redirect)

[【n8n教程】n8n Hellos AI 自动化日报工作流深度拆解（四）](https://mp.weixin.qq.com/s?__biz=MzUyMjEyMDcyOQ==\&mid=2247498812\&idx=1\&sn=9d11bead52537fddbc5d717af086482c\&scene=21#wechat_redirect)

[【n8n教程】n8n Hellos AI 自动化日报工作流深度拆解（五）](https://mp.weixin.qq.com/s?__biz=MzUyMjEyMDcyOQ==\&mid=2247498830\&idx=1\&sn=54267ba53debdecd9df02acdcd23ad52\&scene=21#wechat_redirect)

好了，这篇文章是这个工作里拆解的最后一篇了，这里会把剩余的逻辑和本地的工作流都做一下详细说明！

下面，我们一起来看看！

**0\*\*\*\*1****思路拆解**

我把前面已经把图片都生成完毕了，这里我需要生成文字内容，这个就简单多了，逻辑如下：

**&#x30;****1****&#x4FEF;瞰图**![图片](/images/ai/workflow/article-1770690648548/2.jpg)

![图片](/images/ai/workflow/article-1770690648548/3.jpg)

![图片](/images/ai/workflow/article-1770690648548/4.jpg)

前面2张图是剩余的n8n工作流逻辑，第三章是飞书多维表格！

**&#x30;****2****&#x61;i agent**

文案当然还是使用ai来生成了，这里我们把新闻详情列表信息都输入到AI Agent，然后约定好输出格式，如：

![图片](/images/ai/workflow/article-1770690648548/5.jpg)

在用户信息中，我约定好了用户输入数据中各个字段的含义，当然还有输入数据的json字符串，然后在系统提示词中约定它的角色和输出数据的格式！生成完毕后交给code节点，然后把输出的json字符串解析成json对象；

**&#x30;****3****&#x98DE;书入库**

好了，现在所有的数据都已经生成完毕了，那么我就需要把这些东西保存到飞书里面，以便我查看或者复制！

这里，我必须对所有的数据进行合并，所以这里我使用到了merge节点，如下：

![图片](/images/ai/workflow/article-1770690648548/6.jpg)

有哪些入口数据，就把数字调整成多少，这些数据就会被合并到一个json object里面！

![图片](/images/ai/workflow/article-1770690648548/7.jpg)

这个飞书节点主要是把飞书的链接地址参数解析出来，然后交给后续节点使用！

![图片](/images/ai/workflow/article-1770690648548/8.jpg)

这里是这个自工作流的最后一个节点了，它就是实现数据的最终入库，保存到飞书中！

好了，至此，数据都保存到飞书了，那么为了比较方便的进行发帖，这里还存在一个问题：那些图片能否比较快速的下载下来？

为什么要下载呢？因为国内这些社交媒体平台它们都不支持直接提供图片链接地址，它们要你上传原始图片！

所以，这里就有了本地的这个专门下载图片的工作流！

**&#x30;****3****&#x4E0B;载图片**

整体俯瞰图如下：

![图片](/images/ai/workflow/article-1770690648548/9.jpg)

这里逻辑比较少，主要是实现飞书数据的查询和图片下载，当然也可以实现小绿书的自动发帖，不过格式还没有进行优化，暂时注释掉了！

查询飞书：

如下节点主要功能是查询飞书中"待发布"状态的数据，如：

![图片](/images/ai/workflow/article-1770690648548/10.jpg)

这里如果想查少一点，可以把这个20改小一点！

下载图片：

下载图片我也使用的是cloudflare的S3，为什么呢？当然，我们在浏览器中可以直接打开这些图片的，但是在n8n中因为浏览器指纹不一样，非常容易被cloudflare识别，会导致你用Http request下载图片失败，所以我前面既然用cloudflare的S3上传，那下载也直接用它，多方便，还不需要那么麻烦！

![图片](/images/ai/workflow/article-1770690648548/11.jpg)

好了我们本地有图片了，我们也有该帖子的标题、正文、tags等等内容，那这里不就可以通过接口来实现自动发帖了吗？所以，本地工作流中我已经实现了小绿书的发帖功能（当然格式还需要优化）

小绿书发帖：

小绿书发帖需要关注图片上传和各个文字字段的对应，如下：（这是上传图片的接口），底下这些接口的调用都是微信开放平台中列举的接口并且严格按照它们的参数来进行设置

![图片](/images/ai/workflow/article-1770690648548/12.jpg)

获得token接口如：

![图片](/images/ai/workflow/article-1770690648548/13.jpg)

创建草稿：

![图片](/images/ai/workflow/article-1770690648548/14.jpg)

body参数如：{

`"articles": [`        `{`            `"article_type": "newspic",`            `"title": "{{ $('Code in JavaScript').item.json.original_data.first().data.items.first().fields['标题'].first().text }}",`            `"content": "{{ $('Code in JavaScript').item.json.original_data.first().data.items.first().fields['内容'].first().text.replace(/\r?\n|\r/g, "") }} {{ $('Code in JavaScript').item.json.original_data.first().data.items.first().fields.tags.first().text }}",`            `"image_info": {`                `"image_list": {{ $json.image_list.toJsonString() }}`            `}`        `}`    `]``}`

发布草稿：

![图片](/images/ai/workflow/article-1770690648548/15.jpg)

该接口只有一个参数，把这个media\_id传给接口就好了，然后帖子就可以发布了！

**0\*\*\*\*2****写在最后**

好了，这个Hellos AI日报的工作流整体上就是这些内容，总体上来说也不是一个复杂的工作流，主要难点是模板的生成和截图，主要是调试功能，其他的都比较简单一点！

这种只适合于那种模板比较固定的内容生成，如果说你得小hs帖子图片非常丰富多彩，那就必须调用文生图/图生图的API接口了！

想要我这些工作流的朋友，可以访问我的知识库：<https://oahvw93j6te.feishu.cn/wiki/SSZFwqNDBiqEdYkiS2UcsN5onLc?fromScene=spaceOverview>

后续就不会像这样对于一个工作流还要分成很多个不分来进行拆解了，直接说总体思路和各部分功能和难点了！

另欢迎大家来我的个人博客网站<https://hellosai.cc/逛逛！>**关注杰哥不迷路**，每天给你分享不一样的实用好工具。

免责声明：本公众号分享的内容以及软件等来自互联网，仅供大家学习交流，同时请遵守你当地的法律法规，否则造成的一切后果自负，与本公众号无关。如有侵权联删！部分知识难免有时效性，若内容过期失效，请见谅,感谢！

******喜欢这篇干货？如果觉得不错，请帮我一键三连，转发给您的朋友，都是对我最大的鼓励与认可。******如果想第一时间收到推送，可以把我的公众号加个星标🌟方便后面我们一起探讨AI或有意思的东西，还能够快速找到我！我们明天见！******—*****END*****—******图 | 来源网络侵删******欢迎点赞，在看，转发给我鼓励\~******👇👇关注我👇👇******👇👇扫码加入粉丝群领取福利👇👇***
