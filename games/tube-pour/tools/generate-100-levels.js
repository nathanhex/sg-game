/**
 * 生成 100 关关卡数据（候选局面生成 + 正向求解器验收）。
 * 设计文档: docs/plans/2026-03-04-tube-pour-level-design-and-generation.md
 * 运行: node games/tube-pour/tools/generate-100-levels.js
 * 输出可替换 games/tube-pour/js/game.js 中的 LEVELS 数组。
 */

var core = require("./level-generator-core.js");

function formatTube(arr) {
  return "[" + arr.join(", ") + "]";
}

function formatLevel(level) {
  var tubesStr = level.tubes.map(formatTube).join(", ");
  var colorsStr = level.colors.map(function (c) { return '"' + c + '"'; }).join(", ");
  return (
    "    { id: " + level.id + ", capacity: " + level.capacity + ",\n" +
    "      tubes: [" + tubesStr + "],\n" +
    "      colors: [" + colorsStr + "] }"
  );
}

var levels = [];
for (var id = 1; id <= 100; id++) {
  var level = core.generateLevelByRules(id);
  var validity = core.validateLevel(level);
  if (!validity.ok) {
    console.error("validate failed for level " + id + ": " + validity.message);
    process.exit(1);
  }
  if (core.isLevelComplete(level.tubes)) {
    console.error("level " + id + " must not start complete");
    process.exit(1);
  }
  if (id >= 56 && core.maxSegmentLength(level.tubes) > 2) {
    console.error("level " + id + " violates hard max segment length");
    process.exit(1);
  }
  if (id >= 56 && core.countSingleColorTubes(level.tubes) > 0) {
    console.error("level " + id + " still has single-color tubes");
    process.exit(1);
  }
  levels.push(level);
}

console.log("  var LEVELS = [");
for (var i = 0; i < levels.length; i++) {
  console.log(formatLevel(levels[i]) + (i < levels.length - 1 ? "," : ""));
}
console.log("  ];");
