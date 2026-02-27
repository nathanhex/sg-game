# sg-game

儿童向小游戏合集，采用糖果梦境（Candy Dreamland）主题风格。纯前端实现，无需构建工具，打开即玩。

## 游戏列表

| 游戏 | 简介 | 路径 |
|------|------|------|
| 🧪 试管倒水 | 把同色液体倒进同一根试管，100 关内置关卡 + 随机生成无限关 | `games/tube-pour/` |

### 试管倒水

- **100 关精心设计的内置关卡**，从入门到进阶循序渐进
- **4 个难度档位**：简单、中等、困难、非常困难，另支持自定义参数（颜色数量、试管数量）
- **音效 & 语音播报**：倒水、成功、错误等音效反馈，可在设置中独立开关
- **倒水动画**：SVG 液柱动画，视觉效果流畅
- **自动死锁检测**：无法继续操作时自动提示重试

## 快速开始

```bash
# 克隆项目
git clone https://github.com/nathanhex/sg-game.git
cd sg-game

# 直接打开 index.html 即可
open index.html        # macOS
xdg-open index.html    # Linux
start index.html       # Windows
```

也可以使用任意静态文件服务器：

```bash
# 使用 Python 自带服务器
python3 -m http.server 8080

# 或使用 Node.js 的 npx
npx serve .
```

然后访问 `http://localhost:8080`。

## 项目结构

```
sg-game/
├── index.html          # 游戏索引页入口
├── index.css           # 索引页样式
├── CNAME               # GitHub Pages 自定义域名
│
├── shared/             # 共享资源（字体、设计令牌等）
│
├── games/              # 游戏子目录
│   └── tube-pour/      # 试管倒水
│       ├── index.html
│       ├── css/        # 样式（style.css, audio.css）
│       ├── js/         # 逻辑（game.js, audio.js）
│       ├── sounds/     # 音效文件
│       ├── cover.png   # 索引页封面
│       └── tools/      # 诊断 & 生成工具
│
└── docs/               # 设计与实施文档
    ├── plans/
    └── PROJECT-STRUCTURE.md
```

## 工具

`games/tube-pour/tools/` 下提供了以下辅助工具：

| 工具 | 用途 |
|------|------|
| `diagnose-levels.js` | 验证关卡数据的合法性和可解性 |
| `generate-100-levels.js` | 批量生成关卡数据 |
| `generate-sounds.html` | 在浏览器中生成游戏音效 WAV 文件 |

## 音效

试管倒水的音效通过 Web Audio API 生成。如需重新生成：

1. 在浏览器打开 `games/tube-pour/tools/generate-sounds.html`
2. 点击按钮生成各音效 WAV 文件
3. 将生成的文件放入 `games/tube-pour/sounds/`

## 添加新游戏

1. 在 `games/` 下创建游戏目录（小写连字符命名，如 `memory-match`）
2. 按照以下结构添加必需文件：
   - `index.html` — 游戏主页面
   - `css/style.css` — 主样式
   - `js/game.js` — 游戏逻辑
   - `cover.png` — 索引页封面（建议 440×220 或 2:1 比例）
3. 在根目录 `index.html` 中添加游戏卡片链接
4. 更新本 README 的游戏列表

详细规范请参阅 [`docs/PROJECT-STRUCTURE.md`](docs/PROJECT-STRUCTURE.md)。

## 技术栈

- **纯 HTML / CSS / JavaScript**，无框架依赖
- **Web Audio API** 生成和播放音效
- **SVG** 实现倒水动画
- **CSS 动画** 实现 UI 过渡效果
- **GitHub Pages** 部署

## License

[Apache License 2.0](LICENSE)
