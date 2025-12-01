---
title: 自行搭建一个干净的专属梯子
description: 这是一个手动搭建干净专属梯子的教程，以便实现自己无限制访问国外互联网，vpn，适合在v2rayN里面使用
date: 2025-12-01 11:01:59
author: 杰哥
cover: /images/covers/cover-自行搭建一个干净的专属梯子.png
tags:
  - VPN
  - 教程
  - 节点
  - 机场

---
## 手把手教程：搭建专属梯子

本教程的目标：手动一套干净的梯子，实现无限制访问网络
本教程的适用对象：想要访问国外互联网的朋友们！

## 1. 准备一台服务器，可以自行购买
![](/images/uploads/upload-1764551759419.png)


## 2. 安装过程
## a. 执行如下命令

```language
VERSION=1.2.2 && bash <(curl -Ls https://raw.githubusercontent.com/alireza0/s-ui/$VERSION/install.sh) $VERSION
```

如下截图：
![](/images/uploads/upload-1764551835381.png)

执行结果如：

![](/images/uploads/upload-1764552095401.png)


![](/images/uploads/upload-1764552219667.png)


## b. 继续执行命令

```language
for d in tag.demandbase.com consent.trustarc.com aws.amazon.com azure.microsoft.com a.b.cdn.console.awsstatic.com statici.icloud.com gray-wowt-prod.gtv-cdn.com www.xilinx.com visualstudio.microsoft.com cdnssl.clicktale.net ; do t1=$(date +%s%3N); timeout 1 openssl s_client -connect $d:443 -servername $d </dev/null &>/dev/null && t2=$(date +%s%3N) && echo "$d: $((t2 - t1)) ms" || echo "$d: timeout"; done
```
执行结果如下：
![](/images/uploads/upload-1764552416984.png)

在上面找一个延迟比较低的域名来使用，如果延迟高，复制

```language
for d in www.oracle.com ds-aksb-a.akamaihd.net th.bing.com sisu.xboxlive.com www.icloud.com catalog.gamepass.com cdnssl.clicktale.net xp.apple.com electronics.sony.com t0.m.awsstatic.com ; do t1=$(date +%s%3N); timeout 1 openssl s_client -connect $d:443 -servername $d </dev/null &>/dev/null && t2=$(date +%s%3N) && echo "$d: $((t2 - t1)) ms" || echo "$d: timeout"; done
```

执行结果如下：
![](/images/uploads/upload-1764552544962.png)

![](/images/uploads/upload-1764552701054.png)

当然不使用这里的域名，直接使用自己的域名也是可以的！
**记住一定要找到一个延迟低的那种域名！**


## 3.配置
因为安装过程中它会给我们输出2个访问网址，所以这里我就直接访问它，会打开如下的界面。。
如网址：
![](/images/uploads/upload-1764553475859.png)

复制底下的global address然后在浏览器打开，如：
![](/images/uploads/upload-1764553520500.png)
注：这里默认是英文，我们可以直接把界面改成中文的！

## 输入账号
在安装过程中会有用户名、密码显示出来的，如：
![](/images/uploads/upload-1764553667092.png)
登陆后管理界面如下：
![](/images/uploads/upload-1764553749171.png)


## 配置（可选步骤）
![](/images/uploads/upload-1764553884496.png)

开启后界面如下：
![](/images/uploads/upload-1764553927276.png)


## 配置TLS：
这里包括2个步骤
### 配置REALITY
TLS：本意就是传输层安全，就是相当于是设置传输协议！
点击左侧菜单"TLS设置"
![](/images/uploads/upload-1764554033355.png)

点击"添加"按钮
![](/images/uploads/upload-1764554092233.png)

选一个延迟比较低的域名
![](/images/uploads/upload-1764554234089.png)

填写下面的表单
![](/images/uploads/upload-1764554644745.png)

保存后界面显示如下：
![](/images/uploads/upload-1764554704700.png)


### 配置TLS
这里需要再次添加一个TLS设置，请详细看添加的截图

![](/images/uploads/upload-1764555070892.png)

最后TLS这里有2个卡片/或者是叫2个配置
![](/images/uploads/upload-1764555125589.png)


## 入站管理
左侧菜单找到入站管理，如：
![](/images/uploads/upload-1764555283660.png)

添加第一个：
![](/images/uploads/upload-1764555579898.png)


添加第二个：
![](/images/uploads/upload-1764555775100.png)

![](/images/uploads/upload-1764555809835.png)


## 用户管理
接着就是最后一个设置了，这里添加用户信息，如：
![](/images/uploads/upload-1764555921621.png)

这里点击"添加"按钮，如下：
名字随便填写，底下入站标签需要勾选这2个
![](/images/uploads/upload-1764556005492.png)



## 使用
添加好了用户之后，就可以生成代理链接了，如：
![](/images/uploads/upload-1764556137939.png)

![](/images/uploads/upload-1764556279401.png)
![](/images/uploads/upload-1764556314116.png)
上面显示二维码的这些界面都是点击后就复制了链接，可以直接使用的！

例如，我点击上面第二个图片中的vless-reality，
获得链接后，我把自己搭建的梯子配置到v2rayN中！
![](/images/uploads/upload-1764556758158.png)

编辑配置
![](/images/uploads/upload-1764556860434.png)

测试节点延迟：选中某节点后，鼠标右键，按ctrl+r 就可以进行测试了
![](/images/uploads/upload-1764557277701.png)

设置第一个为活动服务器，如：
选中节点后第二个选项把节点激活！

注意：v2rayN底下的"系统代理"一般选择"自动配置系统代理"选项。。。

![](/images/uploads/upload-1764557863584.png)


好了，接着就可以畅玩国外互联网了！
