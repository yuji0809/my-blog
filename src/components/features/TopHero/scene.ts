/**
 * HeroScene - 静謐で洗練された3D表現
 *
 * コロケーション原則に基づき、このファイルは
 * 同一ディレクトリの index.svelte からのみ使用される。
 *
 * デザインコンセプト:
 * - 彩度を落とした落ち着いた色調
 * - ゆっくりと浮遊するジオメトリック要素
 * - 静謐だがリッチな視覚体験
 */

import * as THREE from 'three'

// ========================
// 型定義
// ========================
interface HeroSceneConfig {
  canvas: HTMLCanvasElement
  backgroundColor?: number
  particleCount?: number
}

interface FloatingMesh extends THREE.Mesh {
  userData: {
    rotationSpeed: THREE.Vector3
    floatSpeed: number
    floatOffset: number
    originalY: number
  }
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
  private floatingMeshes: FloatingMesh[] = []
  private particles: THREE.Points | null = null
  private animationId: number | null = null
  private clock: THREE.Clock
  private isDisposed = false

  constructor(config: HeroSceneConfig) {
    const { canvas, backgroundColor = PALETTE.background, particleCount = 800 } = config

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
    this.renderer.toneMappingExposure = 0.8

    // Scene
    this.scene = new THREE.Scene()
    this.scene.fog = new THREE.FogExp2(PALETTE.fog, 0.015)

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      60,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000
    )
    this.camera.position.set(0, 0, 30)

    // シーン構築
    this.setupLights()
    this.createFloatingGeometries()
    this.createParticleField(particleCount)

