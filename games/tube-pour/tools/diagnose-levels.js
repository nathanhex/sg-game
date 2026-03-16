/**
 * 诊断脚本：分析 game.js 中 LEVELS 数组的问题、混合度与可解性
 * 设计文档: docs/plans/2026-03-04-tube-pour-level-design-and-generation.md
 * 运行: node games/tube-pour/tools/diagnose-levels.js
 */

var fs = require("fs");
var core = require("./level-generator-core.js");
var src = fs.readFileSync(__dirname + "/../js/game.js", "utf-8");
var match = src.match(/var LEVELS = \[([\s\S]*?)\];/);
if (!match) { console.error("无法提取 LEVELS"); process.exit(1); }
var LEVELS;
eval("LEVELS = [" + match[1] + "]");

console.log("=== 关卡诊断报告 ===\n");

var completeLevels = [];
var singleColorLevels = [];
var easyHardLevels = [];
var maxSegmentViolations = []; // id>=56 且 max 连续段 >2
var hardSingleColorViolations = []; // id>=56 且仍有整管同色
var unsolvableLevels = [];
var perLevelStats = {};

for (var i = 0; i < LEVELS.length; i++) {
  var level = LEVELS[i];
  var tubes = level.tubes;
  var numColors = level.colors.length;
  var nonEmptyTubes = tubes.filter(function(t) { return t.length > 0; }).length;
  var singleColor = core.countSingleColorTubes(tubes);
  var solved = core.countSolvedTubes(tubes);
  var complete = core.isLevelComplete(tubes);
  var maxSeg = core.maxSegmentLength(tubes);
  var solveResult = core.solveLevel(level, {
    maxStates: level.id >= 56 ? 300000 : 120000
  });
  perLevelStats[level.id] = {
    singleColor: singleColor,
    solved: solved,
    complete: complete,
    maxSeg: maxSeg,
    solvable: solveResult.solvable
  };

  if (complete) completeLevels.push(level.id);
  if (singleColor > 0) singleColorLevels.push({ id: level.id, count: singleColor, total: nonEmptyTubes });
  if (level.id >= 51 && solved >= numColors - 2) {
    easyHardLevels.push({ id: level.id, solved: solved, numColors: numColors, pctSolved: Math.round(solved/numColors*100) });
  }
  if (level.id >= 56 && singleColor > 0) {
    hardSingleColorViolations.push({ id: level.id, count: singleColor });
  }
  if (level.id >= 56 && maxSeg > 2) {
    maxSegmentViolations.push({ id: level.id, maxSeg: maxSeg });
  }
  if (!solveResult.solvable) {
    unsolvableLevels.push({ id: level.id, explored: solveResult.exploredStates });
  }
}

console.log("【问题1】开局就有整管同色的关卡（共 " + singleColorLevels.length + " 关）：");
singleColorLevels.forEach(function(l) {
  console.log("  关卡 " + l.id + ": " + l.count + "/" + l.total + " 根非空管为单色");
});

console.log("\n【问题2】开局即通关的关卡（共 " + completeLevels.length + " 关）：");
console.log("  " + completeLevels.join(", "));

console.log("\n【问题3】困难/挑战段（51-100关）难度过低的关卡（已归位管 >= 颜色数-2）：");
console.log("  共 " + easyHardLevels.length + " 关：");
easyHardLevels.forEach(function(l) {
  console.log("  关卡 " + l.id + ": " + l.solved + "/" + l.numColors + " 色已归位 (" + l.pctSolved + "%)");
});

console.log("\n【问题4】困难/挑战段（56-100关）单管最大连续同色 > 2（不符合档位混合度）：");
if (maxSegmentViolations.length === 0) {
  console.log("  无");
} else {
  console.log("  共 " + maxSegmentViolations.length + " 关：");
  maxSegmentViolations.forEach(function(l) {
    console.log("  关卡 " + l.id + ": max 连续段 = " + l.maxSeg);
  });
}

console.log("\n【问题5】困难/挑战段（56-100关）仍有整管同色的关卡：");
if (hardSingleColorViolations.length === 0) {
  console.log("  无");
} else {
  console.log("  共 " + hardSingleColorViolations.length + " 关：");
  hardSingleColorViolations.forEach(function(l) {
    console.log("  关卡 " + l.id + ": 单色管数 = " + l.count);
  });
}

console.log("\n【问题6】求解器未找到解的关卡：");
if (unsolvableLevels.length === 0) {
  console.log("  无");
} else {
  console.log("  共 " + unsolvableLevels.length + " 关：");
  unsolvableLevels.forEach(function(l) {
    console.log("  关卡 " + l.id + ": 搜索状态数 = " + l.explored);
  });
}

// 段落统计
console.log("\n=== 段落难度统计 ===");
var segments = [
  { name: "入门 (1-20)", from: 1, to: 20 },
  { name: "进阶 (21-50)", from: 21, to: 50 },
  { name: "困难 (51-80)", from: 51, to: 80 },
  { name: "挑战 (81-100)", from: 81, to: 100 }
];
segments.forEach(function(seg) {
  var segLevels = LEVELS.filter(function(l) { return l.id >= seg.from && l.id <= seg.to; });
  var totalSingleColor = 0, totalSolved = 0, totalComplete = 0, totalColors = 0, totalMaxSeg = 0, totalUnsolvable = 0;
  segLevels.forEach(function(l) {
    var stats = perLevelStats[l.id];
    totalSingleColor += stats.singleColor;
    totalSolved += stats.solved;
    totalComplete += stats.complete ? 1 : 0;
    totalColors += l.colors.length;
    totalMaxSeg += stats.maxSeg;
    if (!stats.solvable) totalUnsolvable++;
  });
  var avgSingleColor = (totalSingleColor / segLevels.length).toFixed(1);
  var avgSolved = (totalSolved / segLevels.length).toFixed(1);
  var avgColors = (totalColors / segLevels.length).toFixed(1);
  var avgMaxSeg = (totalMaxSeg / segLevels.length).toFixed(1);
  var viol = seg.from >= 56 ? segLevels.filter(function(l) { return perLevelStats[l.id].maxSeg > 2; }).length : 0;
  var hardSingleViol = seg.from >= 56 ? segLevels.filter(function(l) { return perLevelStats[l.id].singleColor > 0; }).length : 0;
  console.log("\n" + seg.name + " (共" + segLevels.length + "关):");
  console.log("  平均颜色数: " + avgColors);
  console.log("  平均开局单色管数: " + avgSingleColor);
  console.log("  平均开局已归位管数: " + avgSolved);
  console.log("  平均单管最大连续同色: " + avgMaxSeg);
  if (seg.from >= 56) console.log("  不符合混合度(max>2)的关数: " + viol);
  if (seg.from >= 56) console.log("  高难单色管违规关数: " + hardSingleViol);
  console.log("  求解器未通过: " + totalUnsolvable + " 关");
  console.log("  开局即通关: " + totalComplete + " 关");
});

/* 诊断结论：存在问题时以非零退出，便于 CI/脚本判断「未通过」 */
var hasFailure =
  completeLevels.length > 0 ||
  maxSegmentViolations.length > 0 ||
  hardSingleColorViolations.length > 0 ||
  unsolvableLevels.length > 0;
if (hasFailure) {
  console.log("\n>>> 诊断未通过：存在开局即通关、56-100 关混合度(max>2)违规、高难单色管违规，或求解器未通过的关卡，请重新生成或修复关卡。");
  process.exit(1);
}
console.log("\n>>> 诊断通过：无开局即通关，56-100 关均满足单管最大连续同色 ≤ 2、整管同色数为 0，且求解器验证通过。");
