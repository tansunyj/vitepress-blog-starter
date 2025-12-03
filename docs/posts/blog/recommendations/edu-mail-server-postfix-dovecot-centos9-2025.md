---
title: 2025自建教育邮箱服务器第5步：CentOS9 Postfix+Dovecot完整保姆级搭建（支持SMTP发信+IMAP收信+SSL加密）
description: 教育邮箱核心邮局！2025最新CentOS9/Stream零基础部署Postfix（SMTP发送）+Dovecot（IMAP/POP3接收），含main.cf/master.cf全量配置、Dovecot与Postfix SASL认证联调、Maildir格式、强制SSL、25/587/465/993全端口加密，实测完美收发Gmail，装完直接用于Navicat、JetBrains、GitHub Student验证！
date: 2025-12-01 15:30:03
author: 杰哥
cover: /images/covers/cover-article-1764564592120.jpg
tags:
  - 搭建
  - 网站
  - 邮件服务器
  - hellosAI公众号
  - 教程
category: "blog"

---

您好，我是Hellos AI，一个10年+互联网从业者，现在专注于自媒体。希望我的文章能够为您带来更多精彩。如果您觉得我的文章对您有帮助，可以关注、点赞，谢谢！

往期有关教育邮件服务器搭建手把手教程如下：

[教育邮件服务器搭建手把手教程：购买域名](https://mp.weixin.qq.com/s?__biz=MzUyMjEyMDcyOQ==\&mid=2247491914\&idx=1\&sn=94ef9163116f82e5bbf98b0c8de1de7e\&scene=21#wechat_redirect)

[教育邮件服务器搭建手把手教程：购买云服务器](https://mp.weixin.qq.com/s?__biz=MzUyMjEyMDcyOQ==\&mid=2247491930\&idx=1\&sn=58f9ff698c414ce729c9b618fc4c1230\&scene=21#wechat_redirect)

[教育邮件服务器搭建手把手教程：配置域名解析](https://mp.weixin.qq.com/s?__biz=MzUyMjEyMDcyOQ==\&mid=2247491943\&idx=1\&sn=4e6797bbcc148cf2942694403e670d1d\&scene=21#wechat_redirect)

[教育邮件服务器搭建手把手教程：nginx、php、mysql安装部署](https://mp.weixin.qq.com/s?__biz=MzUyMjEyMDcyOQ==\&mid=2247491993\&idx=1\&sn=6390f90f1221993f630051110e691a15\&scene=21#wechat_redirect)

今天我们继续后续搭建过程：

在前面我们已经把centOS服务器上nginx、php、mysql都安装好之后，我们还要安装和配置postfix和dovecot。

![图片](/images/blog/recommendations/article-1764762812164/2.jpg)

## 简介

因为在CentOS/RHEL发行版中，Postfix和Dovecot是不默认安装到服务器中的，不过它们的安装包是包含在软件仓库中，可以很方便的通过rpm命令、yum命令来进行安装。

## 一、功能特点

### 1、Postfix

邮件传输代理：负责邮件的接受、路由和发送；

安全性高：采用模块化设计，各组件以最低权限运行；

配置简单：主配置文件清晰易懂；

高性能：采用队列机制处理邮件，支持高并发；

兼容性强：支持SMTP、SMTPS协议，能与多种MDA配合；

### 2、Dovecot

**邮件投递代理(MDA)**：提供IMAP/POP3服务

**高效存储**：支持mbox和Maildir格式，推荐使用Maildir

**安全性强**：默认支持SSL/TLS加密

**资源占用低**：优化良好，适合高负载环境

**扩展性好**：支持插件系统，可添加反病毒、全文搜索等功能

###

## 二、工作原理

![图片](/images/blog/recommendations/article-1764762812164/4.jpg)

## 1. 发送邮件（SMTP + 鉴权）

### a.客户端连接 Postfix

i.客户端通过 SMTP（端口 25 或 587）连接到 Postfix。

ii.若使用加密，客户端会发起 `STARTTLS` 命令。

### b.Postfix 请求鉴权

i.客户端发送 `AUTH LOGIN` 或 `AUTH PLAIN` 命令。

ii.Postfix 根据 `/etc/postfix/main.cf` 中的配置，将认证请求转发给Dovecot：

```
smtpd_sasl_type=dovecot
```
### c.Dovecot 处理认证

i.Dovecot 通过 Unix 套接字 `/var/spool/postfix/private/auth` 接收请求。

根据 `/etc/dovecot/conf.d/10-auth.conf` 配置的认证后端（如系统用户、ii.SQL、LDAP）验证密码。

iii.返回认证结果给 Postfix。

### d.邮件投递

i.认证成功后，Postfix 接收邮件并存入队列。

ii.Postfix 调用 Dovecot 的 LDA（本地投递代理）将邮件写入用户 `~/Maildir` 目录。

## 2. 接收邮件流程（IMAP/POP3）
  
### a.客户端连接 Dovecot

客户端通过IMAP（端口143/993）或POP3（端口110/995）链接到Dovecot 

加密将连接会直接使用SSL（如993端口）

### b.Dovecot独立鉴权
dovecot直接验证用户身份(与SMTP认证共享同一套密码源)
认证成功后，从用户~/Maildir目录读取邮件列表或内容

### c.返回邮件数据
dovecot将邮件内容通过IMAP/POP3协议返回给客户端

## Postfix安装配置

### 一、安装

```
## 更新系统
```

### 二、配置

main.cf:配置如下(/etc/postfix/main.cf)

```
[root@mydomain postfix]# cat main.cf
```

master.cf:配置如下(/etc/postfix/master.cnf)

```
[root@mydomain postfix]# cat master.cf
```

邮箱中继代理配置如下：

```
[root@mydomain postfix]# more sasl_passwd
```

至此postfix的配置基本结束，接下来，我们来配置dovecot

## Dovecot安装配置

### 一、安装

```
## 安装Dovecot及依赖
```

### 二、配置

1.主配置文件/etc/dovecot/dovecot.conf

```
[root@mydomain dovecot]# cat dovecot.conf 
```

2.ssl证书配置/etc/dovecot/conf.d/10-ssl.conf

```
[root@mydomain conf.d]# cat 10-ssl.conf 
```

3.邮件存储配置/etc/dovecot/conf.d/10-mail.conf

```
mail_location = maildir:~/Maildir
```

4.认证配置/etc/dovecot/conf.d/10-auth.conf

```
auth_mechanisms = plain login
```

5.禁用dovecot的明文端口/etc/dovecot/conf.d/10-master.conf

```
[root@mydomain conf.d]# cat 10-master.conf 
```

上面这些内容配置好之后，我们可以实现在不同服务器之间的邮件收发服务了！

## **最后**

测试效果如下：1.接收邮件：这里我们可以使用gmail向该邮箱发送一封邮件：

![图片](/images/blog/recommendations/article-1764762812164/8.jpg)

![图片](/images/blog/recommendations/article-1764762812164/9.jpg)

2.发送邮件

![图片](/images/blog/recommendations/article-1764762812164/10.jpg)

![图片](/images/blog/recommendations/article-1764762812164/11.jpg)
