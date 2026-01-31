/**
 * HeroScene - レイマーチング・フラクタルシェーダー
 *
 * コロケーション原則に基づき、このファイルは
 * 同一ディレクトリの index.svelte からのみ使用される。
 *
 * デザインコンセプト:
 * - 計算で生成される複雑な3D構造（Mandelbulbフラクタル）
 * - エンジニアリング感のある洗練された雰囲気
 * - レイマーチング技術による数学的美しさ
 * - 静謐だがリッチな視覚体験
 */

import * as THREE from 'three'

// ========================
// 型定義
// ========================
interface HeroSceneConfig {
  canvas: HTMLCanvasElement
  backgroundColor?: number
}

// ========================
// カラーパレット（明るく温かみのある大人の雰囲気）
// ========================
const PALETTE = {
  background: 0xfaf8f3, // cream-100: 明るいクリーム背景
  primary: 0xb8a38a, // mocha-300: 主要オブジェクト
  secondary: 0xd4c4b0, // mocha-200: 副次オブジェクト
  accent: 0xb86f4f, // terracotta-500: アクセント（温かみのあるテラコッタ）
  ambient: 0xede6d9, // cream-300: 環境光
  fog: 0xfaf8f3, // 霧の色
} as const

// ========================
// HeroScene クラス
// ========================
export class HeroScene {
  private renderer: THREE.WebGLRenderer
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private raymarchMesh: THREE.Mesh | null = null
  private animationId: number | null = null
  private clock: THREE.Clock
  private isDisposed = false

  constructor(config: HeroSceneConfig) {
    const { canvas, backgroundColor = PALETTE.background } = config

    // Clock初期化
    this.clock = new THREE.Clock()

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight)
    this.renderer.setClearColor(backgroundColor, 1)
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.0

