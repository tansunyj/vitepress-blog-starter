---
title: Gemini API Key免费申请+多账号无限白嫖教程！2025 gcli2api配置Cherry Studio
description: 2025最新Gemini API Key白嫖全攻略：Google AI Studio零门槛申请API Key，gcli2api多账号管理自动轮换无限调用（每天100次+），Cherry Studio配置原生接口演示。0基础图文教程，附OAuth认证+模型添加，突破额度限制免费用Gemini 2.5 Pro！
date: 2025-12-02 18:30:29
author: 杰哥
cover: /images/covers/cover-article-1764659963567.jpg
tags:
  - 白嫖
  - gemini
  - google
  - AI
  - 教程
category: "blog"

---

![Image](/images/ai/tools/article-1764744926975/1.jpg)***您好，我是Hellos AI，擅长AI编程、分享AI工具资讯等，立志让更多普通人了解AI、学会AI，利用AI找到人生的第二曲线。***

今天，这篇文章是一篇Google Gemini API Key的白嫖攻略文。

![图片](/images/ai/tools/article-1764744926975/2.jpg)

这篇文章将从如何获取Google Gemini API Key、如何配置管理多账号、如何使用 API Key三个方面进行了详细演示，特别适合0基础的朋友们。


## 01如何申请Google Gemini API key

打开Google Al Studio页面<https://aistudio.google.com，点击左下角的“Get> API key”

![图片](/images/ai/tools/article-1764744926975/3.jpg)

进入API Key页面，点击右上角的“create API Key”

![图片](/images/ai/tools/article-1764744926975/4.jpg)

输入密钥名称，点击选择导入的项目，我们还没有创建项目，点击“Create Project”

![图片](/images/ai/tools/article-1764744926975/5.jpg)

输入项目名称点击创建之后会提示我们无法创建，需要去Google Cloud控制台创建。

![图片](/images/ai/tools/article-1764744926975/6.jpg)

点击提示窗口上的“Google Cloud 控制台”链接，跳转到Google Cloud 控制台的过程中需要我们选择账号，选择Google 邮箱账号。

![图片](/images/ai/tools/article-1764744926975/7.jpg)

点击“同意并继续”按钮进入到Google Cloud 控制台页面

![图片](/images/ai/tools/article-1764744926975/8.jpg)

在页面中输入项目名称，比如我输入的是AI Agent,点击“创建”按钮

![图片](/images/ai/tools/article-1764744926975/9.jpg)

这时提示我们项目创建成功，页面上显示项目信息。我们需要重新回到

Google AI Studio的API密钥页面点击“创建API密钥”

在创建新密钥窗口中输入密钥名称、点击选择导入的项目下拉列表中的“Import project”。

![图片](/images/ai/tools/article-1764744926975/11.jpg)

页面右侧显示我们刚创建的项目“AI Agent ”

![图片](/images/ai/tools/article-1764744926975/12.jpg)

勾选“AI Agent ”，点击“导入”按钮。

![图片](/images/ai/tools/article-1764744926975/13.jpg)

项目成功导入，在创建新密钥窗口已经显示我们的项目名称

![图片](/images/ai/tools/article-1764744926975/14.jpg)

点击项目名称，再点击“创建密钥”按钮

![图片](/images/ai/tools/article-1764744926975/15.jpg)

API密钥页面显示创建的密钥信息，表示我们的Google API key 创建成功。

![图片](/images/ai/tools/article-1764744926975/16.jpg)


## 02如何配置、管理多账号

接下来我们根据GitHub上面的一个开源项目来帮我们管理多个Google的API Key。

在浏览器中输入网址：<https://github.com/su-kaka/gcli2api进入gcli2api主页。>

gcli2api是github上开源的一个将Google Gemini API转换为OpenAI 和GEMINI API格式的代理工具。

它支持多账户管理、自动轮换、实时日志监控等功能。

我们需要先下载这个项目，点击页面右上角的“Code”下拉列表中的“Download ZIP”。

![图片](/images/ai/tools/article-1764744926975/17.jpg)

下载成功后，将它解压。

![图片](/images/ai/tools/article-1764744926975/18.jpg)

接下来将gcli2api主页往下拉，拉到安装指南的位置。

![图片](/images/ai/tools/article-1764744926975/19.jpg)

根据自己的环境复制对应的命令，我的是windows系统，所以我复制windows对应的命令。

然后按住Win + S键， 输入 PowerShell ，点击PowerShell右键选择 “以管理员身份运行”，省得后面权限报错。

![图片](/images/ai/tools/article-1764744926975/20.jpg)

进入PowerShell终端，将目录切换到我们解压gcli2api

的zip包的目录下，粘贴我们刚才复制的那行在windows环境下安装的命令，然后回车。

