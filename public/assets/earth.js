import * as THREE from 'three';

function latLonToLocal(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  return new THREE.Vector3(x, y, z);
}

// Simplified but detailed continents outlines (same set used across pages)
const CONTINENTS = [
  [[71, -10], [70, -5], [68, 0], [66, 5], [64, 8], [62, 10], [60, 12], [58, 13], [56, 15], [54, 17], [52, 19], [50, 21], [48, 23], [46, 25], [44, 27], [42, 29], [40, 30], [38, 29], [36, 27], [35, 25], [36, 20], [37, 15], [38, 10], [39, 5], [40, 0], [42, -3], [44, -5], [46, -7], [48, -8], [50, -9], [55, -10], [60, -10], [65, -10], [71, -10]],
  [[37, 10], [36, 12], [35, 15], [34, 18], [33, 20], [32, 22], [30, 25], [28, 28], [26, 30], [24, 32], [22, 34], [20, 36], [18, 38], [16, 39], [14, 40], [12, 41], [10, 41], [8, 41], [6, 40], [4, 39], [2, 38], [0, 37], [-2, 36], [-4, 35], [-6, 34], [-8, 33], [-10, 32], [-12, 31], [-14, 30], [-16, 29], [-18, 28], [-20, 27], [-22, 26], [-24, 25], [-26, 24], [-28, 23], [-30, 22], [-32, 21], [-34, 20], [-35, 19], [-34, 17], [-32, 16], [-30, 15], [-28, 14], [-26, 13], [-24, 12], [-22, 11], [-20, 10], [-18, 9], [-16, 8], [-14, 7], [-12, 6], [-10, 5], [-8, 4], [-6, 3], [-4, 2], [-2, 1], [0, 0], [2, -1], [4, -2], [6, -3], [8, -4], [10, -5], [12, -6], [14, -7], [16, -8], [18, -9], [20, -9], [22, -9], [24, -9], [26, -9], [28, -9], [30, -8], [32, -6], [34, -3], [35, 0], [36, 3], [37, 6], [37, 10]],
  [[75, 40], [73, 45], [71, 50], [69, 55], [67, 60], [65, 65], [63, 70], [61, 75], [59, 80], [57, 85], [55, 90], [53, 95], [51, 100], [49, 105], [47, 108], [45, 110], [43, 112], [41, 114], [39, 116], [37, 118], [35, 120], [33, 122], [31, 124], [29, 126], [27, 128], [25, 130], [23, 132], [21, 134], [19, 136], [17, 138], [15, 139], [13, 140], [15, 141], [17, 142], [19, 143], [21, 144], [23, 145], [25, 145], [27, 145], [29, 145], [31, 144], [33, 143], [35, 142], [37, 141], [39, 140], [41, 139], [43, 138], [45, 137], [47, 136], [49, 135], [51, 134], [53, 133], [55, 132], [57, 131], [59, 130], [61, 128], [63, 126], [65, 124], [67, 122], [69, 120], [71, 118], [73, 115], [75, 112], [77, 108], [78, 104], [79, 100], [79, 95], [78, 90], [77, 85], [76, 80], [75, 75], [74, 70], [73, 65], [72, 60], [71, 55], [71, 50], [72, 45], [74, 40], [75, 40]],
  [[72, -168], [71, -165], [70, -162], [69, -160], [68, -158], [67, -156], [66, -154], [65, -152], [64, -150], [63, -148], [62, -146], [61, -144], [60, -142], [59, -140], [58, -138], [57, -136], [56, -134], [55, -132], [54, -130], [53, -128], [52, -126], [51, -124], [50, -122], [49, -120], [48, -118], [47, -116], [46, -114], [45, -112], [44, -110], [43, -109], [42, -108], [41, -107], [40, -106], [39, -105], [38, -104], [37, -103], [36, -102], [35, -101], [34, -100], [33, -99], [32, -98], [31, -98], [30, -98], [29, -99], [28, -100], [27, -101], [26, -102], [25, -103], [24, -104], [23, -105], [22, -106], [21, -107], [20, -107], [19, -106], [18, -105], [17, -104], [16, -103], [15, -102], [14, -101], [13, -100], [12, -99], [11, -97], [10, -95], [9, -93], [10, -91], [11, -89], [12, -87], [13, -85], [14, -84], [15, -83], [16, -82], [17, -81], [18, -80], [19, -79], [20, -78], [21, -77], [22, -76], [23, -75], [24, -75], [25, -75], [26, -76], [27, -77], [28, -78], [29, -79], [30, -80], [31, -81], [32, -82], [33, -83], [34, -84], [35, -85], [36, -86], [37, -87], [38, -88], [39, -89], [40, -90], [41, -91], [42, -92], [43, -93], [44, -94], [45, -95], [46, -96], [47, -97], [48, -98], [49, -99], [50, -100], [51, -102], [52, -104], [53, -106], [54, -108], [55, -110], [56, -112], [57, -114], [58, -116], [59, -118], [60, -120], [61, -122], [62, -124], [63, -126], [64, -128], [65, -130], [66, -133], [67, -136], [68, -140], [69, -144], [70, -150], [71, -156], [72, -162], [72, -168]],
  [[12, -80], [11, -79], [10, -78], [9, -77], [8, -76], [7, -75], [6, -74], [5, -73], [4, -72], [3, -71], [2, -70], [1, -70], [0, -70], [-1, -70], [-2, -70], [-3, -69], [-4, -69], [-5, -68], [-6, -68], [-7, -67], [-8, -67], [-9, -66], [-10, -66], [-11, -65], [-12, -65], [-13, -65], [-14, -64], [-15, -64], [-16, -64], [-17, -64], [-18, -63], [-19, -63], [-20, -63], [-21, -63], [-22, -63], [-23, -63], [-24, -63], [-25, -63], [-26, -63], [-27, -63], [-28, -63], [-29, -63], [-30, -63], [-31, -62], [-32, -62], [-33, -62], [-34, -62], [-35, -62], [-36, -62], [-37, -62], [-38, -62], [-39, -62], [-40, -63], [-41, -63], [-42, -64], [-43, -64], [-44, -65], [-45, -65], [-46, -66], [-47, -66], [-48, -67], [-49, -67], [-50, -68], [-51, -68], [-52, -69], [-53, -69], [-54, -70], [-55, -70], [-55, -69], [-55, -68], [-54, -67], [-53, -66], [-52, -65], [-51, -64], [-50, -63], [-49, -62], [-48, -61], [-47, -60], [-46, -59], [-45, -58], [-44, -57], [-43, -56], [-42, -55], [-41, -55], [-40, -54], [-39, -54], [-38, -53], [-37, -53], [-36, -52], [-35, -52], [-34, -51], [-33, -51], [-32, -50], [-31, -50], [-30, -50], [-29, -49], [-28, -49], [-27, -49], [-26, -48], [-25, -48], [-24, -47], [-23, -47], [-22, -46], [-21, -46], [-20, -45], [-19, -45], [-18, -46], [-17, -47], [-16, -48], [-15, -49], [-14, -50], [-13, -51], [-12, -52], [-11, -53], [-10, -54], [-9, -55], [-8, -56], [-7, -57], [-6, -58], [-5, -59], [-4, -60], [-3, -61], [-2, -62], [-1, -63], [0, -64], [1, -65], [2, -66], [3, -67], [4, -68], [5, -69], [6, -70], [7, -71], [8, -72], [9, -74], [10, -76], [11, -78], [12, -80]],
  [[-10, 113], [-11, 115], [-12, 117], [-13, 119], [-14, 121], [-15, 123], [-16, 125], [-17, 127], [-18, 129], [-19, 131], [-20, 133], [-21, 135], [-22, 137], [-23, 138], [-24, 139], [-25, 140], [-26, 141], [-27, 142], [-28, 143], [-29, 144], [-30, 145], [-31, 145], [-32, 146], [-33, 146], [-34, 147], [-35, 147], [-36, 148], [-37, 148], [-38, 148], [-38, 149], [-38, 150], [-37, 151], [-36, 152], [-35, 152], [-34, 153], [-33, 153], [-32, 153], [-31, 153], [-30, 153], [-29, 153], [-28, 153], [-27, 152], [-26, 152], [-25, 152], [-24, 152], [-23, 152], [-22, 151], [-21, 151], [-20, 150], [-19, 150], [-18, 149], [-17, 148], [-16, 147], [-15, 146], [-14, 145], [-13, 144], [-12, 142], [-11, 140], [-10, 138], [-10, 136], [-10, 134], [-10, 132], [-10, 130], [-10, 128], [-10, 126], [-10, 124], [-10, 122], [-10, 120], [-10, 118], [-10, 116], [-10, 114], [-10, 113]]
];

