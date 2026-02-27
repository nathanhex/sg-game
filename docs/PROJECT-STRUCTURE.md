# sg-game 项目目录规范

本文档为 sg-game 儿童游戏合集的项目目录规范。**新增游戏时须遵循本规范。**

---

## 1. 项目整体结构

```
sg-game/
├── index.html              # 游戏索引页入口
├── index.css               # 索引页样式
├── README.md
├── .gitignore
│
├── shared/                 # 共享资源（可选，按需引入）
│   ├── fonts.css
│   └── tokens.css
│
├── games/                  # 游戏子目录（统一入口）
│   ├── tube-pour/          # 试管倒水
│   └── <game-id>/          # 后续游戏
│
└── docs/                   # 设计与实施文档
    ├── plans/
    └── PROJECT-STRUCTURE.md  # 本规范文档
```

**工具归属原则：** 若工具只服务某一款游戏，放在该游戏目录下 `tools/`；若工具服务于多游戏或全项目，放在根 `tools/`。

---

## 2. 单游戏目录规范

每个 `games/<game-id>/` **必须**遵循以下固定结构：

### 2.1 固定结构

```
games/<game-id>/
├── index.html       # 游戏主页面入口
├── css/             # 样式统一放此目录
│   ├── style.css    # 主样式（必须）
│   └── audio.css    # 音效 UI 样式（有音效时）
├── js/              # 脚本统一放此目录
│   ├── game.js      # 游戏逻辑（必须）
│   └── audio.js     # 音效逻辑（有音效时）
├── sounds/          # 音效文件（有音效时，可为空目录）
├── cover.png        # 索引页卡片封面，建议 440×220 或 2:1
└── tools/           # 该游戏专属工具（有则放，无则空）
```

### 2.2 必须文件

| 路径 | 说明 |
|------|------|
| `index.html` | 游戏主页面 |
| `css/style.css` | 主样式 |
| `js/game.js` | 游戏逻辑 |
| `cover.png` | 索引页封面 |

### 2.3 可选文件（按需）

| 路径 | 说明 |
|------|------|
| `css/audio.css` | 音效相关 UI |
| `js/audio.js` | 音效逻辑 |
| `sounds/*.wav` | 音效文件（小写、连字符命名） |

### 2.4 目录约定

| 目录 | 用途 |
|------|------|
| `css/` | 所有样式文件 |
| `js/` | 所有脚本文件 |
| `sounds/` | 音效资源 |
| `tools/` | 游戏专属工具，引用用 `../js/game.js` 等 |

---

## 3. 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 游戏 ID | 小写、连字符 | `tube-pour`, `memory-match`, `match-three` |
| 游戏目录 | 与 game-id 一致 | `games/tube-pour/` |
| 封面图 | `cover.png` 或 `cover.jpg` | `games/tube-pour/cover.png` |
| 音效 | 小写、连字符、.wav | `pour.wav`, `error.wav` |
| 样式 | 放 `css/`，主样式 `style.css`、音效 UI `audio.css` | `css/style.css` |
| 脚本 | 放 `js/`，逻辑 `game.js`、音效 `audio.js` | `js/game.js` |

---

## 4. 路径与引用规范

- **索引页引用封面：** `games/<game-id>/cover.png`
- **索引页链接游戏：** `href="games/<game-id>/"`
- **游戏 index.html 引用：** `href="css/style.css"`、`href="css/audio.css"`、`src="js/game.js"`、`src="js/audio.js"`
- **游戏内 fetch（如音效）：** `fetch("sounds/pour.wav")`（相对当前页面 URL）
- **tools 内引用游戏文件：** `__dirname + "/../js/game.js"`

---

## 5. 新增游戏检查清单

- [ ] 创建 `games/<game-id>/` 及 `css/`、`js/`、`sounds/`、`tools/` 子目录
- [ ] 放入 `index.html`，引用 `css/style.css`、`js/game.js`
- [ ] 若有音效：`css/audio.css`、`js/audio.js`、`sounds/`
- [ ] 提供 `cover.png`，在根 `index.html` 增加卡片
- [ ] 若有专属工具：放入 `tools/`，路径如 `__dirname + "/../js/game.js"`
- [ ] 更新 `README.md` 游戏列表
