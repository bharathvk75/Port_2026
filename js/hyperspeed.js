/**
 * React Bits: Hyperspeed Component Engine
 * Variant: Vanilla JavaScript + Three.js + WebGL
 * 
 * High-performance cyber hyper-tunnel background with dynamic GLSL shaders,
 * neon light trails, turbulent camera distortion, and interactive speed warp.
 */

(function () {
  'use strict';

  const DEFAULT_EFFECT_OPTIONS = {
    onSpeedUp: () => {},
    onSlowDown: () => {},
    distortion: 'turbulentDistortion',
    length: 400,
    roadWidth: 10,
    islandWidth: 2,
    lanesPerRoad: 3,
    fov: 90,
    fovSpeedUp: 150,
    speedUp: 2,
    carLightsFade: 0.4,
    totalSideLightSticks: 20,
    lightPairsPerRoadWay: 40,
    shoulderLinesWidthPercentage: 0.05,
    brokenLinesWidthPercentage: 0.1,
    brokenLinesLengthPercentage: 0.5,
    lightStickWidth: [0.12, 0.5],
    lightStickHeight: [1.3, 1.7],
    movingAwaySpeed: [60, 80],
    movingCloserSpeed: [-120, -160],
    carLightsLength: [12, 80],
    carLightsRadius: [0.05, 0.14],
    carWidthPercentage: [0.3, 0.5],
    carShiftX: [-0.8, 0.8],
    carFloorSeparation: [0, 5],
    colors: {
      roadColor: 0x080808,
      islandColor: 0x0a0a0a,
      background: 0x000000,
      shoulderLines: 0xffffff,
      brokenLines: 0xffffff,
      leftCars: [0xd856bf, 0x6750a2, 0xc247ac],
      rightCars: [0x03b3c3, 0x0e5ea5, 0x324555],
      sticks: 0x03b3c3
    }
  };

  const random = base => {
    if (Array.isArray(base)) return Math.random() * (base[1] - base[0]) + base[0];
    return Math.random() * base;
  };

  const pickRandom = arr => {
    if (Array.isArray(arr)) return arr[Math.floor(Math.random() * arr.length)];
    return arr;
  };

  function lerp(current, target, speed = 0.1, limit = 0.001) {
    let change = (target - current) * speed;
    if (Math.abs(change) < limit) {
      change = target - current;
    }
    return change;
  }

  const nsin = val => Math.sin(val) * 0.5 + 0.5;

  class HyperspeedEngine {
    constructor(containerEl, customOptions = {}) {
      if (!containerEl || typeof THREE === 'undefined') return;
      this.container = containerEl;
      this.options = Object.assign({}, DEFAULT_EFFECT_OPTIONS, customOptions);
      this.options.colors = Object.assign({}, DEFAULT_EFFECT_OPTIONS.colors, customOptions.colors || {});
      
      this.active = false;
      this.disposed = false;
      this.rafId = null;
      this.clock = new THREE.Clock();

      this.initUniforms();
      this.initScene();
      this.initRoadElements();
      this.attachEvents();
    }

    initUniforms() {
      const turbulentUniforms = {
        uFreq: { value: new THREE.Vector4(4, 8, 8, 1) },
        uAmp: { value: new THREE.Vector4(25, 5, 10, 10) }
      };

      const mountainUniforms = {
        uFreq: { value: new THREE.Vector3(3, 6, 10) },
        uAmp: { value: new THREE.Vector3(30, 30, 20) }
      };

      this.distortions = {
        turbulentDistortion: {
          uniforms: turbulentUniforms,
          getDistortion: `
            uniform vec4 uFreq;
            uniform vec4 uAmp;
            float nsin(float val){
              return sin(val) * 0.5 + 0.5;
            }
            #define PI 3.14159265358979
            float getDistortionX(float progress){
              return (
                cos(PI * progress * uFreq.r + uTime) * uAmp.r +
                pow(cos(PI * progress * uFreq.g + uTime * (uFreq.g / uFreq.r)), 2. ) * uAmp.g
              );
            }
            float getDistortionY(float progress){
              return (
                -nsin(PI * progress * uFreq.b + uTime) * uAmp.b +
                -pow(nsin(PI * progress * uFreq.a + uTime / (uFreq.b / uFreq.a)), 5.) * uAmp.a
              );
            }
            vec3 getDistortion(float progress){
              return vec3(
                getDistortionX(progress) - getDistortionX(0.0125),
                getDistortionY(progress) - getDistortionY(0.0125),
                0.
              );
            }
          `,
          getJS: (progress, time) => {
            const uFreq = turbulentUniforms.uFreq.value;
            const uAmp = turbulentUniforms.uAmp.value;

            const getX = p =>
              Math.cos(Math.PI * p * uFreq.x + time) * uAmp.x +
              Math.pow(Math.cos(Math.PI * p * uFreq.y + time * (uFreq.y / uFreq.x)), 2) * uAmp.y;

            const getY = p =>
              -nsin(Math.PI * p * uFreq.z + time) * uAmp.z -
              Math.pow(nsin(Math.PI * p * uFreq.w + time / (uFreq.z / uFreq.w)), 5) * uAmp.w;

            let distortion = new THREE.Vector3(
              getX(progress) - getX(progress + 0.007),
              getY(progress) - getY(progress + 0.007),
              0
            );
            let lookAtAmp = new THREE.Vector3(-2, -5, 0);
            let lookAtOffset = new THREE.Vector3(0, 0, -10);
            return distortion.multiply(lookAtAmp).add(lookAtOffset);
          }
        },
        mountainDistortion: {
          uniforms: mountainUniforms,
          getDistortion: `
            uniform vec3 uAmp;
            uniform vec3 uFreq;
            #define PI 3.14159265358979
            float nsin(float val){
              return sin(val) * 0.5 + 0.5;
            }
            vec3 getDistortion(float progress){
              float movementProgressFix = 0.02;
              return vec3( 
                cos(progress * PI * uFreq.x + uTime) * uAmp.x - cos(movementProgressFix * PI * uFreq.x + uTime) * uAmp.x,
                nsin(progress * PI * uFreq.y + uTime) * uAmp.y - nsin(movementProgressFix * PI * uFreq.y + uTime) * uAmp.y,
                nsin(progress * PI * uFreq.z + uTime) * uAmp.z - nsin(movementProgressFix * PI * uFreq.z + uTime) * uAmp.z
              );
            }
          `,
          getJS: (progress, time) => {
            let movementProgressFix = 0.02;
            let uFreq = mountainUniforms.uFreq.value;
            let uAmp = mountainUniforms.uAmp.value;
            let distortion = new THREE.Vector3(
              Math.cos(progress * Math.PI * uFreq.x + time) * uAmp.x -
                Math.cos(movementProgressFix * Math.PI * uFreq.x + time) * uAmp.x,
              nsin(progress * Math.PI * uFreq.y + time) * uAmp.y -
                nsin(movementProgressFix * Math.PI * uFreq.y + time) * uAmp.y,
              nsin(progress * Math.PI * uFreq.z + time) * uAmp.z -
                nsin(movementProgressFix * Math.PI * uFreq.z + time) * uAmp.z
            );
            let lookAtAmp = new THREE.Vector3(2, 2, 2);
            let lookAtOffset = new THREE.Vector3(0, 0, -5);
            return distortion.multiply(lookAtAmp).add(lookAtOffset);
          }
        }
      };

      this.distortionObj = this.distortions[this.options.distortion] || this.distortions.turbulentDistortion;
    }

    initScene() {
      const initW = Math.max(1, this.container.offsetWidth || window.innerWidth);
      const initH = Math.max(1, this.container.offsetHeight || window.innerHeight);

      this.renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: true,
        powerPreference: 'high-performance'
      });
      this.renderer.setSize(initW, initH, false);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      this.renderer.domElement.className = 'hyperspeed-canvas';
      this.container.appendChild(this.renderer.domElement);

      this.camera = new THREE.PerspectiveCamera(this.options.fov, initW / initH, 0.1, 10000);
      this.camera.position.z = -5;
      this.camera.position.y = 8;
      this.camera.position.x = 0;

      this.scene = new THREE.Scene();
      this.scene.background = null;

      const fog = new THREE.Fog(this.options.colors.background, this.options.length * 0.2, this.options.length * 500);
      this.scene.fog = fog;
      this.fogUniforms = {
        fogColor: { value: fog.color },
        fogNear: { value: fog.near },
        fogFar: { value: fog.far }
      };

      this.fovTarget = this.options.fov;
      this.speedUpTarget = 0;
      this.speedUp = 0;
      this.timeOffset = 0;
    }

    initRoadElements() {
      const options = this.options;
      const distortion = this.distortionObj;

      // 1. Car Lights (Left - Away & Right - Closer)
      this.leftCarLights = this.createCarLights(
        options.colors.leftCars,
        options.movingAwaySpeed,
        new THREE.Vector2(0, 1 - options.carLightsFade)
      );
      this.leftCarLights.mesh.position.setX(-options.roadWidth / 2 - options.islandWidth / 2);
      this.scene.add(this.leftCarLights.mesh);

      this.rightCarLights = this.createCarLights(
        options.colors.rightCars,
        options.movingCloserSpeed,
        new THREE.Vector2(1, 0 + options.carLightsFade)
      );
      this.rightCarLights.mesh.position.setX(options.roadWidth / 2 + options.islandWidth / 2);
      this.scene.add(this.rightCarLights.mesh);

      // 2. Side Light Sticks
      this.leftSticks = this.createLightSticks();
      this.leftSticks.mesh.position.setX(-(options.roadWidth + options.islandWidth / 2));
      this.scene.add(this.leftSticks.mesh);

      // 3. Road Surface & Central Island
      this.uRoadTime = { value: 0 };
      this.leftRoadWay = this.createRoadPlane(-1, options.roadWidth, true);
      this.rightRoadWay = this.createRoadPlane(1, options.roadWidth, true);
      this.island = this.createRoadPlane(0, options.islandWidth, false);
    }

    createCarLights(colors, speed, fade) {
      const options = this.options;
      const curve = new THREE.LineCurve3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -1));
      const geometry = new THREE.TubeGeometry(curve, 40, 1, 8, false);
      const instanced = new THREE.InstancedBufferGeometry().copy(geometry);
      instanced.instanceCount = options.lightPairsPerRoadWay * 2;

      const laneWidth = options.roadWidth / options.lanesPerRoad;
      const aOffset = [];
      const aMetrics = [];
      const aColor = [];

      const colorList = Array.isArray(colors) ? colors.map(c => new THREE.Color(c)) : [new THREE.Color(colors)];

      for (let i = 0; i < options.lightPairsPerRoadWay; i++) {
        const radius = random(options.carLightsRadius);
        const length = random(options.carLightsLength);
        const spd = random(speed);

        const carLane = i % options.lanesPerRoad;
        let laneX = carLane * laneWidth - options.roadWidth / 2 + laneWidth / 2;
        const carWidth = random(options.carWidthPercentage) * laneWidth;
        const carShiftX = random(options.carShiftX) * laneWidth;
        laneX += carShiftX;

        const offsetY = random(options.carFloorSeparation) + radius * 1.3;
        const offsetZ = -random(options.length);

        // Pair 1
        aOffset.push(laneX - carWidth / 2, offsetY, offsetZ);
        aMetrics.push(radius, length, spd);
        const c1 = pickRandom(colorList);
        aColor.push(c1.r, c1.g, c1.b);

        // Pair 2
        aOffset.push(laneX + carWidth / 2, offsetY, offsetZ);
        aMetrics.push(radius, length, spd);
        const c2 = pickRandom(colorList);
        aColor.push(c2.r, c2.g, c2.b);
      }

      instanced.setAttribute('aOffset', new THREE.InstancedBufferAttribute(new Float32Array(aOffset), 3, false));
      instanced.setAttribute('aMetrics', new THREE.InstancedBufferAttribute(new Float32Array(aMetrics), 3, false));
      instanced.setAttribute('aColor', new THREE.InstancedBufferAttribute(new Float32Array(aColor), 3, false));

      const carLightsFragment = `
        #define USE_FOG;
        ${THREE.ShaderChunk['fog_pars_fragment']}
        varying vec3 vColor;
        varying vec2 vUv; 
        uniform vec2 uFade;
        void main() {
          vec3 color = vec3(vColor);
          float alpha = smoothstep(uFade.x, uFade.y, vUv.x);
          gl_FragColor = vec4(color, alpha);
          if (gl_FragColor.a < 0.0001) discard;
          ${THREE.ShaderChunk['fog_fragment']}
        }
      `;

      const carLightsVertex = `
        #define USE_FOG;
        ${THREE.ShaderChunk['fog_pars_vertex']}
        attribute vec3 aOffset;
        attribute vec3 aMetrics;
        attribute vec3 aColor;
        uniform float uTravelLength;
        uniform float uTime;
        varying vec2 vUv; 
        varying vec3 vColor; 
        #include <getDistortion_vertex>
        void main() {
          vec3 transformed = position.xyz;
          float radius = aMetrics.r;
          float myLength = aMetrics.g;
          float speed = aMetrics.b;

          transformed.xy *= radius;
          transformed.z *= myLength;

          transformed.z += myLength - mod(uTime * speed + aOffset.z, uTravelLength);
          transformed.xy += aOffset.xy;

          float progress = abs(transformed.z / uTravelLength);
          transformed.xyz += getDistortion(progress);

          vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.);
          gl_Position = projectionMatrix * mvPosition;
          vUv = uv;
          vColor = aColor;
          ${THREE.ShaderChunk['fog_vertex']}
        }
      `;

      const material = new THREE.ShaderMaterial({
        fragmentShader: carLightsFragment,
        vertexShader: carLightsVertex,
        transparent: true,
        blending: THREE.AdditiveBlending,
        uniforms: Object.assign(
          {
            uTime: { value: 0 },
            uTravelLength: { value: options.length },
            uFade: { value: fade }
          },
          this.fogUniforms,
          this.distortionObj.uniforms
        )
      });

      material.onBeforeCompile = shader => {
        shader.vertexShader = shader.vertexShader.replace(
          '#include <getDistortion_vertex>',
          this.distortionObj.getDistortion
        );
      };

      const mesh = new THREE.Mesh(instanced, material);
      mesh.frustumCulled = false;

      return {
        mesh,
        update: time => {
          mesh.material.uniforms.uTime.value = time;
        }
      };
    }

    createLightSticks() {
      const options = this.options;
      const geometry = new THREE.PlaneGeometry(1, 1);
      const instanced = new THREE.InstancedBufferGeometry().copy(geometry);
      const totalSticks = options.totalSideLightSticks;
      instanced.instanceCount = totalSticks;

      const stickoffset = options.length / (totalSticks - 1);
      const aOffset = [];
      const aColor = [];
      const aMetrics = [];

      const colorList = Array.isArray(options.colors.sticks)
        ? options.colors.sticks.map(c => new THREE.Color(c))
        : [new THREE.Color(options.colors.sticks)];

      for (let i = 0; i < totalSticks; i++) {
        const width = random(options.lightStickWidth);
        const height = random(options.lightStickHeight);
        aOffset.push((i - 1) * stickoffset * 2 + stickoffset * Math.random());

        const color = pickRandom(colorList);
        aColor.push(color.r, color.g, color.b);
        aMetrics.push(width, height);
      }

      instanced.setAttribute('aOffset', new THREE.InstancedBufferAttribute(new Float32Array(aOffset), 1, false));
      instanced.setAttribute('aColor', new THREE.InstancedBufferAttribute(new Float32Array(aColor), 3, false));
      instanced.setAttribute('aMetrics', new THREE.InstancedBufferAttribute(new Float32Array(aMetrics), 2, false));

      const sideSticksVertex = `
        #define USE_FOG;
        ${THREE.ShaderChunk['fog_pars_vertex']}
        attribute float aOffset;
        attribute vec3 aColor;
        attribute vec2 aMetrics;
        uniform float uTravelLength;
        uniform float uTime;
        varying vec3 vColor;
        mat4 rotationY( in float angle ) {
          return mat4(	cos(angle),		0,		sin(angle),	0,
                       0,		1.0,			 0,	0,
                  -sin(angle),	0,		cos(angle),	0,
                  0, 		0,				0,	1);
        }
        #include <getDistortion_vertex>
        void main(){
          vec3 transformed = position.xyz;
          float width = aMetrics.x;
          float height = aMetrics.y;

          transformed.xy *= vec2(width, height);
          float time = mod(uTime * 60. * 2. + aOffset, uTravelLength);

          transformed = (rotationY(3.14/2.) * vec4(transformed,1.)).xyz;

          transformed.z += - uTravelLength + time;

          float progress = abs(transformed.z / uTravelLength);
          transformed.xyz += getDistortion(progress);

          transformed.y += height / 2.;
          transformed.x += -width / 2.;
          vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.);
          gl_Position = projectionMatrix * mvPosition;
          vColor = aColor;
          ${THREE.ShaderChunk['fog_vertex']}
        }
      `;

      const sideSticksFragment = `
        #define USE_FOG;
        ${THREE.ShaderChunk['fog_pars_fragment']}
        varying vec3 vColor;
        void main(){
          vec3 color = vec3(vColor);
          gl_FragColor = vec4(color, 1.);
          ${THREE.ShaderChunk['fog_fragment']}
        }
      `;

      const material = new THREE.ShaderMaterial({
        fragmentShader: sideSticksFragment,
        vertexShader: sideSticksVertex,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        uniforms: Object.assign(
          {
            uTravelLength: { value: options.length },
            uTime: { value: 0 }
          },
          this.fogUniforms,
          this.distortionObj.uniforms
        )
      });

      material.onBeforeCompile = shader => {
        shader.vertexShader = shader.vertexShader.replace(
          '#include <getDistortion_vertex>',
          this.distortionObj.getDistortion
        );
      };

      const mesh = new THREE.Mesh(instanced, material);
      mesh.frustumCulled = false;

      return {
        mesh,
        update: time => {
          mesh.material.uniforms.uTime.value = time;
        }
      };
    }

    createRoadPlane(side, width, isRoad) {
      const options = this.options;
      const geometry = new THREE.PlaneGeometry(
        isRoad ? options.roadWidth : options.islandWidth,
        options.length,
        20,
        100
      );

      let uniforms = {
        uTravelLength: { value: options.length },
        uColor: { value: new THREE.Color(isRoad ? options.colors.roadColor : options.colors.islandColor) },
        uTime: this.uRoadTime
      };

      if (isRoad) {
        uniforms = Object.assign(uniforms, {
          uLanes: { value: options.lanesPerRoad },
          uBrokenLinesColor: { value: new THREE.Color(options.colors.brokenLines) },
          uShoulderLinesColor: { value: new THREE.Color(options.colors.shoulderLines) },
          uShoulderLinesWidthPercentage: { value: options.shoulderLinesWidthPercentage },
          uBrokenLinesLengthPercentage: { value: options.brokenLinesLengthPercentage },
          uBrokenLinesWidthPercentage: { value: options.brokenLinesWidthPercentage }
        });
      }

      const roadMarkings_vars = `
        uniform float uLanes;
        uniform vec3 uBrokenLinesColor;
        uniform vec3 uShoulderLinesColor;
        uniform float uShoulderLinesWidthPercentage;
        uniform float uBrokenLinesWidthPercentage;
        uniform float uBrokenLinesLengthPercentage;
      `;

      const roadMarkings_fragment = `
        uv.y = mod(uv.y + uTime * 0.05, 1.);
        float laneWidth = 1.0 / uLanes;
        float brokenLineWidth = laneWidth * uBrokenLinesWidthPercentage;
        float laneEmptySpace = 1. - uBrokenLinesLengthPercentage;

        float brokenLines = step(1.0 - brokenLineWidth, fract(uv.x * 2.0)) * step(laneEmptySpace, fract(uv.y * 10.0));
        float sideLines = step(1.0 - brokenLineWidth, fract((uv.x - laneWidth * (uLanes - 1.0)) * 2.0)) + step(brokenLineWidth, uv.x);

        brokenLines = mix(brokenLines, sideLines, uv.x);
      `;

      const roadBaseFragment = `
        #define USE_FOG;
        varying vec2 vUv; 
        uniform vec3 uColor;
        uniform float uTime;
        #include <roadMarkings_vars>
        ${THREE.ShaderChunk['fog_pars_fragment']}
        void main() {
          vec2 uv = vUv;
          vec3 color = vec3(uColor);
          #include <roadMarkings_fragment>
          gl_FragColor = vec4(color, 1.);
          ${THREE.ShaderChunk['fog_fragment']}
        }
      `;

      const islandFragment = roadBaseFragment
        .replace('#include <roadMarkings_fragment>', '')
        .replace('#include <roadMarkings_vars>', '');

      const roadFragment = roadBaseFragment
        .replace('#include <roadMarkings_fragment>', roadMarkings_fragment)
        .replace('#include <roadMarkings_vars>', roadMarkings_vars);

      const roadVertex = `
        #define USE_FOG;
        uniform float uTime;
        ${THREE.ShaderChunk['fog_pars_vertex']}
        uniform float uTravelLength;
        varying vec2 vUv; 
        #include <getDistortion_vertex>
        void main() {
          vec3 transformed = position.xyz;
          vec3 distortion = getDistortion((transformed.y + uTravelLength / 2.) / uTravelLength);
          transformed.x += distortion.x;
          transformed.z += distortion.y;
          transformed.y += -1. * distortion.z;  
          
          vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.);
          gl_Position = projectionMatrix * mvPosition;
          vUv = uv;
          ${THREE.ShaderChunk['fog_vertex']}
        }
      `;

      const material = new THREE.ShaderMaterial({
        fragmentShader: isRoad ? roadFragment : islandFragment,
        vertexShader: roadVertex,
        side: THREE.DoubleSide,
        uniforms: Object.assign(uniforms, this.fogUniforms, this.distortionObj.uniforms)
      });

      material.onBeforeCompile = shader => {
        shader.vertexShader = shader.vertexShader.replace(
          '#include <getDistortion_vertex>',
          this.distortionObj.getDistortion
        );
      };

      const mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.z = -options.length / 2;
      mesh.position.x += (options.islandWidth / 2 + options.roadWidth / 2) * side;
      this.scene.add(mesh);

      return mesh;
    }

    attachEvents() {
      this.onResize = () => {
        if (!this.container || !this.renderer || !this.camera) return;
        const w = Math.max(1, this.container.offsetWidth || window.innerWidth);
        const h = Math.max(1, this.container.offsetHeight || window.innerHeight);

        this.renderer.setSize(w, h, false);
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
      };
      window.addEventListener('resize', this.onResize);

      // Speed up interaction on pointer down/drag
      const triggerSpeedUp = () => {
        if (this.options.onSpeedUp) this.options.onSpeedUp();
        this.fovTarget = this.options.fovSpeedUp;
        this.speedUpTarget = this.options.speedUp;
      };

      const triggerSlowDown = () => {
        if (this.options.onSlowDown) this.options.onSlowDown();
        this.fovTarget = this.options.fov;
        this.speedUpTarget = 0;
      };

      window.addEventListener('mousedown', (e) => {
        if (e.button === 0 && e.target.closest('#hero, .site-bg-hyperspeed, #site-bg-video-wrap')) {
          triggerSpeedUp();
        }
      });
      window.addEventListener('mouseup', triggerSlowDown);
      window.addEventListener('touchstart', (e) => {
        if (e.target.closest('#hero, .site-bg-hyperspeed')) {
          triggerSpeedUp();
        }
      }, { passive: true });
      window.addEventListener('touchend', triggerSlowDown);
      window.addEventListener('touchcancel', triggerSlowDown);
    }

    start() {
      if (this.active) return;
      this.active = true;
      this.clock.start();

      const animate = () => {
        if (!this.active || this.disposed) return;

        const delta = Math.min(this.clock.getDelta(), 0.05);
        const lerpPercentage = Math.exp(-(-60 * Math.log2(1 - 0.1)) * delta);

        this.speedUp += lerp(this.speedUp, this.speedUpTarget, lerpPercentage, 0.00001);
        this.timeOffset += this.speedUp * delta;

        const time = this.clock.getElapsedTime() + this.timeOffset;

        if (this.leftCarLights) this.leftCarLights.update(time);
        if (this.rightCarLights) this.rightCarLights.update(time);
        if (this.leftSticks) this.leftSticks.update(time);
        if (this.uRoadTime) this.uRoadTime.value = time;

        let updateCamera = false;
        const fovChange = lerp(this.camera.fov, this.fovTarget, lerpPercentage);
        if (Math.abs(fovChange) > 0.001) {
          this.camera.fov += fovChange * delta * 6;
          updateCamera = true;
        }

        if (this.distortionObj.getJS) {
          const distortion = this.distortionObj.getJS(0.025, time);
          this.camera.lookAt(
            new THREE.Vector3(
              this.camera.position.x + distortion.x,
              this.camera.position.y + distortion.y,
              this.camera.position.z + distortion.z
            )
          );
          updateCamera = true;
        }

        if (updateCamera) {
          this.camera.updateProjectionMatrix();
        }

        this.renderer.render(this.scene, this.camera);
        this.rafId = requestAnimationFrame(animate);
      };

      this.rafId = requestAnimationFrame(animate);
    }

    pause() {
      this.active = false;
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
      this.clock.stop();
    }

    destroy() {
      this.pause();
      this.disposed = true;
      window.removeEventListener('resize', this.onResize);
      if (this.renderer && this.renderer.domElement && this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      }
    }
  }

  // Auto-mount and initialize with theme controller
  document.addEventListener('DOMContentLoaded', () => {
    const mountEl = document.getElementById('hyperspeed-bg');
    if (!mountEl) return;

    let hyperspeedInstance = null;

    function handleThemeState(theme) {
      const isDark = theme === 'dark';
      if (isDark) {
        if (!hyperspeedInstance && typeof THREE !== 'undefined') {
          hyperspeedInstance = new HyperspeedEngine(mountEl);
          window.hyperspeedInstance = hyperspeedInstance;
        }
        if (hyperspeedInstance) {
          hyperspeedInstance.start();
        }
      } else {
        if (hyperspeedInstance) {
          hyperspeedInstance.pause();
        }
      }
    }

    // Initial check
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    handleThemeState(currentTheme);

    // Listen for theme toggle events
    window.addEventListener('themeChanged', (e) => {
      const nextTheme = e.detail?.theme || document.documentElement.getAttribute('data-theme');
      handleThemeState(nextTheme);
    });
  });

  window.HyperspeedEngine = HyperspeedEngine;
})();
