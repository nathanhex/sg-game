# 儿童游戏列表页 — 前端落地实施规划

**日期：** 2026-02-27  
**依据：** [2026-02-27-kids-game-index-design.md](2026-02-27-kids-game-index-design.md)、[kids-game-index-mockup.png](../ui/kids-game-index-mockup.png)  
**技术栈：** 原生 HTML / CSS，无构建工具

---

## 1. 设计方向（frontend-design）

| 维度 | 方向 | 落地要点 |
|------|------|----------|
| **Tone** | playful / toy-like / soft pastel | 糖果梦境、圆润、高饱和度柔和色 |
| **Differentiation** | 封面图为主、儿童视觉敏感 | 每卡片 100–120px 封面区，图片铺满，emoji 兜底 |
| **Typography** | Baloo 2（标题）+ Nunito（正文） | 延续 tube-pour，避免通用字体 |
| **Motion** | 错落入场 + 悬停上浮 + 点击反馈 | `animation-delay`  stagger、`transform: translateY(-8px)`、`:active scale(0.98)` |
| **Spatial** | 网格 + 充足留白 | `minmax(240px, 1fr)`，gap 28px，max-width 720px |

---

## 2. 实施任务清单

### 阶段 A：HTML 结构与封面图兜底

**文件：** `index.html`

1. 卡片结构改为「封面区 + 信息区」：
   - 封面区：`<img>` 优先，`onerror` 回退到 `<span class="game-icon">` emoji
   - 图片 src：`tube-pour/cover.png`（或 `cover.jpg`），相对根路径
2. 每张卡片增加 `aria-label`，如：`aria-label="试管倒水：把同色液体倒进同一根试管"`
3. 卡片增加 `style="animation-delay: 0.1s"`、`0.2s` 等错落值（后续游戏递增）

**HTML 示例：**

```html
<a href="tube-pour/" class="game-card" aria-label="试管倒水：把同色液体倒进同一根试管" style="animation-delay: 0.1s">
  <div class="game-card-preview">
    <img src="tube-pour/cover.png" alt="" class="game-cover-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='inline';">
    <span class="game-icon" aria-hidden="true">🧪</span>
  </div>
  <div class="game-card-info">
    <h2 class="game-name">试管倒水</h2>
    <p class="game-desc">把同色液体倒进同一根试管</p>
  </div>
</a>
```

---

### 阶段 B：CSS 样式（对齐 mockup）

**文件：** `index.css`

#### B.1 变量与布局

```css
/* 新增/调整变量 */
--card-preview-height: 110px;
--game-grid-gap: 28px;
--game-card-min-height: 220px;
--card-radius: 24px;
```

- `.index-main`：`max-width: 720px`
- `.game-grid`：`grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: var(--game-grid-gap);`

#### B.2 标题

- `.index-title`：`font-size: clamp(28px, 5vw, 40px)`，`font-weight: 800`
- 可选：增加 `background: linear-gradient(...)` + `-webkit-background-clip: text` 实现渐变标题（mockup 中橙粉黄渐变）
- `text-shadow` 保持柔和高光

#### B.3 卡片与封面区

- `.game-card`：`min-height: 220px`，`border-radius: 24px`，`overflow: hidden`
- `.game-card-preview`：`height: 110px`，`position: relative`，`overflow: hidden`
- `.game-cover-img`：`width: 100%`，`height: 100%`，`object-fit: cover`，`display: block`
- `.game-icon`：`position: absolute` 居中，`display: none` 默认；`onerror` 时由 JS 或内联切换为 `inline`（或 CSS 配合 `:has()` 实现兜底）
- 兜底方案（无 JS）：使用 `<picture>` + `<source>` 或纯 CSS：`.game-cover-img` 加载失败时用 `background` 渐变 + 居中 emoji

**推荐兜底（纯 CSS）：**  
封面区始终有 `--preview-gradient` 背景；`img` 叠加在上，`object-fit: cover`。若 `src` 404，`img` 不显示，背景+emoji 可见。需确保 `.game-icon` 在无图时显示——可用兄弟选择器：当 `.game-cover-img` 不存在或 `img` 加载失败时，需一点 JS。简化做法：`img` 加 `onerror="this.remove()"`，则 `.game-icon` 作为下一个兄弟会自然显示（需调整 DOM 顺序：emoji 在 img 后面）。

#### B.4 信息区与字体

- `.game-card-info`：`padding: 18px 16px`，`min-height: 90px`
- `.game-name`：`font-size: 20px`，`font-weight: 800`，`margin-bottom: 6px`
- `.game-desc`：`font-size: 15px`，`line-height: 1.5`，`color: var(--text-soft)`

#### B.5 动效与交互

- `.game-card:hover`：`transform: translateY(-8px)`，`box-shadow` 加深
- `.game-card:active`：`transform: translateY(-4px) scale(0.98)`
- `@keyframes cardAppear`：保持，`animation-delay` 每卡 +0.1s

