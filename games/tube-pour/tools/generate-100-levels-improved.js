/**
 * 生成 100 关关卡数据（改进版：避免整管同色）。
 * 运行: node games/tube-pour/tools/generate-100-levels-improved.js
 * 输出可替换 games/tube-pour/js/game.js 中的 LEVELS 数组。
 */

var PALETTE = [
  "#FF6B6B", "#4ECDC4", "#95E86C", "#FFD93D",
  "#C084FC", "#FF6B9D", "#FF9F43", "#54A0FF",
  "#5CD5E0", "#F093FB", "#FDCB6E", "#6C88DA"
];

function seededRandom(seed) {
  var s = seed | 0;
  return function () {
    s = (s * 1103515245 + 12345) >>> 0;
    return (s % 0x10000) / 0x10000;
  };
}

/** 辅助函数：数组洗牌 */
function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/** 检查是否存在完整的单色试管 */
function hasFullSingleColorTubes(tubes, capacity) {
  for (var i = 0; i < tubes.length; i++) {
    var tube = tubes[i];
    if (tube.length === capacity) {
      // 检查是否所有元素都相同
      var firstColor = tube[0];
      var allSame = tube.every(color => color === firstColor);
      if (allSame) return true;
    }
  }
  return false;
}

/** 改进的种子状态生成：分散式布局 */
function getImprovedSeedState(numColors, numTubes, capacity) {
  capacity = capacity || 4;
  var tubes = Array(numTubes).fill().map(() => []);

  // 将每种颜色尽可能分散到不同的试管中，避免整管同色
  for (var color = 1; color <= numColors; color++) {
    // 为每种颜色随机分配放置位置
    for (var i = 0; i < capacity; i++) {
      // 计算一个相对分散的位置，避免颜色集中
      var tubeIndex = (color - 1 + i * numColors) % numTubes;
      if (tubes[tubeIndex].length < capacity) {
        tubes[tubeIndex].push(color);
      } else {
        // 如果计算的试管已满，寻找下一个可用试管
        for (var j = 0; j < numTubes; j++) {
          var candidateIndex = (tubeIndex + j + 1) % numTubes;
          if (tubes[candidateIndex].length < capacity) {
            tubes[candidateIndex].push(color);
            break;
          }
        }
      }
    }
  }

  // 随机打乱每个试管内的顺序，使其更加混乱
  for (var i = 0; i < tubes.length; i++) {
    shuffleArray(tubes[i]);
  }

  return tubes;
}

function topSegmentLength(tube) {
  if (!tube || tube.length === 0) return 0;
  var color = tube[tube.length - 1];
  var count = 0;
  for (var i = tube.length - 1; i >= 0 && tube[i] === color; i--) count++;
  return count;
}

/** 反向倾倒选项：从 from 取顶部一段放到 to（用于从种子状态搅乱，保证可解） */
function getReversePourOptions(tubes, capacity) {
  var options = [];
  for (var from = 0; from < tubes.length; from++) {
    if (tubes[from].length === 0) continue;
    var srcTop = tubes[from][tubes[from].length - 1];
    var segLen = topSegmentLength(tubes[from]);
    for (var to = 0; to < tubes.length; to++) {
      if (to === from) continue;
      if (tubes[to].length >= capacity) continue;
      var canReceive = tubes[to].length === 0 || tubes[to][tubes[to].length - 1] === srcTop;
      if (!canReceive) continue;
      var free = capacity - tubes[to].length;
      var amount = Math.min(segLen, free);
      if (amount > 0) options.push({ from: from, to: to, amount: amount });
    }
  }
  return options;
}

function performReversePour(tubes, from, to, amount) {
  var seg = [];
  for (var i = 0; i < amount; i++) seg.unshift(tubes[from].pop());
  for (var i = 0; i < amount; i++) tubes[to].push(seg[i]);
}

/** 统计「整管同色」的试管数（长度>=2 且全部同色），用于尽量让开局更混合 */
function countSingleColorTubes(tubes) {
  var count = 0;
  for (var i = 0; i < tubes.length; i++) {
    var t = tubes[i];
    if (t.length < 2) continue;
    var first = t[0];
    var same = true;
    for (var j = 1; j < t.length; j++) {
      if (t[j] !== first) { same = false; break; }
    }
    if (same) count++;
  }
  return count;
}

/** 与 game.js 过关判定一致：每管空或单色，且同色只在一管中 */
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

function deepCloneTubes(tubes) {
  return tubes.map(function (row) { return row.slice(); });
}

/** 根据关卡号返回 (numColors, numTubes)；仅用于 4–100 关 */
function getParams(levelId) {
  if (levelId <= 20) {
    var n = levelId - 1;
    return { numColors: 2, numTubes: n % 2 === 0 ? 3 : 4 };
  }
  if (levelId <= 50) {
    var n2 = levelId - 21;
    return { numColors: 2 + (n2 % 2), numTubes: 4 + (n2 % 2) };
  }
  if (levelId <= 80) {
    var n3 = levelId - 51;
    var colors = 5 + (n3 % 2);
    return { numColors: colors, numTubes: colors + 1 };
  }
  var n4 = levelId - 81;
  var colors = 6 + (n4 % 2);
  return { numColors: colors, numTubes: colors + 1 };
}

