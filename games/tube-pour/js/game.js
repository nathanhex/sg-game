(function () {
  "use strict";

  /* 糖果梦境配色 — 高饱和、高辨识度、儿童友好 */
  var DEFAULT_COLORS = ["#FF6B6B", "#4ECDC4", "#95E86C", "#FFD93D"];
  var PALETTE = [
    "#FF6B6B",  /* 珊瑚红 */
    "#4ECDC4",  /* 海洋蓝 */
    "#95E86C",  /* 青柠绿 */
    "#FFD93D",  /* 阳光黄 */
    "#C084FC",  /* 葡萄紫 */
    "#FF6B9D",  /* 泡泡粉 */
    "#FF9F43",  /* 蜜橘橙 */
    "#54A0FF",  /* 天空蓝 */
    "#5CD5E0",  /* 薄荷青 */
    "#F093FB",  /* 樱花粉 */
    "#FDCB6E",  /* 蜂蜜金 */
    "#6C88DA"   /* 矢车菊蓝 */
  ];
  var LEVELS = [
    { id: 1, capacity: 4,
      tubes: [[1, 2, 1], [2, 1, 2], []],
      colors: ["#FF6B6B", "#4ECDC4"] },
    { id: 2, capacity: 4,
      tubes: [[1, 2], [2, 1], [1, 2], []],
      colors: ["#FF6B6B", "#4ECDC4"] },
    { id: 3, capacity: 4,
      tubes: [[1, 2, 3], [3, 1, 2], [2, 3, 1], []],
      colors: ["#FF6B6B", "#4ECDC4", "#95E86C"] },
    { id: 4, capacity: 4,
      tubes: [[1, 2, 1, 1], [2, 1, 2], [], [2]],
      colors: ["#FF6B6B", "#4ECDC4"] },
    { id: 5, capacity: 4,
      tubes: [[1, 2], [2, 1, 1, 1], [2, 2]],
      colors: ["#FF6B6B", "#4ECDC4"] },
    { id: 6, capacity: 4,
      tubes: [[1, 2, 2, 2], [2, 1], [1], [1]],
      colors: ["#FF6B6B", "#4ECDC4"] },
    { id: 7, capacity: 4,
      tubes: [[1, 2, 2, 2], [2], [1, 1, 1]],
      colors: ["#FF6B6B", "#4ECDC4"] },
    { id: 8, capacity: 4,
      tubes: [[1, 2, 1], [2, 1, 2, 2], [1], []],
      colors: ["#FF6B6B", "#4ECDC4"] },
    { id: 9, capacity: 4,
      tubes: [[1, 2, 2, 2], [2, 1], [1, 1]],
      colors: ["#FF6B6B", "#4ECDC4"] },
    { id: 10, capacity: 4,
      tubes: [[1, 2, 2, 2], [2, 1, 1], [1], []],
      colors: ["#FF6B6B", "#4ECDC4"] },
    { id: 11, capacity: 4,
      tubes: [[1, 1, 1, 1], [2, 2, 2, 2], []],
      colors: ["#FF6B6B", "#4ECDC4"] },
    { id: 12, capacity: 4,
      tubes: [[1, 2, 1, 1], [2, 1], [2, 2], []],
      colors: ["#FF6B6B", "#4ECDC4"] },
    { id: 13, capacity: 4,
      tubes: [[1, 1, 1, 1], [], [2, 2, 2, 2]],
      colors: ["#FF6B6B", "#4ECDC4"] },
    { id: 14, capacity: 4,
      tubes: [[1], [2, 1, 1, 1], [2, 2, 2], []],
      colors: ["#FF6B6B", "#4ECDC4"] },
    { id: 15, capacity: 4,
      tubes: [[1, 1, 1, 1], [2, 2, 2, 2], []],
      colors: ["#FF6B6B", "#4ECDC4"] },
    { id: 16, capacity: 4,
      tubes: [[1], [2, 1, 1, 1], [], [2, 2, 2]],
      colors: ["#FF6B6B", "#4ECDC4"] },
    { id: 17, capacity: 4,
      tubes: [[1, 1, 1, 1], [2, 2, 2, 2], []],
      colors: ["#FF6B6B", "#4ECDC4"] },
    { id: 18, capacity: 4,
      tubes: [[1, 2], [2, 1, 1, 1], [2, 2], []],
      colors: ["#FF6B6B", "#4ECDC4"] },
    { id: 19, capacity: 4,
      tubes: [[2, 2, 2, 2], [], [1, 1, 1, 1]],
      colors: ["#FF6B6B", "#4ECDC4"] },
    { id: 20, capacity: 4,
      tubes: [[1, 2, 1, 1], [1], [], [2, 2, 2]],
      colors: ["#FF6B6B", "#4ECDC4"] },
    { id: 21, capacity: 4,
      tubes: [[1, 1, 1], [2, 1, 2, 2], [2], []],
      colors: ["#FF6B6B", "#4ECDC4"] },
    { id: 22, capacity: 4,
      tubes: [[1, 2, 3, 3], [2, 2, 2], [3, 1, 1, 1], [3], []],
      colors: ["#FF6B6B", "#4ECDC4", "#95E86C"] },
    { id: 23, capacity: 4,
      tubes: [[1, 2, 2, 2], [2], [1, 1, 1], []],
      colors: ["#FF6B6B", "#4ECDC4"] },
    { id: 24, capacity: 4,
      tubes: [[1, 2, 2, 2], [2, 3, 3], [3, 1, 1, 1], [3], []],
      colors: ["#FF6B6B", "#4ECDC4", "#95E86C"] },
    { id: 25, capacity: 4,
      tubes: [[1, 2, 1, 1], [2, 1], [2], [2]],
      colors: ["#FF6B6B", "#4ECDC4"] },
    { id: 26, capacity: 4,
      tubes: [[1, 2, 2, 2], [2, 3, 3, 3], [3, 1, 1, 1], [], []],
      colors: ["#FF6B6B", "#4ECDC4", "#95E86C"] },
    { id: 27, capacity: 4,
      tubes: [[1], [2, 1, 1, 1], [2, 2, 2], []],
      colors: ["#FF6B6B", "#4ECDC4"] },
    { id: 28, capacity: 4,
      tubes: [[1, 2, 2, 2], [], [3, 1, 1, 1], [2], [3, 3, 3]],
      colors: ["#FF6B6B", "#4ECDC4", "#95E86C"] },
    { id: 29, capacity: 4,
      tubes: [[1, 1, 1], [2, 1, 2, 2], [], [2]],
      colors: ["#FF6B6B", "#4ECDC4"] },
    { id: 30, capacity: 4,
      tubes: [[1], [2, 3, 1, 1], [3, 1, 2, 2], [3, 3], [2]],
      colors: ["#FF6B6B", "#4ECDC4", "#95E86C"] },
    { id: 31, capacity: 4,
      tubes: [[1, 2, 2, 2], [1, 1, 1], [], [2]],
      colors: ["#FF6B6B", "#4ECDC4"] },
    { id: 32, capacity: 4,
      tubes: [[1, 2, 3, 3], [2, 3, 3], [], [1, 1, 1], [2, 2]],
      colors: ["#FF6B6B", "#4ECDC4", "#95E86C"] },
    { id: 33, capacity: 4,
      tubes: [[1, 2, 2, 2], [2], [1, 1, 1], []],
      colors: ["#FF6B6B", "#4ECDC4"] },
    { id: 34, capacity: 4,
      tubes: [[1, 2, 2, 2], [2, 3, 3, 3], [], [3], [1, 1, 1]],
      colors: ["#FF6B6B", "#4ECDC4", "#95E86C"] },
    { id: 35, capacity: 4,
      tubes: [[], [2, 1, 2, 2], [2], [1, 1, 1]],
      colors: ["#FF6B6B", "#4ECDC4"] },
    { id: 36, capacity: 4,
      tubes: [[1], [2, 3, 3, 3], [3, 1, 1, 1], [], [2, 2, 2]],
      colors: ["#FF6B6B", "#4ECDC4", "#95E86C"] },
    { id: 37, capacity: 4,
      tubes: [[2], [2, 1, 2, 2], [1, 1, 1], []],
      colors: ["#FF6B6B", "#4ECDC4"] },
    { id: 38, capacity: 4,
      tubes: [[1, 2, 2, 2], [2, 3, 3, 3], [], [1, 1, 1], [3]],
      colors: ["#FF6B6B", "#4ECDC4", "#95E86C"] },
    { id: 39, capacity: 4,
      tubes: [[], [2, 1, 2, 2], [2], [1, 1, 1]],
      colors: ["#FF6B6B", "#4ECDC4"] },
    { id: 40, capacity: 4,
      tubes: [[2], [2, 3, 3, 3], [3, 1, 2, 2], [1, 1, 1], []],
      colors: ["#FF6B6B", "#4ECDC4", "#95E86C"] },
    { id: 41, capacity: 4,
      tubes: [[1, 2, 2, 2], [2], [], [1, 1, 1]],
      colors: ["#FF6B6B", "#4ECDC4"] },
    { id: 42, capacity: 4,
      tubes: [[1, 2, 2, 2], [], [3, 1, 1, 1], [2], [3, 3, 3]],
      colors: ["#FF6B6B", "#4ECDC4", "#95E86C"] },
    { id: 43, capacity: 4,
      tubes: [[1, 2, 2, 2], [2], [1, 1, 1], []],
      colors: ["#FF6B6B", "#4ECDC4"] },
    { id: 44, capacity: 4,
      tubes: [[1, 2, 2, 2], [2], [3, 1, 1, 1], [3, 3, 3], []],
      colors: ["#FF6B6B", "#4ECDC4", "#95E86C"] },
    { id: 45, capacity: 4,
      tubes: [[2, 2, 2], [2, 1, 1, 1], [1], []],
      colors: ["#FF6B6B", "#4ECDC4"] },
    { id: 46, capacity: 4,
      tubes: [[1, 2, 2, 2], [3, 3, 3], [3, 1, 1, 1], [2], []],
      colors: ["#FF6B6B", "#4ECDC4", "#95E86C"] },
    { id: 47, capacity: 4,
      tubes: [[1, 2, 2, 2], [1, 1, 1], [], [2]],
      colors: ["#FF6B6B", "#4ECDC4"] },
    { id: 48, capacity: 4,
      tubes: [[1, 2, 3, 3], [2], [3, 1, 1, 1], [2, 2], [3]],
      colors: ["#FF6B6B", "#4ECDC4", "#95E86C"] },
    { id: 49, capacity: 4,
      tubes: [[1, 2, 2, 2], [2], [1, 1, 1], []],
      colors: ["#FF6B6B", "#4ECDC4"] },
    { id: 50, capacity: 4,
      tubes: [[1, 2, 2, 2], [2, 3, 3, 3], [3], [], [1, 1, 1]],
      colors: ["#FF6B6B", "#4ECDC4", "#95E86C"] },
    { id: 51, capacity: 4,
      tubes: [[1, 1, 1, 1], [2, 3, 3, 3], [3, 4, 4, 4], [4], [5, 5, 5, 5], [2, 2, 2]],
      colors: ["#FF6B6B", "#4ECDC4", "#95E86C", "#FFD93D", "#C084FC"] },
    { id: 52, capacity: 4,
      tubes: [[1, 2, 2, 2], [2], [3, 3, 3, 3], [4, 4, 4, 4], [5, 5, 5, 5], [6, 1, 1, 1], [6, 6, 6]],
      colors: ["#FF6B6B", "#4ECDC4", "#95E86C", "#FFD93D", "#C084FC", "#FF6B9D"] },
    { id: 53, capacity: 4,
      tubes: [[1, 2, 2, 2], [2], [3, 3, 3, 3], [4, 4, 4, 4], [5, 5, 5, 5], [1, 1, 1]],
      colors: ["#FF6B6B", "#4ECDC4", "#95E86C", "#FFD93D", "#C084FC"] },
    { id: 54, capacity: 4,
      tubes: [[1], [2, 2, 2, 2], [3, 3, 3, 3], [4, 4, 4, 4], [5, 5, 5, 5], [6, 1, 1, 1], [6, 6, 6]],
      colors: ["#FF6B6B", "#4ECDC4", "#95E86C", "#FFD93D", "#C084FC", "#FF6B9D"] },
    { id: 55, capacity: 4,
      tubes: [[1, 1, 1, 1], [2, 2, 2, 2], [3, 3, 3, 3], [4, 4, 4, 4], [5], [5, 5, 5]],
      colors: ["#FF6B6B", "#4ECDC4", "#95E86C", "#FFD93D", "#C084FC"] },
    { id: 56, capacity: 4,
      tubes: [[1, 1, 1, 1], [2, 2, 2, 2], [3, 4, 4, 4], [4, 5, 5, 5], [5], [6, 6, 6, 6], [3, 3, 3]],
      colors: ["#FF6B6B", "#4ECDC4", "#95E86C", "#FFD93D", "#C084FC", "#FF6B9D"] },
    { id: 57, capacity: 4,
      tubes: [[1, 1, 1, 1], [2, 3, 3, 3], [3, 4, 4, 4], [4], [5, 5, 5, 5], [2, 2, 2]],
      colors: ["#FF6B6B", "#4ECDC4", "#95E86C", "#FFD93D", "#C084FC"] },
    { id: 58, capacity: 4,
      tubes: [[1], [2, 2, 2, 2], [3, 3, 3, 3], [4, 4, 4, 4], [5, 5, 5, 5], [6, 1, 1, 1], [6, 6, 6]],
      colors: ["#FF6B6B", "#4ECDC4", "#95E86C", "#FFD93D", "#C084FC", "#FF6B9D"] },
    { id: 59, capacity: 4,
      tubes: [[1, 1, 1, 1], [2, 2, 2, 2], [3, 3, 3, 3], [4, 5, 5, 5], [5], [4, 4, 4]],
      colors: ["#FF6B6B", "#4ECDC4", "#95E86C", "#FFD93D", "#C084FC"] },
    { id: 60, capacity: 4,
      tubes: [[1, 2, 2, 2], [2, 3, 3, 3], [3, 4, 4, 4], [4, 5, 5, 5], [5], [6, 6, 6, 6], [1, 1, 1]],
      colors: ["#FF6B6B", "#4ECDC4", "#95E86C", "#FFD93D", "#C084FC", "#FF6B9D"] },
    { id: 61, capacity: 4,
      tubes: [[1, 1, 1, 1], [2, 3, 3, 3], [3], [4, 4, 4, 4], [5, 5, 5, 5], [2, 2, 2]],
      colors: ["#FF6B6B", "#4ECDC4", "#95E86C", "#FFD93D", "#C084FC"] },
    { id: 62, capacity: 4,
      tubes: [[1, 1, 1, 1], [2, 2, 2, 2], [3, 4, 4, 4], [4, 5, 5, 5], [5, 6, 6, 6], [6], [3, 3, 3]],
      colors: ["#FF6B6B", "#4ECDC4", "#95E86C", "#FFD93D", "#C084FC", "#FF6B9D"] },
    { id: 63, capacity: 4,
      tubes: [[1, 1, 1, 1], [2, 3, 3, 3], [3, 4, 4, 4], [4], [5, 5, 5, 5], [2, 2, 2]],
      colors: ["#FF6B6B", "#4ECDC4", "#95E86C", "#FFD93D", "#C084FC"] },
    { id: 64, capacity: 4,
      tubes: [[1, 1, 1, 1], [2, 2, 2, 2], [3, 4, 4, 4], [4, 5, 5, 5], [5], [6, 6, 6, 6], [3, 3, 3]],
      colors: ["#FF6B6B", "#4ECDC4", "#95E86C", "#FFD93D", "#C084FC", "#FF6B9D"] },
    { id: 65, capacity: 4,
      tubes: [[1, 2, 2, 2], [2], [3, 3, 3, 3], [4, 4, 4, 4], [5, 5, 5, 5], [1, 1, 1]],
      colors: ["#FF6B6B", "#4ECDC4", "#95E86C", "#FFD93D", "#C084FC"] },
    { id: 66, capacity: 4,
      tubes: [[1, 1, 1, 1], [2, 2, 2, 2], [3, 3, 3, 3], [4, 4, 4, 4], [5, 6, 6, 6], [6], [5, 5, 5]],
      colors: ["#FF6B6B", "#4ECDC4", "#95E86C", "#FFD93D", "#C084FC", "#FF6B9D"] },
    { id: 67, capacity: 4,
      tubes: [[1, 1, 1, 1], [2, 2, 2, 2], [3, 3, 3, 3], [4], [5, 5, 5, 5], [4, 4, 4]],
      colors: ["#FF6B6B", "#4ECDC4", "#95E86C", "#FFD93D", "#C084FC"] },
    { id: 68, capacity: 4,
      tubes: [[1, 2, 2, 2], [2], [3, 3, 3, 3], [4, 4, 4, 4], [5, 5, 5, 5], [6, 1, 1, 1], [6, 6, 6]],
      colors: ["#FF6B6B", "#4ECDC4", "#95E86C", "#FFD93D", "#C084FC", "#FF6B9D"] },
    { id: 69, capacity: 4,
      tubes: [[1, 2, 2, 2], [2], [3, 3, 3, 3], [4, 4, 4, 4], [5, 1, 1, 1], [5, 5, 5]],
      colors: ["#FF6B6B", "#4ECDC4", "#95E86C", "#FFD93D", "#C084FC"] },
    { id: 70, capacity: 4,
      tubes: [[1], [2, 2, 2, 2], [3, 3, 3, 3], [4, 4, 4, 4], [5, 5, 5, 5], [6, 1, 1, 1], [6, 6, 6]],
      colors: ["#FF6B6B", "#4ECDC4", "#95E86C", "#FFD93D", "#C084FC", "#FF6B9D"] },
    { id: 71, capacity: 4,
      tubes: [[1, 1, 1, 1], [2, 2, 2, 2], [3, 3, 3, 3], [4, 5, 5, 5], [5], [4, 4, 4]],
      colors: ["#FF6B6B", "#4ECDC4", "#95E86C", "#FFD93D", "#C084FC"] },
    { id: 72, capacity: 4,
      tubes: [[1, 2, 2, 2], [2, 3, 3, 3], [3, 4, 4, 4], [4, 5, 5, 5], [5], [6, 6, 6, 6], [1, 1, 1]],
      colors: ["#FF6B6B", "#4ECDC4", "#95E86C", "#FFD93D", "#C084FC", "#FF6B9D"] },
    { id: 73, capacity: 4,
      tubes: [[1], [2, 2, 2, 2], [3, 3, 3, 3], [4, 4, 4, 4], [5, 1, 1, 1], [5, 5, 5]],
      colors: ["#FF6B6B", "#4ECDC4", "#95E86C", "#FFD93D", "#C084FC"] },
    { id: 74, capacity: 4,
      tubes: [[1, 2, 2, 2], [2, 3, 3, 3], [3], [4, 4, 4, 4], [5, 5, 5, 5], [6, 1, 1, 1], [6, 6, 6]],
      colors: ["#FF6B6B", "#4ECDC4", "#95E86C", "#FFD93D", "#C084FC", "#FF6B9D"] },
    { id: 75, capacity: 4,
      tubes: [[1, 2, 2, 2], [2, 3, 3, 3], [3], [4, 4, 4, 4], [5, 5, 5, 5], [1, 1, 1]],
      colors: ["#FF6B6B", "#4ECDC4", "#95E86C", "#FFD93D", "#C084FC"] },
    { id: 76, capacity: 4,
      tubes: [[1, 1, 1, 1], [2, 2, 2, 2], [3, 3, 3, 3], [4, 5, 5, 5], [5, 6, 6, 6], [6], [4, 4, 4]],
      colors: ["#FF6B6B", "#4ECDC4", "#95E86C", "#FFD93D", "#C084FC", "#FF6B9D"] },
    { id: 77, capacity: 4,
      tubes: [[1], [2, 2, 2, 2], [3, 3, 3, 3], [4, 4, 4, 4], [5, 1, 1, 1], [5, 5, 5]],
      colors: ["#FF6B6B", "#4ECDC4", "#95E86C", "#FFD93D", "#C084FC"] },
    { id: 78, capacity: 4,
      tubes: [[1, 2, 2, 2], [2], [3, 3, 3, 3], [4, 4, 4, 4], [5, 5, 5, 5], [6, 6, 6, 6], [1, 1, 1]],
      colors: ["#FF6B6B", "#4ECDC4", "#95E86C", "#FFD93D", "#C084FC", "#FF6B9D"] },
    { id: 79, capacity: 4,
      tubes: [[1, 1, 1, 1], [2, 2, 2, 2], [3], [4, 4, 4, 4], [5, 5, 5, 5], [3, 3, 3]],
      colors: ["#FF6B6B", "#4ECDC4", "#95E86C", "#FFD93D", "#C084FC"] },
    { id: 80, capacity: 4,
      tubes: [[1, 1, 1, 1], [2, 2, 2, 2], [3, 4, 4, 4], [4, 5, 5, 5], [5], [6, 6, 6, 6], [3, 3, 3]],
      colors: ["#FF6B6B", "#4ECDC4", "#95E86C", "#FFD93D", "#C084FC", "#FF6B9D"] },
    { id: 81, capacity: 4,
      tubes: [[1], [2, 2, 2, 2], [3, 3, 3, 3], [4, 4, 4, 4], [5, 6, 6, 6], [6, 1, 1, 1], [5, 5, 5]],
      colors: ["#FF6B6B", "#4ECDC4", "#95E86C", "#FFD93D", "#C084FC", "#FF6B9D"] },
    { id: 82, capacity: 4,
      tubes: [[1, 2, 2, 2], [2, 3, 3, 3], [3], [4, 4, 4, 4], [5, 5, 5, 5], [6, 6, 6, 6], [7, 7, 7, 7], [1, 1, 1]],
      colors: ["#FF6B6B", "#4ECDC4", "#95E86C", "#FFD93D", "#C084FC", "#FF6B9D", "#FF9F43"] },
    { id: 83, capacity: 4,
      tubes: [[1, 1, 1, 1], [2, 2, 2, 2], [3, 3, 3, 3], [4, 5, 5, 5], [5], [6, 6, 6, 6], [4, 4, 4]],
      colors: ["#FF6B6B", "#4ECDC4", "#95E86C", "#FFD93D", "#C084FC", "#FF6B9D"] },
    { id: 84, capacity: 4,
      tubes: [[1, 1, 1, 1], [2], [3, 3, 3, 3], [4, 4, 4, 4], [5, 5, 5, 5], [6, 6, 6, 6], [7, 7, 7, 7], [2, 2, 2]],
      colors: ["#FF6B6B", "#4ECDC4", "#95E86C", "#FFD93D", "#C084FC", "#FF6B9D", "#FF9F43"] },
    { id: 85, capacity: 4,
      tubes: [[1, 1, 1, 1], [2, 2, 2, 2], [3, 3, 3, 3], [4, 5, 5, 5], [5, 6, 6, 6], [6], [4, 4, 4]],
      colors: ["#FF6B6B", "#4ECDC4", "#95E86C", "#FFD93D", "#C084FC", "#FF6B9D"] },
    { id: 86, capacity: 4,
      tubes: [[1, 2, 2, 2], [2, 3, 3, 3], [3], [4, 4, 4, 4], [5, 5, 5, 5], [6, 6, 6, 6], [7, 7, 7, 7], [1, 1, 1]],
      colors: ["#FF6B6B", "#4ECDC4", "#95E86C", "#FFD93D", "#C084FC", "#FF6B9D", "#FF9F43"] },
    { id: 87, capacity: 4,
      tubes: [[1, 2, 2, 2], [2], [3, 3, 3, 3], [4, 4, 4, 4], [5, 5, 5, 5], [6, 6, 6, 6], [1, 1, 1]],
      colors: ["#FF6B6B", "#4ECDC4", "#95E86C", "#FFD93D", "#C084FC", "#FF6B9D"] },
    { id: 88, capacity: 4,
      tubes: [[1, 2, 2, 2], [2], [3, 3, 3, 3], [4, 4, 4, 4], [5, 5, 5, 5], [6, 6, 6, 6], [7, 7, 7, 7], [1, 1, 1]],
      colors: ["#FF6B6B", "#4ECDC4", "#95E86C", "#FFD93D", "#C084FC", "#FF6B9D", "#FF9F43"] },
    { id: 89, capacity: 4,
      tubes: [[1, 1, 1, 1], [2, 2, 2, 2], [3, 3, 3, 3], [4, 4, 4, 4], [5], [6, 6, 6, 6], [5, 5, 5]],
      colors: ["#FF6B6B", "#4ECDC4", "#95E86C", "#FFD93D", "#C084FC", "#FF6B9D"] },
    { id: 90, capacity: 4,
      tubes: [[1], [2, 2, 2, 2], [3, 3, 3, 3], [4, 4, 4, 4], [5, 5, 5, 5], [6, 7, 7, 7], [7, 1, 1, 1], [6, 6, 6]],
      colors: ["#FF6B6B", "#4ECDC4", "#95E86C", "#FFD93D", "#C084FC", "#FF6B9D", "#FF9F43"] },
    { id: 91, capacity: 4,
      tubes: [[1], [2, 2, 2, 2], [3, 3, 3, 3], [4, 4, 4, 4], [5, 6, 6, 6], [6, 1, 1, 1], [5, 5, 5]],
      colors: ["#FF6B6B", "#4ECDC4", "#95E86C", "#FFD93D", "#C084FC", "#FF6B9D"] },
    { id: 92, capacity: 4,
      tubes: [[1, 1, 1, 1], [2, 3, 3, 3], [3], [4, 4, 4, 4], [5, 5, 5, 5], [6, 6, 6, 6], [7, 7, 7, 7], [2, 2, 2]],
      colors: ["#FF6B6B", "#4ECDC4", "#95E86C", "#FFD93D", "#C084FC", "#FF6B9D", "#FF9F43"] },
    { id: 93, capacity: 4,
      tubes: [[1, 1, 1, 1], [2, 2, 2, 2], [3, 3, 3, 3], [4, 5, 5, 5], [5], [6, 6, 6, 6], [4, 4, 4]],
      colors: ["#FF6B6B", "#4ECDC4", "#95E86C", "#FFD93D", "#C084FC", "#FF6B9D"] },
    { id: 94, capacity: 4,
      tubes: [[1, 1, 1, 1], [2, 2, 2, 2], [3, 3, 3, 3], [4, 4, 4, 4], [5], [6, 6, 6, 6], [7, 7, 7, 7], [5, 5, 5]],
      colors: ["#FF6B6B", "#4ECDC4", "#95E86C", "#FFD93D", "#C084FC", "#FF6B9D", "#FF9F43"] },
    { id: 95, capacity: 4,
      tubes: [[1], [2, 2, 2, 2], [3, 3, 3, 3], [4, 4, 4, 4], [5, 6, 6, 6], [6, 1, 1, 1], [5, 5, 5]],
      colors: ["#FF6B6B", "#4ECDC4", "#95E86C", "#FFD93D", "#C084FC", "#FF6B9D"] },
    { id: 96, capacity: 4,
      tubes: [[1, 1, 1, 1], [2, 2, 2, 2], [3, 3, 3, 3], [4, 5, 5, 5], [5, 6, 6, 6], [6], [7, 7, 7, 7], [4, 4, 4]],
      colors: ["#FF6B6B", "#4ECDC4", "#95E86C", "#FFD93D", "#C084FC", "#FF6B9D", "#FF9F43"] },
    { id: 97, capacity: 4,
      tubes: [[1, 1, 1, 1], [2, 3, 3, 3], [3], [4, 4, 4, 4], [5, 5, 5, 5], [6, 6, 6, 6], [2, 2, 2]],
      colors: ["#FF6B6B", "#4ECDC4", "#95E86C", "#FFD93D", "#C084FC", "#FF6B9D"] },
    { id: 98, capacity: 4,
      tubes: [[1], [2, 2, 2, 2], [3, 3, 3, 3], [4, 4, 4, 4], [5, 5, 5, 5], [6, 6, 6, 6], [7, 7, 7, 7], [1, 1, 1]],
      colors: ["#FF6B6B", "#4ECDC4", "#95E86C", "#FFD93D", "#C084FC", "#FF6B9D", "#FF9F43"] },
    { id: 99, capacity: 4,
      tubes: [[1, 1, 1, 1], [2, 2, 2, 2], [3, 4, 4, 4], [4, 5, 5, 5], [5], [6, 6, 6, 6], [3, 3, 3]],
      colors: ["#FF6B6B", "#4ECDC4", "#95E86C", "#FFD93D", "#C084FC", "#FF6B9D"] },
    { id: 100, capacity: 4,
      tubes: [[1, 1, 1, 1], [2, 2, 2, 2], [3, 4, 4, 4], [4, 5, 5, 5], [5], [6, 6, 6, 6], [7, 7, 7, 7], [3, 3, 3]],
      colors: ["#FF6B6B", "#4ECDC4", "#95E86C", "#FFD93D", "#C084FC", "#FF6B9D", "#FF9F43"] }
  ];

  var currentLevelIndex = 0;
  var currentTubes = [];
  var selectedTubeIndex = null;
  var vibrationEnabled = typeof navigator !== "undefined" && typeof navigator.vibrate === "function";

  /* 音效与语音：使用 audio.js 模块，未加载时使用空实现 */
  var GameAudio = window.GameAudio || {
    soundEnabled: true,
    voiceEnabled: true,
    playSound: function () {},
    speak: function () {},
    loadSettings: function () {},
    saveSettings: function () {}
  };

  /* 设置状态 */
  var settingsColorCount = 4;
  var settingsTubeCount = 6;
  var settingsDifficulty = "medium"; /* easy|medium|hard|expert|custom */
  var MIN_COLORS = 2;
  var MAX_COLORS = 10;
  var MIN_TUBES = 3;
  var MAX_TUBES = 14;
  var isCustomLevel = false;

  /** 难度档位 → 参数范围（儿童关卡设计 2026-02-27） */
  var DIFFICULTY_PRESETS = {
    easy:   { numColors: [2, 2],     numTubes: [3, 4],     scrambleSteps: [4, 8]   },
    medium: { numColors: [2, 3],     numTubes: [4, 5],     scrambleSteps: [8, 16]  },
    hard:   { numColors: [3, 5],     numTubes: [5, 7],     scrambleSteps: [16, 35] },
    expert: { numColors: [5, 7],     numTubes: [6, 8],     scrambleSteps: [35, 55] }
  };

  function pickInRange(arr) {
    if (Array.isArray(arr) && arr.length === 2) {
      var lo = arr[0], hi = arr[1];
      return lo + Math.floor(Math.random() * (hi - lo + 1));
    }
    return arr;
  }

  /** 从档位解析 (numColors, numTubes, scrambleSteps) */
  function resolvePresetParams(presetKey) {
    var p = DIFFICULTY_PRESETS[presetKey];
    if (!p) return null;
    return {
      numColors: pickInRange(p.numColors),
      numTubes: pickInRange(p.numTubes),
      scrambleSteps: pickInRange(p.scrambleSteps)
    };
  }

  /** 可解种子状态：C 根满管循环排列 + (T-C) 空管 */
  function getSeedState(numColors, numTubes, capacity) {
    capacity = capacity || 4;
    var tubes = [];
    for (var i = 0; i < numColors; i++) {
      var tube = [];
      for (var k = 0; k < capacity; k++) {
        tube.push((i + k) % numColors + 1);
      }
      tubes.push(tube);
    }
    for (var e = 0; e < numTubes - numColors; e++) tubes.push([]);
    return tubes;
  }

  function topSegmentLengthScramble(tube) {
    if (!tube || tube.length === 0) return 0;
    var color = tube[tube.length - 1];
    var count = 0;
    for (var i = tube.length - 1; i >= 0 && tube[i] === color; i--) count++;
    return count;
  }

  function getReversePourOptions(tubes, capacity) {
    var options = [];
    for (var from = 0; from < tubes.length; from++) {
      if (tubes[from].length === 0) continue;
      var srcTop = tubes[from][tubes[from].length - 1];
      var segLen = topSegmentLengthScramble(tubes[from]);
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

  function deepCloneTubesForScramble(tubes) {
    return tubes.map(function (row) { return row.slice(); });
  }

  /**
   * 生成可解随机关卡：种子状态 + 反向搅乱。
   * 支持 (numColors, numTubes, scrambleSteps?) 或从档位解析。
   */
  function generateSolvableLevel(numColors, numTubes, scrambleSteps) {
    var capacity = 4;
    numTubes = Math.max(numTubes, numColors + 1);
    if (scrambleSteps == null) {
      scrambleSteps = Math.max(4, Math.min(40, (numColors - 1) * 8 + Math.floor(Math.random() * 12)));
    }
    var tubes = getSeedState(numColors, numTubes, capacity);
    var steps = Math.max(4, scrambleSteps);
    var seedOffset = 0;
    var rnd = function () { return Math.random(); };

    while (seedOffset < 300) {
      tubes = getSeedState(numColors, numTubes, capacity);
      var stepsToUse = Math.max(4, Math.floor(steps * (1 - seedOffset * 0.01)));
      for (var s = 0; s < stepsToUse; s++) {
        var options = getReversePourOptions(tubes, capacity);
        if (options.length === 0) break;
        var best = [];
        var bestCount = -1;
        for (var o = 0; o < options.length; o++) {
          var opt = options[o];
          var next = deepCloneTubesForScramble(tubes);
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
      if (!isLevelComplete(tubes)) break;
      seedOffset++;
    }

    return {
      id: -1,
      capacity: capacity,
      tubes: tubes,
      colors: PALETTE.slice(0, numColors)
    };
  }

  /**
   * 根据档位或自定义参数生成可解关卡。
   * 若 presetKey 有效则忽略 numColors/numTubes。
   */
  function generateRandomLevel(numColors, numTubes, presetKey) {
    if (presetKey && DIFFICULTY_PRESETS[presetKey]) {
      var p = resolvePresetParams(presetKey);
      return generateSolvableLevel(p.numColors, p.numTubes, p.scrambleSteps);
    }
    var steps = Math.max(8, Math.min(30, (numColors - 1) * 6 + Math.floor(Math.random() * 10)));
    return generateSolvableLevel(numColors, numTubes, steps);
  }

  function updateViewportUnit() {
    var vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--app-vh", vh + "px");
  }

  function updateGuide(phase, message) {
    var panel = document.getElementById("guide-panel");
    var text = document.getElementById("guide-step");
    if (panel) panel.setAttribute("data-phase", phase);
    if (text) text.textContent = message || "";
  }

  function haptic(type) {
    if (type === "tap") GameAudio.playSound("tap");
    if (!vibrationEnabled) return;
    if (type === "success") {
      navigator.vibrate([14, 28, 18]);
      return;
    }
    if (type === "warning") {
      navigator.vibrate([24, 20, 24]);
      return;
    }
    navigator.vibrate(12);
  }

  function updateDockState() {
    var dock = document.querySelector(".bottom-dock");
    var cancelBtn = document.getElementById("btn-cancel");
    if (!dock || !cancelBtn) return;

    var pickingTarget = selectedTubeIndex !== null;
    dock.classList.toggle("is-picking-target", pickingTarget);
    cancelBtn.disabled = !pickingTarget;
    cancelBtn.setAttribute("aria-disabled", pickingTarget ? "false" : "true");
  }

  function deepCloneTubes(tubes) {
    return tubes.map(function (row) { return row.slice(); });
  }

  function getColors(level) {
    return level.colors || DEFAULT_COLORS;
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

      // 新规则：同一种颜色的液体必须集中在同一根试管中
      if (colorToTube[first] !== undefined && colorToTube[first] !== i) {
        return false;
      }
      colorToTube[first] = i;
    }
    return true;
  }

  function getTopSegmentLength(tubes, tubeIndex) {
    var t = tubes[tubeIndex];
    if (!t || t.length === 0) return 0;
    var color = t[t.length - 1];
    var count = 0;
    for (var i = t.length - 1; i >= 0 && t[i] === color; i--) count++;
    return count;
  }

  function canPour(sourceIdx, targetIdx) {
    if (sourceIdx === targetIdx) return false;
    var src = currentTubes[sourceIdx];
    var dst = currentTubes[targetIdx];
    if (!src || src.length === 0) return false;
    var capacity = LEVELS[currentLevelIndex].capacity;
    if (dst.length >= capacity) return false;
    var srcColor = src[src.length - 1];
    if (dst.length === 0) return true;
    return dst[dst.length - 1] === srcColor;
  }

  function getPourAmount(sourceIdx, targetIdx) {
    var srcLen = getTopSegmentLength(currentTubes, sourceIdx);
    var capacity = LEVELS[currentLevelIndex].capacity;
    var dstFree = capacity - currentTubes[targetIdx].length;
    return Math.min(srcLen, dstFree);
  }

  function performPour(sourceIdx, targetIdx) {
    var n = getPourAmount(sourceIdx, targetIdx);
    var src = currentTubes[sourceIdx];
    var dst = currentTubes[targetIdx];
    var color = src[src.length - 1];
    for (var i = 0; i < n; i++) {
      src.pop();
      dst.push(color);
    }
  }

  function hasValidMove() {
    for (var i = 0; i < currentTubes.length; i++) {
      for (var j = 0; j < currentTubes.length; j++) {
        if (i !== j && canPour(i, j)) return true;
      }
    }
    return false;
  }

  function validateLevel(level) {
    if (!level || !level.tubes || level.tubes.length < 2) {
      return { ok: false, message: "关卡数据无效" };
    }
    var capacity = level.capacity;
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
    for (var k in colorCount) {
      if (colorCount[k] > capacity) return { ok: false, message: "关卡数据无效" };
    }
    if (!hasNonFull && !isLevelComplete(level.tubes)) {
      return { ok: false, message: "关卡数据无效" };
    }
    return { ok: true };
  }

  /* 儿童向反馈文案：过关、提示、僵局、最后一关、成功倒水鼓励 */
  var winMessages = [
    "太棒了！", "过关啦！", "你真会动脑筋！", "你太厉害啦！",
    "全部归位，真棒！", "小脑袋真灵！", "又过关啦，继续加油！", "做得真好！"
  ];
  var toastEmptyTube = [
    "先点有水的试管哦", "这根是空的，换一根试试", "点有颜色的那根"
  ];
  var toastFull = [
    "这根已经满啦", "装不下啦，换一根吧", "满啦，选别的试管哦"
  ];
  var toastWrongColor = [
    "要倒到同颜色或空试管哦", "颜色不一样不能倒一起哦", "先倒到空试管或同色的"
  ];
  var deadlockMessages = [
    "动不了啦，没关系，再试一次", "卡住啦，再试一次吧", "这次没路啦，重来一次"
  ];
  var lastLevelMessages = [
    "已经是最后一关啦", "通关啦，你真棒", "全部过关！厉害"
  ];
  var pourEncourage = ["对啦", "好棒", "没错", "继续"];

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function randomWinMessage() {
    return pick(winMessages);
  }

  function showToast(text) {
    var el = document.getElementById("toast");
    if (!el) return;
    el.textContent = text;
    el.classList.add("show");
    GameAudio.speak(text);
    clearTimeout(showToast._t);
    showToast._t = setTimeout(function () {
      el.classList.remove("show");
    }, 2500);
  }

  function setModalOpen(id, open) {
    var el = document.getElementById(id);
    if (!el) return;
    if (open) {
      el.removeAttribute("hidden");
      el.setAttribute("data-open", "true");
    } else {
      el.setAttribute("data-open", "false");
    }
  }

  function showWinModal() {
    var msg = randomWinMessage();
    document.getElementById("win-message").textContent = msg;
    setModalOpen("win-modal", true);
    updateGuide("complete", "");
    haptic("success");
    GameAudio.playSound("success");
    GameAudio.speak(msg);
  }

  function showDeadlockModal() {
    var msg = pick(deadlockMessages);
    setModalOpen("deadlock-modal", true);
    GameAudio.playSound("error");
    GameAudio.speak(msg);
  }

  function shakeTube(index) {
    var container = document.getElementById("tubes-container");
    var tube = container.querySelector('.tube[data-tube-index="' + index + '"]');
    if (tube) {
      tube.classList.remove("shake");
      tube.offsetHeight;
      tube.classList.add("shake");
      setTimeout(function () { tube.classList.remove("shake"); }, 280);
    }
    haptic("warning");
    GameAudio.playSound("error");
  }

  function animatePour(sourceIndex, targetIndex, done) {
    var container = document.getElementById("tubes-container");
    var src = container.querySelector('.tube[data-tube-index="' + sourceIndex + '"]');
    var dst = container.querySelector('.tube[data-tube-index="' + targetIndex + '"]');
    var trailDuration = 360;
    var totalDuration = 720;
    if (!src || !dst) {
      done();
      return;
    }
    var srcRect = src.getBoundingClientRect();
    var dstRect = dst.getBoundingClientRect();
    /*
     * 旋转 90° 后试管变为水平，竖直跨度 = 试管宽度。
     * 需让旋转后的底边（pivotY + halfW）在目标管口上方留出 gap，
     * 否则水平试管会和目标试管重叠。
     */
    var targetCenterX = dstRect.left + dstRect.width * 0.5;
    var halfW = srcRect.width * 0.5;
    var pourGap = 8;
    var targetMouthY = dstRect.top - halfW - pourGap;
    var srcCenterX = srcRect.left + srcRect.width * 0.5;
    var rotateDeg = targetCenterX >= srcCenterX ? 90 : -90;
    var h = srcRect.height;
    var dx;
    if (rotateDeg === 90) {
      dx = (targetCenterX - h) - srcCenterX;
    } else {
      dx = (targetCenterX + h) - srcCenterX;
    }
    var dy = targetMouthY - srcRect.bottom + 16;

    src.classList.add("pouring-source");
    dst.classList.add("pouring-target");
    src.style.transformOrigin = "50% 100%";

    /* 拿起来 → 移到目标上方 → 倾斜倒水 → 保持 → 平滑归位 */
    var keyframes = [
      { transform: "translateY(-16px)", offset: 0 },
      { transform: "translate(" + dx + "px, " + (dy - 16) + "px)", offset: 0.28 },
      { transform: "translate(" + dx + "px, " + (dy - 16) + "px) rotate(" + rotateDeg + "deg)", offset: 0.4 },
      { transform: "translate(" + dx + "px, " + (dy - 16) + "px) rotate(" + rotateDeg + "deg)", offset: 0.72 },
      { transform: "translate(0px, 0px) rotate(0deg)", offset: 1 }
    ];
    if (src.animate) {
      src.animate(keyframes, { duration: totalDuration, fill: "forwards", easing: "ease-in-out" });
    }

    var pourStartMs = Math.round(totalDuration * 0.36);
    var fillCount = currentTubes[targetIndex].length;
    var cells = dst.querySelectorAll(".tube-cell");
    var surfaceY = cells.length > 0
      ? cells[Math.max(0, fillCount - 1)].getBoundingClientRect().top
      : dstRect.top + dstRect.height - 20;
    setTimeout(function () {
      GameAudio.playSound("pour", { duration: trailDuration / 1000 });
      var colorId = currentTubes[sourceIndex] && currentTubes[sourceIndex].length > 0
        ? currentTubes[sourceIndex][currentTubes[sourceIndex].length - 1] : 1;
      var colors = getColors(LEVELS[currentLevelIndex]);
      var pourColor = colors[colorId - 1] || DEFAULT_COLORS[colorId - 1] || "#FF6B6B";
      animatePourStream(dstRect, rotateDeg, pourColor, trailDuration, srcRect.width, surfaceY);
    }, pourStartMs);

    setTimeout(function () {
      if (src.animate) {
        var anims = src.getAnimations();
        for (var i = 0; i < anims.length; i++) anims[i].cancel();
      }
      src.style.transform = "";
      src.classList.remove("pouring-source");
      dst.classList.remove("pouring-target");
      done();
    }, totalDuration);
  }

  function bezier2(t, p0, p1, p2) {
    var u = 1 - t;
    return {
      x: u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x,
      y: u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y
    };
  }

  /** 二次贝塞尔曲线的切线（导数） */
  function bezier2Tangent(t, p0, p1, p2) {
    return {
      x: 2 * (1 - t) * (p1.x - p0.x) + 2 * t * (p2.x - p1.x),
      y: 2 * (1 - t) * (p1.y - p0.y) + 2 * t * (p2.y - p1.y)
    };
  }

  /**
   * 计算倒水抛物线轨迹。
   * 起点在试管倾斜中途的管口近似位置（目标管口上方偏侧），
   * 终点在目标试管液面 targetSurfaceY，使水流接到水面而不是半空消失。
   */
  function getPourCurve(dstRect, rotateDeg, tubeWidth, targetSurfaceY) {
    var cx = dstRect.left + dstRect.width * 0.5;
    var halfW = (tubeWidth || 80) * 0.5;
    var pourGap = 8;
    var mouthCenterY = dstRect.top - halfW - pourGap;
    var startX = cx;
    var startY = mouthCenterY + halfW;

    var exitDir = rotateDeg > 0 ? 1 : -1;
    var endX = cx + exitDir * 25;
    var endY = typeof targetSurfaceY === "number" ? targetSurfaceY : startY + 50;

    var p0 = { x: startX, y: startY };
    var p2 = { x: endX, y: endY };
    var midY = (startY + endY) * 0.5;
    var p1 = { x: startX + exitDir * 22, y: startY + Math.max(6, (midY - startY) * 0.3) };
    return { p0: p0, p1: p1, p2: p2, endX: endX, endY: endY };
  }

  /** 沿曲线参数 t 的水柱宽度：管口处最粗，越往下越细 */
  function streamWidth(t) {
    return 3 + 5 * Math.pow(1 - t, 1.5);
  }

  /**
   * 根据水流前端 headT 和尾端 tailT (0-1) 生成封闭水柱 SVG path。
   * 两侧沿法线偏移，形成有粗细变化的带状形状。
   */
  function createStreamPath(curve, headT, tailT, time) {
    if (headT <= tailT + 0.01) return "";
    var STEPS = 14;
    var left = [], right = [];
    for (var i = 0; i <= STEPS; i++) {
      var t = tailT + (headT - tailT) * (i / STEPS);
      var pt = bezier2(t, curve.p0, curve.p1, curve.p2);
      var tan = bezier2Tangent(t, curve.p0, curve.p1, curve.p2);
      var len = Math.sqrt(tan.x * tan.x + tan.y * tan.y) || 1;
      var nx = -tan.y / len;
      var ny = tan.x / len;
      var w = streamWidth(t);
      /* 轻微正弦扰动，让水柱有液态抖动感 */
      w += Math.sin(t * 14 + time * 9) * 0.6;
      var hw = w * 0.5;
      left.push(pt.x + nx * hw, pt.y + ny * hw);
      right.push(pt.x - nx * hw, pt.y - ny * hw);
    }
    var d = "M" + left[0].toFixed(1) + "," + left[1].toFixed(1);
    for (var i = 2; i < left.length; i += 2) {
      d += " L" + left[i].toFixed(1) + "," + left[i + 1].toFixed(1);
    }
    for (var i = right.length - 2; i >= 0; i -= 2) {
      d += " L" + right[i].toFixed(1) + "," + right[i + 1].toFixed(1);
    }
    return d + " Z";
  }

  /** 水柱高光线：沿弧线一侧画一条细亮线 */
  function createHighlightPath(curve, headT, tailT) {
    if (headT <= tailT + 0.01) return "";
    var STEPS = 10;
    var d = "";
    for (var i = 0; i <= STEPS; i++) {
      var t = tailT + (headT - tailT) * (i / STEPS);
      var pt = bezier2(t, curve.p0, curve.p1, curve.p2);
      var tan = bezier2Tangent(t, curve.p0, curve.p1, curve.p2);
      var len = Math.sqrt(tan.x * tan.x + tan.y * tan.y) || 1;
      var nx = -tan.y / len;
      var ny = tan.x / len;
      var hw = streamWidth(t) * 0.28;
      d += (i === 0 ? "M" : " L") + (pt.x + nx * hw).toFixed(1) + "," + (pt.y + ny * hw).toFixed(1);
    }
    return d;
  }

  /** 入水溅射：在目标管口生成几滴随机飞溅的小水珠 */
  function spawnSplashDrops(x, y, color) {
    var count = 4 + Math.floor(Math.random() * 2);
    for (var i = 0; i < count; i++) {
      (function () {
        var size = 2 + Math.random() * 3;
        var drop = document.createElement("span");
        drop.style.cssText =
          "position:fixed;border-radius:50%;pointer-events:none;z-index:170;" +
          "width:" + size + "px;height:" + size + "px;" +
          "left:" + x + "px;top:" + y + "px;" +
          "margin-left:" + (-size / 2) + "px;margin-top:" + (-size / 2) + "px;" +
          "background:" + color + ";" +
          "box-shadow:inset 0 -1px 2px rgba(0,0,0,0.15),0 1px 3px rgba(0,0,0,0.2);";
        document.body.appendChild(drop);
        var angle = -Math.PI * 0.85 + Math.random() * Math.PI * 0.7;
        var speed = 14 + Math.random() * 16;
        var vx = Math.cos(angle) * speed;
        var vy = Math.sin(angle) * speed;
        if (drop.animate) {
          drop.animate([
            { transform: "translate(0,0) scale(1)", opacity: 0.9 },
            { transform: "translate(" + vx + "px," + (vy + 18) + "px) scale(0.2)", opacity: 0 }
          ], { duration: 200 + Math.random() * 100, easing: "ease-out" });
        }
        setTimeout(function () {
          if (drop.parentNode) drop.parentNode.removeChild(drop);
        }, 360);
      })();
    }
  }

  /**
   * SVG 水流动画主函数。
   * requestAnimationFrame 逐帧更新水柱 SVG path，
   * 三阶段：起流（水头延伸）→ 持续 → 收尾（水尾追赶水头）。
   */
  function animatePourStream(dstRect, rotateDeg, color, duration, tubeWidth, targetSurfaceY) {
    var curve = getPourCurve(dstRect, rotateDeg, tubeWidth, targetSurfaceY);
    var svg = document.getElementById("pour-fx");
    if (!svg) return;
    var ns = "http://www.w3.org/2000/svg";

    var streamPath = document.createElementNS(ns, "path");
    streamPath.setAttribute("fill", color);
    streamPath.setAttribute("opacity", "0.88");
    streamPath.setAttribute("filter", "url(#pour-blur)");
    svg.appendChild(streamPath);

    var hlPath = document.createElementNS(ns, "path");
    hlPath.setAttribute("fill", "none");
    hlPath.setAttribute("stroke", "rgba(255,255,255,0.4)");
    hlPath.setAttribute("stroke-width", "1.5");
    hlPath.setAttribute("stroke-linecap", "round");
    hlPath.setAttribute("filter", "url(#pour-blur)");
    svg.appendChild(hlPath);

    var startTime = null;
    var splashed = false;
    var EXTEND = 0.25, HOLD = 0.50, RETRACT = 0.25;

    function ease3(x) { return x * x * (3 - 2 * x); }

    function tick(ts) {
      if (!startTime) startTime = ts;
      var p = Math.min((ts - startTime) / duration, 1);
      var headT, tailT;

      if (p < EXTEND) {
        headT = ease3(p / EXTEND);
        tailT = 0;
      } else if (p < EXTEND + HOLD) {
        headT = 1;
        tailT = 0;
      } else {
        headT = 1;
        tailT = ease3((p - EXTEND - HOLD) / RETRACT);
      }

      var time = (ts - startTime) * 0.001;
      streamPath.setAttribute("d", createStreamPath(curve, headT, tailT, time) || "M0,0");
      hlPath.setAttribute("d", createHighlightPath(curve, headT, tailT) || "M0,0");

      if (!splashed && headT > 0.92) {
        splashed = true;
        spawnSplashDrops(curve.endX, curve.endY, color);
      }

      if (p < 1) {
        requestAnimationFrame(tick);
      } else {
        if (streamPath.parentNode) streamPath.parentNode.removeChild(streamPath);
        if (hlPath.parentNode) hlPath.parentNode.removeChild(hlPath);
      }
    }

    requestAnimationFrame(tick);
  }

  function renderTubes() {
    var level = LEVELS[currentLevelIndex];
    if (!level) return;
    var capacity = level.capacity;
    var colors = getColors(level);
    var container = document.getElementById("tubes-container");
    container.innerHTML = "";
    container.style.setProperty("--cell-height", (capacity <= 4 ? 48 : 36) + "px");

    for (var i = 0; i < currentTubes.length; i++) {
      var arr = currentTubes[i];
      var tube = document.createElement("div");
      tube.className = "tube";
      if (arr.length === 0) tube.classList.add("tube-empty");
      tube.setAttribute("data-tube-index", i);
      if (selectedTubeIndex === i) tube.classList.add("selected");

      for (var row = 0; row < capacity; row++) {
        var cell = document.createElement("div");
        cell.className = "tube-cell";
        if (row < arr.length) {
          var colorId = arr[row];
          var hex = colors[colorId - 1] || DEFAULT_COLORS[colorId - 1] || "#999";
          cell.style.background = hex;
          cell.classList.add("filled");
          if (row === arr.length - 1) {
            cell.classList.add("top-liquid");
          }
        } else {
          cell.classList.add("empty");
        }
        tube.appendChild(cell);
      }
      /* 玻璃反射高光条 */
      var glassHL = document.createElement("div");
      glassHL.className = "tube-glass-highlight";
      glassHL.setAttribute("aria-hidden", "true");
      tube.appendChild(glassHL);

      container.appendChild(tube);
    }

    var numEl = document.getElementById("current-level-num");
    if (numEl) numEl.textContent = isCustomLevel ? "自定义" : (currentLevelIndex + 1);
    updateDockState();
  }

  var customLevel = null;

  function loadLevel(index) {
    if (index < 0 || index >= LEVELS.length) return;
    isCustomLevel = false;
    customLevel = null;
    var level = LEVELS[index];
    var result = validateLevel(level);
    if (!result.ok) {
      showToast(result.message);
      return;
    }
    currentLevelIndex = index;
    currentTubes = deepCloneTubes(level.tubes);
    selectedTubeIndex = null;
    setModalOpen("win-modal", false);
    setModalOpen("deadlock-modal", false);
    setModalOpen("level-picker", false);
    setModalOpen("settings-modal", false);

    renderTubes();
    if (isLevelComplete(currentTubes)) {
      showWinModal();
      updateGuide("complete", "");
    } else {
      updateGuide("pick-source", "");
    }
  }

  function loadCustomLevel() {
    var level;
    if (settingsDifficulty === "custom") {
      level = generateRandomLevel(settingsColorCount, settingsTubeCount, null);
    } else {
      level = generateRandomLevel(null, null, settingsDifficulty);
    }
    var result = validateLevel(level);
    if (!result.ok) {
      showToast(result.message);
      return;
    }
    isCustomLevel = true;
    customLevel = level;
    /* 将自定义关卡临时挂载到 LEVELS 末尾以复用现有逻辑 */
    currentLevelIndex = LEVELS.length;
    LEVELS[currentLevelIndex] = level;
    currentTubes = deepCloneTubes(level.tubes);
    selectedTubeIndex = null;
    setModalOpen("win-modal", false);
    setModalOpen("deadlock-modal", false);
    setModalOpen("level-picker", false);
    setModalOpen("settings-modal", false);

    /* 更新关卡标签 */
    var numEl = document.getElementById("current-level-num");
    if (numEl) numEl.textContent = "自定义";

    renderTubes();
    updateGuide("pick-source", "");
  }

  function onTubeClick(index) {
    var level = LEVELS[currentLevelIndex];
    if (!level) return;
    if (document.getElementById("win-modal").getAttribute("data-open") === "true") return;
    if (document.getElementById("deadlock-modal").getAttribute("data-open") === "true") return;

    if (selectedTubeIndex === null) {
      if (!currentTubes[index] || currentTubes[index].length === 0) {
        showToast(pick(toastEmptyTube));
        updateGuide("pick-source", "");
        haptic("warning");
        return;
      }
      selectedTubeIndex = index;
      renderTubes();
      updateGuide("pick-target", "");
      haptic("tap");
      return;
    }

    if (selectedTubeIndex === index) {
      selectedTubeIndex = null;
      renderTubes();
      updateGuide("pick-source", "");
      haptic("tap");
      return;
    }

    var src = selectedTubeIndex;
    var dst = index;
    if (!canPour(src, dst)) {
      if (currentTubes[dst].length >= level.capacity) {
        showToast(pick(toastFull));
      } else {
        showToast(pick(toastWrongColor));
      }
    shakeTube(dst);
    updateGuide("pick-target", "");
    return;
  }

  animatePour(src, dst, function () {
      performPour(src, dst);
      selectedTubeIndex = null;
      renderTubes();
      haptic("tap");
      if (Math.random() < 0.28) GameAudio.speak(pick(pourEncourage));

      if (isLevelComplete(currentTubes)) {
        showWinModal();
        return;
      }
      if (!hasValidMove()) {
        showDeadlockModal();
        updateGuide("pick-source", "");
        return;
      }
      updateGuide("pick-source", "");
    });
  }

  function init() {
    GameAudio.loadSettings();
    updateViewportUnit();
    window.addEventListener("resize", updateViewportUnit, { passive: true });
    window.addEventListener("orientationchange", updateViewportUnit, { passive: true });

    var container = document.getElementById("tubes-container");
    if (container) {
      container.addEventListener("click", function (e) {
        var tube = e.target.closest(".tube");
        if (tube && tube.dataset.tubeIndex !== undefined) {
          onTubeClick(parseInt(tube.dataset.tubeIndex, 10));
        }
      });
    }

    document.getElementById("btn-restart").addEventListener("click", function () {
      haptic("tap");
      if (isCustomLevel) {
        loadCustomLevel();
      } else {
        loadLevel(currentLevelIndex);
      }
    });

    document.getElementById("btn-cancel").addEventListener("click", function () {
      if (selectedTubeIndex === null) return;
      haptic("tap");
      selectedTubeIndex = null;
      renderTubes();
      updateGuide("pick-source", "");
    });

    document.getElementById("btn-levels").addEventListener("click", function () {
      haptic("tap");
      var list = document.getElementById("level-list");
      list.innerHTML = "";
      for (var i = 0; i < LEVELS.length; i++) {
        var btn = document.createElement("button");
        btn.textContent = i + 1;
        if (i === currentLevelIndex) btn.classList.add("current");
        (function (idx) {
          btn.addEventListener("click", function () {
            haptic("tap");
            loadLevel(idx);
            setModalOpen("level-picker", false);
          });
        })(i);
        list.appendChild(btn);
      }
      setModalOpen("level-picker", true);
    });

    document.getElementById("btn-close-levels").addEventListener("click", function () {
      haptic("tap");
      setModalOpen("level-picker", false);
    });

    document.getElementById("btn-next").addEventListener("click", function () {
      haptic("tap");
      setModalOpen("win-modal", false);
      if (isCustomLevel) {
        /* 自定义模式下"下一关"就再随机生成一局 */
        loadCustomLevel();
        return;
      }
      if (currentLevelIndex + 1 >= LEVELS.length) {
        showToast(pick(lastLevelMessages));
        loadLevel(currentLevelIndex);
        return;
      }
      loadLevel(currentLevelIndex + 1);
    });

    document.getElementById("btn-replay").addEventListener("click", function () {
      haptic("tap");
      setModalOpen("win-modal", false);
      if (isCustomLevel) {
        loadCustomLevel();
      } else {
        loadLevel(currentLevelIndex);
      }
    });

    document.getElementById("btn-levels-from-win").addEventListener("click", function () {
      haptic("tap");
      setModalOpen("win-modal", false);
      document.getElementById("btn-levels").click();
    });

    document.getElementById("btn-deadlock-retry").addEventListener("click", function () {
      haptic("tap");
      setModalOpen("deadlock-modal", false);
      if (isCustomLevel) {
        loadCustomLevel();
      } else {
        loadLevel(currentLevelIndex);
      }
    });

    /* === 设置弹框 === */
    function updateSettingsUI() {
      var difficultySelect = document.getElementById("difficulty-select");
      var customParams = document.getElementById("custom-params");
      var colorEl = document.getElementById("color-count");
      var tubeEl = document.getElementById("tube-count");
      var hintEl = document.getElementById("settings-hint");
      var soundToggle = document.getElementById("toggle-sound");
      var voiceToggle = document.getElementById("toggle-voice");

      if (difficultySelect) difficultySelect.value = settingsDifficulty;
      if (customParams) customParams.classList.toggle("is-disabled", settingsDifficulty !== "custom");

      if (colorEl) colorEl.textContent = settingsColorCount;
      if (tubeEl) tubeEl.textContent = settingsTubeCount;

      var emptyTubes = settingsTubeCount - settingsColorCount;
      if (hintEl) hintEl.textContent = "包含 " + emptyTubes + " 个空试管";

      if (soundToggle) soundToggle.setAttribute("aria-pressed", GameAudio.soundEnabled ? "true" : "false");
      if (voiceToggle) voiceToggle.setAttribute("aria-pressed", GameAudio.voiceEnabled ? "true" : "false");

      var colorMinus = document.getElementById("color-minus");
      var colorPlus = document.getElementById("color-plus");
      var tubeMinus = document.getElementById("tube-minus");
      var tubePlus = document.getElementById("tube-plus");

      var steppersEnabled = settingsDifficulty === "custom";
      if (colorMinus) colorMinus.disabled = !steppersEnabled || settingsColorCount <= MIN_COLORS;
      if (colorPlus) colorPlus.disabled = !steppersEnabled || settingsColorCount >= MAX_COLORS || settingsColorCount >= settingsTubeCount - 1;
      if (tubeMinus) tubeMinus.disabled = !steppersEnabled || settingsTubeCount <= settingsColorCount + 1 || settingsTubeCount <= MIN_TUBES;
      if (tubePlus) tubePlus.disabled = !steppersEnabled || settingsTubeCount >= MAX_TUBES;
    }

    document.getElementById("btn-settings").addEventListener("click", function () {
      haptic("tap");
      updateSettingsUI();
      setModalOpen("settings-modal", true);
    });

    document.getElementById("toggle-sound").addEventListener("click", function () {
      haptic("tap");
      GameAudio.soundEnabled = !GameAudio.soundEnabled;
      GameAudio.saveSettings();
      this.setAttribute("aria-pressed", GameAudio.soundEnabled ? "true" : "false");
    });

    document.getElementById("toggle-voice").addEventListener("click", function () {
      haptic("tap");
      GameAudio.voiceEnabled = !GameAudio.voiceEnabled;
      GameAudio.saveSettings();
      this.setAttribute("aria-pressed", GameAudio.voiceEnabled ? "true" : "false");
    });

    var difficultySelectEl = document.getElementById("difficulty-select");
    if (difficultySelectEl) {
      difficultySelectEl.addEventListener("change", function () {
        haptic("tap");
        settingsDifficulty = this.value;
        if (settingsDifficulty !== "custom") {
          var p = DIFFICULTY_PRESETS[settingsDifficulty];
          if (p) {
            var nc = pickInRange(p.numColors);
            var nt = pickInRange(p.numTubes);
            nt = Math.max(nt, nc + 1);
            settingsColorCount = nc;
            settingsTubeCount = nt;
          }
        }
        updateSettingsUI();
      });
    }

    document.getElementById("color-minus").addEventListener("click", function () {
      haptic("tap");
      if (settingsColorCount > MIN_COLORS) {
        settingsColorCount--;
        if (settingsTubeCount <= settingsColorCount) {
          settingsTubeCount = settingsColorCount + 1;
        }
        updateSettingsUI();
      }
    });

    document.getElementById("color-plus").addEventListener("click", function () {
      haptic("tap");
      if (settingsColorCount < MAX_COLORS && settingsColorCount < settingsTubeCount - 1) {
        settingsColorCount++;
        updateSettingsUI();
      }
    });

    document.getElementById("tube-minus").addEventListener("click", function () {
      haptic("tap");
      if (settingsTubeCount > settingsColorCount + 1 && settingsTubeCount > MIN_TUBES) {
        settingsTubeCount--;
        updateSettingsUI();
      }
    });

    document.getElementById("tube-plus").addEventListener("click", function () {
      haptic("tap");
      if (settingsTubeCount < MAX_TUBES) {
        settingsTubeCount++;
        updateSettingsUI();
      }
    });

    document.getElementById("btn-settings-play").addEventListener("click", function () {
      haptic("tap");
      loadCustomLevel();
    });

    document.getElementById("btn-settings-close").addEventListener("click", function () {
      haptic("tap");
      setModalOpen("settings-modal", false);
    });

    loadLevel(0);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