export function initEarth({
  canvas,
  canvasId,
  radius = 3,
  earthPosition = [0, 0, 0],
  cameraPosition = [0, 0, 8],
  cameraLookAt = earthPosition,
  userMarker = { lat: 48.3, lon: 6.95 },
  particlesCount = 800,
  wireColor = 0x00ff41,
  continentsOpacity = 0.5,
  cameraSway = false
} = {}) {
  const canvasEl = canvas ?? (canvasId ? document.getElementById(canvasId) : null);
  if (!canvasEl) throw new Error('Canvas not found');

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x000000, 10, 50);

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(...cameraPosition);
  camera.lookAt(...cameraLookAt);
  const baseCameraPos = new THREE.Vector3().copy(camera.position);

  const renderer = new THREE.WebGLRenderer({ canvas: canvasEl, antialias: true, alpha: false });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000);

  // Earth mesh (wireframe)
  const earthGeometry = new THREE.SphereGeometry(radius, Math.max(48, Math.floor(radius * 16)), Math.max(48, Math.floor(radius * 16)));
  const earthMaterial = new THREE.MeshBasicMaterial({
    color: wireColor,
    wireframe: true,
    transparent: true,
    opacity: 0.6
  });
  const earth = new THREE.Mesh(earthGeometry, earthMaterial);
  earth.position.set(...earthPosition);
  scene.add(earth);

  // Continents filled meshes (local to Earth)
  const continentsMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ff88,
    transparent: true,
    opacity: continentsOpacity,
    side: THREE.DoubleSide
  });

  CONTINENTS.forEach(contour => {
    const points = contour.map(([lat, lon]) => latLonToLocal(lat, lon, radius));

    const vertices = [];
    const center = new THREE.Vector3();
    points.forEach(p => center.add(p));
    center.divideScalar(points.length);

    for (let i = 0; i < points.length - 1; i++) {
      vertices.push(center.x, center.y, center.z);
      vertices.push(points[i].x, points[i].y, points[i].z);
      vertices.push(points[i + 1].x, points[i + 1].y, points[i + 1].z);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.computeVertexNormals();
    const mesh = new THREE.Mesh(geometry, continentsMaterial);
    earth.add(mesh);
  });

  // User location marker (local to Earth)
  const markerPos = latLonToLocal(userMarker.lat, userMarker.lon, radius);
  const dotSize = Math.max(0.04 * radius, 0.08);
  const ringInner = Math.max(0.05 * radius, 0.12);
  const ringOuter = ringInner * 1.2;

  const dotGeometry = new THREE.SphereGeometry(dotSize, 16, 16);
  const dotMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 1 });
  const userDot = new THREE.Mesh(dotGeometry, dotMaterial);
  userDot.position.copy(markerPos);
  earth.add(userDot);

  const ringGeo = new THREE.RingGeometry(ringInner, ringOuter, 32);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.position.copy(markerPos);
  ring.lookAt(earth.position);
  earth.add(ring);

  // Inner grid sphere (child of Earth so it follows)
  const innerGeometry = new THREE.SphereGeometry(radius * 0.975, 32, 32);
  const innerMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff88, wireframe: true, transparent: true, opacity: 0.2 });
  const innerSphere = new THREE.Mesh(innerGeometry, innerMaterial);
  earth.add(innerSphere);

  // Particles around
  const particlesGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particlesCount * 3);
  for (let i = 0; i < particlesCount * 3; i += 3) {
    const pr = radius * 4 + Math.random() * radius * 6; // scale with planet size
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    positions[i] = pr * Math.sin(phi) * Math.cos(theta);
    positions[i + 1] = pr * Math.sin(phi) * Math.sin(theta);
    positions[i + 2] = pr * Math.cos(phi);
  }
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particlesMaterial = new THREE.PointsMaterial({ color: 0x00ff41, size: 0.05, transparent: true, opacity: 0.6 });
  const particles = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particles);

  const light = new THREE.PointLight(0x00ff41, 1, 50);
  light.position.set(5, 5, 5);
  scene.add(light);

  const clock = new THREE.Clock();

  // Normalize camera sway options
  const sway = (function normalizeSway(opt) {
    if (!opt) return { enabled: false };
    if (opt === true) {
      return { enabled: true, amplitudeX: 0.5, amplitudeY: 0.3, speedX: 0.1, speedY: 0.15 };
    }
    return {
      enabled: Boolean(opt.enabled ?? true),
      amplitudeX: Number(opt.amplitudeX ?? 0.5),
      amplitudeY: Number(opt.amplitudeY ?? 0.3),
      speedX: Number(opt.speedX ?? 0.1),
      speedY: Number(opt.speedY ?? 0.15)
    };
  })(cameraSway);
  function animate() {
    const elapsed = clock.getElapsedTime();

    earth.rotation.y = elapsed * 0.15;
    earth.rotation.x = Math.sin(elapsed * 0.1) * 0.05;

    innerSphere.rotation.y = -elapsed * 0.1;
    innerSphere.rotation.x = elapsed * 0.08;

    particles.rotation.y = elapsed * 0.02;

    const blink = 0.5 + Math.sin(elapsed * 4) * 0.5;
    userDot.material.opacity = blink;
    ring.material.opacity = blink * 0.6;
    ring.scale.set(1 + blink * 0.3, 1 + blink * 0.3, 1);

    // Optional camera oscillation (sway) around base position
    if (sway.enabled) {
      camera.position.x = baseCameraPos.x + Math.sin(elapsed * sway.speedX) * sway.amplitudeX;
      camera.position.y = baseCameraPos.y + Math.cos(elapsed * sway.speedY) * sway.amplitudeY;
    }

    // Gentle camera breathing around lookAt
    camera.lookAt(...cameraLookAt);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener('resize', onResize);

  return {
    dispose() {
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    }
  }
}
