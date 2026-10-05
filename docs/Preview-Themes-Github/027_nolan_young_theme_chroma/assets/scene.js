/* Original dependency-free shader and local product demonstrations. */
(() => {
  const stages = [
    [
      "01 / THE BRIEF",
      "A shared starting point.",
      "One purpose. A few clear priorities. Everything your team needs to begin.",
      "● Context connected",
    ],
    [
      "02 / THE WORK",
      "A little more momentum.",
      "Design and delivery, moving together. Clear ownership and a useful next step.",
      "● Review in progress",
    ],
    [
      "03 / THE RELEASE",
      "Ready to meet the world.",
      "The details are checked, the story is clear, and the whole team knows what is next.",
      "✓ Ready for release",
    ],
  ];
  document.querySelectorAll("[data-stage]").forEach((button) =>
    button.addEventListener("click", () => {
      document
        .querySelectorAll("[data-stage]")
        .forEach((item) =>
          item.setAttribute("aria-pressed", String(item === button)),
        );
      const content = stages[Number(button.dataset.stage)];
      ["label", "title", "copy", "status"].forEach((name, i) => {
        document.querySelector("[data-flow-" + name + "]").textContent =
          content[i];
      });
    }),
  );
  const teams = {
    product: [
      "01",
      "A release with everyone on the same page.",
      "Keep discovery, design, engineering, and the final decision connected. Less time reconstructing context, more time building a product that feels considered.",
      "PRODUCT / THE WORKING LOOP",
      "Discover → Build → Learn",
      "Begin with the problem, bring decisions into the open, and turn each release into a better starting point for the next.",
      [
        "A shared opportunity brief",
        "Connected design and engineering reviews",
        "Release notes with a learning loop",
      ],
    ],
    design: [
      "02",
      "A clear thread through the creative process.",
      "Give the brief, the explorations, and the chosen direction a shared home. Keep feedback specific and creative intent intact, from first sketch to final handoff.",
      "DESIGN / THE WORKING LOOP",
      "Explore → Refine → Deliver",
      "Create room for divergent ideas, then converge around a direction everyone understands.",
      [
        "A living creative brief",
        "Focused rounds of visual review",
        "A complete delivery checklist",
      ],
    ],
    operations: [
      "03",
      "Good systems make good work repeatable.",
      "Turn a recurring process into a useful shared rhythm. Keep responsibilities visible and exceptions easy to understand without adding another layer of administration.",
      "OPERATIONS / THE WORKING LOOP",
      "Define → Coordinate → Improve",
      "Start with a clear process, make exceptions visible, and improve the next cycle with what you learn.",
      [
        "Clear process ownership",
        "Visible dependencies and checkpoints",
        "A practical retrospective",
      ],
    ],
  };
  document.querySelectorAll("[data-team]").forEach((button) =>
    button.addEventListener("click", () => {
      document
        .querySelectorAll("[data-team]")
        .forEach((item) =>
          item.setAttribute("aria-pressed", String(item === button)),
        );
      const data = teams[button.dataset.team];
      ["number", "title", "copy", "label", "flow", "detail"].forEach(
        (key, i) => {
          document.querySelector("[data-team-" + key + "]").textContent =
            data[i];
        },
      );
      const list = document.querySelector("[data-team-list]");
      list.replaceChildren();
      data[6].forEach((text) => {
        const li = document.createElement("li");
        li.textContent = text;
        list.append(li);
      });
    }),
  );
  const canvas = document.querySelector("[data-shader]");
  if (!canvas) return;
  const gl = canvas.getContext("webgl", {
    alpha: false,
    antialias: false,
    powerPreference: "low-power",
  });
  if (!gl) {
    canvas.hidden = true;
    return;
  }
  const vertex = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
  const fragment = `precision mediump float;
uniform vec2 res;uniform float time;uniform vec2 pointer;uniform vec3 ca;uniform vec3 cb;uniform vec3 cc;uniform vec3 cd;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.;float a=.5;for(int i=0;i<4;i++){v+=a*noise(p);p=mat2(.8,.6,-.6,.8)*p*2.05+2.7;a*=.5;}return v;}
void main(){vec2 uv=gl_FragCoord.xy/res;vec2 p=(uv-.5)*vec2(res.x/res.y,1.)*2.0;float t=time*.055;p+=(pointer-.5)*.18;
vec2 q=vec2(fbm(p+t),fbm(p+vec2(4.1,1.7)-t*.7));vec2 r=vec2(fbm(p+2.8*q+vec2(1.7,9.2)+t*.4),fbm(p+3.*q+vec2(8.3,2.8)-t*.3));
float f=fbm(p+2.9*r);vec3 color=mix(ca,cb,smoothstep(.18,.7,f));color=mix(color,cc,smoothstep(.25,.8,q.x)*.87);color=mix(color,cd,smoothstep(.3,.8,r.y)*.85);color+=.035*sin(f*14.);color+=(hash(gl_FragCoord.xy)-.5)*.022;gl_FragColor=vec4(color,1.);}`;
  function compile(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }
  const vs = compile(gl.VERTEX_SHADER, vertex),
    fs = compile(gl.FRAGMENT_SHADER, fragment);
  if (!vs || !fs) {
    canvas.hidden = true;
    return;
  }
  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    canvas.hidden = true;
    return;
  }
  gl.useProgram(program);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW,
  );
  const position = gl.getAttribLocation(program, "p");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  const uniforms = {};
  ["res", "time", "pointer", "ca", "cb", "cc", "cd"].forEach(
    (n) => (uniforms[n] = gl.getUniformLocation(program, n)),
  );
  const palettes = [
    [
      [0.97, 0.42, 0.27],
      [0.97, 0.79, 0.42],
      [0.91, 0.56, 0.68],
      [0.47, 0.63, 0.72],
    ],
    [
      [0.23, 0.32, 0.66],
      [0.65, 0.68, 0.9],
      [0.46, 0.79, 0.76],
      [0.93, 0.64, 0.76],
    ],
    [
      [0.26, 0.43, 0.33],
      [0.76, 0.84, 0.49],
      [0.52, 0.68, 0.59],
      [0.9, 0.71, 0.43],
    ],
  ];
  let palette = 0,
    pointer = [0.5, 0.5],
    paused = document.documentElement.classList.contains("motion-paused"),
    visible = true,
    frame = 0,
    last = 0,
    elapsed = 0,
    lost = false;
  function resize() {
    const ratio = Math.min(devicePixelRatio || 1, 1.5);
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.min(1800, Math.round(rect.width * ratio)));
    canvas.height = Math.max(1, Math.round(rect.height * ratio));
    gl.viewport(0, 0, canvas.width, canvas.height);
    draw();
  }
  function draw() {
    if (lost) return;
    gl.uniform2f(uniforms.res, canvas.width, canvas.height);
    gl.uniform1f(uniforms.time, elapsed / 1000);
    gl.uniform2f(uniforms.pointer, ...pointer);
    ["ca", "cb", "cc", "cd"].forEach((n, i) =>
      gl.uniform3fv(uniforms[n], palettes[palette][i]),
    );
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
  function tick(now) {
    frame = 0;
    if (paused || !visible || document.hidden || lost) return;
    if (now - last >= 32) {
      elapsed += Math.min(now - last, 50);
      last = now;
      draw();
    }
    frame = requestAnimationFrame(tick);
  }
  function restart() {
    cancelAnimationFrame(frame);
    frame = 0;
    last = performance.now();
    if (!paused && visible && !document.hidden && !lost)
      frame = requestAnimationFrame(tick);
    else draw();
  }
  canvas.parentElement.addEventListener("pointermove", (event) => {
    const r = canvas.getBoundingClientRect();
    pointer = [
      (event.clientX - r.left) / r.width,
      1 - (event.clientY - r.top) / r.height,
    ];
  });
  document.querySelectorAll("[data-palette]").forEach((button) =>
    button.addEventListener("click", () => {
      palette = Number(button.dataset.palette);
      document
        .querySelectorAll("[data-palette]")
        .forEach((item) =>
          item.setAttribute("aria-pressed", String(item === button)),
        );
      draw();
    }),
  );
  document.addEventListener("motionchange", (event) => {
    paused = event.detail.paused;
    restart();
  });
  document.addEventListener("visibilitychange", restart);
  new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
    restart();
  }).observe(canvas);
  new ResizeObserver(resize).observe(canvas);
  canvas.addEventListener("webglcontextlost", (event) => {
    event.preventDefault();
    lost = true;
    cancelAnimationFrame(frame);
    canvas.hidden = true;
  });
  resize();
  restart();
})();
