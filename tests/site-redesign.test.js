const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.join(__dirname, "..");
const read = file => fs.readFileSync(path.join(root, file), "utf8");

test("all root HTML routes load the shared visual system and decorative background", () => {
  const pages = fs.readdirSync(root).filter(file => file.endsWith(".html"));
  assert.ok(pages.length >= 10);
  for (const page of pages) {
    const html = read(page);
    assert.match(html, /site-experience\.css\?v=[^"]+/,
      `${page} should load the unified visual system`);
    assert.match(html, /tech-background\.js\?v=[^"]+/,
      `${page} should load the local ambient background`);
  }
});

test("homepage has no remote stock image and preserves real product and contact links", () => {
  const html = read("index.html");
  assert.doesNotMatch(html, /images\.unsplash\.com|<img[^>]+src="https?:/i);
  assert.doesNotMatch(html, /class="home-project"/);
  assert.match(html, /DavKays Connect/);
  assert.match(html, /davkays-connect\.davidkanyurira6\.workers\.dev/);
  assert.match(html, /mailto:info@davkays\.me/);
  assert.match(html, /href="\/services\.html"/);
  assert.match(html, /href="\/projects\.html"/);
});

test("homepage styling stays within deep brown, chrome, black, white and state indicators", () => {
  const css = read("site-experience.css");
  assert.match(css, /--dk-brown:#21150f/);
  assert.match(css, /--dk-chrome:#a8a9ad/);
  assert.match(css, /--dk-ink:#080808/);
  assert.match(css, /--dk-white:#fff/);
  assert.doesNotMatch(css, /#(?:ff6[0-9a-f]{4}|d9693b|e8643a|ffa500|ffd700)/i);
  assert.match(css, /prefers-reduced-motion:reduce/);
  assert.match(css, /body:not\(\.landing-app\) #tech-environment,body\.landing-app #tech-environment\{position:absolute/);
  assert.match(css, /body\.landing-app #tech-environment\{position:fixed!important/);
});

test("ambient canvas draws a static fallback and does not animate under reduced motion", () => {
  const calls = { prepended: null, raf: 0, clear: 0, fill: 0 };
  const context2d = {
    clearRect() { calls.clear += 1; }, beginPath() {}, moveTo() {}, lineTo() {}, bezierCurveTo() {}, stroke() {}, arc() {}, closePath() {},
    fill() { calls.fill += 1; }, setTransform() {}, createLinearGradient() { return { addColorStop() {} }; },
    shadowColor: "", shadowBlur: 0, fillStyle: "", strokeStyle: "", lineWidth: 1
  };
  const canvas = { style: { setProperty() {} }, dataset: {}, setAttribute() {}, getContext: () => context2d };
  const sandbox = {
    window: {
      matchMedia: () => ({ matches: true }), innerWidth: 390, innerHeight: 844, devicePixelRatio: 2,
      addEventListener() {}, requestAnimationFrame() { calls.raf += 1; return 1; }, cancelAnimationFrame() {}
    },
    navigator: {},
    document: { hidden: false, body: { prepend(node) { calls.prepended = node; } }, addEventListener() {} },
    documentElement: {},
    documentRef: null,
    documentHidden: false,
    documentListeners: {},
    document: null,
    console
  };
  sandbox.document = {
    hidden: false,
    body: { classList: { contains: () => false }, prepend(node) { calls.prepended = node; } },
    addEventListener() {}
  };
  sandbox.document.createElement = tag => tag === "canvas" ? canvas : {};
  sandbox.window.document = sandbox.document;
  sandbox.window.documentElement = {};
  sandbox.window.deviceMemory = 4;
  sandbox.window.matchMedia = () => ({ matches: true });
  sandbox.window.cancelAnimationFrame = () => {};
  sandbox.window.requestAnimationFrame = () => { calls.raf += 1; return 1; };
  sandbox.window.addEventListener = () => {};
  sandbox.document.addEventListener = () => {};
  sandbox.document.hidden = false;
  sandbox.document.createElement = () => canvas;
  sandbox.requestAnimationFrame = sandbox.window.requestAnimationFrame;
  sandbox.cancelAnimationFrame = sandbox.window.cancelAnimationFrame;
  vm.runInNewContext(read("tech-background.js"), sandbox);
  assert.equal(calls.prepended, canvas);
  assert.equal(canvas.id, "tech-environment");
  assert.equal(canvas.dataset.motion, "static");
  assert.equal(canvas.style.position, "absolute");
  assert.equal(calls.raf, 0);
  assert.ok(calls.clear > 0);
});

test("ambient canvas schedules repeated frames on a motion-enabled device", () => {
  const calls = { frames: [], clear: 0 };
  const context2d = {
    clearRect() { calls.clear += 1; }, beginPath() {}, moveTo() {}, lineTo() {}, bezierCurveTo() {}, stroke() {}, arc() {}, closePath() {}, fill() {}, setTransform() {},
    createLinearGradient() { return { addColorStop() {} }; }, shadowColor: "", shadowBlur: 0, fillStyle: "", strokeStyle: "", lineWidth: 1
  };
  const canvas = { style: { setProperty() {} }, dataset: {}, setAttribute() {}, getContext: () => context2d };
  const listeners = {};
  let id = 0;
  const document = { hidden: false, body: { classList: { contains: () => false }, offsetHeight: 2400, prepend() {} }, addEventListener(type, handler) { listeners[type] = handler; }, createElement: () => canvas };
  const window = {
    matchMedia: () => ({ matches: false }), innerWidth: 1280, innerHeight: 800, devicePixelRatio: 1, addEventListener() {},
    requestAnimationFrame(callback) { calls.frames.push(callback); id += 1; return id; }, cancelAnimationFrame() {}
  };
  const sandbox = { window, document, navigator: { deviceMemory: 8 }, requestAnimationFrame: window.requestAnimationFrame.bind(window), cancelAnimationFrame() {} };
  vm.runInNewContext(read("tech-background.js"), sandbox);
  assert.equal(canvas.dataset.motion, "animated");
  assert.equal(canvas.style.height, "2400px", "canvas should span the page content height");
  assert.equal(canvas.height, 2400, "the drawing surface should match document coordinates");
  assert.equal(calls.frames.length, 1);
  const frame = calls.frames.shift();
  frame(1000);
  assert.equal(calls.frames.length, 1, "each rendered frame should schedule the next frame");
  assert.ok(calls.clear >= 2, "the animated frame should redraw the scene");
});
