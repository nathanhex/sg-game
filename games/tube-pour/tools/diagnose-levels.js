/**
 * 诊断脚本：分析 game.js 中 LEVELS 数组的三个问题
 * 1. 开局就有整管同色
 * 2. 开局就是通关状态
 * 3. 困难/挑战段难度过低
 *
 * 运行: node games/tube-pour/tools/diagnose-levels.js
 */

// 从 game.js 中提取 LEVELS 数据
var fs = require("fs");
var src = fs.readFileSync(__dirname + "/../js/game.js", "utf-8");
var match = src.match(/var LEVELS = \[([\s\S]*?)\];/);
if (!match) { console.error("无法提取 LEVELS"); process.exit(1); }
var LEVELS;
eval("LEVELS = [" + match[1] + "]");

function isLevelComplete(tubes) {
  var colorToTube = {};
  for (var i = 0; i < tubes.length; i++) {
    var t = tubes[i];
    if (t.length === 0) continue;
    var first = t[0];
    for (var j = 1; j < t.length; j++) {
      if (t[j] !== first) return false;
    }
    if (colorToTube[first] !== undefined && colorToTube[first] !== i) return false;
    colorToTube[first] = i;
  }
  return true;
}

/** 统计单色管（长度>=1，全部同色） */
function countSingleColorTubes(tubes) {
  var count = 0;
  for (var i = 0; i < tubes.length; i++) {
    var t = tubes[i];
    if (t.length === 0) continue;
    var first = t[0];
    var same = true;
    for (var j = 1; j < t.length; j++) {
      if (t[j] !== first) { same = false; break; }
    }
    if (same) count++;
  }
  return count;
}

/** 统计"已归位"管：单色且该颜色只出现在这一根管中 */
function countSolvedTubes(tubes) {
  var colorPositions = {};
  for (var i = 0; i < tubes.length; i++) {
    var t = tubes[i];
    for (var j = 0; j < t.length; j++) {
      if (!colorPositions[t[j]]) colorPositions[t[j]] = new Set();
      colorPositions[t[j]].add(i);
    }
  }
  var count = 0;
  for (var i = 0; i < tubes.length; i++) {
    var t = tubes[i];
    if (t.length === 0) continue;
    var first = t[0];
    var same = true;
    for (var j = 1; j < t.length; j++) {
      if (t[j] !== first) { same = false; break; }
    }
    if (same && colorPositions[first] && colorPositions[first].size === 1) count++;
  }
  return count;
}

console.log("=== 关卡诊断报告 ===\n");

var completeLevels = [];
var singleColorLevels = [];
var easyHardLevels = [];

for (var i = 0; i < LEVELS.length; i++) {
  var level = LEVELS[i];
  var tubes = level.tubes;
  var numColors = level.colors.length;
  var nonEmptyTubes = tubes.filter(function(t) { return t.length > 0; }).length;
  var singleColor = countSingleColorTubes(tubes);
  var solved = countSolvedTubes(tubes);
  var complete = isLevelComplete(tubes);

  if (complete) completeLevels.push(level.id);
  if (singleColor > 0) singleColorLevels.push({ id: level.id, count: singleColor, total: nonEmptyTubes });
  if (level.id >= 51 && solved >= numColors - 2) {
    easyHardLevels.push({ id: level.id, solved: solved, numColors: numColors, pctSolved: Math.round(solved/numColors*100) });
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

// 段落统计
console.log("\n=== 段落难度统计 ===");
var segments = [
  { name: "入门 (1-20)", from: 1, to: 20 },
  { name: "进阶 (21-50)", from: 21, to: 50 },
  { name: "困难 (51-80)", from: 51, to: 80 },
  { name: "挑战 (81-100)", from: 81, to: 100 }
];
segments.forEach(function(seg) {
  var levels = LEVELS.filter(function(l) { return l.id >= seg.from && l.id <= seg.to; });
  var totalSingleColor = 0, totalSolved = 0, totalComplete = 0, totalColors = 0;
  levels.forEach(function(l) {
    totalSingleColor += countSingleColorTubes(l.tubes);
    totalSolved += countSolvedTubes(l.tubes);
    totalComplete += isLevelComplete(l.tubes) ? 1 : 0;
    totalColors += l.colors.length;
  });
  var avgSingleColor = (totalSingleColor / levels.length).toFixed(1);
  var avgSolved = (totalSolved / levels.length).toFixed(1);
  var avgColors = (totalColors / levels.length).toFixed(1);
  console.log("\n" + seg.name + " (共" + levels.length + "关):");
  console.log("  平均颜色数: " + avgColors);
  console.log("  平均开局单色管数: " + avgSingleColor);
  console.log("  平均开局已归位管数: " + avgSolved);
  console.log("  开局即通关: " + totalComplete + " 关");
});
