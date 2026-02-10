---
title: 【n8n教程】飞书开放平台注册应用获取凭证和凭证的配置
description: 【n8n教程】飞书开放平台注册应用获取凭证和凭证的配置
date: 2026-02-10 11:01:25
author: Hellos AI
cover: /images/covers/cover-article-1770690609445.png
tags:
  - "爬取文章"
  - n8n
  - 教程
  - AI
  - 工具
  - 效率
  - ai智能体
  - 搭建
category: "blog"

---

![Image](/images/ai/workflow/article-1770690609445/1.jpg)***您好，我是Hellos AI，擅长AI编程、分享AI工具资讯等，立志让更多普通人了解AI、学会AI，利用AI找到人生的第二曲线。***

前面文章中我们已经把feishu插件在n8n中安装好了，但是要用这个插件，还需要在飞书开放平台注册应用获取app ID和app Secret，然后才能在飞书各节点中愉快的使用！

下面，我们一起来看看该怎样在飞书开放平台上注册应用获取凭证！

**0\*\*\*\*1****飞书开放平&#x53F0;****0****&#x31;\*\*\*\*注册**

网址：<https://open.feishu.cn/app>

打开该网址后，进入如下页面，如：

![图片](/images/ai/workflow/article-1770690609445/2.jpg)

这里点击"Create Custom App"按钮进入如下的页面，如：

![图片](/images/ai/workflow/article-1770690609445/3.jpg)

点击"Create"按钮后进入如下的页面：

![图片](/images/ai/workflow/article-1770690609445/4.jpg)**&#x30;****2****&#x83B7;取app密钥数据**

点击左上角第一个菜单"Credentials & Basic Info"进入如下页面，这里就有我们需要的东西

![图片](/images/ai/workflow/article-1770690609445/5.jpg)**&#x30;****3****&#x7533;请权限**

获取了上面的这2个字段后，还不能直接使用，还要给这个应用授权，如：

点击左侧的Permissions & Scopes后进入如下页面，然后勾选合适的权限（Base底下的全部权限），点击右下角的Add Scopes按钮

![图片](/images/ai/workflow/article-1770690609445/6.jpg)

对于这里的权限，我们不需要记忆，在n8n节点调试过程中会报告响应的错误，根据错误返回说缺少哪些权限就申请哪些权限就好了！

**&#x30;****4****&#x53D1;布应用**

然后新建一个版本发布这个应用，如：

![图片](/images/ai/workflow/article-1770690609445/7.jpg)

新增版本，填写如下字段：

![图片](/images/ai/workflow/article-1770690609445/8.jpg)

![图片](/images/ai/workflow/article-1770690609445/9.jpg)**0\*\*\*\*2****配&#x7F6E;****0****&#x31;\*\*\*\*多维表格**

打开飞书，我们在各自空间中添加一个多维表格（注意需要在云盘底下新建这个多维表格），如：

![图片](/images/ai/workflow/article-1770690609445/10.jpg)

并且在里面添加了多条数据以便测试使用！

它的链接地址如：<https://oahvw93j6te.feishu.cn/base/BQRlbUDUpalg4ssUd3mcuLVinSe?table=tblRv9Fb380jESha&view=vewtyNgOeH，这种中间是base文字！>**&#x30;****2****&#x591A;维表格授权应用**

在多维表格这里点击右上角的"..."，找到如下菜单：

![图片](/images/ai/workflow/article-1770690609445/11.jpg)

在如下对话框中把我们在飞书开放平台中的那个应用加进来，如：

![图片](/images/ai/workflow/article-1770690609445/12.jpg)

![图片](/images/ai/workflow/article-1770690609445/13.jpg)**&#x30;****3****&#x98DE;书节点凭证配置**

这里我们可以把飞书节点凭证配置好，然后方便后续使用，如：

![图片](/images/ai/workflow/article-1770690609445/14.jpg)

![图片](/images/ai/workflow/article-1770690609445/15.jpg)

这里需要填写应用级别凭证、表格token、工作表id等等数据，如：

![图片](/images/ai/workflow/article-1770690609445/16.jpg)

![图片](/images/ai/workflow/article-1770690609445/17.jpg)

填写app Id和app Secret字段内容：

![图片](/images/ai/workflow/article-1770690609445/18.jpg)

![图片](/images/ai/workflow/article-1770690609445/19.jpg)

![图片](/images/ai/workflow/article-1770690609445/20.jpg)

然后，我们添加的这个凭证后续就可以重复使用啦！

**0\*\*\*\*3****写在最后**

好了，上面这些就是飞书凭证的注册、获取和配置过程！

后续如何往飞书多维表格中插入和查询数据，请看我后续文章，敬请关注！

另欢迎大家来我的个人博客网站<https://hellosai.cc/逛逛！>

我不生产工具，我只是好工具的搬运工。

**关注杰哥不迷路**，每天给你分享不一样的实用好工具。

免责声明：本公众号分享的内容以及软件等来自互联网，仅供大家学习交流，同时请遵守你当地的法律法规，否则造成的一切后果自负，与本公众号无关。如有侵权联删！部分知识难免有时效性，若内容过期失效，请见谅,感谢！

******喜欢这篇干货？如果觉得不错，请帮我一键三连，转发给您的朋友，都是对我最大的鼓励与认可。******如果想第一时间收到推送，可以把我的公众号加个星标🌟方便后面我们一起探讨AI或有意思的东西，还能够快速找到我！我们明天见！******—*****END*****—******图 | 来源网络侵删******欢迎点赞，在看，转发给我鼓励\~******👇👇关注我👇👇******👇👇扫码加入粉丝群领取福利👇👇***
