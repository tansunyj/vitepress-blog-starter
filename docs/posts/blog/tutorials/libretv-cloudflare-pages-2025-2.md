---
title: 2025国内直连无广告影视网站搭建：LibreTV+Cloudflare Pages一键部署（永久免费+无需工具）
description: Vercel被墙了？2025最新最稳方案！Cloudflare Pages+LibreTV纯前端5分钟部署私人影视网站，国内直连秒开、全程免费、无广告、无需注册登录！已实测完美替代Vercel，支持自定义密码+虎牙/非凡/豆瓣热播资源，真正实现观影自由！
date: 2025-12-01 18:59:51
author: 杰哥
cover: /images/covers/cover-article-1764580188436.jpg
tags:
  - 搭建
  - 网站
  - 出海
  - 教程
  - hellosAI公众号
category: "blog"

---

![图片](/images/blog/tutorials/article-1764752172993/1.jpg)

您好，我是Hellos AI，一个10年+互联网从业者，现在专注于自媒体。希望我的文章能够为您带来更多精彩。如果您觉得我的文章对您有帮助，可以关注、点赞，谢谢！

[3分钟搭建一个私人影院：实现观影自由](https://mp.weixin.qq.com/s?__biz=MzUyMjEyMDcyOQ==\&mid=2247492138\&idx=1\&sn=87fdf5c1b4242b35ae77746a3c4cedda\&scene=21#wechat_redirect)

在我前面的文章中有说使用vercel.com来实现搭建个人自己的私人影院，但是后来有朋友反应说vercel.com部署后的网址访问时需要工具，我测试了一下，发现确实是这样，所以这里我介绍一种部署后不需要工具也能够正常访问的方法！

在cloudflare上部署！

![图片](/images/blog/tutorials/article-1764752172993/2.jpg)

## cloudflare

网址：<https://www.cloudflare.com/>

简介：这个网站就是大名鼎鼎的cloudflare了，或者又被一些人简称为cf！该公司是全球领先的网络性能和安全公司，提供包括CDN、DNS解析、DDos防护、SSL证书、边缘计算等服务，并且最重要的是它的免费套餐功能强大，非常适合我们个人使用！

免费服务

cf提供了如下的一些免费套餐功能，如：

### 1.免费DNS解析服务：cf免费套餐无隐藏收费、通过全球各数据中心加速解析、降低延迟；

### 2.CDN加速与缓存：cf的免费CDN可以显著提升网站访问速度并减少服务器负载；

### 3.安全防护：cf提供免费的DDos防护，Web应用防火墙，SSL/TLS加密等；

### 4.边缘计算：免费部署轻量级js代码到cloudflare全球网络，每日有10W次请求的免费额度；

### 5.静态网站托管：自动从github/gitlab部署静态页面，支持自定义域名/https，支持git提交时触发自动构建；**###**注册**###**该网站打开后如下

![图片](/images/blog/tutorials/article-1764752172993/3.jpg)

 点击页面中部的"Start for free"，或者对于英文不好的朋友可以在下面的页面中选择右上角的语言，切换成简体中文：
 
 ![图片](/images/blog/tutorials/article-1764752172993/4.jpg)

### 填写邮箱、密码、勾选机器人验证即可注册完毕 
![图片](/images/blog/tutorials/article-1764752172993/5.jpg)

![图片](/images/blog/tutorials/article-1764752172993/6.jpg)

### 验证

### 接着任意点击一个什么菜单如"计算works"则会弹出邮件验证的对话框，cf会给我们的邮箱发送一封邮件，打开邮件点击里面的按钮即可彻底激活账号！

![图片](/images/blog/tutorials/article-1764752172993/7.jpg)

### cf的注册最简单了，输入邮箱和密码加邮件验证就完事！并且最重要的是国内网络可以直接访问！


![图片](/images/blog/tutorials/article-1764752172993/8.jpg)

## 部署

在cf上部署前端应用就很简单了！详细部署过程如下

### 1.计算works

在左侧菜单栏中找到计算works菜单后，点击第一个子菜单进入如下的页面：

![图片](/images/blog/tutorials/article-1764752172993/9.jpg)

在这里选择"Pages"tab，导入git项目地址就好了

![图片](/images/blog/tutorials/article-1764752172993/10.jpg)

![图片](/images/blog/tutorials/article-1764752172993/11.jpg)

### 2.关联github、选择项目

点击上图中的"连接github"，会自动弹出github登陆并授权的页面

![图片](/images/blog/tutorials/article-1764752172993/12.jpg)

![图片](/images/blog/tutorials/article-1764752172993/13.jpg)

这个页面和我前面那个在vercel.com中搭建私人影院的那个页面一致，这里选择好对应的github项目地址并点击底下的绿色按钮就好了。接着进入如下的页面。

![图片](/images/blog/tutorials/article-1764752172993/14.jpg)

### 3.部署

![图片](/images/blog/tutorials/article-1764752172993/15.jpg)

这个页面中啥都不需要填写，直接点击右下角的按钮即可

注：如果有朋友需要让自己的libreTV在访问时需要输入密码，那么就需要在上面截图的"环境变量（高级）"中输入变量名（如PASSWORD）和密码（如123456）即可！如下图

![图片](/images/blog/tutorials/article-1764752172993/16.jpg)

接着一路next或确定点下去即可完成所有部署工作

![图片](/images/blog/tutorials/article-1764752172993/17.jpg)

![图片](/images/blog/tutorials/article-1764752172993/18.jpg)

点击上面的网址<https://libretv-d7f.pages.dev/，私人影院访问页面如下：>

![图片](/images/blog/tutorials/article-1764752172993/19.jpg)

![图片](/images/blog/tutorials/article-1764752172993/20.jpg)

后续的设置之类的这里就不再赘述了，有兴趣的朋友可以看我[前一篇文章](https://mp.weixin.qq.com/s?__biz=MzUyMjEyMDcyOQ==\&mid=2247492138\&idx=1\&sn=87fdf5c1b4242b35ae77746a3c4cedda\&scene=21#wechat_redirect)！

![图片](/images/blog/tutorials/article-1764752172993/21.jpg)

## **最后**

好了，一个访问不受限制的个人影响就搭建完毕了。
当然这个cf网站它不止能够搭建私人影院，像一些前后端分离项目之类的，我们都可以把前端部署在上面，以便充分利用其CDN、DDos、SSL证书、域名解析等免费服务和便利！（当然vercel.com也一样）

它提供的这些免费服务，对于个人来说完全够用！

所以这个cf又被很多出海的朋友称为赛博活菩萨！