---

### 阶段 C：封面图资源与插画生成

**目标：** 为每款游戏生成 `cover.png`，置于游戏子目录（如 `tube-pour/cover.png`）

**规格：**

- 尺寸：440×220px（2:1 横版），适配 `object-fit: cover`
- 格式：PNG（支持透明）或 JPG
- 风格：与糖果梦境统一，高饱和、圆润、儿童友好

#### C.1 生成方式

| 方式 | 适用场景 | 步骤概要 |
|------|----------|----------|
| 游戏截图 | 已有可玩版本 | 打开游戏主界面 → 截取关键画面 → 裁切为 440×220 |
| AI 生成插画 | 需要定制插画 | 使用 Cursor 的 GenerateImage 或 Midjourney/DALL·E 等 |
| 设计工具 | 需要精修 | Figma / FigJam 绘制，导出 PNG |
| 临时兜底 | 未出图前 | 不添加文件，使用 emoji + 渐变背景 |

#### C.2 AI 生成封面插画（以试管倒水为例）

**Step 1：编写提示词**

针对试管倒水，可选用下面任一 prompt 进行生成：

```
Child-friendly game cover illustration for "Water Sort Puzzle" (试管倒水). 
Horizontal layout 2:1 ratio. Three glass test tubes on a wooden stand, 
filled with bright colored liquids (red, blue, green). One tube tilted 
pouring liquid into another. Soft pastel background, candy dreamland 
style, rounded shapes, no sharp edges. Cute, playful, for kids age 3-10.
```

```
儿童向游戏封面插画：试管倒水。横版 2:1。三根玻璃试管立在木架上，
装有红、蓝、绿色液体。一根试管倾斜向另一根倒水。柔和的粉蓝背景，
糖果梦境风格，圆润可爱，适合 3–10 岁儿童。
```

**Step 2：生成并导出**

- 使用 Cursor：`/generate-image` 或 GenerateImage 工具，传入上述 prompt
- 使用 Midjourney/DALL·E：同上 prompt，指定 `--ar 2:1` 或 440×220 输出
- 保存为 `tube-pour/cover.png`

**Step 3：验收**

- 尺寸 440×220 或等比例 2:1
- 主视觉为试管 + 彩色液体，一眼能看出游戏主题
- 色调与糖果梦境（粉、紫、蓝、绿）协调

#### C.3 其他游戏的封面生成

后续每增加一个游戏，在 `docs/plans/` 或项目说明中补充对应 prompt 模板，例如：

- **记忆匹配**：卡片翻面、配对元素、明亮色块
- **消消乐**：彩色方块网格、消除效果、简洁几何

**通用 prompt 结构：**  
`[游戏名] 封面插画 + [核心玩法元素] + [糖果梦境风格] + [尺寸 2:1] + [儿童向]`

#### C.4 兜底策略

- 无 `cover.png` 时：使用 emoji + 渐变背景（阶段 A 已实现）
- 图片加载失败时：`onerror` 回退到 emoji

---

### 阶段 D：可选增强（mockup 细节点）

| 增强项 | 实现方式 | 优先级 |
|--------|----------|--------|
| 标题渐变 | `background-clip: text` + 橙粉黄渐变 | 中 |
| 卡片内装饰 | 封面区 `::before` 加少量 `radial-gradient` 小圆点模拟 sparkles | 低 |
| 背景 sparkles | `.bg-decor::after` 加若干 `box-shadow` 白点 | 低 |

---

## 3. 文件变更汇总

| 文件 | 变更 |
|------|------|
| `index.html` | 封面区 `<img>` + emoji 兜底、`aria-label`、`animation-delay` |
| `index.css` | 变量、布局、封面区高度 110px、图片样式、字体、动效、`:active` |
| `tube-pour/cover.png` | 新增，按 C.2 步骤生成插画 |

---

## 4. 验收清单

- [ ] 有封面图时，封面区显示图片且 `object-fit: cover`
- [ ] 无封面图时，显示 emoji + 渐变背景
- [ ] 封面区高度 110px，卡片 min-height 220px，gap 28px
- [ ] 标题 ≥ 28px，游戏名 20px，描述 15px
- [ ] 悬停上浮 8px，`:active` 有缩放反馈
- [ ] 每卡片有 `aria-label`
- [ ] 卡片入场错落淡入
- [ ] 移动端触控区域充足

---

## 5. 实施顺序建议

1. **阶段 A + B.1–B.4**：先完成结构与基础样式，不依赖封面图
2. **阶段 C**：按 C.1–C.2 生成封面插画并放入 `tube-pour/cover.png`
3. **阶段 B.5**：完善 `:active` 与动效
4. **阶段 D**：按需做标题渐变、sparkles 等增强
