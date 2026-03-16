var assert = require("assert");
var core = require("./level-generator-core.js");
var shared = require("../js/level-generator-shared.js");

function test(name, fn) {
  try {
    fn();
    console.log("PASS " + name);
  } catch (err) {
    console.error("FAIL " + name);
    throw err;
  }
}

test("solver finds a solution for a known solvable level", function () {
  var result = core.solveLevel({
    capacity: 4,
    tubes: [[1, 2, 1], [2, 1, 2], []]
  }, { trackPath: true });

  assert.strictEqual(result.solvable, true);
  assert.ok(Array.isArray(result.path));
  assert.ok(result.path.length > 0);
});

test("tool core re-exports the shared browser/node implementation", function () {
  assert.strictEqual(core.generateLevelByRules, shared.generateLevelByRules);
  assert.strictEqual(core.solveLevel, shared.solveLevel);
});

test("hard level generation returns a solvable mixed layout", function () {
  var level = core.generateLevelByRules(56);
  var result = core.solveLevel(level, { maxStates: 300000 });

  assert.strictEqual(core.isLevelComplete(level.tubes), false);
  assert.strictEqual(core.maxSegmentLength(level.tubes) <= 2, true);
  assert.strictEqual(core.countSingleColorTubes(level.tubes), 0);
  assert.strictEqual(result.solvable, true);
});

test("generated hard level keeps exactly capacity cells for each color", function () {
  var level = core.generateLevelByRules(82);
  var counts = {};

  level.tubes.forEach(function (tube) {
    tube.forEach(function (color) {
      counts[color] = (counts[color] || 0) + 1;
    });
  });

  for (var color = 1; color <= level.colors.length; color++) {
    assert.strictEqual(counts[color], level.capacity);
  }
});

test("generated hard range contains some max-segment-2 layouts for variety", function () {
  var countWithTwo = 0;

  for (var id = 56; id <= 70; id++) {
    if (core.maxSegmentLength(core.generateLevelByRules(id).tubes) === 2) {
      countWithTwo++;
    }
  }

  assert.ok(countWithTwo >= 5);
});

test("early generated range is not dominated by only two repeated layouts", function () {
  var unique = {};

  for (var id = 4; id <= 15; id++) {
    unique[core.serializeTubes(core.generateLevelByRules(id).tubes)] = true;
  }

  assert.ok(Object.keys(unique).length >= 6);
});