    // Scene
    this.scene = new THREE.Scene()

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      45,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      100
    )
    this.camera.position.set(0, 0, 3.5)

    // レイマーチングシーン構築
    this.createRaymarchScene()

    // イベントリスナー
    this.handleResize = this.handleResize.bind(this)
    window.addEventListener('resize', this.handleResize)
  }

  // ========================
  // レイマーチングシーンの生成
  // ========================
  private createRaymarchScene(): void {
    // フルスクリーンクアッド用のジオメトリ
    const geometry = new THREE.PlaneGeometry(2, 2)

    // カラーパレットをシェーダー用に正規化
    const bgColor = new THREE.Color(PALETTE.background)
    const primaryColor = new THREE.Color(PALETTE.primary)
    const secondaryColor = new THREE.Color(PALETTE.secondary)
    const accentColor = new THREE.Color(PALETTE.accent)

    // レイマーチング用シェーダーマテリアル
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        uCameraPos: { value: this.camera.position },
        uBackgroundColor: { value: bgColor },
        uPrimaryColor: { value: primaryColor },
        uSecondaryColor: { value: secondaryColor },
        uAccentColor: { value: accentColor },
      },
      vertexShader: `
        varying vec2 vUv;
        
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec2 uResolution;
        uniform vec3 uCameraPos;
        uniform vec3 uBackgroundColor;
        uniform vec3 uPrimaryColor;
        uniform vec3 uSecondaryColor;
        uniform vec3 uAccentColor;
        
        varying vec2 vUv;
        
        // ========================
        // Constants
        // ========================
        #define MAX_STEPS 80
        #define MAX_DIST 20.0
        #define SURF_DIST 0.001
        #define PI 3.14159265359
        
        // ========================
        // Utility Functions
        // ========================
        mat2 rot2D(float a) {
          float s = sin(a);
          float c = cos(a);
          return mat2(c, -s, s, c);
        }
        
        // ========================
        // SDF Functions
        // ========================
        
        // Mandelbulb フラクタル SDF
        float mandelbulb(vec3 p) {
          vec3 z = p;
          float dr = 1.0;
          float r = 0.0;
          float power = 8.0 + sin(uTime * 0.1) * 2.0; // 時間で変化
          
          for (int i = 0; i < 8; i++) {
            r = length(z);
            if (r > 2.0) break;
            
            // Spherical coordinates
            float theta = acos(z.z / r);
            float phi = atan(z.y, z.x);
            dr = pow(r, power - 1.0) * power * dr + 1.0;
            
            // Scale and rotate
            float zr = pow(r, power);
            theta = theta * power;
            phi = phi * power;
            
            // Convert back to cartesian
            z = zr * vec3(
              sin(theta) * cos(phi),
              sin(phi) * sin(theta),
              cos(theta)
            );
            z += p;
          }
          
          return 0.5 * log(r) * r / dr;
        }
        
        // Smooth minimum
        float smin(float a, float b, float k) {
          float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
          return mix(b, a, h) - k * h * (1.0 - h);
        }
        
        // シンプルな球
        float sdSphere(vec3 p, float r) {
          return length(p) - r;
        }
        
        // メインシーンSDF
        float sceneSDF(vec3 p) {
          // 回転を適用
          vec3 pos = p;
          pos.xz *= rot2D(uTime * 0.05);
          pos.yz *= rot2D(uTime * 0.03);
          
          // Mandelbulbフラクタル
          float bulb = mandelbulb(pos * 0.8) / 0.8;
          
          // 周囲に小さな球を配置（エンジニアリング感）
          float orbs = MAX_DIST;
          for (int i = 0; i < 6; i++) {
            float angle = float(i) * PI / 3.0 + uTime * 0.2;
            vec3 orbPos = vec3(cos(angle) * 2.0, sin(angle * 1.3) * 0.5, sin(angle) * 2.0);
            orbs = smin(orbs, sdSphere(p - orbPos, 0.15), 0.3);
          }
          
          return smin(bulb, orbs, 0.5);
        }
        
        // ========================
        // Raymarching
        // ========================
        float raymarch(vec3 ro, vec3 rd) {
          float dO = 0.0;
          
          for (int i = 0; i < MAX_STEPS; i++) {
            vec3 p = ro + rd * dO;
            float dS = sceneSDF(p);
            dO += dS;
            
            if (dO > MAX_DIST || abs(dS) < SURF_DIST) break;
          }
          
          return dO;
        }
        
        // 法線計算
        vec3 getNormal(vec3 p) {
          float d = sceneSDF(p);
          vec2 e = vec2(0.001, 0.0);
          
          vec3 n = d - vec3(
            sceneSDF(p - e.xyy),
            sceneSDF(p - e.yxy),
            sceneSDF(p - e.yyx)
          );
          
          return normalize(n);
        }
        
        // ========================
        // Lighting & Shading
        // ========================
        vec3 getLight(vec3 p, vec3 rd, vec3 color) {
          vec3 normal = getNormal(p);
          
          // メインライト（上から）
          vec3 lightPos1 = vec3(3.0, 4.0, 2.0);
          vec3 lightDir1 = normalize(lightPos1 - p);
          float diff1 = max(dot(normal, lightDir1), 0.0);
          
          // リムライト（後方から）
          vec3 lightPos2 = vec3(-2.0, 1.0, -3.0);
          vec3 lightDir2 = normalize(lightPos2 - p);
          float diff2 = max(dot(normal, lightDir2), 0.0);
          
          // アンビエント・オクルージョン（簡易）
          float ao = 1.0 - (float(MAX_STEPS) - raymarch(p + normal * 0.1, normal)) / float(MAX_STEPS);
          ao = pow(ao, 1.5);
          
          // フレネル効果
          float fresnel = pow(1.0 - max(dot(-rd, normal), 0.0), 3.0);
          
          // カラーグラデーション（高さベース）
          vec3 baseColor = mix(color, uAccentColor, smoothstep(-1.0, 1.0, p.y));
          baseColor = mix(baseColor, uSecondaryColor, fresnel * 0.3);
          
          // ライティング合成
          vec3 diffuse = baseColor * (diff1 * 0.7 + diff2 * 0.3);
          vec3 ambient = baseColor * 0.3 * ao;
          vec3 rim = uAccentColor * fresnel * 0.4;
          
          return diffuse + ambient + rim;
        }
        
        // ========================
        // Main
        // ========================
        void main() {
          // UV座標を正規化（アスペクト比考慮）
          vec2 uv = (vUv - 0.5) * 2.0;
          uv.x *= uResolution.x / uResolution.y;
          
          // レイの設定
          vec3 ro = uCameraPos; // レイの原点
          vec3 rd = normalize(vec3(uv, -1.5)); // レイの方向
          
          // カメラの緩やかな回転
          rd.xz *= rot2D(sin(uTime * 0.1) * 0.1);
          rd.yz *= rot2D(cos(uTime * 0.08) * 0.05);
          
          // レイマーチング実行
          float d = raymarch(ro, rd);
          
          // カラーリング
          vec3 color = uBackgroundColor;
          
          if (d < MAX_DIST) {
            vec3 p = ro + rd * d;
            color = getLight(p, rd, uPrimaryColor);
            
            // 距離によるフォグ
            float fogAmount = 1.0 - exp(-d * 0.15);
            color = mix(color, uBackgroundColor, fogAmount);
          } else {
            // 背景にグラデーション
            float gradient = smoothstep(-1.0, 1.0, uv.y);
            color = mix(uBackgroundColor, uBackgroundColor * 0.95, gradient);
          }
          
          // トーンマッピング（柔らかく）
          color = color / (color + vec3(1.0));
          color = pow(color, vec3(1.0 / 2.2)); // ガンマ補正
          
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      side: THREE.DoubleSide,
    })

    this.raymarchMesh = new THREE.Mesh(geometry, material)
    this.scene.add(this.raymarchMesh)
  }

  // ========================
  // アニメーションループ
  // ========================
  public start(): void {
    if (this.isDisposed) return

    const animate = (): void => {
      if (this.isDisposed) return

      this.animationId = requestAnimationFrame(animate)
      const elapsed = this.clock.getElapsedTime()

      // シェーダーのuniform更新
      if (this.raymarchMesh) {
        const material = this.raymarchMesh.material as THREE.ShaderMaterial
        material.uniforms.uTime.value = elapsed
        material.uniforms.uCameraPos.value.copy(this.camera.position)
      }

      this.renderer.render(this.scene, this.camera)
    }

    animate()
  }

  // ========================
  // リサイズ処理
  // ========================
  private handleResize(): void {
    if (this.isDisposed) return

    const canvas = this.renderer.domElement
    const width = canvas.clientWidth
    const height = canvas.clientHeight

    if (canvas.width !== width || canvas.height !== height) {
      this.renderer.setSize(width, height, false)
      this.camera.aspect = width / height
      this.camera.updateProjectionMatrix()

      // シェーダーの解像度更新
      if (this.raymarchMesh) {
        const material = this.raymarchMesh.material as THREE.ShaderMaterial
        material.uniforms.uResolution.value.set(width, height)
      }
    }
  }

  // ========================
  // クリーンアップ
  // ========================
  public dispose(): void {
    this.isDisposed = true

    // アニメーション停止
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId)
    }

    // イベントリスナー解除
    window.removeEventListener('resize', this.handleResize)

    // メッシュのクリーンアップ
    if (this.raymarchMesh) {
      this.raymarchMesh.geometry.dispose()
      if (this.raymarchMesh.material instanceof THREE.Material) {
        this.raymarchMesh.material.dispose()
      }
      this.scene.remove(this.raymarchMesh)
    }

    // レンダラーのクリーンアップ
    this.renderer.dispose()

    // 参照クリア
    this.raymarchMesh = null
  }
}
