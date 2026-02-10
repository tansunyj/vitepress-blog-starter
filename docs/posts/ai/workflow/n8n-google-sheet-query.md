---
title: 【n8n教程】n8n查询、编辑在线google sheets文档！
description: 【n8n教程】n8n查询、编辑在线google sheets文档！
date: 2026-02-10 10:59:22
author: Hellos AI
cover: /images/covers/cover-article-1770690594696.png
tags:
  - "爬取文章"
  - n8n
  - AI
  - 工具
  - 效率
  - ai智能体
category: "blog"

---

![Image](/images/ai/workflow/article-1770690594696/1.jpg)***您好，我是Hellos AI，擅长AI编程、分享AI工具资讯等，立志让更多普通人了解AI、学会AI，利用AI找到人生的第二曲线。***

在我前面文章中已经把google OAuth credential都弄好了，那么接着我们就可以使用n8n节点来获取/编辑google sheet了！

**0\*\*\*\*1****配置**

想要在n8n中正确的访问google sheet，那么我们必须使用google sheet节点，并且在里面进行一些设置才可以进行使用！

**&#x30;****1****&#x6DFB;加节点**

这里我们在n8n工作台中添加如下节点，如：

节点1：

![图片](/images/ai/workflow/article-1770690594696/2.jpg)

节点2：

![图片](/images/ai/workflow/article-1770690594696/3.jpg)

点击这个google sheets节点后选择：

![图片](/images/ai/workflow/article-1770690594696/4.jpg)

最后工作台中有如下的2个节点，如：

![图片](/images/ai/workflow/article-1770690594696/5.jpg)**&#x30;****2****&#x914D;置**

在这2个节点配置好之后，我们需要对google sheets节点进行配置，这样才可以访问里面的数据

鼠标双击这个节点，然后打开如下的页面：

![图片](/images/ai/workflow/article-1770690594696/6.jpg)

其中"Credential to connect with"点击下拉框选择"Create new Credential "

![图片](/images/ai/workflow/article-1770690594696/7.jpg)

此时进入页面：

![图片](/images/ai/workflow/article-1770690594696/8.jpg)

这里"OAuth Redirect URL"之前在：配置google cloud credential时已经在如下页面中配置过了对吧？

![图片](/images/ai/workflow/article-1770690594696/9.jpg)

如果没有配置，那么这里就必须点击上图页面中"Add URI"按钮，然后把"<http://localhost:5678/rest/oauth2-credential/callback"粘贴进去再点击保存！>

这里填写Client ID 和Client Secret如：

![图片](/images/ai/workflow/article-1770690594696/10.jpg)

点击这个然后，会弹出如下的界面，如：

![图片](/images/ai/workflow/article-1770690594696/11.jpg)

这里需要选择你的gmail邮箱，然后授权登陆，如：

![图片](/images/ai/workflow/article-1770690594696/12.jpg)

这里会报告说你这个app没有被谷歌审核，没关系，我们这个app不需要谷歌审核，直接点击"Advanced"，然后继续下一步：

![图片](/images/ai/workflow/article-1770690594696/13.jpg)

![图片](/images/ai/workflow/article-1770690594696/14.jpg)

点击Continue按钮后就登陆成功啦，然后以后就可以直接用这个了， 就像下图这样，我遇到使用google sheet的场景，直接选择这个credential名字就行啦，完全不需要重新做任何配置：

![图片](/images/ai/workflow/article-1770690594696/15.jpg)

好了，这个"Credential to connect with"字段以后就直接用这个"Google Sheets account"这个选项就好啦！

**0\*\*\*\*2****获取数据**

好，既然这个google sheet的"Credential to connect with"配置好了，那我们就可以继续配置了

**&#x30;****1****&#x5728;线google sheet**

回到<https://docs.google.com/spreadsheets/u/0/在这里，我们可以新建一个在线excel文档，如：>

![图片](/images/ai/workflow/article-1770690594696/16.jpg)

![图片](/images/ai/workflow/article-1770690594696/17.jpg)

这里加号可以增加一个sheet，下拉小箭头可以删除sheet和给sheet改名！

**&#x30;****2****&#x83B7;取数据**

既然在线sheet已经弄好了，那么我们接下来该设置这个google sheets节点，以便可以读取数据了：

![图片](/images/ai/workflow/article-1770690594696/18.jpg)

