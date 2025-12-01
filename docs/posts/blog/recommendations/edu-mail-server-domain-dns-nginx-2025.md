---
title: 2025自建教育邮箱服务器第3步：教育域名解析+MX记录+Nginx配置（regery+Cloudflare失败实测）
description: 教育.edu.pl/.edu.kg域名无法加Cloudflare？手把手教你直接在regery后台正确添加A记录、MX记录、TTL设置，配合Nginx一键配置管理后台postfixadmin和用户前端roundcubemail，5分钟搞定域名直连，实测成功激活Navicat、JetBrains等教育验证！
date: 2025-12-01 15:19:44
author: 杰哥
cover: /images/covers/cover-article-1764564585313.jpg
tags:
  - 搭建
  - 网站
  - 邮件服务器
  - hellosAI公众号
  - 教程
category: "blog"

---

您好，我是Hellos AI，一个10年+互联网从业者，现在专注于自媒体。希望我的文章能够为您带来更多精彩。如果您觉得我的文章对您有帮助，可以关注、点赞，谢谢！

![图片](/images/blog/recommendations/2.jpg)

[教育邮件服务器搭建手把手教程：购买云服务器](https://mp.weixin.qq.com/s?__biz=MzUyMjEyMDcyOQ==\&mid=2247491930\&idx=1\&sn=58f9ff698c414ce729c9b618fc4c1230\&scene=21#wechat_redirect)

[教育邮件服务器搭建手把手教程：购买域名](https://mp.weixin.qq.com/s?__biz=MzUyMjEyMDcyOQ==\&mid=2247491914\&idx=1\&sn=94ef9163116f82e5bbf98b0c8de1de7e\&scene=21#wechat_redirect)

邮件服务器的域名配置详情如下：

邮件服务器一般来说，我们需要配置邮件域名解析和该服务器前后端web应用的域名解析，这里我们分别进行说明：

## 域名解析

对于域名的解析，我们一般会优先选择放到cloudflare上，毕竟它是全球性的大公司。但是当前这个是教育域名，我尝试配置在cloudflare上配置，但是一直报告无效(可能是有什么潜在限制之类的)。所以这里我是直接配置在域名供应商配置的。

## 1.<https://regery.com/配置>

在前面已经购买了服务器的前提下，我们当前是可以来配置域名了。

一般来说像这些域名供应商对于域名的常用配置都会有相应的帮助文档或者问答机器人之类的，例如：

a.在页面中点击右下角的logo，会打开在线帮助机器人

![图片](/images/blog/recommendations/3.jpg)

![图片](/images/blog/recommendations/4.jpg)

仔细理解和机器人中这里的文档，就知道我们需要配置A类型的域名解析和MX类型的域名解析。

b.打开域名解析

![图片](/images/blog/recommendations/5.jpg)

![图片](/images/blog/recommendations/6.jpg)

选择上面的DNS Records，在底下添加A类型的域名解析2条、MX类型的域名解析1条，如下：

A：表示IP地址类型的域名解析，后面data中配置@和www，都是表示类似于<https://abc.edu.pl、https://www.abc.edu.pl类型域名都会解析到后面的IP地址上去（因为我在目标服务器上部署了邮箱管理web、用户web应用）；>

MX：表示邮件类型的域名解析，data配置@，后面priority默认，exchange中配置服务器ip地址即可。

CNAME：将域名指向另外一个域名（不需要配置，配置不配置无所谓）

注：像ALIAS是默认的一条配置，懒得管他；TTL指查询一条域名后缓存的时间！

## 2.nginx配置

因为我的机器上使用的nginx服务器，所以对于用户端web、管理后端web都需要配置配置好nginx域解析才能让用户、管理员正常使用；

注：nginx的安装配置等会在后续文章中描述，这里仅说明nginx中域配置。

roundcubemail-1.5.11：用户端邮件web应用

postfixadmin-3.3.15：管理员邮件web应用

所以nginx域配置如下：

在/etc/nginx/conf.d下新建配置文件如：example.edu.pl.conf，并且在里面添加配置如下

```
## HTTPS Server Configuration
```

只有nginx域配置完成后，才可以让管理员、用户正常访问邮箱的web应用，如：

## 3.用户端web

![图片](/images/blog/recommendations/8.jpg)

当前用户我使用某个用户登陆后，该邮件账号能够正常接收邮件并激活例如navticat账号！

## 4.管理员web

![图片](/images/blog/recommendations/9.jpg)

![图片](/images/blog/recommendations/10.jpg)

后续章节会详细叙述服务器上各组件的安装过程！

希望这篇文章对您有所收获，请不要吝惜您的支持——**点赞、转发、在看**，都是对我最大的鼓励与认可。

感谢您的陪伴与共鸣，让我们共同期待更多优秀的作品诞生！


阅读更多好文
