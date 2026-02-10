---
title: 【n8n教程】读取本地数据文件并推送到google sheets！
description: 【n8n教程】读取本地数据文件并推送到google sheets！
date: 2026-02-10 11:00:19
author: Hellos AI
cover: /images/covers/cover-article-1770690603111.png
tags:
  - "爬取文章"
  - AI
  - n8n
  - ai智能体
  - 效率
  - hellosAI公众号
category: "blog"

---

![Image](/images/ai/workflow/article-1770690603111/1.jpg)***您好，我是Hellos AI，擅长AI编程、分享AI工具资讯等，立志让更多普通人了解AI、学会AI，利用AI找到人生的第二曲线。***

为了在Pinterest平台上推广我的取名网站，我已经在前些天使用windsurf大批量的生成了大约2000多个pin如下：

![图片](/images/ai/workflow/article-1770690603111/2.jpg)

基本上是覆盖到了我这个取名网站所有的url页面和一些高搜索量的关键词等！

那么，现在pin有了， 这么大量，后续高峰期发布时我还手工发布吗？这不得把人得手点废掉了？

所以我现在就开始需要做准备把这些pin都导入到google sheets中，以后后续工作流可以定时推送到pinterest中！

**0\*\*\*\*1****思路**

要想把这些md文件都读取出来并且推送google sheets，我认为需要经过如下得步骤：

**&#x30;****1****&#x6587;件夹遍历**

遍历数据文件夹，在循环中获得各个md文件的内容，然后解析获得pin数据正文

**&#x30;****2****&#x63D0;取pin**

根据上面获得的每个文件内容进行解析，得到批次数据和pin数据，然后把pin数据转换成适合google sheets存储的列式数据

**&#x30;****3****&#x5199;google sheets**

在循环中把前面步骤中的数据写入到google sheets中

不过因为这里过程可能会比较长，所以我会分几篇文章来详细介绍！

当前文章中仅对如何读取文件来做一下介绍

**0\*\*\*\*2****读取文件&#x5939;****0****&#x31;\*\*\*\*怎么做呢？**

当然我也是第一次做这种功能，我也不知道用什么样的节点，该怎么用这些节点？没关系，在我前面文章中有介绍，万事不决问AI啊，n8n的docAI对于这块还是很智能的。如下：

![图片](/images/ai/workflow/article-1770690603111/3.jpg)

这里docsAI给我提供了如下的思路：

![图片](/images/ai/workflow/article-1770690603111/4.jpg)**&#x30;****2****&#x6587;件读取配置**

在n8n 2.0版本之前读取文件不是那么方便的，升级后，我们只需要在本地磁盘把一个文件夹挂载到n8n某个文件夹下，然后在n8n内部就能看到它了。

我本地的这个配置如下：

![图片](/images/ai/workflow/article-1770690603111/5.jpg)

![图片](/images/ai/workflow/article-1770690603111/6.jpg)

做了这样的配置之后，然后，在容器详情中，我就能看到它以files这个文件夹来显示挂载，如：

![图片](/images/ai/workflow/article-1770690603111/7.jpg)

这里看到在pin文件夹下就有2个md文件！

既然在容器中能看到这2个文件了，那接下来就可以添加节点来实现对应的功能了！

**&#x30;****3****&#x5DE5;作台实现**

现在回到n8n工作台，根据docs AI的建议，我们添加如下节点：

![图片](/images/ai/workflow/article-1770690603111/8.jpg)

When clicking 'Execute workflow'：manual trigger节点

Read/Write Files from Disk：文件读写节点。

Read/Write Files from Disk配置如下：

![图片](/images/ai/workflow/article-1770690603111/9.jpg)

这里File(s) Selector根据实际文件夹路径填写，\*.md--是正则表达式，用来匹配出所有的markdown文档。我们点击右上角的红色按钮测试，结果如下：

![图片](/images/ai/workflow/article-1770690603111/10.jpg)

嗯，不错，文件获取到了，接着进入下一个难关，我们要把内容从里面提取出来！

**0\*\*\*\*3****提取数&#x636E;****0****&#x31;\*\*\*\*提取全文数据**

然后根据docs AI的指引，添加extract from file节点，然后执行，效果如下：

![图片](/images/ai/workflow/article-1770690603111/11.jpg)

我们看到右边执行结果，该节点它能够正常的把md文件内容提取出来！

**&#x30;****2****&#x63D0;取json字符串**

接下来，我们需要添加一个code in JavaScript节点，如下：

![图片](/images/ai/workflow/article-1770690603111/12.jpg)

配置如下：

![图片](/images/ai/workflow/article-1770690603111/13.jpg)

我们看到，这里它可以正确的把里面的json都提取出来！在右边可以看到提取到了2条json数据！

**&#x30;****3****&#x63A8;送google sheet**

然后，我在code in JavaScript节点后面添加一个google sheets节点，往在线文档中写入数据，如：

![图片](/images/ai/workflow/article-1770690603111/14.jpg)

添加后配置如下：

![图片](/images/ai/workflow/article-1770690603111/15.jpg)

![图片](/images/ai/workflow/article-1770690603111/16.jpg)

看到这里执行后插入了2条数据到google sheets中，不过这个不对，虽然输入参数是2个json object对象，但是底下的pins字段是一个json array里面有多条数据，所有，我还要对这些地方进行优化！

然后，我们回到Code  in JavaScript节点，把里面的javascripts代码再次进行修改，让里面按照pins数组进行展开，那么后面它输出的结果就不是只有2条了，应该是有大几十条数据，如：

![图片](/images/ai/workflow/article-1770690603111/17.jpg)

好了，修改完Code  in JavaScript节点后，我们再回到google sheets，再次进行修改各字段取值，如：

![图片](/images/ai/workflow/article-1770690603111/18.jpg)

其实原因是什么呢？因为google sheets n8n节点它无法深入的去遍历pins数组的数据，所以我们必须在Code  in JavaScript中按照pins数组来展开，相当于不会有多层的那种数组嵌套。然后，我们执行这个google sheets节点，得到结果如下：

![图片](/images/ai/workflow/article-1770690603111/19.jpg)

在线google sheets文档结果如下：

![图片](/images/ai/workflow/article-1770690603111/20.jpg)

好了，大家现在可以看到这些文档现在就都插入进去了！

**0\*\*\*\*4****写在最后**

好了，这里就是如何读取本地的数据文件，然后把它们都上传到远程的文档中的工作流了。

想要这个工作流的朋友可以在下面这个链接下载哈：

【读取本地数据文件并推送google sheets】<https://pan.quark.cn/s/9096034bb959>

另欢迎大家来我的个人博客网站<https://hellosai.cc/逛逛！>

我不生产工具，我只是好工具的搬运工。

**关注杰哥不迷路**，每天给你分享不一样的实用好工具。

免责声明：本公众号分享的内容以及软件等来自互联网，仅供大家学习交流，同时请遵守你当地的法律法规，否则造成的一切后果自负，与本公众号无关。如有侵权联删！部分知识难免有时效性，若内容过期失效，请见谅,感谢！

******喜欢这篇干货？如果觉得不错，请帮我一键三连，转发给您的朋友，都是对我最大的鼓励与认可。******如果想第一时间收到推送，可以把我的公众号加个星标🌟方便后面我们一起探讨AI或有意思的东西，还能够快速找到我！我们明天见！******—*****END*****—******图 | 来源网络侵删******欢迎点赞，在看，转发给我鼓励\~******👇👇关注我👇👇******👇👇扫码加入粉丝群领取福利👇👇***