记住这里的设置:

Document这里改成By URL，然后把刚才新建的google sheet在线文档的url地址贴进去；

Sheet：这里点击下拉框后可以看到几个tab的名字，这里选择你的目标tab，然后就可以进行测试了！

![图片](/images/ai/workflow/article-1770690594696/19.jpg)

测试结果如：

![图片](/images/ai/workflow/article-1770690594696/20.jpg)**&#x30;****3****&#x6570;据过滤**

这里，例如我需要找到正常状态的数据，那么我可以这样设置：

![图片](/images/ai/workflow/article-1770690594696/21.jpg)

再次执行，我们来看看执行结果如：

![图片](/images/ai/workflow/article-1770690594696/22.jpg)

你看，这样就把那条"忽略"状态的数据过滤掉了！

接着，我们来弄一个多条件过滤，如：我添加了日期这个列，然后里面有日期，这里我们可以看看：

![图片](/images/ai/workflow/article-1770690594696/23.jpg)

例如，我需要把状态正常、把2025年12月13号之后的数据过滤出来，如：这里因为google sheets节点多条件查询不能进行这种大于、小于等等运算，所以我可以加一个filter节点，用它来进行过滤，如：

![图片](/images/ai/workflow/article-1770690594696/24.jpg)

然后设置如：

![图片](/images/ai/workflow/article-1770690594696/25.jpg)

然后执行，右边就能看到符合条件的数据啦！

**0\*\*\*\*3****往google sheets写数据**

接下来，我们可以往google sheets里面写数据或者更新数据，那该怎么操作呢？

**&#x30;****1****&#x75;pdate节点**

这里我们可以添加如下节点，如：

![图片](/images/ai/workflow/article-1770690594696/26.jpg)

![图片](/images/ai/workflow/article-1770690594696/27.jpg)**&#x30;****2****&#x8BBE;置**

添加后整个工作流如下：

![图片](/images/ai/workflow/article-1770690594696/28.jpg)

双击打开进行设置，如：

![图片](/images/ai/workflow/article-1770690594696/29.jpg)

"Credential to connect with"选前面已经配置好的那个就可以了；

"Document"字段选择成By URL，然后填写那个google sheets在线文档的链接地址；

"Sheet"字段从下拉框中选择 reddit\_keywordstab；

底下的"Mapping Column Mode"会自动弹出来，"Column to match on"会自动填写row\_number，当然我们可以根据实际情况来选择，这里我们默认使用行号！

"Values to Update"字段：这里默认会把所有字段列举出来，我们需要根据实际情况来更新，这里例如我要把"状态"字段的值更新成"已发布"；

上面这些设置好之后，点击右上角的"Execution Step"按钮，如：

![图片](/images/ai/workflow/article-1770690594696/30.jpg)

检查google sheets在线文档，发现那条结果已经更新了，如：

![图片](/images/ai/workflow/article-1770690594696/31.jpg)

好了，这里也实现了如何来更新google sheets文档！

**0\*\*\*\*7****写在最后**

到这里，因为有前面我们把新建google OAuth client，获得了clientId和clientSecret，然后我们在n8n中就能够使用到google sheets节点中以便实现在线文档的读取和更新！

好了，本次对于google sheets的操作就写到这里，欢迎关注我后续的文章哦！我们一步一步的搭建一个能够自动化的发布到pinterest的工作流！

另欢迎大家来我的个人博客网站<https://hellosai.cc/逛逛！>

我不生产工具，我只是好工具的搬运工。

**关注杰哥不迷路**，每天给你分享不一样的实用好工具。

免责声明：本公众号分享的内容以及软件等来自互联网，仅供大家学习交流，同时请遵守你当地的法律法规，否则造成的一切后果自负，与本公众号无关。如有侵权联删！部分知识难免有时效性，若内容过期失效，请见谅,感谢！

******喜欢这篇干货？如果觉得不错，请帮我一键三连，转发给您的朋友，都是对我最大的鼓励与认可。******如果想第一时间收到推送，可以把我的公众号加个星标🌟方便后面我们一起探讨AI或有意思的东西，还能够快速找到我！我们明天见！******—*****END*****—******图 | 来源网络侵删******欢迎点赞，在看，转发给我鼓励\~******👇👇关注我👇👇******👇👇扫码加入粉丝群领取福利👇👇***
