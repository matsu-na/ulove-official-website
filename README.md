# 有谷漫展 YOUGU EXPO

一个以「有谷漫展」为主题的全栈网站。视觉方向是冬日漫展 × Y2K 编辑设计：奶油纸张底色、荧光绿与紫色点缀、手绘感的漫画眼睛、海报与票根元素。

前端使用 React + Vite，后端使用 Express + PostgreSQL。账号、会话、社区、联系表单、订阅和站点内容全部由后端提供并持久化。

![有谷漫展首页预览](preview/home.png)

## 页面

- **首页** `/` — 主视觉、开票倒计时、展会亮点、嘉宾阵容、三日日程、资讯预览、社区预告
- **资讯** `/news` — 分类筛选、关键词搜索、头条与资讯列表
- **资讯详情** `/news/:id` — 文章目录、正文、标签、复制分享、相关阅读
- **关于我们** `/about` — 山谷故事、时间线、价值主张、团队与场馆
- **联系我们** `/contact` — 联系表单、常见问题手风琴、交通与场馆信息
- **社区** `/community` — 帖子、话题筛选、点赞、收藏、评论、发帖
- **登录 / 注册** `/login` — PostgreSQL 用户体系与 HttpOnly 会话

## 环境准备

复制环境变量模板，并填入 PostgreSQL 连接串：

```bash
cp .env.example .env
```

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE
PGSSL=true
PORT=8787
```

`.env` 已被 Git 忽略，不会提交到仓库。当前项目已配置 Supabase PostgreSQL。

## 启动

```bash
pnpm install
pnpm dev
```

`pnpm dev` 会同时启动：

- 前端：`http://127.0.0.1:5173`
- 后端：`http://127.0.0.1:8787`

Vite 会将 `/api` 请求代理到后端。也可以分别启动：

```bash
pnpm dev:server
pnpm dev:client
```

## 构建与生产运行

```bash
pnpm build
pnpm start
```

构建完成后，Express 会同时提供前端静态文件和 API：`http://127.0.0.1:8787`。

## 演示账号

```text
邮箱：demo@yougu.com
密码：yougu2026
```

也可以在登录页点击「填入演示账号」，或注册一个新账号。

## PostgreSQL 数据

所有表使用 `yougu_` 前缀：

| 表 | 用途 |
| --- | --- |
| `yougu_content_blocks` | 资讯、嘉宾、日程、FAQ、统计、时间线、社区话题等内容 |
| `yougu_users` | 用户与 scrypt 密码哈希 |
| `yougu_sessions` | 服务端登录会话 |
| `yougu_posts` | 社区帖子 |
| `yougu_comments` | 评论 |
| `yougu_post_likes` | 点赞关系 |
| `yougu_bookmarks` | 收藏关系 |
| `yougu_contact_messages` | 联系表单消息 |
| `yougu_newsletter_subscriptions` | 山谷来信订阅 |
| `yougu_meta` | 种子标记 |

首次启动会自动建表，并写入 `server/seed.js` 中的展会内容与初始社区帖子。

重置数据库并重新写入种子数据（建议先停止后端）：

```bash
pnpm db:reset -- --yes
```

## 主要 API

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/content` | 全站内容数据 |
| GET | `/api/news` | 资讯列表与分类 |
| GET | `/api/news/:id` | 单篇资讯 |
| GET | `/api/auth/me` | 当前登录用户 |
| POST | `/api/auth/login` | 登录 |
| POST | `/api/auth/register` | 注册 |
| POST | `/api/auth/logout` | 退出登录 |
| PATCH | `/api/auth/profile` | 修改昵称/简介 |
| GET | `/api/community/posts` | 帖子列表 |
| POST | `/api/community/posts` | 发布帖子 |
| POST | `/api/community/posts/:id/like` | 点赞/取消点赞 |
| POST | `/api/community/posts/:id/bookmark` | 收藏/取消收藏 |
| POST | `/api/community/posts/:id/comments` | 发表评论 |
| POST | `/api/contact/messages` | 提交联系表单 |
| POST | `/api/newsletter/subscriptions` | 订阅山谷来信 |
| GET | `/api/health` | 后端与数据库健康检查 |

## 说明

- 这是一个 Supabase PostgreSQL 演示后端，尚未加入生产级限流、CSRF 防护与后台管理界面。
- 联系页面会明确提示：消息提交到数据库，不会真实发送给外部。
- 所有插图均为内联 SVG / CSS 绘制，字体文件本地托管，不依赖外部图片服务。