/** 搅乱步数：随关卡递增；困难/挑战段约 2 倍步数 */
function getScrambleSteps(levelId) {
  if (levelId <= 10) return 4 + (levelId % 4);
  if (levelId <= 30) return 8 + (levelId % 6);
  if (levelId <= 50) return 12 + (levelId % 8);
  if (levelId <= 80) return 32 + (levelId % 12);
  return 44 + (levelId % 14);
}

function generateLevel(levelId) {
  if (levelId === 1) {
    return { id: 1, capacity: 4, tubes: [[1, 2, 1], [2, 1, 2], []], colors: PALETTE.slice(0, 2) };
  }
  if (levelId === 2) {
    return { id: 2, capacity: 4, tubes: [[1, 2], [2, 1], [1, 2], []], colors: PALETTE.slice(0, 2) };
  }
  if (levelId === 3) {
    return { id: 3, capacity: 4, tubes: [[1, 2, 3], [3, 1, 2], [2, 3, 1], []], colors: PALETTE.slice(0, 3) };
  }

  var capacity = 4;
  var params = getParams(levelId);
  var numColors = params.numColors;
  var numTubes = params.numTubes;
  var tubes = getImprovedSeedState(numColors, numTubes, capacity);
  var rnd = seededRandom(levelId * 7919);
  var steps = getScrambleSteps(levelId);

  for (var s = 0; s < steps; s++) {
    var options = getReversePourOptions(tubes, capacity);
    if (options.length === 0) break;

    // 优选不会产生整管同色的倾倒操作
    var filteredOptions = options.filter(opt => {
      var next = deepCloneTubes(tubes);
      performReversePour(next, opt.from, opt.to, opt.amount);
      return !hasFullSingleColorTubes(next, capacity);
    });

    // 如果没有避免整管同色的选择，则允许原逻辑
    var selectedOptions = filteredOptions.length > 0 ? filteredOptions : options;
    var best = [];
    var bestCount = -1;
    for (var o = 0; o < selectedOptions.length; o++) {
      var opt = selectedOptions[o];
      var next = deepCloneTubes(tubes);
      performReversePour(next, opt.from, opt.to, opt.amount);
      var c = countSingleColorTubes(next);
      if (bestCount < 0 || c < bestCount) {
        bestCount = c;
        best = [opt];
      } else if (c === bestCount) {
        best.push(opt);
      }
    }
    var opt = best[Math.floor(rnd() * best.length)];
    performReversePour(tubes, opt.from, opt.to, opt.amount);
  }

  /* 若搅乱后恰好是过关状态，换种子并减少步数重试，避免选关进入即过关 */
  var seedOffset = 0;
  var stepsToUse = steps;
  while (isLevelComplete(tubes) && seedOffset < 300) {
    seedOffset++;
    tubes = getImprovedSeedState(numColors, numTubes, capacity);
    rnd = seededRandom(levelId * 7919 + seedOffset * 2654435761);
    stepsToUse = Math.max(10, Math.floor(steps * 0.6) - seedOffset * 3);
    for (var s = 0; s < stepsToUse; s++) {
      var options = getReversePourOptions(tubes, capacity);
      if (options.length === 0) break;

      // 优选不会产生整管同色的倾倒操作
      var filteredOptions = options.filter(opt => {
        var next = deepCloneTubes(tubes);
        performReversePour(next, opt.from, opt.to, opt.amount);
        return !hasFullSingleColorTubes(next, capacity);
      });

      // 如果没有避免整管同色的选择，则允许原逻辑
      var selectedOptions = filteredOptions.length > 0 ? filteredOptions : options;
      var best = [];
      var bestCount = -1;
      for (var o = 0; o < selectedOptions.length; o++) {
        var opt = selectedOptions[o];
        var next = deepCloneTubes(tubes);
        performReversePour(next, opt.from, opt.to, opt.amount);
        var c = countSingleColorTubes(next);
        if (bestCount < 0 || c < bestCount) {
          bestCount = c;
          best = [opt];
        } else if (c === bestCount) {
          best.push(opt);
        }
      }
      var opt = best[Math.floor(rnd() * best.length)];
      performReversePour(tubes, opt.from, opt.to, opt.amount);
    }
  }

  return {
    id: levelId,
    capacity: capacity,
    tubes: tubes,
    colors: PALETTE.slice(0, numColors)
  };
}

function validateLevel(level) {
  var capacity = level.capacity;
  var tubes = level.tubes;
  if (!tubes || tubes.length < 2) return false;
  var colorCount = {};
  var hasNonFull = false;
  for (var i = 0; i < tubes.length; i++) {
    var t = tubes[i];
    if (t.length < capacity) hasNonFull = true;
    if (t.length > capacity) return false;
    for (var j = 0; j < t.length; j++) {
      var c = t[j];
      colorCount[c] = (colorCount[c] || 0) + 1;
    }
  }
  for (var k in colorCount) {
    if (colorCount[k] > capacity) return false;
  }
  return true;
}

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
  var level = generateLevel(id);
  if (!validateLevel(level)) {
    console.error("validate failed for level " + id);
    process.exit(1);
  }
  levels.push(level);
}

console.log("  var LEVELS = [");
for (var i = 0; i < levels.length; i++) {
  console.log(formatLevel(levels[i]) + (i < levels.length - 1 ? "," : ""));
}
console.log("  ];");