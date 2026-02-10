---
title: 【n8n教程】Ubuntu 云服务器安装 Docker + n8n，5 分钟从零跑到可用
description: 【n8n教程】Ubuntu 云服务器安装 Docker + n8n，5 分钟从零跑到可用
date: 2026-02-10 10:46:00
author: Hellos AI
cover: /images/covers/cover-article-1770690575645.png
tags:
  - "爬取文章"
  - 教程
  - n8n
  - hellosAI公众号
category: "blog"

---
前面有很多粉丝朋友说想要有一个docker+n8n部署教程，这里我手头恰好有一台空闲的ubuntu服务器，我就以它为例子，在上面安装docker并正确配置n8n镜像，让n8n能够跑起来！

下面，我们一起来看看整个安装过程是怎么样的呢？

## 部署docker

其实对于自己不擅长的一些东西，如果说不知道，那最好的就是可以多问AI，让它告诉你下一步该怎么做！

### 01安装docker

卸载旧的版本数据（可选步骤，就是清理掉旧的文件）

```
sudo apt remove -y docker docker-engine docker.io containerd runc
sudo apt purge -y docker-ce docker-ce-cli containerd.io
sudo rm -rf /var/lib/docker
sudo rm -rf /var/lib/containerd
```

![](/images/uploads/upload-1770691130323.png)


更新系统并安装依赖包：

```
## 更新包列表
sudo apt update
sudo apt upgrade -y
## 安装必要工具
sudo apt install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    apt-transport-https \
    software-properties-common
```

执行结果如下：

![](/images/uploads/upload-1770691176109.png)

安装docker，执行如下的命令

```
sudo apt install -y \
    docker-ce \
    docker-ce-cli \
    containerd.io \
    docker-buildx-plugin \
    docker-compose-plugin
```

结果如下：
![](/images/uploads/upload-1770691201223.png)


执行完毕后，可以看看docker命令是否正常，如：

docker --version

![](/images/uploads/upload-1770691237035.png)


到这里docker已经在当前服务器安装好了，接下来就是可以进行一些设置，以便服务器重启，那么docker能够自动启动！

### 02配置(可选)

执行如下命令：

```

## 启动 Docker 服务
sudo systemctl start docker
sudo systemctl enable docker
## 检查状态
sudo systemctl status docker
```

执行结果如：

![](/images/uploads/upload-1770691254373.png)


其实上面第一步安装好执行docker --version能够打印版本号已经安装好了，接下来就是拉取远程n8n镜像！

## n8n安装配置

### 新建文件夹

为什么需要新建文件夹：因为我需要让n8n镜像把里面的工作流等数据存储在ubuntu服务器磁盘上，避免n8n镜像重启或者崩溃等导致工作流数据丢失！

执行如下命令：

```

## 新建一个文件夹，放在合适的地方
mkdir -p n8n_data
## 设置该文件夹的权限，因为docker默认以用户id=1000的用户运行
sudo chown -R 1000:1000 n8n_data
```

执行后结果如下：

![](/images/uploads/upload-1770691284715.png)


### 02拉取n8n镜像

这里因为某些原因，我们在国内是无法从docker官网来拉取一些镜像的（不像个人电脑，你可以安装点什么特殊的工具来避开这些限制，在云服务器上就只能加国内的一些docker镜像站点）

```

## 1. 创建或编辑Docker配置
sudo tee /etc/docker/daemon.json << 'EOF'
{
  "registry-mirrors": [
    "https://docker.m.daocloud.io",
  ]
}
EOF
## 2. 重启Docker服务
sudo systemctl daemon-reload
sudo systemctl restart docker
```

执行结果如下：
![](/images/uploads/upload-1770691309480.png)



然后执行如下命令：

```
docker run -d   --name n8n   -p 5678:5678   -v ~/xxx/docker/n8n_data:/home/node/.n8n    -e N8N_BASIC_AUTH_ACTIVE=true   -e N8N_BASIC_AUTH_USER=admin   -e N8N_BASIC_AUTH_PASSWORD=123456   -e N8N_PROTOCOL=http   -e WEBHOOK_URL=http://localhost:5678/   -e GENERIC_TIMEZONE=Asia/Shanghai   -e TZ=Asia/Shanghai   n8nio/n8n
```

执行结果如下：

![](/images/uploads/upload-1770691335938.png)

