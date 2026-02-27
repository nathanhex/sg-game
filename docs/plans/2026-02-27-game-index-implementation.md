# 游戏索引首页 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 将根路径 `/` 改为游戏索引页（糖果梦境风格），试管倒水迁移至 `tube-pour/`，并建立可扩展的项目结构。

**Architecture:** 根目录保留 index.html + index.css 作为索引页；每个游戏独立子目录，自包含 HTML/CSS/JS/资源；索引页不引用任何游戏内样式，仅复用糖果梦境色板与背景装饰。

**Tech Stack:** 原生 HTML / CSS / JS，无构建工具。

**参考设计:** `docs/plans/2026-02-14-game-index-design.md`

---

## Task 1: 创建 tube-pour 子目录并迁移游戏文件

**Files:**
- Create: `tube-pour/index.html`（从根 index.html 复制并调整路径）
- Create: `tube-pour/style.css`（从根 style.css 复制）
- Create: `tube-pour/audio.css`（从根 audio.css 复制）
- Create: `tube-pour/audio.js`（从根 audio.js 复制）
- Create: `tube-pour/game.js`（从根 game.js 复制）
- Create: `tube-pour/sounds/`（复制根 sounds/* 到 tube-pour/sounds/）

**Step 1: 创建 tube-pour 目录**

```bash
mkdir -p tube-pour/sounds
```

**Step 2: 复制游戏资源**

```bash
cp index.html tube-pour/index.html
cp style.css tube-pour/style.css
cp audio.css tube-pour/audio.css
cp audio.js tube-pour/audio.js
cp game.js tube-pour/game.js
cp -r sounds/* tube-pour/sounds/ 2>/dev/null || true
```

**Step 3: 确认 tube-pour 内引用为相对路径**

tube-pour/index.html 中的 `href="style.css"`、`href="audio.css"`、`src="audio.js"`、`src="game.js"` 已是相对路径，无需修改。audio.js 中 `fetch("sounds/" + id + ".wav")` 相对于 tube-pour/index.html，正确。

**Step 4: 修改 tube-pour/index.html 的 title**

将 `<title>试管倒水游戏</title>` 保持即可。

**Step 5: 暂不删除根目录文件**

根目录的 game.js、style.css、audio.js、audio.css、sounds 在 Task 4 完成新 index.html 后再删除，避免中间状态导致根路径 404。

**Step 6: Commit**

```bash
git add tube-pour/
git status  # 确认 tube-pour 已加入
git commit -m "refactor: add tube-pour/ with game copy (root files removed in Task 4)"
```

---

## Task 2: 更新根 tools 路径

**Files:**
- Modify: `tools/diagnose-levels.js`
- Modify: `tools/generate-sounds.html`（可选，更新说明文案）

**Step 1: 修改 diagnose-levels.js 中 game.js 路径**

在 `tools/diagnose-levels.js` 第 13 行：

```javascript
// 原
var src = fs.readFileSync(__dirname + "/../game.js", "utf-8");

// 改为
var src = fs.readFileSync(__dirname + "/../tube-pour/game.js", "utf-8");
```

**Step 2: 更新 generate-sounds.html 说明**

在 `tools/generate-sounds.html` 中，将「放入项目的 sounds/ 目录」改为「放入 tube-pour/sounds/ 目录」。

**Step 3: 运行诊断脚本验证**

```bash
node tools/diagnose-levels.js
```

Expected: 正常输出，无报错。

**Step 4: Commit**

```bash
git add tools/diagnose-levels.js tools/generate-sounds.html
git commit -m "chore: update tools to reference tube-pour/game.js"
```

---

## Task 3: 创建索引页 index.css（糖果梦境风格）

**Files:**
- Create: `index.css`

**Step 1: 编写 index.css**

从 `tube-pour/style.css` 提取：
1. `:root` 中的糖果梦境色板（背景渐变、卡片、文字、按钮主色等）
2. 全局重置 `* { box-sizing: border-box; }`、`body` 基础样式
3. `.bg-decor`、`.cloud`、`.candy-hill` 背景装饰
4. 索引页专用：`.game-grid`、`.game-card`、卡片悬停动效、标题样式

索引页不需要平板外框、工具栏、试管、弹框等，仅需：
- 背景与装饰
- 标题
- 游戏卡片网格（grid）
- 卡片样式（圆角、阴影、hover 上浮、animation-delay 错落出现）

**index.css 内容要点：**

```css
/* 游戏索引页 — 糖果梦境主题 */
:root {
  --bg-top: #FFD4E5;
  --bg-mid: #FFE0EE;
  --bg-bottom: #D4F1FF;
  --card-bg: rgba(255, 255, 255, 0.92);
  --card-border: #E8D0F8;
  --text-main: #3D2D5C;
  --text-soft: #5C4A7A;
  --btn-main-start: #FF8AC3;
  --btn-main-end: #FF6FA6;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  min-height: 100vh;
  color: var(--text-main);
  font-family: "Baloo 2", "Nunito", "Microsoft YaHei", sans-serif;
  background: linear-gradient(180deg, var(--bg-top) 0%, var(--bg-mid) 40%, var(--bg-bottom) 100%);
  padding: 24px 16px;
}

