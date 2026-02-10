---
title: 别再一个人死磕了！印度老哥用10个AI组建团队，效率吊打一家公司
description: 别再一个人死磕了！印度老哥用10个AI组建团队，效率吊打一家公司
date: 2026-02-10 11:40:01
author: Hellos AI
cover: /images/covers/cover-article-1770690722914.png
tags:
  - "爬取文章"
  - openclaw
  - 搭建
  - ai智能体
  - 工具
  - AI
  - 效率
  - hellosAI公众号
category: "blog"

---

![Image](/images/ai/agent/article-1770690722914/1.jpg)***您好，我是Hellos AI，擅长AI编程、分享AI工具资讯等，立志让更多普通人了解AI、学会AI，利用AI找到人生的第二曲线。***

今天看X，发现上面有一个印度老哥做了一个Mission Control,这个系统呢是由10个可以自主运行的AI Agent组成的多智能体团队，这些Agent都是基于openclaw搭建，由一个叫Jarvis的Agent来领导它们！

![图片](/images/ai/agent/article-1770690722914/2.jpg)
**0\*\*\*\*1****详情**

帖子链接：<https://x.com/pbteja1998/status/2017495026230775832>**&#x30;****1****&#x6838;心功能**

核心理念：这是一个完全自治的多Agent协作系统，它们具备如下的核心功能：

a.自己创建任务(create work on their own)

b.自己认领任务(claim tasks on their own)；

c.互相交流(talk with each other)；

d.互相审核和挑刺(refute each other when necessary)；

e.互相表扬(praise each other)；

f.互相监督工作；

这个Mission Control可以 7\*24持续工作，无需人类干预就可以自动运行！

**&#x30;****2****&#x7279;点**

a.高度自治、自组织

- 这些agent不需要人类逐个来指派任务，它们会根据任务目标来自动拆解任务，然后自己认领、推进子任务；

- Jaris是这些agent的团队领导，它负责整体任务拆解、多agent协调、任务分配、监督，其他Agent会向他汇报工作和互动；

b.真实的团队协作行为

- agent之间会互相评论、质疑、改进，这是该Mission Control的重大突破；

- 能够生成高质量的内容，而不是单个agent最容易产出垃圾内容；

- 采用人类的：头脑风暴、质疑、改进的工作模式；

c.可视化管理中心

- 界面沿用现在常见的看板方式，里面可以管理如下内容：

- Agent列表：显示当前Mission Control中的所有Agent，如：Jarvis、Friday、Pepper、Quill等等，各个不同Agent都有各自的角色；

- 任务队列：如新任务、已认领、处理中、任务审查、结束；

- 实时反馈：实时显示agent之间的评论、决策、进度等；

- 任务卡片：卡片信息很详细，有负责人、截止时间、上下文信息、附件等；

- 支持实时查看Agent状态，类似于远程监控；

d.角色分工明确，类似于公司的部门

各个agent分工明确，都有各自固定专场，如：

- Jarvis-->LEAD团队领导；

- Friday-->开发专家；

- Fury-->用研专家；

- Quill-->社媒专家；

- Vision-->SEO专家；

- Wanda-->设计师；

- Loki-->内容写手；

- Pepper-->市场营销专家；

- 任务卡片：卡片信息很详细，有负责人、截止时间、上下文信息、附件等；

它甚至能够自己生成新的Agent

e.任务生成、并行执行

当前这些Agent非常擅长于生成高质量任务、策略、研究报告和内容；

但是据作者透露当前暂时限制了Mission Control自动执行，当前还是人工审核，以确保他们能够符合预期要求；

作者透露再观察一段时间后可以放开执行权限；

**0\*\*\*\*2****细节拆解**

通过作者透露的信息加上当前openclaw的功能特性、官方文档等对他进行拆解，它应该利用了如下的一些特性：

**&#x30;****1****&#x591A;session隔离**

核心机制：openclaw会让每个agent拥有独立的session文件来隔离信息，避免全局污染，扩展到多代理情景，每个agent的会话是独立的jsonl文件，存储当前对话历史、上下文和状态；

在Mission Control中的应用：

Jarvis有主session，用户协调其他各agent的子session；

交互时通过@来跨session通信，agent完成任务后告诉Jarvis，Jarvis从自己的session审阅并分配review；

**&#x30;****2****&#x77;orkspace**

核心机制：openclaw为每个agent提供独立的workspace目录，它包括配置我呢间、日志、工具等，如：

SOUL.md：定义agent人格、技能、规则等，确保角色的专业性；

AGENTS.md：核心规则、安全协议、复杂子任务代理；

USER.md：用户偏好；

HEARTBEAT.md：定时任务，支持自治；

TOOLS.md：本地配置，如各种key、外部工具等；

IDENTITY.md：agent身份，用户互动一致性；

在Mission Control中的应用：

每个agent在workspace中有自己的专属存储，但通过shared dashboard暴露自己；

系统扫描agents目录中所有的agent，然后在控制面板中显示他们的在线状态；

**&#x30;****3****&#x8BB0;忆系统**

特点：多层设计，确保永不忘记；

核心机制：openclaw的多层内存架构结合了短期/长期、语义搜索，支持跨session回忆。默认禁止记忆搜索，不过可以启用本地embedding.

Session Context：活跃对话，在session文件中，接近文件上线时会compaction，但flush关键信息到下一层；

Daily Logs：每日日志文件，记录raw events，session启动加载今天和昨天的日志信息；

长期记忆：精炼知识，一般会手动或自动更新；

Progressive Disclosure Index：紧凑索引；

Vector Search Index：sqlite数据库，用向量模型支持语义搜索；

在Mission Control中的应用：

每个agent有独立的记忆，但全局记忆或vector index允许跨记忆；

记忆以来:agent review时进行语义搜索并输出，避免重复错误；

自治性：心跳消息+记忆让agent能够主动执行任务；

**&#x30;****4****&#x6574;体交互机制**

特点：事件驱动+轮询。

每个session中会涉及到调用多个AI大模型；

各agent还需要进行隔离和防止注入；

**03****写在最后**

好了，我们从这个印度老哥自己做的Mission Control思路可以得知，我们可以通过官方开源的openclaw代码来进行改造，然后构建自己的多Agent协作团队，让一群AI为我工作！

另欢迎大家来我的个人博客网站<https://hellosai.cc/逛逛！>**关注杰哥不迷路**，每天给你分享不一样的实用好工具。

免责声明：本公众号分享的内容以及软件等来自互联网，仅供大家学习交流，同时请遵守你当地的法律法规，否则造成的一切后果自负，与本公众号无关。如有侵权联删！部分知识难免有时效性，若内容过期失效，请见谅,感谢！

******喜欢这篇干货？如果觉得不错，请帮我一键三连，转发给您的朋友，都是对我最大的鼓励与认可。******如果想第一时间收到推送，可以把我的公众号加个星标🌟方便后面我们一起探讨AI或有意思的东西，还能够快速找到我！我们明天见！******—*****END*****—******图 | 来源网络侵删******欢迎点赞，在看，转发给我鼓励\~******👇👇关注我👇👇******👇👇扫码加入粉丝群领取福利👇👇***
