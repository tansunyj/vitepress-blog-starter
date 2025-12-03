---
title: 2025自建教育邮箱服务器第6步：PostfixAdmin+RoundcubeMail完整保姆级部署（含3.3.15全部bug修复+一键建表脚本）
description: 教育邮箱最后一步！2025最新PostfixAdmin 3.3.15 + RoundcubeMail 1.5.11全流程保姆级部署，独家解决官方无完整建表脚本、MailboxHandler.php致命bug、路径扫描风险，附Cursor一键生成初始SQL+全量修复补丁+config.inc.php终极配置，装完立即拥有和163/Gmail一样好用的自助注册Webmail，轻松批量开通教育邮箱！
date: 2025-12-01 15:33:56
author: 杰哥
cover: /images/covers/cover-article-1764564594394.jpg
tags:
  - 搭建
  - 网站
  - 出海
  - 邮件服务器
  - hellosAI公众号
category: "blog"

---

您好，我是Hellos AI，一个10年+互联网从业者，现在专注于自媒体。希望我的文章能够为您带来更多精彩。如果您觉得我的文章对您有帮助，可以关注、点赞，谢谢！

往期有关教育邮件服务器搭建手把手教程如下：

[教育邮件服务器搭建手把手教程：购买域名](https://mp.weixin.qq.com/s?__biz=MzUyMjEyMDcyOQ==\&mid=2247491914\&idx=1\&sn=94ef9163116f82e5bbf98b0c8de1de7e\&scene=21#wechat_redirect)

[教育邮件服务器搭建手把手教程：购买云服务器](https://mp.weixin.qq.com/s?__biz=MzUyMjEyMDcyOQ==\&mid=2247491930\&idx=1\&sn=58f9ff698c414ce729c9b618fc4c1230\&scene=21#wechat_redirect)

[教育邮件服务器搭建手把手教程：配置域名解析](https://mp.weixin.qq.com/s?__biz=MzUyMjEyMDcyOQ==\&mid=2247491943\&idx=1\&sn=4e6797bbcc148cf2942694403e670d1d\&scene=21#wechat_redirect)

[教育邮件服务器搭建手把手教程：nginx、php、mysql安装部署](https://mp.weixin.qq.com/s?__biz=MzUyMjEyMDcyOQ==\&mid=2247491993\&idx=1\&sn=6390f90f1221993f630051110e691a15\&scene=21#wechat_redirect)

[教育邮件服务器搭建手把手教程：postfix、dovecot安装配置](https://mp.weixin.qq.com/s?__biz=MzUyMjEyMDcyOQ==\&mid=2247492003\&idx=1\&sn=10b10b34f3c0a16a3fe0041ad16b2890\&scene=21#wechat_redirect)

今天我们继续后续搭建过程：

在前面我们已经把postfix、dovecot等搭建完毕，那么接下来我们可以部署postfixadmin-3.3.15、roundcubemail-1.5.11，这2个开源软件是邮件服务器的用户端和管理员端。

## 思路

前面文章中部署postfix、dovecot，主要是邮件传输和邮件访问，但是邮件投递到具体的邮箱账号之后，我们还需要有界面去查看邮件、收发邮件。
当然，也有朋友会说，我可以使用outlook、foxmail等邮件客户端，嗯，没错，但是对于各个不同的邮件账户，每次新注册邮箱，还需要管理员手动在服务器上操作了再把邮箱给你么？

所以一般来说，像我们使用的163邮箱、sohu邮箱、gmail邮箱等自行注册的都是虚拟邮箱账户，它们都有具体的操作页面，由用户自己创建。

对于我们当前搭建这个邮件服务器来说，我们也需要使用虚拟邮件账户，那么就需要部署类似postfixadmin-3.3.15、roundcubemail-1.5.11这样的web应用，用户可以访问邮箱查看和收发邮件，管理员可以对账户进行操作。

## roundcubemail-1.5.11安装配置

### 一、介绍

简介：roundcubemail是一款基于浏览器的邮件客户端，它支持多语言，提供邮件收发、MIME支持、通讯录、文件夹管理等等功能。该项目使用php+js+mysql/postgresql/sqlite等进行开发，支持很多插件和皮肤功能扩展。

注：选择该项目的原因是该项目在github上star数比较高并且该项目持续在进行更新，所以后续升级维护会有保障！

源码地址：<https://github.com/roundcube/roundcubemail.git>

release：<https://github.com/roundcube/roundcubemail/releases>

当前最新版本是1.7-beta，但是最稳定版本是这个1.5.11，我们可以根据自己实际环境来下载最合适的版本。

![图片](/images/blog/recommendations/article-1764761429052/4.jpg)

### 二、安装

1.nginx域配置

因为前面已经购买过域名，所以这里在nginx中直接配置域配置如下：

```
server {
```

2.安装

在配置完域后，我们可以使用域名来对该应用进行安装，例如：访问<http://mydomain.edu/installer.php或者直接配置config.inc.php，但是注意安装完后需要在/usr/local/roundcubemail-1.5.11/public\\_html文件夹底下删除installer。>

这里我使用的是直接配置config.inc.php，如下：

```
[root@mydomain config]# cat config.inc.php
```

该配置文件我们需要配置数据库访问链接串db\_dsnw、表前缀db\_prefix、des加密密钥des\_key、在线安装开关enable\_installer、管理员账号admin\_username就这些！

![图片](/images/blog/recommendations/article-1764761429052/5.jpg)

接下来，我们可以安装后端管理员页面

## postfixadmin-3.3.15安装

### 一、介绍

简介：postfixadmin是一款基于web的开源邮件服务器管理工具，专门为postfix邮件系统设计，提供web管理页面，降低管理员工作难度、提高工作效率，能轻松对邮件域名、邮件账户、邮件别名和转发规则进行管理。

该管理工具与当前主流邮件服务组件深度集成，包括postfix、dovecot等IMAP/POP3服务器，支持mysql、postgresql和sqlite等数据库，采用PHP+JS等开发。

源码地址：<https://github.com/postfixadmin/postfixadmin.git>

release:<https://github.com/postfixadmin/postfixadmin/releases>

![图片](/images/blog/recommendations/article-1764761429052/7.jpg)

### 二、安装

注：该管理后端的部署就比较麻烦了，它没办法直接建表、并且php代码中还存在一定的bug，所以我在部署过程中还结合cursor对项目代码进行编辑才能顺利部署完成。

1.nginx域配置

因为这个是一个管理后端，访问用户少并且安全等级要求比较高，所以域配置中我不会直接在nginx中配置简单的地址，如下：

```
## PostfixAdmin 的路径映射（通过 /admin 访问）
```

注：qkxjnUIn8TjKHmCEhAqNafwvfV1APbqzjLCURgTA1Tjd2MPPJs这个东西就不能简单的配置一个admin，让脚本简单的就扫描到admin的入口

2.部署

安装过程中，因为这个postfixadmin没有单独的提供sql建库建表脚本，它都是随着版本进行升级的升级脚本，你要想后面稳定版本安装，那么你数据库得跟随着它得升级脚本不断得升级。

这里我就使用了一种比较讨巧得做法，使用cursor扫描当前项目所有源代码，让它给我生成一个完整版本得建库建表脚本，以该脚本为初始版本去部署postfixadmin。

当然在登陆postfixadmin和打开各页面时，都会报告一些小错误，这时我们同样可以发挥cursor的作用，让它分析并解决报错的问题，这时cursor会修改源代码，我们只需要把修改后的源代码、修改后的数据库变更sql语句一并提交到服务器中。在我们解决完postfixadmin的一个又一个的小问题后，最终我们就能够正常使用postfixadmin了。

配置config.inc.php，该配置文件中主要是配置数据库连接串、密钥等等，如下：

```
$CONF['database_type'] = 'mysqli';
```

![图片](/images/blog/recommendations/article-1764761429052/8.jpg)

总的来说，原始发布包中MailboxHandler.php代码文件存在一些问题导致无法正常部署，另外就是没有完整的建库建表脚本。

## **最后**

在postfix、dovecot等配置成虚拟邮件账号并使用MySQL鉴权后，我们就可以在postfixadmin中批量创建邮箱账号了，最终这个邮件服务器的体验如下：1.用户端

![图片](/images/blog/recommendations/article-1764761429052/10.jpg)

![图片](/images/blog/recommendations/article-1764761429052/11.jpg)

![图片](/images/blog/recommendations/article-1764761429052/12.jpg)

2.管理员端

![图片](/images/blog/recommendations/article-1764761429052/13.jpg)

![图片](/images/blog/recommendations/article-1764761429052/14.jpg)
