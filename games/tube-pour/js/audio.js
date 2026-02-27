/**
 * 试管倒水游戏 — 音效与语音播报模块
 * 提供 Web Audio 音效与 Web Speech API 中文 TTS，通过全局 GameAudio 使用。
 * 若存在 sounds/*.wav（可用 tools/generate-sounds.html 生成），则优先播放文件；否则使用程序生成音效。
 */
(function () {
  "use strict";

  var audioCtx = null;
  var STORAGE_SOUND = "sg-game-sound";
  var STORAGE_VOICE = "sg-game-voice";

  var soundBuffers = { tap: null, pour: null, success: null, error: null };
  var SOUND_IDS = ["tap", "pour", "success", "error"];

  function initAudioContext() {
    if (audioCtx) return audioCtx;
    if (typeof window === "undefined" || (!window.AudioContext && !window.webkitAudioContext)) return null;
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      return null;
    }
    return audioCtx;
  }

  function playFromBuffer(type, options) {
    var buf = soundBuffers[type];
    if (!buf) return false;
    var ctx = initAudioContext();
    if (!ctx) return false;
    if (ctx.state === "suspended") ctx.resume();
    var src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(ctx.destination);
    var now = ctx.currentTime;
    src.start(now);
    if (type === "pour" && options && typeof options.duration === "number" && options.duration > 0) {
      src.stop(now + options.duration);
    }
    return true;
  }

  /**
   * 儿童向游戏音效：优先播放 sounds/*.wav，否则程序生成
   * 使用柔和包络、暖色音色（triangle/多振荡器）和轻微随机，避免生硬感
   */
  function playSound(type, options) {
    if (!GameAudio.soundEnabled) return;
    if (playFromBuffer(type, options || {})) return;
    var ctx = initAudioContext();
    if (!ctx) return;
    if (ctx.state === "suspended") ctx.resume();
    var now = ctx.currentTime;

    if (type === "tap") {
      var baseFreq = 580 + Math.random() * 100;
      var osc = ctx.createOscillator();
      var osc2 = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = "triangle";
      osc2.type = "sine";
      osc.frequency.setValueAtTime(baseFreq, now);
      osc2.frequency.setValueAtTime(baseFreq * 1.5, now);
      osc2.connect(gain);
      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.06, now + 0.018);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc.start(now);
      osc2.start(now);
      osc.stop(now + 0.14);
      osc2.stop(now + 0.14);
      return;
    }

    if (type === "pour") {
      var dur = (options && typeof options.duration === "number" && options.duration > 0) ? options.duration : 0.36;
      var gain = ctx.createGain();
      var filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1200, now);
      filter.frequency.exponentialRampToValueAtTime(400, now + dur);
      filter.Q.value = 0.6;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.04, now + dur * 0.14);
      gain.gain.linearRampToValueAtTime(0.025, now + dur * 0.43);
      gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
      gain.connect(ctx.destination);
      var burstGap = dur * 0.2;
      var burstLen = dur - 2 * burstGap;
      for (var k = 0; k < 3; k++) {
        var o1 = ctx.createOscillator();
        var o2 = ctx.createOscillator();
        o1.type = "triangle";
        o2.type = "sine";
        var t = now + k * burstGap;
        o1.frequency.setValueAtTime(280 + k * 40, t);
        o1.frequency.exponentialRampToValueAtTime(160, t + burstLen);
        o2.frequency.setValueAtTime(200 + k * 30, t);
        o2.frequency.exponentialRampToValueAtTime(120, t + burstLen);
        o1.connect(filter);
        o2.connect(filter);
        o1.start(t);
        o2.start(t);
        o1.stop(t + burstLen);
        o2.stop(t + burstLen);
      }
      filter.connect(gain);
      return;
    }

    if (type === "success") {
      var freqs = [523.25, 659.25, 783.99, 1046.5];
      var d = 0.14;
      for (var i = 0; i < freqs.length; i++) {
        var t = now + i * d;
        var o = ctx.createOscillator();
        var o2 = ctx.createOscillator();
        var g = ctx.createGain();
        o.type = "triangle";
        o2.type = "sine";
        o.frequency.setValueAtTime(freqs[i], t);
        o2.frequency.setValueAtTime(freqs[i] * 1.005, t);
        o.connect(g);
        o2.connect(g);
        g.connect(ctx.destination);
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.08, t + 0.03);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
        o.start(t);
        o2.start(t);
        o.stop(t + 0.2);
        o2.stop(t + 0.2);
      }
      return;
    }

    if (type === "error") {
      var osc = ctx.createOscillator();
      var osc2 = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = "triangle";
      osc2.type = "sine";
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(165, now + 0.2);
      osc2.frequency.setValueAtTime(200 * 0.75, now);
      osc2.frequency.exponentialRampToValueAtTime(165 * 0.75, now + 0.2);
      osc.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.04, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.start(now);
      osc.stop(now + 0.22);
      osc2.start(now);
      osc2.stop(now + 0.22);
      return;
    }
  }

  function speak(text, options) {
    if (!GameAudio.voiceEnabled || !text) return;
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(String(text));
    u.lang = "zh-CN";
    u.rate = 1;
    u.volume = 1;
    if (options && options.rate != null) u.rate = options.rate;
    window.speechSynthesis.speak(u);
  }

  function loadSettings() {
    try {
      if (typeof localStorage !== "undefined") {
        if (localStorage.getItem(STORAGE_SOUND) !== null) {
          GameAudio.soundEnabled = localStorage.getItem(STORAGE_SOUND) === "true";
        }
        if (localStorage.getItem(STORAGE_VOICE) !== null) {
          GameAudio.voiceEnabled = localStorage.getItem(STORAGE_VOICE) === "true";
        }
      }
    } catch (e) {}
  }

  function saveSettings() {
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(STORAGE_SOUND, String(GameAudio.soundEnabled));
        localStorage.setItem(STORAGE_VOICE, String(GameAudio.voiceEnabled));
      }
    } catch (e) {}
  }

  function loadSoundFiles() {
    if (typeof window === "undefined" || !window.fetch) return;
    var ctx = null;
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      return;
    }
    SOUND_IDS.forEach(function (id) {
      fetch("sounds/" + id + ".wav")
        .then(function (r) { return r.ok ? r.arrayBuffer() : Promise.reject(); })
        .then(function (ab) {
          return new Promise(function (resolve, reject) {
            ctx.decodeAudioData(ab, resolve, reject);
          });
        })
        .then(function (buffer) {
          soundBuffers[id] = buffer;
        })
        .catch(function () {});
    });
  }

  loadSoundFiles();

  window.GameAudio = {
    soundEnabled: true,
    voiceEnabled: true,
    playSound: playSound,
    speak: speak,
    loadSettings: loadSettings,
    saveSettings: saveSettings
  };
})();
