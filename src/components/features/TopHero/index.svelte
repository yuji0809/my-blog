<!--
  TopHero/index.svelte - View層
  
  コロケーション原則:
  このファイルは同一ディレクトリの scene.ts と密結合しており、
  TopHero フォルダを削除・移動すれば、関連するすべてのコードが
  一緒に操作される設計になっている。
-->
<script lang="ts">
import { onMount } from 'svelte'
// コロケーション: 同じディレクトリからインポート
import { HeroScene } from './scene'

// State
let canvasElement: HTMLCanvasElement
let heroScene: HeroScene | null = null
let isLoaded = false

onMount(() => {
  // HeroSceneの初期化
  heroScene = new HeroScene({
    canvas: canvasElement,
  })
  heroScene.start()

  // フェードイン用フラグ
  setTimeout(() => {
    isLoaded = true
  }, 100)

  // クリーンアップ
  return () => {
    if (heroScene) {
      heroScene.dispose()
      heroScene = null
    }
  }
})
</script>

<section class="hero-section" class:loaded={isLoaded}>
  <!-- 3D Canvas -->
  <canvas
    bind:this={canvasElement}
    class="hero-canvas"
    aria-hidden="true"
  ></canvas>

  <!-- オーバーレイコンテンツ -->
  <div class="hero-content">
    <div class="hero-text-container">
      <span class="hero-eyebrow">Personal Tech Blog</span>
      <h1 class="hero-title">
        <span class="title-line">Thoughts on</span>
        <span class="title-line title-accent">Engineering</span>
      </h1>
      <p class="hero-description">
        ソフトウェアアーキテクチャ、クラフトマンシップ、<br class="hidden md:inline" />
        そして技術の美学について。
      </p>
      <div class="hero-cta">
        <a href="/blog" class="cta-button primary">
          記事を読む
          <svg class="cta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
        <a href="/about" class="cta-button secondary">
          About
        </a>
      </div>
    </div>
  </div>

  <!-- スクロールインジケーター -->
  <div class="scroll-indicator">
    <span class="scroll-text">Scroll</span>
    <div class="scroll-line"></div>
  </div>

  <!-- グラデーションオーバーレイ（下部フェード） -->
  <div class="gradient-overlay"></div>
</section>

<style>
  /* ========================
     Hero Section Base
     ======================== */
  .hero-section {
    position: relative;
    width: 100%;
    height: 100vh;
    min-height: 600px;
    overflow: hidden;
    background-color: #0a0e1c;
  }

  /* ========================
     Canvas Styling
     ======================== */
  .hero-canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: opacity 1.5s ease-out;
  }

  .hero-section.loaded .hero-canvas {
    opacity: 1;
  }

  /* ========================
     Content Overlay
     ======================== */
  .hero-content {
    position: relative;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    padding: 2rem;
  }

  .hero-text-container {
    max-width: 800px;
    text-align: center;
    opacity: 0;
    transform: translateY(30px);
    animation: slideUp 1s ease-out 0.3s forwards;
  }

  /* ========================
     Typography
     ======================== */
  .hero-eyebrow {
    display: inline-block;
    margin-bottom: 1.5rem;
    padding: 0.5rem 1.25rem;
    font-family: 'Source Sans 3', 'Noto Sans JP', sans-serif;
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #b8984a;
    background: rgba(184, 152, 74, 0.1);
    border: 1px solid rgba(184, 152, 74, 0.2);
    border-radius: 100px;
  }

  .hero-title {
    margin-bottom: 1.5rem;
    font-family: 'Cormorant Garamond', Garamond, serif;
    font-size: clamp(2.5rem, 8vw, 5rem);
    font-weight: 300;
    line-height: 1.1;
    color: #f8f9fa;
  }

  .title-line {
    display: block;
  }

  .title-accent {
    font-style: italic;
    color: #b8984a;
  }

  .hero-description {
    margin-bottom: 2.5rem;
    font-family: 'Source Sans 3', 'Noto Sans JP', sans-serif;
    font-size: 1.125rem;
    font-weight: 300;
    line-height: 1.8;
    color: #adb5bd;
  }

  /* ========================
     CTA Buttons
     ======================== */
  .hero-cta {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .cta-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.875rem 2rem;
    font-family: 'Source Sans 3', 'Noto Sans JP', sans-serif;
    font-size: 0.875rem;
    font-weight: 500;
    letter-spacing: 0.05em;
    text-decoration: none;
    border-radius: 4px;
    transition: all 0.3s ease;
  }

  .cta-button.primary {
    color: #0a0e1c;
    background: #b8984a;
    border: 1px solid #b8984a;
  }

  .cta-button.primary:hover {
    background: #c4aa62;
    border-color: #c4aa62;
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(184, 152, 74, 0.25);
  }

  .cta-button.secondary {
    color: #f8f9fa;
    background: transparent;
    border: 1px solid rgba(248, 249, 250, 0.3);
  }

  .cta-button.secondary:hover {
    background: rgba(248, 249, 250, 0.05);
    border-color: rgba(248, 249, 250, 0.5);
  }

  .cta-icon {
    width: 16px;
    height: 16px;
    transition: transform 0.3s ease;
  }

  .cta-button.primary:hover .cta-icon {
    transform: translateX(4px);
  }

  /* ========================
     Scroll Indicator
     ======================== */
  .scroll-indicator {
    position: absolute;
    bottom: 2rem;
    left: 50%;
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    transform: translateX(-50%);
    opacity: 0;
    animation: fadeIn 1s ease-out 1.5s forwards;
  }

  .scroll-text {
    font-family: 'Source Sans 3', 'Noto Sans JP', sans-serif;
    font-size: 0.625rem;
    font-weight: 500;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: #6c757d;
  }

  .scroll-line {
    width: 1px;
    height: 40px;
    background: linear-gradient(to bottom, #6c757d, transparent);
    animation: scrollPulse 2s ease-in-out infinite;
  }

  /* ========================
     Gradient Overlay
     ======================== */
  .gradient-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 200px;
    background: linear-gradient(to top, #0a0e1c, transparent);
    pointer-events: none;
    z-index: 5;
  }

  /* ========================
     Animations
     ======================== */
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes scrollPulse {
    0%, 100% {
      opacity: 0.4;
      transform: scaleY(1);
    }
    50% {
      opacity: 1;
      transform: scaleY(1.2);
    }
  }

  /* ========================
     Responsive
     ======================== */
  @media (max-width: 768px) {
    .hero-content {
      padding: 1.5rem;
    }

    .hero-description {
      font-size: 1rem;
    }

    .cta-button {
      padding: 0.75rem 1.5rem;
    }
  }
</style>
