---
title: 2025自建教育邮箱服务器第4步：CentOS9一键搭建LNMP（Nginx+PHP+MySQL8.0）超详细保姆级教程
description: 教育邮箱核心是PostfixAdmin+RoundcubeMail，都靠PHP+MySQL运行！2025最新CentOS9/Stream完整LNMP环境从零搭建，含nginx最新稳定版安装、php8.3+php-fpm端口通信配置、MySQL8.0离线rpm全家桶安装+初始密码获取+安全初始化，附全套命令+报错解决思路，装完直接进入下一章部署邮局！
date: 2025-12-01 15:23:09
author: Hellos AI
cover: /images/covers/cover-article-1764564587998.jpg
tags:
  - 网站
  - 邮件服务器
  - 搭建
  - hellosAI公众号
  - 教程
category: "blog"

---

您好，我是Hellos AI，一个10年+互联网从业者，现在专注于自媒体。希望我的文章能够为您带来更多精彩。如果您觉得我的文章对您有帮助，可以关注、点赞，谢谢！

![图片](/images/blog/recommendations/2.jpg)

往期有关教育邮件服务器搭建手把手教程如下：

[教育邮件服务器搭建手把手教程：购买域名](https://mp.weixin.qq.com/s?__biz=MzUyMjEyMDcyOQ==\&mid=2247491914\&idx=1\&sn=94ef9163116f82e5bbf98b0c8de1de7e\&scene=21#wechat_redirect)

[教育邮件服务器搭建手把手教程：购买云服务器](https://mp.weixin.qq.com/s?__biz=MzUyMjEyMDcyOQ==\&mid=2247491930\&idx=1\&sn=58f9ff698c414ce729c9b618fc4c1230\&scene=21#wechat_redirect)

[教育邮件服务器搭建手把手教程：配置域名解析](https://mp.weixin.qq.com/s?__biz=MzUyMjEyMDcyOQ==\&mid=2247491943\&idx=1\&sn=4e6797bbcc148cf2942694403e670d1d\&scene=21#wechat_redirect)

今天我们继续后续搭建过程：

因为需要在当前机器上安装部署像postfixadmin-3.3.15、roundcubemail-1.5.11这些开源的邮件服务，而根据这2个开源软件的READ文档，它们都是使用php+MySQL开发，所以这里我们需要先搭建基础的运行环境。

也就是：php、MySQL、nginx！

## 思路

对于非IT专业人士来说，如果说不知道该安装哪些东西，那在这个AI时代，我们可以问AI嘛！

例如：

![图片](/images/blog/recommendations/4.jpg)

![图片](/images/blog/recommendations/5.jpg)

![图片](/images/blog/recommendations/6.jpg)

![图片](/images/blog/recommendations/7.jpg)

基本上AI还是回答的比较全面的，我们可以照着AI说的这些来做！

根据上面AI的回答postfixadmin-3.3.15、roundcubemail-1.5.11要能够正常运行，我们需要安装部署nginx、php、MySQL这几个基础软件！

## nginx安装

这里我们也可以请AI告诉我们该如何安装nginx，如下：

![图片](/images/blog/recommendations/9.jpg)

主要就是执行命令：

```
yum update -y                //更新系统软件包
```

nginx安装完毕后，我们可以使用如下的命令来查看它是否启动正常，如：

![图片](/images/blog/recommendations/10.jpg)

nginx进程处于运行状态，jobs done！

接着我们需要来进行配置了：

## php安装

在nginx安装完毕后，我们需要在该centOS机器上安装php，其实安装php包括两部分，a. php运行环境；b.php-fpm，这些东西都可以让AI告诉我们。

![图片](/images/blog/recommendations/12.jpg)

![图片](/images/blog/recommendations/13.jpg)

在配置好www\.conf文件后，我们使用php -v命令或ps命令来查看php是否已经安装完毕，如下：

![图片](/images/blog/recommendations/14.jpg)

注：因为我这个机器不是使用socket方式让nginx与php-fpm通信，而是采用的本地端口的形式，所以www\.conf配置如下：

![图片](/images/blog/recommendations/15.jpg)

当然这里listen也可以使用socket通信，看自己怎么设置了！

在nginx与php都安装配置好之后，我们可以使用如下的命令来检查，看看它们是否运行正常，如下：

把 <?php phpinfo(); ?> 添加到test.php文件中，再使用php test.php来运行它，效果如下：

![图片](/images/blog/recommendations/16.jpg)

## MySQL安装

MySQL的安装就比较复杂了，因为MySQL比较大，所以需要从MySQL官网下载再上传到服务器上，再使用命令来安装！

## 一、下载MySQL

访问链接：<https://downloads.mysql.com/archives/community/，在这里可以自由选择已经归档的一些版本，如下：>

![图片](/images/blog/recommendations/18.jpg)

## 二、安装

上传解压后对于rpm包的安装就很简单了，命令如下：

```
rpm -ivh *.rpm
```

当然过程中可能会出现报错之类的，如果出现，我们也可以直接把所有的报错复制到deepseek中让它帮我们解决！

## 三、初始设置

安装完毕后初始启动，mysql会把初始访问密码输出到日志中，我们必须使用如下命令来获取到它

```
## 最常见的位置
```

接着使用该密码来访问MySQL，如下：

![图片](/images/blog/recommendations/19.jpg)

链接成功后我们需要修改MySQL的初始密码、创建用户、设置权限，然后创建像postfixadmin-3.3.15、roundcubemail-1.5.11的数据库之类！

## **最后**

到这里了，那么我们就把postfixadmin-3.3.15、roundcubemail-1.5.11运行所需的基础环境搭建好了，然后在后续章节中，我们需要配置nginx域、ssl证书、postfixadmin-3.3.15、roundcubemail-1.5.11配置和修复bug！

希望这篇文章对您有所收获，请不要吝惜您的支持——**点赞、转发、在看**，都是对我最大的鼓励与认可。

感谢您的陪伴与共鸣，让我们共同期待更多优秀的作品诞生！


阅读更多好文