![图片](/images/ai/tools/article-1764744926975/21.jpg)

等待gcli2api安装成功后会出现上图所示的信息。

复制控制面板的网址，在浏览器中打开: <http://127.0.0.1:7861>

![图片](/images/ai/tools/article-1764744926975/22.jpg)

进入GCLI2API管理面板，输入默认密码，小写的pwd，点击登录。

![图片](/images/ai/tools/article-1764744926975/23.jpg)

接下来在GCLI2API控制面板里面添加Google APIKey

![图片](/images/ai/tools/article-1764744926975/24.jpg)

点击获取认证链接按钮，选择账号信息。

![图片](/images/ai/tools/article-1764744926975/25.jpg)

然后点击生成的认证链接，认证成功会跳转到新的页面，显示如下信息：

![图片](/images/ai/tools/article-1764744926975/26.jpg)

这样就认证成功了。再点击下方的“获取认证文件”按钮

![图片](/images/ai/tools/article-1764744926975/27.jpg)

页面中显示认证文件内容，代表认证文件生成成功了。

![图片](/images/ai/tools/article-1764744926975/28.jpg)

如果我们还想添加更多的账号怎么办呢？

再次点击“获取认证链接”，点击新生成的链接，然后选择其他的Gmail账号，操作步骤与之前的一样，不再赘述。

点击页面上方的文件管理，可以查看到我们刚才添加的API key的账号。

![图片](/images/ai/tools/article-1764744926975/29.jpg)

如果添加多个账号，状态筛选下方就会有多条API key的账号记录。


## 03如何使用Google Gemini Key

我们已经配置好了Gemini API key,怎么去使用它呢？

我们一般通过第三方工具来使用，比如cherry studio。

在浏览器中输入网址<https://www.cherry-ai.com/>

![图片](/images/ai/tools/article-1764744926975/30.jpg)

下载安装好cherry studio。

我们打开powershell，这里有两种访问格式，一种是OpenAI兼容格式，一种是Gemini原生格式。

![图片](/images/ai/tools/article-1764744926975/31.jpg)

接下来我将在cherry studio中演示如何通过Gemin原生地址访问。

把Gemini原生: <http://127.0.0.1:7861复制下来。>

打开已安装好的cherry studio。点击cherry studio窗口右上角的设置，找到模型服务，点击Gemini

![图片](/images/ai/tools/article-1764744926975/32.jpg)

将我们复制的Gemini原生地址填写进去，密钥就是小写的pwd,接下来添加模型。

在添加模型之前，我们回到gcli2api主页，查看它所支持的模型有哪些？我们根据它所支持的模型去添加。

![图片](/images/ai/tools/article-1764744926975/33.jpg)

查看完所支持的模型后，回到cherry studio窗口点击右下方的添加按钮。

![图片](/images/ai/tools/article-1764744926975/34.jpg)

在添加模型窗口中，输入添加的模型id,点击“添加模型”按钮。

![图片](/images/ai/tools/article-1764744926975/35.jpg)

模型添加成功后，会在页面中显示，点击“API 密钥”右下方的“检测”按钮

![图片](/images/ai/tools/article-1764744926975/36.jpg)

选择我们刚才添加的模型进行检测

![图片](/images/ai/tools/article-1764744926975/37.jpg)

检测成功，页面上方会提示“连接成功”。

![图片](/images/ai/tools/article-1764744926975/38.jpg)

点击cherry studio窗口左上角的首页，然后选择我们刚测试成功的模型“Gemini-2.5-pro”

![图片](/images/ai/tools/article-1764744926975/39.jpg)

在窗口下方的输入框中输入内

![图片](/images/ai/tools/article-1764744926975/40.jpg)

Gemini-2.5-pro大模型能够正常回复，说明本地的API key调用正常，能正常使用。

点击GCLI2API 页面上方的“使用统计”可以查看API调用情况。

![图片](/images/ai/tools/article-1764744926975/41.jpg)

Gemini 2.5pro每天可调用次数是100次，那怎样才能打破它的这个限制，让我们可以无限白嫖呢？

GCLI2API检测到哪个账号调用API超过100次它就会自动轮换另一个账号去使用，并且不会被Google监测到是同一台主机调用。

![图片](/images/ai/tools/article-1764744926975/42.jpg)

因为GCLI2API帮我们做了伪装，如果你有多个账号就可以无限地轮询，也就实现了无限白嫖。

## 04写在最后

如果没有多个账号但对使用的模型要求不高，也可以调用Google的其他模型，每个模型都有100次调用，对于我们普通人来说足够用了。

另外提醒一下如果访问Google gemini官网有点问题，我们可以使用镜像的网站，在GCLI2API的配置管理页面中点击“一键使用镜像网址”就可以了，但是第一次导入API key的账号，还是需要魔法的。
