# Arena of Valor 粉丝演示站（lienquan-aov-site）

参照 [lienquan.garena.vn](https://lienquan.garena.vn/) 的功能结构与素材制作的纯静态演示站，
设计语言采用 [design-system-extraction-2026-10](../design-system-extraction-2026-10/) 中
**03-zcode** 站的逆向提取 Token 体系（Reconstruction Sheet）。

> ⚠️ 非官方粉丝演示项目，仅用于设计语言与前端结构研究。游戏名称、美术素材与商标版权归 Garena / TiMi Studio Group 所有。

## 线上地址

- **GitHub Pages（当前生产）**：https://wulinjun007.github.io/lienquan-aov-site/
- Netlify：站点已创建（`lienquan-aov-site.netlify.app`，Site ID `3a013a66-58a3-4fc1-a069-95ba229d4110`，sso_login 已关），
  但账户额度耗尽暂时锁定新部署；额度恢复后执行：
  `netlify deploy --site 3a013a66-58a3-4fc1-a069-95ba229d4110 --dir . --prod`

## 功能清单（对齐原站）

| 原站功能 | 本站实现 |
|---|---|
| 顶部导航 + 下拉菜单 + 下载 CTA | 吸顶暗色导航：玩法/资讯/链接三组下拉 + 搜索 + 白胶囊「下载游戏」 |
| Banner 轮播 | 双 banner 自动播放（5s）+ 箭头 + 页码点 |
| Tin tức nổi bật 最新动态 | 4 张新闻卡（日期 + 分类徽章 + 标题，徽章分 sky/amber 两色） |
| Tướng & Trang phục 英雄与皮肤 | 5 位精选英雄大立绘 Tab 切换（Krixi/Valhein/Aya/Triệu Vân/Arthur） |
| Gameplay 玩法入口 | 7 个玩法系统图标卡（英雄皮肤/时装/装备/奥义/辅助/徽章/模式） |
| 英雄图鉴（127 位 + 职业筛选） | 全量 127 位英雄网格，六职业筛选（含计数）+ 实时搜索 + 点击详情弹层 |
| 下载区 | QR 码 + Google Play / App Store 按钮 + 版本信息 |
| 页脚 | 社交图标 + 版权与免责声明 |

## 设计 Token（来源：design-system-extraction-2026-10 / sites/03-zcode）

- 底色 `#161616`，三级面板 `#1C1C1C` / `#2A2A2A`（支持 oklch 的浏览器使用提取原值 `oklch(0.205 0 0)` 等）
- 强调 sky-500 `oklch(0.685 0.169 237.323)`，商业高亮 amber-500 `#F59E0B`
- 层级 = 底色差 + `rgba(255,255,255,.08)` hairline，**无阴影体系**（原站签名）
- 圆角 8/10/16 + 胶囊；H1 60/700 · H2 36/600 · 正文 16；区块纵向节奏 88px
- 白胶囊为唯一高亮实体；sky/amber 按配额制使用

## 技术

- 纯静态零依赖：单页 `index.html` + `assets/css/style.css` + 原生 JS（`main.js` 交互、`heroes-data.js` 数据）
- 图片资产 153 项本地化（无外链，符合部署规范「核心资源本地化」），共 9.1MB
- 响应式：1024 / 768 双断点；移动端抽屉导航
- 无障碍：下拉/Tab/弹层的 aria 标记、Esc 关闭、键盘可操作

## Release Report · 2026-10-02

| 检查项 | 结果 |
|---|---|
| Build（纯静态，无需构建） | ✅ |
| Secret 扫描 | ✅ 干净（唯一命中为页脚 "design tokens" 字样） |
| Git 提交 + GitHub 推送 | ✅ `wulinjun007/lienquan-aov-site` main |
| 本地交互测试（Playwright） | ✅ 127 格子 / 法师筛选 31 / 搜索 Arthur=1 / 弹层 / Tab / 轮播，0 报错 |
| 修复记录 | `.hero-modal` display:flex 覆盖 `hidden` 属性导致全页点击被拦截 → 补 `[hidden]{display:none}`；弯引号/越南语变音文件名 → ASCII slug 化并对齐数据 |
| Netlify Production | ⚠️ 站点已建、`sso_login=false` 已设，但 API 返回 `Account credit usage exceeded - new deploys are blocked until credits are added` |
| GitHub Pages Production（公网实测） | ✅ https://wulinjun007.github.io/lienquan-aov-site/ 200，线上实拍：127 格子 / 法师筛选 31 / 轮播自动播放，0 网络错误 |
| 状态 | **LIVE（GitHub Pages）** / Netlify 待额度恢复补部署 |

### Netlify 教训（供后续会话复用）

- netlify-cli 27.8.0 `deploy --site <id>` 报 `JSONHTTPError: Forbidden` 时，先直接查 API：
  `POST /api/v1/sites/{id}/deploys`（Content-Type: application/zip，zip 二进制直传）会返回真实原因。
- 本例真实原因 = **账户额度耗尽**（credits blocked），token 与流程均正常。
- token 读取路径：`~/Library/Preferences/netlify/config.json` → `users.{hash}.auth.token`（`users.default` 不存在）。
