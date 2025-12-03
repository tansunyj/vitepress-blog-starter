---
title: 【博客系统】第三篇：静态博客搭建第2篇：WordPress免费主题Blog-X安装+多级菜单+分类完美配置（10分钟搞定）
description: 【博客系统】第三篇：2025最新静态博客系列第3篇：LocalWP本地WordPress一键安装超美Blog-X免费主题，10分钟完成顶部横向多级菜单+右侧侧边栏+搜索框+标签云+文章分类绑定，纯小白20张图保姆级教程，配合Simply Static完美导出永不封号静态站！
date: 2025-12-02 20:47:49
author: 杰哥
cover: /images/covers/cover-3博客系统article-1764659969702.jpg
tags:
  - 网站
  - 工具
  - 教程
  - 搭建
  - 博客系统
category: "blog"

---

![Image](/images/blog/recommendations/article-1764659969702/1.jpg)***您好，我是Hellos AI，擅长AI编程、分享AI工具资讯等，立志让更多普通人了解AI、学会AI，利用AI找到人生的第二曲线。***

静态博客搭建系列教程：

[【第1篇】告别删文封号！全流程0成本搭建“永不失联”博客系统，小白也能复制！](https://mp.weixin.qq.com/s?__biz=MzUyMjEyMDcyOQ==\&mid=2247496348\&idx=1\&sn=3803f643381bf9c36c62a801a0a14485\&scene=21#wechat_redirect)

前面的文章中我们已经决定了要自己部署一个wordpress博客系统和使用localwp进行本地安装，安装完后它还只是一个空壳，还要我们安装各种主题和插件，这样博客系统的界面才能够美观和实用！

接下来，我将一步一步的来选择和配置它们！

## 选主题

主题是wordpress博客系统中最重要的内容，它决定博客系统的外观。

这里我的目标是要找到一个顶部页眉有一些菜单、右侧有一些列表、tags、有搜索框、主体是列表、有页脚的这样布局的一个主题。

### 01去哪找？

那需要在哪找主题呢？

我们可以在管理后台"外观"-->"主题"这个子菜单这里找主题

![图片](/images/blog/recommendations/article-1764659969702/3.jpg)

打开主题后，需要选择"添加主题"，如下图：

![图片](/images/blog/recommendations/article-1764659969702/4.jpg)

如果自己本地已经有了一个好看的主题文件，那么在这里点击"上传主题"按钮也可以

![图片](/images/blog/recommendations/article-1764659969702/5.jpg)

在右边搜索主题的框中输入如astra、或者blog之类的，就会得到如下的一个列表：

![图片](/images/blog/recommendations/article-1764659969702/6.jpg)

假如我们已经选中了某个主题，那么就可以鼠标放到该卡片上，看到有查看详情、安装、预览按钮，如下图：

![图片](/images/blog/recommendations/article-1764659969702/7.jpg)

查看预览：

![图片](/images/blog/recommendations/article-1764659969702/8.jpg)

注：这里对于博客主题，如果说自己没有好的选择，我们可以询问AI，让它告诉我，我可以选什么样的主题

![图片](/images/blog/recommendations/article-1764659969702/9.jpg)

不过AI可能会推荐一些不是那么符合我们要求的主题，这个需要我们自己鉴别；这里我安装的是blog-x主题，如：

![图片](/images/blog/recommendations/article-1764659969702/10.jpg)

从它的封面录上看，有页眉的横向菜单、主体部分都是列表式的文章，右侧有一个窄窄的侧边栏，有搜索框、列表和tags，大体满足我的要求；

点击它的安装和激活按钮，就可以把这个插件安装到当前wordpress了，如果说要更换主体，安装其他的就好了，不需要改代码或重新部署之类的，方便得很！

### 02规划博客模块

主题安装完毕后，最重要得工作就是要根据自己得博客内容来规划菜单了！

##### 01规划模块

![图片](/images/blog/recommendations/article-1764659969702/11.jpg)

最终，我得到了如下得功能板块划分建议：

![图片](/images/blog/recommendations/article-1764659969702/12.jpg)

##### 02新建菜单

根据wordpress得特点，新建菜单之类得是这样来做得：1.新建了一个组件之后会绑定到页眉这里；2.新建很多分类，这些分类会具备一定得层级关系；3.把分类绑定要页眉组件这里，这酒完成了菜单得设置；如：

###### 1.新建组件：点击"外观"-->"自定义"

![图片](/images/blog/recommendations/article-1764659969702/13.jpg)

![图片](/images/blog/recommendations/article-1764659969702/14.jpg)

![图片](/images/blog/recommendations/article-1764659969702/15.jpg)

![图片](/images/blog/recommendations/article-1764659969702/16.jpg)

###### 2.新建分类：在"文章"-->"分类目录"中新建菜单和子菜单，如：

![图片](/images/blog/recommendations/article-1764659969702/17.jpg)

这里根据前面和AI讨论得结果，新建了5个大菜单，各大菜单下有很多子菜单；

###### 3.把菜单绑定要页眉组件：打开"外观"-->"菜单"

![图片](/images/blog/recommendations/article-1764659969702/18.jpg)

菜单名称"页眉得菜单"就是新建得那个组件；

分类目录：因为我是想在页眉这里添加多个大菜单和子菜单，所以这里就要添加它们得层级关系，接着把"查看所有"这里得层级关系全部悬赏，点击"添加至菜单"，再点击"保存菜单"，接着我们就可以在前端页面上看到页眉上得菜单了，如：

![图片](/images/blog/recommendations/article-1764659969702/19.jpg)

##### 03文章分类

接着就是文章，博客系统中各种文章默认就是挂在各个子菜单下得，那么这里是怎么设置得呢？例如我们新增或修改文章时，可以在右边勾选：

进入"文章"-->"所有文章"菜单中

![图片](/images/blog/recommendations/article-1764659969702/20.jpg)

文章挂在一个二级子菜单下，如：

![图片](/images/blog/recommendations/article-1764659969702/21.jpg)

这样就可以实现按菜单对文章进行筛选了！

## 写在最后

这里我就以主题的选择和安装还有菜单的新建为例来说明这个配置过程了。

眼尖的你应该看到在上面截图红色库上方有一个卡片，那这个卡片不是我想要的，那怎么删除呢？请你接着看我后面的文章！