Digest: sha256:d9162b9b151744f909d7e687f4179a1aa4e7f3a7504d6bf7e0c0e27852fe9731

Status: Downloaded newer image for n8nio/n8n:latest

cf67417e7e95f42167d0c38eddd70615ab446a3610407608d20c7f6f3e989ab5

这里就只能慢慢等啦，等待下载完毕！

验证是否已经完整的下载这个镜像，如：

```
## 查看所有容器状态
```

执行结果如下：
![](/images/uploads/upload-1770691355047.png)

### 03nginx配置

当然这里只是在这个机器上配置好了可以本地访问n8n，那我们在自己电脑上该如何访问它呢？这里就该nginx出马了！

nginx配置如下：

![](/images/uploads/upload-1770691369425.png)


然后，重启nginx生效，在浏览器访问如下：

![](/images/uploads/upload-1770691378812.png)


![](/images/uploads/upload-1770691400489.png)


这里n8n要求配置https证书或者是我来禁用n8n的https安全配置，所以我还要改如下的配置：

这里我选择禁用https安全性，所以我需要停止并删除n8n容器，然后重启启动它，如：

```

## 停止n8n，删除它
docker stop n8n &&docker rm n8n
## 重新启动它
docker run -d   --name n8n   -p 5678:5678   -v ~/xxxx/docker/n8n_data:/home/node/.n8n    -e N8N_BASIC_AUTH_ACTIVE=true   -e N8N_BASIC_AUTH_USER=admin   -e N8N_BASIC_AUTH_PASSWORD=123456   -e N8N_PROTOCOL=http   -e WEBHOOK_URL=http://localhost:5678/   -e GENERIC_TIMEZONE=Asia/Shanghai   -e TZ=Asia/Shanghai  -e N8N_SECURE_COOKIE=false  n8nio/n8n
```

然后就能正常的打开n8n啦！

![](/images/uploads/upload-1770691432131.png)


注意：

1.如果你没有域名，你想要访问，就只能使用ip:端口的方式来访问你的n8n，然后再禁用https安全，这里有2个要注意的点：n8n启动参数：N8N_SECURE_COOKIE=false，还有http://172.17.0.1:5678/，为什么不是127.0.0.1或者host.docker.internal，因为127.0.0.1是当前机器的ip，而n8n在docker容器中；host.docker.internal是容器内的ip地址，在nginx部署在当前机器上时它无法识别到host.docker.internal，所以需要使用172.17.0.1这个虚拟机上创建的网桥来进行中转（该网桥不需要配置，不用管，这个ip地址直接用就好了）；

2.如果自己有域名，那么就直接在cloudflare上托管，接着把域名或子域名解析到当前这样的服务器上，然后当然你有域名了，接着申请证书就好了！

3.在启动n8n容器时必须要注意当前容器所用到的数据必须挂载在外部文件夹底下，避免n8n容器启动、崩溃时导致你所有的工作成功等毁于一旦（这是我泣血得忠告）！

域名解析配置可以看我那些搭建私人影院、搭建邮件服务器的那些文章，里面说得很详细！

当然如果docker+n8n是搭建在本地那就简单得多了，既不需要配置nginx也不需要关心什么参数问题。

## 写在最后

好了，关于如何在ubuntu服务器上安装和部署docker+n8n就介绍到这里了！关于这个安装过程中遇到哪些问题，我们可以在评论区进行讨论！

另欢迎大家来我的个人博客网站<https://hellosai.cc/逛逛！>

我不生产工具，我只是好工具的搬运工。

**关注杰哥不迷路**，每天给你分享不一样的实用好工具。

免责声明：本公众号分享的内容以及软件等来自互联网，仅供大家学习交流，同时请遵守你当地的法律法规，否则造成的一切后果自负，与本公众号无关。如有侵权联删！部分知识难免有时效性，若内容过期失效，请见谅,感谢！

******喜欢这篇干货？如果觉得不错，请帮我一键三连，转发给您的朋友，都是对我最大的鼓励与认可。******如果想第一时间收到推送，可以把我的公众号加个星标🌟方便后面我们一起探讨AI或有意思的东西，还能够快速找到我！我们明天见！******—*****END*****—******图 | 来源网络侵删******欢迎点赞，在看，转发给我鼓励\~******👇👇关注我👇👇******👇👇扫码加入粉丝群领取福利👇👇***
