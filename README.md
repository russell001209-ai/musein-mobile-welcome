# Musein Mobile Welcome

给同事评审和接入的独立新手教程。保留当前 Musein 风格、中英文切换和「灵感 → 图片 → 视频 → 电脑端创作」流程。

这是教程原型，不是完整 Musein 网站，也不是在线生成器。点击播放只播放预先生成的视频，不创建项目、不扣点数。

## 本地运行

需要 Node.js 22.20+（推荐 Node 22 LTS）和 npm。无需账号、环境变量、API key 或公司后端。

```bash
git clone https://github.com/russell001209-ai/musein-mobile-welcome.git
cd musein-mobile-welcome
npm ci
npm run dev
```

打开 http://127.0.0.1:3000/ ，或保留原路径 http://127.0.0.1:3000/previews/mobile-welcome 。

私有仓库需要先获得访问权限；仅转发仓库链接不会自动授予权限。

## 包含的内容

- 手机优先的三步互动教程，英文/中文切换及语言偏好保存。
- 「角色 / 场景 / 风格」提示词拆解，完整中文图片提示词（明确标注为翻译），可展开的实际英文生成原文。
- 实际生成的输入图片、五秒视频、静态/动态对比、加载失败及重试提示。
- 桌面端链接复制及手动复制兜底，键盘导航、缩放和安全区支持。
- 原站 Button / Card / Tabs 等必要组件及最小主题，不包含整站 canvas、登录、支付、埋点或服务配置。

## 素材和外部依赖

案例是 **Galaxy Paper Boat**，在独立 Musein 演示画布中生成。素材链接、任务 ID、模型及实际英文提示词集中在 `src/components/onboarding/welcome-demo.ts`。中文全文仅为阅读翻译，不代表本次任务提交了中文。

图片和视频从 `files.musein.ai` 加载；字体沿用 Google Fonts，失败时使用系统字体。本仓库不包含素材二进制文件，离线时无法播放。画布核验链接不是公开模板，不要把编辑链接当作新用户入口。

品牌、原有 UI 组件和素材的权利归其各自权利方；本仓库没有授予开源或再分发许可。用于已授权的内部交接。

## 修改入口

| 内容 | 文件 |
| --- | --- |
| 页面流程及排版 | `src/components/onboarding/MobileWelcome.tsx` |
| 中英文界面文案 | `src/components/onboarding/welcome-copy.ts` |
| 提示词、图片、视频、桌面入口 | `src/components/onboarding/welcome-demo.ts` |
| 播放、错误和重试 | `src/components/onboarding/WelcomeMedia.tsx` |
| 独立运行的语言适配层 | `src/contexts/LanguageContext.tsx` |
| 精简主题 | `src/app/globals.css` |

## 验证

```bash
npm test
npm run lint
npm run typecheck
npm run build
npm start
```

保持服务器运行，在另一个终端执行 `npm run check:preview`。本仓库使用 webpack，避免原工作区中文路径曾触发的 Turbopack 问题。

自动检查覆盖案例输入输出对应、原文哈希、中文完整性、双语字段、步骤路由、剪贴板兜底、禁止自动播放和 noindex。它们不替代真实 iOS / Android / 扫码内置浏览器测试或新手理解度测试。

## 接回公司网站

1. 复用 `src/components/onboarding/` 和页面入口。
2. 优先使用公司当前版本的 UI 组件、语言 Provider 和主题；本仓库的精简 Provider 仅为独立运行，不要替换整站语言系统。
3. 确认当前生产仓库后，再决定接在活动二维码落地页还是移动端注册成功页。本仓库没有修改任何线上入口。
4. 复制按钮只提供通用桌面 workspace 链接，不会保存项目或跨设备会话。

没有部署线上站点。GitHub 仓库链接用于交接源码，并不是手机端可直接访问的教程网址。

## 本次交接验证（2026-09-06）

- 本地安装、自动检查、lint、类型检查和正式构建通过；运行依赖审计报告 0 个已知漏洞。
- 正式构建的页面返回 HTTP 200；390px 浏览器布局、完整中文提示词、语言及步骤刷新恢复已检查。
- 输入图片加载为 1424px；视频实际播放至结束（1280px，约 5.04 秒）；电脑端引导及中英文切换正常，未观察到浏览器控制台错误。
- 仅导出教程和必要运行文件，上传前检查未发现环境文件或高置信度密钥特征。未复制原站 Git 历史、账号/支付/画布业务代码。
- 以上是作者侧检查，不是独立验收；真实手机、活动扫码入口和新手理解度仍需同事评审。
