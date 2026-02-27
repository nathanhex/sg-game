# 试管倒水游戏 — 实现计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 实现可在浏览器中运行的多关卡试管倒水益智游戏（纯 HTML/CSS/JS），面向 10 岁以下儿童，含完整规则、关卡校验、儿童向多反馈。

**Architecture:** 单页：`index.html` 提供骨架与挂载点，`style.css` 负责布局与视觉（试管、液体、选中态、弹层、动效），`game.js` 持有关卡数据与状态、倾倒与过关逻辑、事件绑定与 DOM 更新。无构建、无后端。

**Tech Stack:** HTML5, CSS3 (variables, flexbox, transition/transform), Vanilla JavaScript (ES5+)。参考文档：`docs/试管倒水游戏-规则说明.md`、`docs/plans/2026-02-12-试管倒水-design.md`。

---

## Task 1: 创建 HTML 骨架

**Files:**
- Create: `index.html`

**Step 1:** 在项目根目录创建 `index.html`，包含：
- `<!DOCTYPE html>`，`<html lang="zh-CN">`，`<head>` 中引入 `style.css`，`<title>` 试管倒水游戏。
- `<body>` 内：顶部操作栏（当前关卡文案、选关按钮、重新开始、取消）、试管容器 `#tubes-container`（空，由 JS 填充）、过关弹层 `#win-modal`、死局弹层 `#deadlock-modal`、可选提示条 `#toast`。
- 底部引入 `game.js`。

**Step 2:** 验证  
用浏览器打开 `index.html`，页面无报错、能看到操作栏和空白试管区域及弹层结构。

---

## Task 2: 创建 CSS 基础与布局

**Files:**
- Create: `style.css`

**Step 1:** 创建 `style.css`。定义 CSS 变量：主背景色、试管边框与圆角、默认液体色板（至少 4 种鲜明颜色）、选中高亮色、按钮主色、弹层遮罩色。采用设计文档 §8 的「柔和游戏风（儿童版）」：浅色背景、圆角、饱满。

**Step 2:** 布局：顶部操作栏 flex 横向、居中；试管区域居中、flex 横向排列、间距一致；弹层 fixed 全屏、半透明遮罩、内容居中；按钮最小点击区域约 48px，字号足够大。

**Step 3:** 验证  
刷新页面，操作栏与试管区域布局正确，弹层默认隐藏（通过 class 或 display），风格统一。

---

## Task 3: 试管与液体样式及选中态

**Files:**
- Modify: `style.css`

**Step 1:** 试管：`.tube` 为竖长条、固定宽度与最大高度（由 capacity 决定）、圆角、边框、内部 flex 纵向、从下往上排列「格」。每格 `.tube-cell` 固定高度（由 capacity 计算），可填背景色表示液体；空格透明或浅灰。

**Step 2:** 液体：用 `.tube-cell.filled` 或按颜色 class 上色；同一试管内同色连续格视觉上连续（无缝隙）。颜色来自 JS 设置的 inline style 或 data 属性 + CSS 变量。

**Step 3:** 选中态：`.tube.selected` 外框加粗、高亮色（如金黄）、轻微 scale(1.05)、transition 0.15–0.2s。可选呼吸式阴影。

**Step 4:** 验证  
在 HTML 中手写 2 根试管、每根 4 格、部分填色，刷新后样式与选中态（手动加 class）符合设计。

---

## Task 4: 弹层、按钮与提示条样式

**Files:**
- Modify: `style.css`

**Step 1:** 过关弹层：标题「过关啦！」、副文案、按钮「下一关」「再玩一次」「选关」。居中卡片、圆角、主按钮突出。显示时遮罩淡入、卡片轻微缩放+淡入（设计文档 §8.5）。

**Step 2:** 死局弹层：鼓励文案「现在动不了啦，点「再试一次」重新排一排吧」、按钮「再试一次」。风格与过关弹层一致，不刺眼。

**Step 3:** 提示条 #toast：固定底部或顶部，短文案（如「这根已经满啦」）、温和橙色背景、几秒后淡出；用于无效倾倒等儿童向提示。

**Step 4:** 选关面板：点击「选关」后展示关卡列表（网格或列表），当前关高亮，点击关卡号切换。可放在弹层或折叠区。

