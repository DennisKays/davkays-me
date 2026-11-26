(() => {
  "use strict";

  // The landing page gets its own viewport-fixed ambient scene. Other pages
  // retain the existing document-sized background implementation below.
  if (document.body.classList.contains("landing-app")) {
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const canvas = document.createElement("canvas");
    canvas.id = "tech-environment";
    canvas.dataset.motion = reduced ? "static" : "animated";
    canvas.setAttribute("aria-hidden", "true");
    canvas.setAttribute("focusable", "false");
    document.body.prepend(canvas);
    const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
    if (!ctx) return;

    let width = 0, height = 0, dpr = 1, frame = 0, elapsed = 0;
    const pointer = { x: 0, y: 0, active: false };
    const rand = (seed => () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; })(81427);
    const particles = Array.from({ length: 70 }, (_, i) => ({
      x: rand(), y: rand() * .60, r: .55 + rand() * 1.25,
      phase: rand() * Math.PI * 2, speed: .08 + rand() * .16,
      cream: i % 7 === 0
    }));
    const signals = Array.from({ length: 40 }, (_, i) => ({ edge: i * 73 % 3000, phase: rand(), speed: .035 + rand() * .065 }));
    const brain = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    function addLobe(side, count) {
      for (let i = 0; i < count; i += 1) {
        const y = 1 - 2 * (i + .5) / count;
        const ring = Math.sqrt(1 - y * y);
        const theta = golden * i;
        const bump = 1 + .045 * Math.sin(theta * 5 + y * 11) * Math.cos(theta * 3 - y * 8);
        brain.push({
          x: side * .46 + Math.cos(theta) * ring * .43 * bump,
          y: y * .58 * bump,
          z: Math.sin(theta) * ring * .52 * bump,
          kind: "cortex"
        });
      }
    }
    addLobe(-1, 465); addLobe(1, 465);
    for (let i = 0; i < 54; i += 1) {
      const y = -1 + 2 * (i + .5) / 54, a = i * golden;
      const r = Math.sqrt(1 - y * y);
      brain.push({ x: .04 + Math.cos(a) * r * .3, y: .53 + y * .2, z: -.32 + Math.sin(a) * r * .27, kind: "cerebellum" });
    }
    for (let i = 0; i < 18; i += 1) {
      const y = .68 + i / 17 * .19, w = .105 * (1 - i / 24);
      brain.push({ x: Math.sin(i * .9) * .018, y, z: .02 + Math.cos(i * .9) * w, kind: "stem" });
    }
    // Precompute three nearest connections for each surface point once.
    const edges = [];
    for (let i = 0; i < brain.length; i += 1) {
      const nearest = [];
      for (let j = 0; j < brain.length; j += 1) {
        if (i === j) continue;
        const a = brain[i], b = brain[j];
        const distance = (a.x-b.x)**2 + (a.y-b.y)**2 + (a.z-b.z)**2;
        if (nearest.length < 3 || distance < nearest[nearest.length - 1].distance) {
          nearest.push({ j, distance }); nearest.sort((m,n) => m.distance - n.distance); nearest.length = Math.min(3, nearest.length);
        }
      }
      for (const n of nearest) if (n.j > i) edges.push([i, n.j]);
    }
    signals.forEach((s, i) => { s.edge = (i * 83) % edges.length; });

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth; height = window.innerHeight;
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(elapsed);
    }
    function draw(time) {
      elapsed = time;
      ctx.clearRect(0, 0, width, height);
      const motion = reduced ? 0 : time * .001;
      const px = pointer.active ? (pointer.x - .5) : 0;
      const py = pointer.active ? (pointer.y - .5) : 0;
      // Three quiet, slowly drifting amber light fields.
      const orbData = [[.18,.23,.42],[.82,.26,.36],[.54,.75,.32]];
      orbData.forEach(([ox,oy,r], i) => {
        const x = width * (ox + Math.sin(motion * .17 + i * 2) * .035 + px * .018);
        const y = height * (oy + Math.cos(motion * .14 + i * 1.8) * .035 + py * .018);
        const glow = ctx.createRadialGradient(x,y,0,x,y,Math.min(width,height)*r);
        glow.addColorStop(0,"rgba(169,121,81,.105)"); glow.addColorStop(.45,"rgba(169,121,81,.035)"); glow.addColorStop(1,"rgba(169,121,81,0)");
        ctx.fillStyle=glow;ctx.fillRect(0,0,width,height);
      });
      const horizon = height * .62 + py * 8;
      const vpX = width * (.5 + px * .018), parallax = px * 8;
      // Perspective floor: fan lines and moving, receding horizontal lines.
      ctx.save(); ctx.beginPath(); ctx.rect(0,horizon,width,height-horizon); ctx.clip();
      for(let i=-12;i<=12;i++){
        const edge=width*.5+i*width*.105;
        const grad=ctx.createLinearGradient(vpX,horizon,edge+parallax,height);
        grad.addColorStop(0,"rgba(169,121,81,0)");grad.addColorStop(1,"rgba(169,121,81,.14)");
        ctx.strokeStyle=grad;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(vpX,horizon);ctx.lineTo(edge+parallax,height);ctx.stroke();
      }
      const phase = reduced ? .2 : (motion * .12) % 1;
      for(let i=0;i<18;i++){
        const p=((i/18+phase)%1), curve=p*p;
        const y=horizon+curve*(height-horizon);
        const alpha=.02+curve*.38;
        ctx.strokeStyle=`rgba(169,121,81,${alpha})`;ctx.lineWidth=1;
        ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(width,y);ctx.stroke();
      }
      ctx.restore();
      const horizonGlow=ctx.createLinearGradient(0,0,width,0);
      horizonGlow.addColorStop(0,"rgba(169,121,81,0)");horizonGlow.addColorStop(.25,"rgba(169,121,81,.03)");horizonGlow.addColorStop(.5,"rgba(217,177,142,.44)");horizonGlow.addColorStop(.75,"rgba(169,121,81,.03)");horizonGlow.addColorStop(1,"rgba(169,121,81,0)");
      ctx.strokeStyle=horizonGlow;ctx.shadowColor="rgba(169,121,81,.45)";ctx.shadowBlur=14;ctx.beginPath();ctx.moveTo(0,horizon);ctx.lineTo(width,horizon);ctx.stroke();ctx.shadowBlur=0;

      // Seventy drifting points and short, low-contrast connections.
      const particleXY=particles.map((p,i)=>({x:p.x*width+Math.sin(motion*p.speed+p.phase)*8+px*12,y:p.y*height+Math.cos(motion*p.speed*.7+p.phase)*5+py*8,r:p.r,cream:p.cream}));
      for(let i=0;i<particleXY.length;i++) for(let j=i+1;j<particleXY.length;j++){
        const a=particleXY[i],b=particleXY[j],dist=Math.hypot(a.x-b.x,a.y-b.y);
        if(dist<130){ctx.strokeStyle=`rgba(169,121,81,${(1-dist/130)*.11})`;ctx.lineWidth=.65;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}
      }
      particleXY.forEach(p=>{ctx.fillStyle=p.cream?"rgba(243,239,232,.65)":"rgba(201,161,126,.65)";ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();});

      // Fine wireframe brain with a gentle Y rotation and cursor parallax.
      const S=Math.min(width*.25,height*.38), cx=width*.5+px*14, cy=height*.44+py*10;
      const angle=motion*.14, tilt=.13+py*.08, focal=S*4.7;
      const projected=brain.map(p=>{
        const x=p.x*Math.cos(angle)+p.z*Math.sin(angle), z=-p.x*Math.sin(angle)+p.z*Math.cos(angle);
        const y=p.y*Math.cos(tilt)-z*Math.sin(tilt), zz=p.y*Math.sin(tilt)+z*Math.cos(tilt);
        const depth=focal/(focal-zz*S*.72);
        return {x:cx+x*S*depth,y:cy+y*S*depth,z:zz,depth};
      });
      // Backdrop glow around the sculpture.
      const bg=ctx.createRadialGradient(cx,cy,0,cx,cy,S*1.5);bg.addColorStop(0,"rgba(169,121,81,.095)");bg.addColorStop(1,"rgba(169,121,81,0)");ctx.fillStyle=bg;ctx.beginPath();ctx.arc(cx,cy,S*1.5,0,Math.PI*2);ctx.fill();
      edges.forEach(([a,b],i)=>{
        const p=projected[a],q=projected[b],front=Math.max(0,(p.z+q.z+1.2)/3.2);
        ctx.strokeStyle=`rgba(208,177,151,${.055+front*.19})`;ctx.lineWidth=.45+front*.35;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();
      });
      projected.forEach((p,i)=>{const alpha=.12+Math.max(0,p.z+1)*.16;ctx.fillStyle=brain[i].kind==="cerebellum"?`rgba(225,206,188,${alpha})`:`rgba(222,190,162,${alpha})`;ctx.beginPath();ctx.arc(p.x,p.y,.45+Math.max(0,p.z+1)*.65,0,Math.PI*2);ctx.fill();});
      // A fine shaded fissure makes the paired hemispheres read as a brain.
      ctx.save();ctx.strokeStyle="rgba(8,8,8,.55)";ctx.lineWidth=Math.max(1,S*.009);ctx.shadowColor="rgba(8,8,8,.65)";ctx.shadowBlur=5;ctx.beginPath();
      for(let i=0;i<=24;i++){const u=i/24,y=cy-S*.57+u*S*1.42,x=cx+Math.sin(u*Math.PI*3+angle)*S*.035;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();ctx.restore();
      if(!reduced) signals.forEach((signal)=>{
        const [a,b]=edges[signal.edge], progress=(signal.phase+motion*signal.speed)%1,p=projected[a],q=projected[b];
        const x=p.x+(q.x-p.x)*progress,y=p.y+(q.y-p.y)*progress;
        ctx.fillStyle="rgba(241,216,192,.9)";ctx.shadowColor="rgba(217,155,108,.9)";ctx.shadowBlur=9;ctx.beginPath();ctx.arc(x,y,1.4,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
      });
      // Restrained engineering HUD rings, 72 ticks, and two arc segments.
      const rr=S*1.14;
      ctx.save();ctx.translate(cx,cy);ctx.strokeStyle="rgba(201,161,126,.28)";ctx.lineWidth=.8;ctx.setLineDash([1.5,7]);ctx.beginPath();ctx.arc(0,0,rr,motion*.08,motion*.08+Math.PI*2);ctx.stroke();ctx.setLineDash([]);
      for(let i=0;i<72;i++){const a=i*Math.PI/36,inner=rr+(i%6===0?-11:-5);ctx.strokeStyle=i%6===0?"rgba(215,177,142,.48)":"rgba(215,177,142,.2)";ctx.lineWidth=i%6===0?1.1:.65;ctx.beginPath();ctx.moveTo(Math.cos(a)*inner,Math.sin(a)*inner);ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);ctx.stroke();}
      ctx.strokeStyle="rgba(243,239,232,.25)";ctx.lineWidth=1.1;ctx.beginPath();ctx.arc(0,0,rr*1.08,.25+motion*.035,1.2+motion*.035);ctx.stroke();ctx.beginPath();ctx.arc(0,0,rr*1.08,3.65-motion*.025,4.55-motion*.025);ctx.stroke();ctx.restore();
      // Radial vignette protects contrast around foreground copy.
      const vignette=ctx.createRadialGradient(width*.5,height*.42,Math.min(width,height)*.18,width*.5,height*.45,Math.max(width,height)*.72);
      vignette.addColorStop(0,"rgba(8,8,8,.02)");vignette.addColorStop(.62,"rgba(8,8,8,.17)");vignette.addColorStop(1,"rgba(8,8,8,.72)");ctx.fillStyle=vignette;ctx.fillRect(0,0,width,height);
    }
    function animate(time){frame=requestAnimationFrame(animate);if(!reduced)draw(time);}
    window.addEventListener("resize",resize,{passive:true});
    window.addEventListener("pointermove",e=>{pointer.x=e.clientX/Math.max(1,width);pointer.y=e.clientY/Math.max(1,height);pointer.active=true;},{passive:true});
    resize();if(!reduced)frame=requestAnimationFrame(animate);
    return;
  }

  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const saveData = navigator.connection?.saveData === true;
  const lowPower = (navigator.deviceMemory && navigator.deviceMemory <= 2) || saveData;
  const canvas = document.createElement("canvas");
  canvas.id = "tech-environment";
  canvas.dataset.motion = reduced || saveData ? "static" : "animated";
  canvas.setAttribute("aria-hidden", "true");
  canvas.setAttribute("focusable", "false");
    document.body.prepend(canvas);

  const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
  if (!ctx) return; // The page's CSS background remains as the graceful fallback.

  const phi = (1 + Math.sqrt(5)) / 2;
  const baseVertices = [
    [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
    [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
    [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1]
  ];
  const baseFaces = [
    [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
    [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
    [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
    [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]
  ];
  const vertexKey = v => v.map(n => n.toFixed(5)).join(",");
  const normalized = v => {
    const length = Math.hypot(v[0], v[1], v[2]) || 1;
    return [v[0] / length, v[1] / length, v[2] / length];
  };
  const vertices = baseVertices.map(normalized);
  const midpointCache = new Map();
  const midpoint = (a, b) => {
    const key = a < b ? `${a}:${b}` : `${b}:${a}`;
    if (midpointCache.has(key)) return midpointCache.get(key);
    const v = normalized(vertices[a].map((value, axis) => value + vertices[b][axis]));
    const index = vertices.push(v) - 1;
    midpointCache.set(key, index);
    return index;
  };
  const faces = [];
  for (const [a, b, c] of baseFaces) {
    const ab = midpoint(a, b), bc = midpoint(b, c), ca = midpoint(c, a);
    faces.push([a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca]);
  }

  let width = 0;
  let height = 0;
  let viewportHeight = 0;
  let points = [];
  let radius = 120;
  let raf = 0;
  let last = 0;
  let elapsed = 0;
  const pointer = { x: 0.5, y: 0.42, active: false };

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, lowPower ? 0.8 : 1);
    width = document.documentElement?.clientWidth || window.innerWidth;
    viewportHeight = window.innerHeight;
    height = Math.min(16000, Math.max(viewportHeight, document.body?.offsetHeight || 0, document.documentElement?.offsetHeight || 0));
    radius = Math.min(320, Math.max(96, Math.min(width * 0.245, viewportHeight * 0.29)));
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.style.position = "absolute";
    canvas.style.top = "0px";
    canvas.style.left = "0px";
    canvas.style.setProperty("--dk-scene-height", `${height}px`);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.max(lowPower ? 36 : 58, Math.min(lowPower ? 80 : 150, Math.round((width * height) / (lowPower ? 42000 : 36000))));
    points = Array.from({ length: count }, (_, i) => ({
      x: ((i * 0.61803398875) % 1) * width,
      y: ((i * 0.75487766625) % 1) * height,
      z: 0.32 + ((i * 0.56984029) % 0.68),
      dx: (i % 2 ? 1 : -1) * (0.11 + (i % 5) * 0.045),
      dy: (i % 3 ? -1 : 1) * (0.08 + (i % 4) * 0.035),
      phase: (i * 2.399963) % (Math.PI * 2)
    }));
    draw(elapsed);
  }

  function rotate(v, ax, ay, az) {
    const cx = Math.cos(ax), sx = Math.sin(ax);
    const cy = Math.cos(ay), sy = Math.sin(ay);
    const cz = Math.cos(az), sz = Math.sin(az);
    const x1 = v[0], y1 = v[1] * cx - v[2] * sx, z1 = v[1] * sx + v[2] * cx;
    const x2 = x1 * cy + z1 * sy, y2 = y1, z2 = -x1 * sy + z1 * cy;
    return [x2 * cz - y2 * sz, x2 * sz + y2 * cz, z2];
  }

  function drawNetwork(time, centerX, centerY) {
    const spacing = Math.min(170, Math.max(96, width * 0.12));
    const tick = time * 0.001;
    const leanX = pointer.active ? (pointer.x - 0.5) * 12 : 0;
    const leanY = pointer.active ? (pointer.y - 0.5) * 10 : 0;
    const projected = points.map(p => {
      if (!reduced && !saveData) {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < -14 || p.x > width + 14) p.dx *= -1;
        if (p.y < -14 || p.y > height + 14) p.dy *= -1;
      }
      return {
        x: p.x + Math.sin(tick * 0.75 + p.phase) * 7 + leanX * p.z,
        y: p.y + Math.cos(tick * 0.65 + p.phase) * 6 + leanY * p.z,
        z: p.z,
        phase: p.phase
      };
    });

    for (let i = 0; i < projected.length; i += 1) {
      const p = projected[i];
      for (let j = i + 1; j < projected.length; j += 1) {
        const q = projected[j];
        const distance = Math.hypot(p.x - q.x, p.y - q.y);
        if (distance < spacing) {
          const alpha = (1 - distance / spacing) * 0.18 * Math.min(p.z, q.z);
          ctx.strokeStyle = `rgba(206,208,211,${alpha})`;
          ctx.lineWidth = 0.65 * p.z;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
      const pulse = reduced || saveData ? 0.5 : 0.58 + 0.3 * Math.sin(tick * 2.3 + p.phase);
      ctx.fillStyle = `rgba(238,239,241,${pulse * p.z})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.1 + p.z * 1.4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Moving silver data pulses travel on two broad, quiet pathways.
    if (!reduced && !saveData) {
      for (let lane = 0; lane < 3; lane += 1) {
        const phase = (time * 0.000075 + lane / 3) % 1;
        const startX = width * (0.04 + lane * 0.035);
        const startY = height * (0.22 + lane * 0.26);
        const endX = centerX - radius * 0.8;
        const endY = centerY + (lane - 1) * radius * 0.65;
        const cp1x = width * 0.36;
        const cp1y = startY - height * 0.12;
        const cp2x = endX - width * 0.12;
        const cp2y = endY + height * 0.12;
        ctx.strokeStyle = "rgba(194,197,201,.12)";
        ctx.lineWidth = 0.75;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
        ctx.stroke();
        const t = phase;
        const inv = 1 - t;
        const px = inv ** 3 * startX + 3 * inv ** 2 * t * cp1x + 3 * inv * t ** 2 * cp2x + t ** 3 * endX;
        const py = inv ** 3 * startY + 3 * inv ** 2 * t * cp1y + 3 * inv * t ** 2 * cp2y + t ** 3 * endY;
        ctx.fillStyle = "rgba(244,245,246,.82)";
        ctx.shadowColor = "rgba(232,234,236,.45)";
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(px, py, 2.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }
  }

  function drawMetalForm(time, centerX, centerY) {
    const t = reduced || saveData ? 0.42 : time * 0.00026;
    const cursorTiltX = pointer.active ? (pointer.y - 0.5) * 0.34 : 0;
    const cursorTiltY = pointer.active ? (pointer.x - 0.5) * 0.44 : 0;
    const ax = 0.24 + cursorTiltX + Math.sin(t * 0.72) * 0.1;
    const ay = t + cursorTiltY;
    const az = 0.2 + Math.sin(t * 0.42) * 0.07;
    const focal = radius * 3.9;
    const scale = radius * 0.86;
    const transformed = vertices.map(v => rotate(v, ax, ay, az));
    const project = v => {
      const depth = focal / (focal - v[2] * scale);
      return { x: centerX + v[0] * scale * depth, y: centerY + v[1] * scale * depth, z: v[2] };
    };
    const points2d = transformed.map(project);
    const orderedFaces = faces.map(face => ({ face, depth: face.reduce((sum, i) => sum + transformed[i][2], 0) / 3 }))
      .sort((a, b) => a.depth - b.depth);

    // Faceted, shaded chrome shell rotates continuously in projected 3D space.
    for (const { face } of orderedFaces) {
      const [a, b, c] = face.map(i => transformed[i]);
      const ab = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
      const ac = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
      const normal = [ab[1] * ac[2] - ab[2] * ac[1], ab[2] * ac[0] - ab[0] * ac[2], ab[0] * ac[1] - ab[1] * ac[0]];
      const center = [a[0] + b[0] + c[0], a[1] + b[1] + c[1], a[2] + b[2] + c[2]];
      if (normal[0] * center[0] + normal[1] * center[1] + normal[2] * center[2] <= 0) continue;
      const pa = points2d[face[0]], pb = points2d[face[1]], pc = points2d[face[2]];
      const shine = Math.max(0, Math.min(1, (normal[0] * -0.38 + normal[1] * -0.58 + normal[2] * 0.72) / (Math.hypot(...normal) || 1)));
      const alpha = 0.09 + shine * 0.32;
      const gradient = ctx.createLinearGradient(pa.x - radius * 0.5, pa.y - radius * 0.6, pc.x + radius * 0.4, pc.y + radius * 0.6);
      gradient.addColorStop(0, `rgba(247,248,249,${alpha})`);
      gradient.addColorStop(0.42, `rgba(168,169,173,${alpha * 0.9})`);
      gradient.addColorStop(0.76, `rgba(85,88,92,${alpha * 0.78})`);
      gradient.addColorStop(1, `rgba(224,226,228,${alpha})`);
      ctx.fillStyle = gradient;
      ctx.strokeStyle = `rgba(226,228,230,${0.08 + shine * 0.2})`;
      ctx.lineWidth = 0.65;
      ctx.beginPath();
      ctx.moveTo(pa.x, pa.y);
      ctx.lineTo(pb.x, pb.y);
      ctx.lineTo(pc.x, pc.y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // Two tilted metallic orbital rings reinforce the depth and move independently.
    for (let ring = 0; ring < 2; ring += 1) {
      const ringAngle = t * (ring ? -0.62 : 0.48) + (ring ? 1.18 : -0.24);
      const ringRadius = radius * (ring ? 1.52 : 1.28);
      const orbit = [];
      const count = 96;
      for (let i = 0; i <= count; i += 1) {
        const a = (i / count) * Math.PI * 2;
        const local = [Math.cos(a) * ringRadius, Math.sin(a) * ringRadius * 0.3, Math.sin(a) * ringRadius * 0.88];
        const rotated = rotate(local, ringAngle, 0.28 + ring * 0.48, ay * (ring ? 0.24 : -0.18));
        const perspective = focal / (focal - rotated[2]);
        orbit.push({ x: centerX + rotated[0] * perspective, y: centerY + rotated[1] * perspective, z: rotated[2] });
      }
      ctx.lineWidth = ring ? 1.2 : 1.8;
      for (let i = 1; i < orbit.length; i += 1) {
        const p = orbit[i - 1], q = orbit[i];
        const pulse = reduced || saveData ? 0.25 : 0.16 + 0.36 * Math.max(0, Math.sin(i / count * Math.PI * 2 + t * 2.3 + ring));
        ctx.strokeStyle = `rgba(226,228,230,${pulse})`;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.stroke();
      }
      if (!reduced && !saveData) {
        const a = time * 0.00042 * (ring ? -1 : 1) + ring * 2.2;
        const local = [Math.cos(a) * ringRadius, Math.sin(a) * ringRadius * 0.3, Math.sin(a) * ringRadius * 0.88];
        const rotated = rotate(local, ringAngle, 0.28 + ring * 0.48, ay * (ring ? 0.24 : -0.18));
        const perspective = focal / (focal - rotated[2]);
        ctx.fillStyle = "rgba(255,255,255,.92)";
        ctx.shadowColor = "rgba(232,234,236,.56)";
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.arc(centerX + rotated[0] * perspective, centerY + rotated[1] * perspective, 2.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }
  }

  function draw(time) {
    elapsed = time;
    ctx.clearRect(0, 0, width, height);
    // Perspective floor is intentionally faint so text and controls remain primary.
    ctx.strokeStyle = "rgba(168,169,173,.07)";
    ctx.lineWidth = 0.7;
    ctx.beginPath();
    const horizon = height * 0.7;
    for (let i = -5; i <= 5; i += 1) {
      ctx.moveTo(width * 0.68, horizon);
      ctx.lineTo(width * 0.68 + i * width * 0.13, height);
    }
    for (let i = 0; i < 5; i += 1) {
      const y = horizon + ((i + 1) / 5) ** 2 * (height - horizon);
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.stroke();

    const centerX = width * (width < 700 ? 0.98 : width < 1024 ? 1.08 : width < 1400 ? 1.1 : 0.95) + (pointer.active ? (pointer.x - 0.5) * 18 : 0);
    const centerY = viewportHeight * 0.49 + (pointer.active ? (pointer.y - 0.5) * 16 : 0);
    drawNetwork(time, centerX, centerY);
    drawMetalForm(time, centerX, centerY);
  }

  function animate(time) {
    if (document.hidden) { raf = 0; return; }
    if (time - last >= (lowPower ? 80 : 34)) {
      last = time;
      draw(time);
    }
    raf = requestAnimationFrame(animate);
  }

  function start() {
    if (reduced || saveData || document.hidden || raf) return;
    raf = requestAnimationFrame(animate);
  }

  function stop() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    draw(elapsed);
  }

  let resizePending = false;
  const scheduleResize = () => {
    if (resizePending) return;
    resizePending = true;
    requestAnimationFrame(() => { resizePending = false; resize(); });
  };
  window.addEventListener("resize", scheduleResize, { passive: true });
  window.addEventListener("load", scheduleResize, { once: true });
  if (window.ResizeObserver) new ResizeObserver(scheduleResize).observe(document.body);
  if (window.MutationObserver) new MutationObserver(scheduleResize).observe(document.body, { childList: true, subtree: true });
  window.addEventListener("pointermove", event => {
    pointer.x = event.clientX / Math.max(1, width);
    pointer.y = (window.scrollY + event.clientY) / Math.max(1, height);
    pointer.active = true;
  }, { passive: true });
  document.addEventListener("visibilitychange", () => document.hidden ? stop() : start());
  resize();
  start();
})();