    // イベントリスナー
    this.handleResize = this.handleResize.bind(this)
    window.addEventListener('resize', this.handleResize)
  }

  // ========================
  // ライティング設定
  // ========================
  private setupLights(): void {
    // 環境光（柔らかく全体を照らす）
    const ambientLight = new THREE.AmbientLight(PALETTE.ambient, 0.4)
    this.scene.add(ambientLight)

    // メインライト（右上から）
    const mainLight = new THREE.DirectionalLight(0xffffff, 0.6)
    mainLight.position.set(10, 15, 10)
    this.scene.add(mainLight)

    // アクセントライト（左下から金色系）
    const accentLight = new THREE.PointLight(PALETTE.accent, 0.3, 50)
    accentLight.position.set(-15, -10, 5)
    this.scene.add(accentLight)

    // 反射用ライト（後方から）
    const rimLight = new THREE.DirectionalLight(0x4466aa, 0.2)
    rimLight.position.set(-5, 5, -10)
    this.scene.add(rimLight)
  }

  // ========================
  // 浮遊するジオメトリの生成
  // ========================
  private createFloatingGeometries(): void {
    // マテリアル定義
    const materials = {
      primary: new THREE.MeshStandardMaterial({
        color: PALETTE.primary,
        roughness: 0.7,
        metalness: 0.3,
        transparent: true,
        opacity: 0.85,
      }),
      secondary: new THREE.MeshStandardMaterial({
        color: PALETTE.secondary,
        roughness: 0.8,
        metalness: 0.2,
        transparent: true,
        opacity: 0.7,
      }),
      accent: new THREE.MeshStandardMaterial({
        color: PALETTE.accent,
        roughness: 0.4,
        metalness: 0.6,
        transparent: true,
        opacity: 0.6,
        emissive: PALETTE.accent,
        emissiveIntensity: 0.1,
      }),
    }

    // ジオメトリ定義
    const geometries = [
      new THREE.IcosahedronGeometry(2, 0),
      new THREE.OctahedronGeometry(1.5, 0),
      new THREE.TetrahedronGeometry(1.8, 0),
      new THREE.TorusGeometry(1.2, 0.4, 8, 24),
      new THREE.DodecahedronGeometry(1.3, 0),
    ]

    // 配置パターン
    const positions = [
      { x: -12, y: 5, z: -5 },
      { x: 10, y: -3, z: -8 },
      { x: -6, y: -6, z: -3 },
      { x: 8, y: 7, z: -10 },
      { x: 0, y: 0, z: -15 },
      { x: -15, y: -2, z: -12 },
      { x: 14, y: 4, z: -6 },
      { x: -3, y: 8, z: -4 },
    ]

    positions.forEach((pos, i) => {
      const geometry = geometries[i % geometries.length]
      const materialKeys = Object.keys(materials) as (keyof typeof materials)[]
      const material = materials[materialKeys[i % materialKeys.length]]

      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.set(pos.x, pos.y, pos.z)

      // ランダムな回転と浮遊パラメータ
      mesh.userData = {
        rotationSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.003,
          (Math.random() - 0.5) * 0.003,
          (Math.random() - 0.5) * 0.002
        ),
        floatSpeed: 0.3 + Math.random() * 0.4,
        floatOffset: Math.random() * Math.PI * 2,
        originalY: pos.y,
      }

      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)

      this.floatingMeshes.push(mesh as unknown as FloatingMesh)
      this.scene.add(mesh)
    })
  }

  // ========================
  // パーティクルフィールドの生成
  // ========================
  private createParticleField(count: number): void {
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(count * 3)
    const sizes = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      // 球状に分布させる
      const radius = 20 + Math.random() * 40
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i3 + 2] = radius * Math.cos(phi)

      sizes[i] = 0.5 + Math.random() * 1.5
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    // シェーダーマテリアル（よりリッチな表現）
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(PALETTE.accent) },
        uSize: { value: 2.0 },
      },
      vertexShader: `
        attribute float size;
        uniform float uTime;
        uniform float uSize;
        varying float vAlpha;
        
        void main() {
          vec3 pos = position;
          
          // 緩やかな揺らぎ
          float wave = sin(uTime * 0.2 + position.x * 0.1) * 0.5;
          pos.y += wave;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * uSize * (200.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
          
          // 距離に応じた透明度
          vAlpha = smoothstep(60.0, 20.0, length(position));
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying float vAlpha;
        
        void main() {
          // 円形のパーティクル
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          
          // 柔らかいエッジ
          float alpha = smoothstep(0.5, 0.1, dist) * vAlpha * 0.6;
          
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    this.particles = new THREE.Points(geometry, material)
    this.scene.add(this.particles)
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

      // 浮遊オブジェクトのアニメーション
      for (const mesh of this.floatingMeshes) {
        const { rotationSpeed, floatSpeed, floatOffset, originalY } = mesh.userData

        // 緩やかな回転
        mesh.rotation.x += rotationSpeed.x
        mesh.rotation.y += rotationSpeed.y
        mesh.rotation.z += rotationSpeed.z

        // 浮遊運動（sin波で上下）
        mesh.position.y = originalY + Math.sin(elapsed * floatSpeed + floatOffset) * 1.5
      }

      // パーティクルのアニメーション
      if (this.particles) {
        const material = this.particles.material as THREE.ShaderMaterial
        material.uniforms.uTime.value = elapsed
        this.particles.rotation.y = elapsed * 0.02
      }

      // カメラの緩やかな揺らぎ
      this.camera.position.x = Math.sin(elapsed * 0.1) * 0.5
      this.camera.position.y = Math.cos(elapsed * 0.08) * 0.3

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
    for (const mesh of this.floatingMeshes) {
      mesh.geometry.dispose()
      if (mesh.material instanceof THREE.Material) {
        mesh.material.dispose()
      }
      this.scene.remove(mesh)
    }

    // パーティクルのクリーンアップ
    if (this.particles) {
      this.particles.geometry.dispose()
      if (this.particles.material instanceof THREE.Material) {
        this.particles.material.dispose()
      }
      this.scene.remove(this.particles)
    }

    // レンダラーのクリーンアップ
    this.renderer.dispose()

    // 配列クリア
    this.floatingMeshes = []
    this.particles = null
  }
}