**Step 5:** 验证  
在 HTML 中临时显示两个弹层和 toast，确认样式与动效符合儿童向设计。

---

## Task 5: game.js — 关卡数据与默认颜色

**Files:**
- Create: `game.js`

**Step 1:** 定义默认颜色数组 `DEFAULT_COLORS`（如 4 种十六进制，鲜明易区分）。定义 `LEVELS` 数组，每项为 `{ id, capacity, tubes, colors? }`。`tubes[i]` 为从底到顶的颜色 ID 数组，空试管为 `[]`。

**Step 2:** 实现至少 3 关可玩关卡：每关满足规则文档「关卡设计约束」（每种颜色总格数 ≤ capacity、至少一根试管非满、试管数 ≥ 2）。示例：第 1 关 2 色 2 管+1 空管，第 2 关 2 色 3 管+1 空管，第 3 关 3 色 3 管+1 空管。

**Step 3:** 验证  
在控制台打印 `LEVELS` 与每关校验（见 Task 6），无报错。

---

## Task 6: game.js — 状态与关卡校验

**Files:**
- Modify: `game.js`

**Step 1:** 状态变量：`currentLevelIndex = 0`，`currentTubes = []`（二维数组），`selectedTubeIndex = null`。

**Step 2:** 实现 `deepCloneTubes(tubes)`，返回 `tubes` 的深拷贝。

**Step 3:** 实现 `validateLevel(level)`：校验试管数 ≥ 2；每根长度 ≤ capacity；每种颜色总格数 ≤ capacity；至少一根试管非满或已过关（可调用过关判定）；颜色 ID 在有效范围。校验失败返回 `{ ok: false, message: '关卡数据无效' }`，成功返回 `{ ok: true }`。

**Step 4:** 验证  
对 `LEVELS` 每关调用 `validateLevel`，合法关通过；构造非法关卡（如某颜色超过 capacity）调用后返回 `ok: false`。

---

## Task 7: game.js — 过关判定与倾倒规则

**Files:**
- Modify: `game.js`

**Step 1:** 实现 `isLevelComplete(tubes)`：遍历每根试管，若长度 > 1 则检查是否全部同色，若长度 <= 1 则视为通过；有一根含两种颜色则未过关。

**Step 2:** 实现 `getTopSegmentLength(tubes, tubeIndex)`：返回该试管顶部连续同色格数（若空返回 0）。

**Step 3:** 实现 `canPour(sourceIdx, targetIdx)`：若源=目标、源空、目标满、颜色不匹配（目标非空且目标顶 ≠ 源顶）返回 false；否则返回 true。

**Step 4:** 实现 `getPourAmount(sourceIdx, targetIdx)`：返回 min(源顶部同色长度, 目标剩余空位)。

**Step 5:** 实现 `performPour(sourceIdx, targetIdx)`：根据 `getPourAmount` 从 `currentTubes[sourceIdx]` 顶部移出 N 格，依次 push 到 `currentTubes[targetIdx]`；不修改除这两个试管外的状态。保证仅在被允许时调用（由调用方保证）。

**Step 6:** 验证  
在控制台用构造的 `currentTubes` 调用上述函数，检查过关判定、canPour 与 performPour 结果与规则文档一致。

---

## Task 8: game.js — 渲染试管与绑定容器

**Files:**
- Modify: `game.js`

**Step 1:** 实现 `renderTubes()`：清空 `#tubes-container`，根据 `currentTubes` 与当前关卡 `capacity`、`colors` 生成每根试管的 DOM（每格一个元素，设置背景色）；为每根试管加 `data-tube-index`，并加 class `selected` 当且仅当 `selectedTubeIndex === index`。将试管元素挂到容器。

**Step 2:** 试管点击事件委托到 `#tubes-container`：取 `data-tube-index`，若为无效则 return；否则调用统一的「处理试管点击」逻辑（见 Task 9）。

**Step 3:** 验证  
设置 `currentLevelIndex = 0`、`currentTubes` 为第一关深拷贝，调用 `renderTubes()`，刷新页面后看到正确颜色与格数；点击试管可在控制台看到 index。

---

## Task 9: game.js — 点击逻辑与加载关卡

**Files:**
- Modify: `game.js`

