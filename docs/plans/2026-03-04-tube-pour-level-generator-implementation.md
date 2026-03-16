# 倒水关卡生成器与诊断工具 — 实现计划

> **设计依据：** `docs/plans/2026-03-04-tube-pour-level-design-and-generation.md`

**目标：** 按设计文档实现“候选局面生成 + 正向求解器验收”的新生成流程，以及诊断工具的新指标输出。

**范围：**
- 修改 `games/tube-pour/tools/generate-100-levels.js`：移除对伪“反向倒水”流程的依赖，改为候选局面生成、评分、求解器验收、门控与重试兜底。
- 修改 `games/tube-pour/tools/diagnose-levels.js`：增加 maxSegmentLength、按档位混合度是否符合（如 id≥56 时 max≤2），并预留/接入求解校验能力。

---

### Task 1: 生成器 — 候选局面生成与求解器验收

**文件：** `games/tube-pour/tools/generate-100-levels.js`

- 新增 `maxSegmentLength(tubes)`：单管最大连续同色长度。
- 新增候选构造逻辑：根据关卡档位直接生成混合开局，而不是从 `getReversePourOptions` 做伪反向搅乱。
- 在候选评分中至少考虑：`maxSegmentLength`、整管同色数、已归位管数量，以及固定模板重复度（例如大量 `[a,b,b,b]` 链式结构）。
- 困难/非常困难（id≥56）将 `maxSegmentLength≤2` 与整管同色数=0 作为硬门槛；简单/中等可使用较宽松门槛。
- 新增正向求解器：按真实倒水规则枚举合法移动、序列化状态、去重搜索，并返回“可解/不可解”结果；可选记录解长。
- 门控：候选局面若 `validateLevel` 不通过、`isLevelComplete` 为 true、混合度不达标、或求解器未找到解，则直接重试。
- 兜底：达到重试上限后，只能在“已求解通过”的候选中选评分最优者；若无候选通过，则显式报错，不允许静默回退到低质量方案。

### Task 2: 诊断工具 — max 连续段、档位符合性与求解校验

**文件：** `games/tube-pour/tools/diagnose-levels.js`

- 新增 `maxSegmentLength(tubes)`（与生成器一致）。
- 每关统计 max 连续段、整管同色数；对 id≥56 检查 max≤2，输出不符合的关卡。
- 可选复用生成器中的求解器，对每关做离线可解性检查；若无解则直接报错。
- 在现有【问题1】【问题2】【问题3】后增加【问题4】单管最大连续同色>2 的关卡（56–100），并可在段落统计中增加「平均 max 连续段」「不符合档位混合度的关数」。

### Task 3: 运行生成器并替换 LEVELS（可选）

- 运行 `node games/tube-pour/tools/generate-100-levels.js`，将输出粘贴替换 `game.js` 中 LEVELS 数组；在 game.js 或注释中标明生成器版本与日期。
- 运行 `node games/tube-pour/tools/diagnose-levels.js` 验证新关卡满足设计文档要求。
- 若保留 `generate-100-levels-improved.js`，需在文档或文件头部明确其为实验脚本；未接入求解器验收前，不应作为正式产出来源。