/* bg-decor, cloud, candy-hill 复用 tube-pour 的样式 */
/* game-grid: display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; */
/* game-card: 圆角、阴影、hover transform translateY(-4px)、animation 错落出现 */
```

完整实现需包含 cloud、candy-hill 的 keyframes 与样式（从 tube-pour/style.css 复制相应片段）。

**Step 2: Commit**

```bash
git add index.css
git commit -m "feat: add index.css for game index page"
```

---

## Task 4: 创建根 index.html（游戏索引页）

**Files:**
- Modify: `index.html`（覆盖为索引页）

**Step 1: 编写 index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>游戏列表</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Nunito:wght@600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="index.css">
</head>
<body>
  <div class="bg-decor">
    <div class="cloud cloud-1"></div>
    <div class="cloud cloud-2"></div>
    <div class="cloud cloud-3"></div>
    <div class="candy-hill hill-1"></div>
    <div class="candy-hill hill-2"></div>
    <div class="candy-hill hill-3"></div>
  </div>

  <main class="index-main">
    <h1 class="index-title">选个游戏玩吧</h1>
    <div class="game-grid">
      <a href="tube-pour/" class="game-card" style="animation-delay: 0.1s">
        <span class="game-icon" aria-hidden="true">🧪</span>
        <h2 class="game-name">试管倒水</h2>
        <p class="game-desc">把同色液体倒进同一根试管</p>
      </a>
      <!-- 后续新游戏在此追加 -->
    </div>
  </main>
</body>
</html>
```

**Step 2: 删除根目录冗余游戏文件**

```bash
rm -f game.js style.css audio.js audio.css
rm -rf sounds
git add -u
```

根目录保留 index.html、index.css；tube-pour/ 包含完整游戏。

**Step 3: 浏览器验证**

- 打开根 index.html，应看到「选个游戏玩吧」和「试管倒水」卡片
- 点击卡片进入 tube-pour/，游戏正常运行
- 从 tube-pour 可通过浏览器后退或修改 URL 回到根

**Step 4: Commit**

```bash
git add index.html
git add -u  # 包含删除的 game.js, style.css 等
git commit -m "feat: add game index page, remove migrated files from root"
```

---

## Task 5: 验证并更新 README

**Files:**
- Modify: `README.md`（若存在）

**Step 1: 手动验证清单**

- [ ] 根 `/` 显示游戏索引页，风格为糖果梦境
- [ ] 试管倒水卡片可点击，跳转至 tube-pour/
- [ ] tube-pour 游戏功能正常（选关、倒水、音效等）
- [ ] `node tools/diagnose-levels.js` 正常输出

**Step 2: 更新 README**

若 README 中有「运行 index.html 开始游戏」等描述，改为「打开 index.html 选择游戏，或直接打开 tube-pour/ 玩试管倒水」。

**Step 3: Commit**

```bash
git add README.md
git commit -m "docs: update README for new project structure"
```

---

## 执行顺序与注意事项

1. **Task 1** 与 **Task 2** 可先完成迁移与 tools 更新，确保 tube-pour 独立可运行。
2. **Task 3** 与 **Task 4** 创建索引页，注意 index.css 不要引入 tube-pour/style.css，避免样式污染。
3. 删除根目录 game.js、style.css 等应在确认 tube-pour 完整且索引页就绪后进行，避免中间状态损坏。

## 后续添加新游戏

1. 新建 `<game-id>/` 目录，放入 index.html、style.css、game.js 等
2. 在根 index.html 的 `.game-grid` 内增加一张 `<a href="<game-id>/" class="game-card">` 卡片