**Step 1:** 实现 `loadLevel(index)`：若 `index` 越界则 return。取 `LEVELS[index]`，执行 `validateLevel`；失败则 alert 或 toast「关卡数据无效」并 return。`currentLevelIndex = index`，`currentTubes = deepCloneTubes(level.tubes)`，`selectedTubeIndex = null`。若 `isLevelComplete(currentTubes)` 则显示过关弹层（开局即过关）。否则调用 `renderTubes()`，隐藏过关/死局弹层。

**Step 2:** 实现「处理试管点击」逻辑：无选中时若该管非空则 `selectedTubeIndex = idx` 并 render；若该管空则 showToast「这根是空的，选一根有颜色的吧」。已选中同一根则取消选中并 render。已选中另一根则若 canPour 则 performPour、清空选中、render、再若 isLevelComplete 则显示过关弹层；否则若无效则 showToast（目标已满 / 要倒到相同颜色或空试管哦）、不取消选中、可选目标试管抖动（见 Task 10）。

**Step 3:** 实现「重新开始本关」：`loadLevel(currentLevelIndex)`。

**Step 4:** 实现「下一关」：隐藏过关弹层，`loadLevel(currentLevelIndex + 1)`。「再玩一次」：隐藏过关弹层，`loadLevel(currentLevelIndex)`。

**Step 5:** 绑定操作栏按钮：选关、重新开始、取消（取消选中并 render）、过关弹层内下一关/再玩一次/选关、死局弹层内再试一次。页面加载时调用 `loadLevel(0)`。

**Step 6:** 验证  
在浏览器中玩第一关：选源、选目标、倾倒、过关后点下一关；点重新开始恢复初始状态；选空试管或无效目标有提示且选中态保持。

---

## Task 10: game.js — 死局检测与选关 UI

**Files:**
- Modify: `game.js`

**Step 1:** 实现 `hasValidMove()`：遍历任意 (i, j) 且 i !== j，若 canPour(i, j) 则返回 true；否则返回 false。

**Step 2:** 在每次 performPour 成功后、且未过关时，若 !hasValidMove() 则显示死局弹层，文案为设计文档中的鼓励语。

**Step 3:** 选关：点击「选关」显示关卡列表（如 1–N 的按钮或网格），点击某关则 `loadLevel(index)` 并关闭选关面板。

**Step 4:** 验证  
玩到死局（或构造死局）时出现死局弹层；选关可切换关卡并正确加载。

---

## Task 11: 儿童向反馈强化（动效与文案）

**Files:**
- Modify: `style.css`, `game.js`

**Step 1:** 选中态：试管已有 .selected 样式；在 JS 中为选中的试管添加 class 后，确保有轻微弹跳或光晕（CSS 已包含 transition 与 scale）。

**Step 2:** 倾倒动画：在 `performPour` 后不立即 `renderTubes()`，而是先更新 `currentTubes`，再在下一帧或 setTimeout(0) 后调用 `renderTubes()`，保证 CSS transition 生效（液体高度变化 0.3–0.5s）。若当前渲染是按格高度计算，则更新数据后重绘即可触发 transition。

**Step 3:** 无效目标反馈：当点击无效目标时，给目标试管元素加 class `.shake`，0.2s 后移除；showToast 对应文案（「这根已经满啦」「要倒到相同颜色或空试管哦」）。CSS 中 `.shake` 为短促左右抖动 keyframes。

**Step 4:** 过关弹层：显示时使用已有淡入+缩放；可选过关文案随机 2–3 句（「太棒了！」「过关啦！」「你真会动脑筋！」）。

**Step 5:** 验证  
在浏览器中完整走一遍：选中→高亮与弹跳感，有效倾倒→液体平滑变化，无效目标→抖动+toast，过关→庆祝弹层。确认符合设计文档 §7、§8。

---

## Definition of Done（v1）

- [ ] 至少 3 关可玩，关卡数据通过校验。
- [ ] 规则与规则文档一致：倾倒、过关判定、取消选择、无效目标不取消选中。
- [ ] 选关、重新开始、下一关、再玩一次、死局再试一次均可用。
- [ ] 儿童向反馈：选中高亮、倾倒动效、无效抖动+toast、过关庆祝弹层、死局鼓励弹层。
- [ ] 在 Chrome 或 Safari 桌面/移动端可正常操作，无控制台报错。
