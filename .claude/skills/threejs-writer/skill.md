---
name: threejs-writer
description: Three.jsによる洗練された3Dビジュアル表現の作成
when_to_use: |
  以下の場合にこのスキルを使用してください：
  - 新しい3D機能の追加（Hero, ArticleVisual, Galleryなど）
  - 既存シーンのパフォーマンス改善
  - アニメーションの洗練化・調整
  - シェーダーマテリアルの実装
  - パーティクルエフェクトの追加
  - 3Dオブジェクトの配置・ライティング調整
---

# Three.js Writer Skill

**Role:** Three.jsによる洗練された3Dビジュアル表現のスペシャリスト

## Mission

静謐で落ち着いた大人の雰囲気を持つ、パフォーマンスに優れた3Dシーンを構築する。
コロケーション原則に従い、各機能フォルダ内の `scene.ts` ファイルとして実装。

## Core Principles

1. **責務分離**: ロジックはTypeScriptクラスに、UIはSvelteに
2. **パフォーマンス最適化**: 60fps維持、メモリリーク防止
3. **デザインコンセプト**: 彩度を抑えた色調、静謐だがリッチな表現
4. **クリーンアップ徹底**: dispose()メソッドによる完全なリソース解放

## Design System

### カラーパレット（落ち着いた大人の雰囲気）
```typescript
const PALETTE = {
  background: 0x0a0e1c,    // navy-950: 深い夜空
  primary: 0x27355e,        // navy-700: 主要オブジェクト
  secondary: 0x1e294f,      // navy-800: 副次オブジェクト
  accent: 0xb8984a,         // gold-500: 控えめな金
  ambient: 0x141b36,        // navy-900: 環境光
} as const;
```

### アニメーション原則
- **緩やか**: 急激な動きを避け、ゆっくりとした浮遊感
- **繊細**: 微細な揺らぎで生命感を表現
- **予測可能**: ユーザーを驚かせず、心地よさを優先

## Technical Standards

### 1. クラス設計パターン
```typescript
export class [Feature]Scene {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private animationId: number | null = null;
  private clock: THREE.Clock;
  private isDisposed = false;

  constructor(config: SceneConfig) {
    // 初期化
  }

  public start(): void {
    // アニメーションループ
  }

  private handleResize(): void {
    // レスポンシブ対応
  }

  public dispose(): void {
    // 完全なクリーンアップ
  }
}
```

### 2. パフォーマンス最適化

#### ✅ DO
```typescript
// ジオメトリの再利用
const geometry = new THREE.IcosahedronGeometry(2, 0);
meshes.forEach(mesh => mesh.geometry = geometry);

// デバイスピクセル比の制限
this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// 不要なレンダリングを避ける
if (this.isDisposed) return;
```

#### ❌ DON'T
```typescript
// ❌ アニメーションループ内でnewしない
animate() {
  const geo = new THREE.BoxGeometry(); // 毎フレーム生成
}

// ❌ dispose忘れ
constructor() {
  window.addEventListener('resize', this.handleResize);
  // removeEventListenerがない
}
```

### 3. ライティング戦略

落ち着いた雰囲気のための3点照明：

```typescript
// 環境光（柔らかい全体照明）
const ambientLight = new THREE.AmbientLight(0x141b36, 0.4);

// メインライト（形状を明確に）
const mainLight = new THREE.DirectionalLight(0xffffff, 0.6);
mainLight.position.set(10, 15, 10);

// アクセントライト（金色のハイライト）
const accentLight = new THREE.PointLight(0xb8984a, 0.3, 50);
accentLight.position.set(-15, -10, 5);
```

### 4. マテリアル設計

```typescript
// 落ち着いた質感
new THREE.MeshStandardMaterial({
  color: PALETTE.primary,
  roughness: 0.7,        // マットな質感
  metalness: 0.3,        // 控えめな金属感
  transparent: true,
  opacity: 0.85,         // 重なりを美しく
});

// アクセント用（エミッシブを控えめに）
new THREE.MeshStandardMaterial({
  color: PALETTE.accent,
  emissive: PALETTE.accent,
  emissiveIntensity: 0.1,  // 過度な発光を避ける
});
```

## File Structure Pattern

```
src/components/features/
├── TopHero/
│   ├── index.svelte      # View層（Canvas提供）
│   └── scene.ts          # このスキルが作成するファイル
├── ArticleVisual/
│   ├── index.svelte
│   └── scene.ts
└── ParallaxGallery/
    ├── index.svelte
    └── scene.ts
```

## Implementation Checklist

各 `scene.ts` ファイルには必須で含める：

- [ ] TypeScript strict mode対応
- [ ] 型安全なconfig interface
- [ ] THREE.Clock によるアニメーション管理
- [ ] resize ハンドラー（boundメソッド）
- [ ] dispose() での完全なクリーンアップ
  - [ ] cancelAnimationFrame
  - [ ] window.removeEventListener
  - [ ] geometry.dispose()
  - [ ] material.dispose()
  - [ ] renderer.dispose()
- [ ] isDisposed フラグによる安全な停止

## Advanced Techniques

### Shader Material（必要に応じて）
```typescript
new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color(PALETTE.accent) },
  },
  vertexShader: `...`,
  fragmentShader: `...`,
  transparent: true,
  blending: THREE.AdditiveBlending,
});
```

### Post-Processing（控えめに使用）
- Bloom: emissiveIntensity 0.1以下で微細な光
- Vignette: 画面端を暗くして集中力向上
- Film Grain: ごく軽いノイズで質感向上

## Collaboration

- **ui-designer**: カラーパレットやアニメーション速度の調整
- **typescript-writer**: 複雑な型定義やユーティリティ関数
- **collocation-checker**: scene.tsが正しい場所にあるか確認

## Success Metrics

- ✅ 60fps維持（Chrome DevTools Performance）
- ✅ メモリリークなし（Detached DOM nodes = 0）
- ✅ 初期ロード < 100KB（圧縮後）
- ✅ dispose()後のリソース完全解放
- ✅ デザインコンセプト遵守（落ち着いた色調）
