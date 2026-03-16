(function (root, factory) {
  if (typeof module !== "undefined" && module.exports) {
    module.exports = factory();
    return;
  }
  root.TubePourLevelGenerator = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var PALETTE = [
    "#FF6B6B", "#4ECDC4", "#95E86C", "#FFD93D",
    "#C084FC", "#FF6B9D", "#FF9F43", "#54A0FF",
    "#5CD5E0", "#F093FB", "#FDCB6E", "#6C88DA"
  ];

  var RUNTIME_PRESETS = {
    easy:   { numColors: [2, 2], numTubes: [3, 4] },
    medium: { numColors: [2, 3], numTubes: [4, 5] },
    hard:   { numColors: [3, 5], numTubes: [4, 6] },
    expert: { numColors: [5, 7], numTubes: [6, 8] }
  };

  function seededRandom(seed) {
    var s = seed | 0;
    return function () {
      s = (s * 1103515245 + 12345) >>> 0;
      return (s % 0x10000) / 0x10000;
    };
  }

  function pickInRange(range, rnd) {
    rnd = rnd || Math.random;
    if (Array.isArray(range) && range.length === 2) {
      var lo = range[0];
      var hi = range[1];
      return lo + Math.floor(rnd() * (hi - lo + 1));
    }
    return range;
  }

  function resolvePresetParams(presetKey, rnd) {
    var preset = RUNTIME_PRESETS[presetKey];
    if (!preset) return null;
    return {
      numColors: pickInRange(preset.numColors, rnd),
      numTubes: pickInRange(preset.numTubes, rnd)
    };
  }

  function shuffleArray(array, rnd) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(rnd() * (i + 1));
      var tmp = array[i];
      array[i] = array[j];
      array[j] = tmp;
    }
    return array;
  }

  function deepCloneTubes(tubes) {
    return tubes.map(function (row) { return row.slice(); });
  }

  function topSegmentLength(tube) {
    if (!tube || tube.length === 0) return 0;
    var color = tube[tube.length - 1];
    var count = 0;
    for (var i = tube.length - 1; i >= 0 && tube[i] === color; i--) count++;
    return count;
  }

  function isUniformTube(tube) {
    if (!tube || tube.length === 0) return false;
    for (var i = 1; i < tube.length; i++) {
      if (tube[i] !== tube[0]) return false;
    }
    return true;
  }

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

  function serializeTubes(tubes) {
    return tubes.map(function (tube) {
      return tube.join(",");
    }).join("|");
  }

  function canPour(tubes, capacity, from, to) {
    if (from === to) return false;
    var src = tubes[from];
    var dst = tubes[to];
    if (!src || src.length === 0) return false;
    if (dst.length >= capacity) return false;
    if (dst.length === 0) return true;
    return dst[dst.length - 1] === src[src.length - 1];
  }

  function getPourAmount(tubes, capacity, from, to) {
    var srcLen = topSegmentLength(tubes[from]);
    var free = capacity - tubes[to].length;
    return Math.min(srcLen, free);
  }

  function performPour(tubes, from, to, amount) {
    var color = tubes[from][tubes[from].length - 1];
    for (var i = 0; i < amount; i++) {
      tubes[from].pop();
      tubes[to].push(color);
    }
  }

  function countSingleColorTubes(tubes) {
    var count = 0;
    for (var i = 0; i < tubes.length; i++) {
      if (tubes[i].length >= 2 && isUniformTube(tubes[i])) count++;
    }
    return count;
  }

  function maxSegmentLength(tubes) {
    var max = 0;
    for (var i = 0; i < tubes.length; i++) {
      var tube = tubes[i];
      if (tube.length === 0) continue;
      var run = 1;
      for (var j = 1; j < tube.length; j++) {
        if (tube[j] === tube[j - 1]) run++;
        else run = 1;
        if (run > max) max = run;
      }
      if (run > max) max = run;
    }
    return max;
  }

  function countSolvedTubes(tubes) {
    var colorPositions = {};
    for (var i = 0; i < tubes.length; i++) {
      for (var j = 0; j < tubes[i].length; j++) {
        if (!colorPositions[tubes[i][j]]) colorPositions[tubes[i][j]] = {};
        colorPositions[tubes[i][j]][i] = true;
      }
    }
    var count = 0;
    for (var k = 0; k < tubes.length; k++) {
      if (!isUniformTube(tubes[k])) continue;
      var color = tubes[k][0];
      if (!colorPositions[color]) continue;
      if (Object.keys(colorPositions[color]).length === 1) count++;
    }
    return count;
  }

  function validateLevel(level) {
    if (!level || !level.tubes || level.tubes.length < 2) {
      return { ok: false, message: "关卡数据无效" };
    }
    var capacity = level.capacity || 4;
    var colorCount = {};
    var hasNonFull = false;
    for (var i = 0; i < level.tubes.length; i++) {
      var t = level.tubes[i];
      if (t.length < capacity) hasNonFull = true;
      if (t.length > capacity) return { ok: false, message: "关卡数据无效" };
      for (var j = 0; j < t.length; j++) {
        var c = t[j];
        colorCount[c] = (colorCount[c] || 0) + 1;
      }
    }
    for (var key in colorCount) {
      if (colorCount[key] > capacity) return { ok: false, message: "关卡数据无效" };
    }
    if (!hasNonFull && !isLevelComplete(level.tubes)) {
      return { ok: false, message: "关卡数据无效" };
    }
    return { ok: true };
  }

  function getForwardPourOptions(tubes, capacity) {
    var options = [];
    for (var from = 0; from < tubes.length; from++) {
      for (var to = 0; to < tubes.length; to++) {
        if (!canPour(tubes, capacity, from, to)) continue;
        var amount = getPourAmount(tubes, capacity, from, to);
        if (amount <= 0) continue;
        options.push({ from: from, to: to, amount: amount });
      }
    }
    return options;
  }

  function scoreMove(tubes, capacity, move) {
    var next = deepCloneTubes(tubes);
    performPour(next, move.from, move.to, move.amount);
    var target = next[move.to];
    var source = next[move.from];
    var score = 0;

    if (target.length === capacity && isUniformTube(target)) score += 100;
    if (source.length === 0) score += 15;
    if (target.length > 0 && isUniformTube(target)) score += 10;
    if (source.length > 0 && isUniformTube(source)) score += 5;
    score += move.amount;
    score -= countSingleColorTubes(next);
    score -= maxSegmentLength(next);

    return score;
  }

  function solveLevel(level, options) {
    options = options || {};
    var capacity = level.capacity || 4;
    var start = deepCloneTubes(level.tubes);
    var startKey = serializeTubes(start);
    var maxStates = options.maxStates || 250000;
    var trackPath = !!options.trackPath;
    var stack = [{ tubes: start, path: trackPath ? [] : null }];
    var visited = {};
    var explored = 0;
    visited[startKey] = true;

    while (stack.length > 0) {
      var current = stack.pop();
      explored++;
      if (isLevelComplete(current.tubes)) {
        return {
          solvable: true,
          path: trackPath ? current.path : null,
          exploredStates: explored
        };
      }
      if (explored >= maxStates) break;

      var moves = getForwardPourOptions(current.tubes, capacity)
        .sort(function (a, b) {
          return scoreMove(current.tubes, capacity, a) - scoreMove(current.tubes, capacity, b);
        });

      for (var i = 0; i < moves.length; i++) {
        var move = moves[i];
        var next = deepCloneTubes(current.tubes);
        performPour(next, move.from, move.to, move.amount);
        var key = serializeTubes(next);
        if (visited[key]) continue;
        visited[key] = true;
        stack.push({
          tubes: next,
          path: trackPath ? current.path.concat([move]) : null
        });
      }
    }

    return {
      solvable: false,
      path: null,
      exploredStates: explored
    };
  }

  function getParams(levelId) {
    if (levelId <= 25) {
      var n = levelId - 1;
      return { numColors: 2, numTubes: n % 2 === 0 ? 3 : 4 };
    }
    if (levelId <= 55) {
      var n2 = levelId - 26;
      return { numColors: 2 + (n2 % 2), numTubes: 4 + (n2 % 2) };
    }
    if (levelId <= 80) {
      var n3 = levelId - 56;
      var colors = 3 + (n3 % 3);
      return { numColors: colors, numTubes: colors + 1 };
    }
    var n4 = levelId - 81;
    var colors2 = 5 + (n4 % 3);
    return { numColors: colors2, numTubes: colors2 + 1 };
  }

  function getLevelRules(levelId) {
    if (levelId <= 25) {
      return { allowedMaxSeg: 4, disallowSingleColor: false, preferredMaxSeg: 2 + (levelId % 2), mutationSteps: 18 };
    }
    if (levelId <= 55) {
      return { allowedMaxSeg: 3, disallowSingleColor: false, preferredMaxSeg: 2 + (levelId % 2), mutationSteps: 26 };
    }
    if (levelId <= 80) {
      return { allowedMaxSeg: 2, disallowSingleColor: true, preferredMaxSeg: levelId % 3 === 0 ? 2 : 1, mutationSteps: 40 };
    }
    return { allowedMaxSeg: 2, disallowSingleColor: true, preferredMaxSeg: 2, mutationSteps: 54 };
  }

  function tubePatternType(tube) {
    if (tube.length < 4) return "";
    if (tube[0] === tube[2] && tube[1] === tube[3] && tube[0] !== tube[1]) return "abab";
    if (tube[0] === tube[1] && tube[2] === tube[3] && tube[0] !== tube[2]) return "aabb";
    return "";
  }

  function diversityPenalty(tubes) {
    var nonEmpty = tubes.filter(function (tube) { return tube.length > 0; });
    var bySig = {};
    var byPattern = {};
    var penalty = 0;

    for (var i = 0; i < nonEmpty.length; i++) {
      var sig = nonEmpty[i].join(",");
      bySig[sig] = (bySig[sig] || 0) + 1;
      var pattern = tubePatternType(nonEmpty[i]);
      if (pattern) byPattern[pattern] = (byPattern[pattern] || 0) + 1;
    }

    for (var sigKey in bySig) {
      if (bySig[sigKey] > 1) penalty += (bySig[sigKey] - 1) * 18;
    }
    for (var patternKey in byPattern) {
      if (byPattern[patternKey] > 1) penalty += (byPattern[patternKey] - 1) * 8;
    }
    return penalty;
  }

  function scoreLevelCandidate(tubes, config) {
    var maxSeg = maxSegmentLength(tubes);
    var singleColor = countSingleColorTubes(tubes);
    var solved = countSolvedTubes(tubes);
    var score = 0;

    if (config.allowedMaxSeg && maxSeg > config.allowedMaxSeg) {
      score += 1000 + (maxSeg - config.allowedMaxSeg) * 100;
    }
    if (config.disallowSingleColor && singleColor > 0) {
      score += 1000 + singleColor * 120;
    }

    score += singleColor * 70;
    score += solved * 25;
    score += diversityPenalty(tubes);
    score += Math.abs(maxSeg - config.preferredMaxSeg) * 16;

    return score;
  }

  function getFilledPositions(tubes) {
    var positions = [];
    for (var i = 0; i < tubes.length; i++) {
      for (var j = 0; j < tubes[i].length; j++) {
        positions.push({ tube: i, index: j });
      }
    }
    return positions;
  }

  function swapCells(tubes, a, b) {
    var tmp = tubes[a.tube][a.index];
    tubes[a.tube][a.index] = tubes[b.tube][b.index];
    tubes[b.tube][b.index] = tmp;
  }

  function rotateTube(tubes, tubeIndex, amount) {
    var tube = tubes[tubeIndex];
    if (!tube || tube.length < 2) return;
    amount = amount % tube.length;
    if (amount === 0) return;
    var moved = tube.splice(tube.length - amount, amount);
    Array.prototype.unshift.apply(tube, moved);
  }

  function randomMutation(tubes, rnd) {
    var next = deepCloneTubes(tubes);
    var choice = Math.floor(rnd() * 3);
    var filled = getFilledPositions(next);
    if (filled.length < 2) return next;

    if (choice === 0) {
      var a = filled[Math.floor(rnd() * filled.length)];
      var b = filled[Math.floor(rnd() * filled.length)];
      if (a.tube === b.tube && a.index === b.index) return next;
      swapCells(next, a, b);
      return next;
    }

    var nonEmpty = next
      .map(function (tube, idx) { return { tube: tube, idx: idx }; })
      .filter(function (entry) { return entry.tube.length >= 2; });
    if (nonEmpty.length === 0) return next;

    var picked = nonEmpty[Math.floor(rnd() * nonEmpty.length)];
    if (choice === 1) {
      rotateTube(next, picked.idx, 1 + Math.floor(rnd() * Math.max(1, picked.tube.length - 1)));
    } else {
      var t = next[picked.idx];
      var left = Math.floor(rnd() * t.length);
      var right = Math.floor(rnd() * t.length);
      var tmp = t[left];
      t[left] = t[right];
      t[right] = tmp;
    }
    return next;
  }

  function buildBasePattern(numColors, variant) {
    var rows = [];
    var base = [];
    for (var color = 1; color <= numColors; color++) base.push(color);

    if (variant === 0) {
      for (var layer = 0; layer < 4; layer++) {
        rows.push(base.slice(layer).concat(base.slice(0, layer)));
      }
      return rows;
    }

    if (variant === 1) {
      var reversed = base.slice().reverse();
      rows.push(base.slice());
      rows.push(reversed.slice());
      rows.push(base.slice(1).concat(base.slice(0, 1)));
      rows.push(reversed.slice(1).concat(reversed.slice(0, 1)));
      return rows;
    }

    rows.push(base.slice());
    rows.push(base.slice(2).concat(base.slice(0, 2)));
    rows.push(base.slice(1).concat(base.slice(0, 1)));
    rows.push(base.slice(3).concat(base.slice(0, 3)));
    return rows;
  }

  function buildLayeredCandidate(numColors, numTubes, capacity, rnd, config) {
    var columns = [];
    var variant = Math.floor(rnd() * 3);
    var rows = buildBasePattern(numColors, variant);

    for (var i = 0; i < numColors; i++) columns.push([]);

    for (var layer = 0; layer < capacity; layer++) {
      var row = rows[layer % rows.length].slice();
      var placed = false;

      for (var attempt = 0; attempt < 250 && !placed; attempt++) {
        shuffleArray(row, rnd);
        placed = true;
        for (var col = 0; col < numColors; col++) {
          var tube = columns[col];
          var len = tube.length;
          if (len >= 1 && tube[len - 1] === row[col] && config.allowedMaxSeg <= 2) {
            placed = false;
            break;
          }
          if (len >= 2 && tube[len - 1] === row[col] && tube[len - 2] === row[col]) {
            placed = false;
            break;
          }
        }
      }

      if (!placed) return null;

      for (var col2 = 0; col2 < numColors; col2++) {
        columns[col2].push(row[col2]);
      }
    }

    var tubes = columns.map(function (tube) { return tube.slice(); });
    for (var e = 0; e < numTubes - numColors; e++) tubes.push([]);
    return tubes;
  }

  function mutateCandidate(tubes, config, rnd) {
    var current = deepCloneTubes(tubes);
    var currentScore = scoreLevelCandidate(current, config);
    var best = deepCloneTubes(current);
    var bestScore = currentScore;

    for (var step = 0; step < config.mutationSteps; step++) {
      var next = randomMutation(current, rnd);
      if (isLevelComplete(next)) continue;
      if (config.allowedMaxSeg && maxSegmentLength(next) > config.allowedMaxSeg) continue;
      if (config.disallowSingleColor && countSingleColorTubes(next) > 0) continue;

      var score = scoreLevelCandidate(next, config);
      if (score < bestScore) {
        best = deepCloneTubes(next);
        bestScore = score;
      }
      if (score <= currentScore || rnd() < 0.18) {
        current = next;
        currentScore = score;
      }
    }

    return best;
  }

  function buildGenerationConfig(options) {
    var allowedMaxSeg = options.allowedMaxSeg || 4;
    return {
      id: options.id == null ? -1 : options.id,
      capacity: options.capacity || 4,
      numColors: options.numColors,
      numTubes: options.forceOneEmpty ? options.numColors + 1 : Math.max(options.numTubes, options.numColors + 1),
      allowedMaxSeg: allowedMaxSeg,
      disallowSingleColor: !!options.disallowSingleColor,
      preferredMaxSeg: options.preferredMaxSeg || Math.min(allowedMaxSeg, 2),
      mutationSteps: options.mutationSteps || 24,
      maxAttempts: options.maxAttempts || 400,
      maxStates: options.maxStates || (allowedMaxSeg <= 2 ? 300000 : 120000)
    };
  }

  function generateLevelWithConfig(options) {
    var config = buildGenerationConfig(options);
    var rnd = options.random || Math.random;
    var bestLevel = null;
    var bestScore = Infinity;

    for (var attempt = 0; attempt < config.maxAttempts; attempt++) {
      var base = buildLayeredCandidate(config.numColors, config.numTubes, config.capacity, rnd, config);
      if (!base) continue;
      var tubes = mutateCandidate(base, config, rnd);
      var level = {
        id: config.id,
        capacity: config.capacity,
        tubes: tubes,
        colors: PALETTE.slice(0, config.numColors)
      };
      var validity = validateLevel(level);
      if (!validity.ok) continue;
      if (isLevelComplete(tubes)) continue;
      if (config.allowedMaxSeg && maxSegmentLength(tubes) > config.allowedMaxSeg) continue;
      if (config.disallowSingleColor && countSingleColorTubes(tubes) > 0) continue;

      var solveResult = solveLevel(level, { maxStates: config.maxStates });
      if (!solveResult.solvable) continue;

      var score = scoreLevelCandidate(tubes, config);
      if (score < bestScore) {
        bestScore = score;
        bestLevel = level;
      }
    }

    if (!bestLevel) {
      throw new Error("failed to generate solvable level");
    }
    return bestLevel;
  }

  function buildManualLevel(levelId) {
    if (levelId === 1) {
      return { id: 1, capacity: 4, tubes: [[1, 2, 1], [2, 1, 2], []], colors: PALETTE.slice(0, 2) };
    }
    if (levelId === 2) {
      return { id: 2, capacity: 4, tubes: [[1, 2], [2, 1], [1, 2], []], colors: PALETTE.slice(0, 2) };
    }
    if (levelId === 3) {
      return { id: 3, capacity: 4, tubes: [[1, 2, 3], [3, 1, 2], [2, 3, 1], []], colors: PALETTE.slice(0, 3) };
    }
    return null;
  }

  function generateLevelByRules(levelId, options) {
    options = options || {};
    var manual = buildManualLevel(levelId);
    if (manual) return manual;

    var params = getParams(levelId);
    var rules = getLevelRules(levelId);
    var seed = options.seed !== undefined ? options.seed : (levelId * 7919);

    return generateLevelWithConfig({
      id: levelId,
      numColors: params.numColors,
      numTubes: params.numTubes,
      capacity: 4,
      allowedMaxSeg: rules.allowedMaxSeg,
      disallowSingleColor: rules.disallowSingleColor,
      preferredMaxSeg: rules.preferredMaxSeg,
      mutationSteps: rules.mutationSteps,
      maxAttempts: options.maxAttempts || 500,
      maxStates: options.maxStates || (rules.allowedMaxSeg <= 2 ? 300000 : 120000),
      forceOneEmpty: levelId >= 56,
      random: seededRandom(seed)
    });
  }

  function generateCustomLevel(options) {
    var randomFn = options.seed !== undefined ? seededRandom(options.seed) : (options.random || Math.random);
    return generateLevelWithConfig({
      id: options.id == null ? -1 : options.id,
      numColors: options.numColors,
      numTubes: options.numTubes,
      capacity: options.capacity || 4,
      allowedMaxSeg: options.allowedMaxSeg || (options.hardConstraints ? 2 : (options.numColors >= 3 ? 3 : 4)),
      disallowSingleColor: !!options.hardConstraints,
      preferredMaxSeg: options.preferredMaxSeg || (options.hardConstraints ? 2 : Math.min(3, options.numColors)),
      mutationSteps: options.mutationSteps || (options.hardConstraints ? 40 : 24),
      maxAttempts: options.maxAttempts || 400,
      maxStates: options.maxStates || (options.hardConstraints ? 220000 : 100000),
      forceOneEmpty: !!options.forceOneEmpty,
      random: randomFn
    });
  }

  return {
    PALETTE: PALETTE,
    RUNTIME_PRESETS: RUNTIME_PRESETS,
    canPour: canPour,
    countSingleColorTubes: countSingleColorTubes,
    countSolvedTubes: countSolvedTubes,
    deepCloneTubes: deepCloneTubes,
    generateCustomLevel: generateCustomLevel,
    generateLevelByRules: generateLevelByRules,
    getForwardPourOptions: getForwardPourOptions,
    getLevelRules: getLevelRules,
    getParams: getParams,
    getPourAmount: getPourAmount,
    isLevelComplete: isLevelComplete,
    isUniformTube: isUniformTube,
    maxSegmentLength: maxSegmentLength,
    performPour: performPour,
    pickInRange: pickInRange,
    resolvePresetParams: resolvePresetParams,
    seededRandom: seededRandom,
    serializeTubes: serializeTubes,
    shuffleArray: shuffleArray,
    solveLevel: solveLevel,
    topSegmentLength: topSegmentLength,
    validateLevel: validateLevel
  };
});
