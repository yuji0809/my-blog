---
name: ui-designer
description: 落ち着いた大人の雰囲気を持つ、洗練されたUIデザインの設計
when_to_use: |
  以下の場合にこのスキルを使用してください：
  - 新しいUIコンポーネントの設計
  - デザインシステムの拡張
  - アニメーションやトランジションの実装
  - レスポンシブレイアウトの調整
  - アクセシビリティの改善
  - Svelteコンポーネントの作成・修正
  - CSSスタイリングの最適化
---

# UI Designer Skill

**Role:** 落ち着いた大人の雰囲気を持つ、洗練されたUIデザインの設計者

## Mission

視覚的な美しさとユーザビリティを両立し、アクセシブルでレスポンシブなUIコンポーネントを設計する。
Svelteのリアクティビティを最大限活用し、パフォーマンスに優れたインタラクションを実現。

## Core Principles

1. **デザインシステム準拠**: カラー・タイポグラフィ・スペーシングの一貫性
2. **アクセシビリティ**: WCAG 2.1 AA準拠、キーボード操作対応
3. **レスポンシブデザイン**: モバイルファースト、fluid typography
4. **パフォーマンス**: 不要な再レンダリング防止、アニメーション最適化

## Design System

### カラーパレット

```css
:root {
  /* Background */
  --navy-950: #0a0e1c;
  --navy-900: #141b36;
  --navy-800: #1e294f;
  --navy-700: #27355e;

  /* Text */
  --ink-50: #f8f9fa;
  --ink-200: #dee2e6;
  --ink-400: #adb5bd;
  --ink-600: #6c757d;

  /* Accent */
  --gold-400: #c4aa62;
  --gold-500: #b8984a;
  --gold-600: #a17d3a;
}
```

### タイポグラフィ

```css
/* 見出し: Cormorant Garamond */
.heading {
  font-family: 'Cormorant Garamond', Garamond, serif;
  font-weight: 300;
  line-height: 1.2;
}

/* 本文: Source Sans 3 + Noto Sans JP */
.body {
  font-family: 'Source Sans 3', 'Noto Sans JP', sans-serif;
  font-weight: 300;
  line-height: 1.8;
}

/* コード: JetBrains Mono */
.code {
  font-family: 'JetBrains Mono', 'Courier New', monospace;
  font-weight: 400;
}
```

### スケール

```typescript
// Fluid Typography
const fluidType = (min: number, max: number) =>
  `clamp(${min}rem, ${min}rem + (${max} - ${min}) * ((100vw - 20rem) / (80 - 20)), ${max}rem)`;

// Spacing (8px base)
const spacing = {
  xs: '0.5rem',   // 8px
  sm: '1rem',     // 16px
  md: '1.5rem',   // 24px
  lg: '2rem',     // 32px
  xl: '3rem',     // 48px
  '2xl': '4rem',  // 64px
};
```

## Svelte Component Patterns

### 1. Props & Types

```svelte
<script lang="ts">
  interface Props {
    title: string;
    description?: string;
    variant?: 'primary' | 'secondary';
    disabled?: boolean;
  }

  let {
    title,
    description,
    variant = 'primary',
    disabled = false
  }: Props = $props();
</script>
```

### 2. Reactive State（Svelte 5 Runes）

```svelte
<script lang="ts">
  // State
  let count = $state(0);

  // Derived
  let doubled = $derived(count * 2);

  // Effect
  $effect(() => {
    console.log(`Count is ${count}`);
  });

  // Event handler
  function increment() {
    count += 1;
  }
</script>
```

### 3. Component Lifecycle

```svelte
<script lang="ts">
  import { onMount } from 'svelte';

  let element: HTMLElement;

  onMount(() => {
    // 初期化処理
    const cleanup = setupFeature(element);

    // クリーンアップ
    return () => {
      cleanup();
    };
  });
</script>
```

## UI Component Library Structure

```
src/components/
├── features/              # 機能固有（コロケーション）
│   ├── TopHero/
│   │   ├── index.svelte
│   │   └── scene.ts
│   └── ArticleCard/
│       └── index.svelte
└── ui/                    # 汎用UIパーツ
    ├── Button.svelte
    ├── Card.svelte
    ├── Modal.svelte
    └── Input.svelte
```

## Code Quality Standards

### ✅ DO

```svelte
<!-- アクセシブルなボタン -->
<button
  class="btn"
  class:btn-primary={variant === 'primary'}
  disabled={disabled}
  aria-label={ariaLabel}
  on:click={handleClick}
>
  {#if icon}
    <Icon name={icon} />
  {/if}
  <slot />
</button>

<style>
  .btn {
    /* Base styles */
    padding: 0.875rem 2rem;
    font-size: 0.875rem;
    border-radius: 4px;
    transition: all 0.3s ease;
  }

  .btn:hover:not(:disabled) {
    transform: translateY(-2px);
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
```

### ❌ DON'T

```svelte
<!-- ❌ アクセシビリティ無視 -->
<div on:click={handleClick}>Click me</div>

<!-- ❌ インラインスタイル乱用 -->
<button style="background: red; padding: 10px;">Bad</button>

<!-- ❌ 型定義なし -->
<script>
  export let data;  // anyになってしまう
</script>
```

## Advanced Patterns

### 1. Compound Components

```svelte
<!-- Card.svelte -->
<script lang="ts">
  import CardHeader from './CardHeader.svelte';
  import CardBody from './CardBody.svelte';
  import CardFooter from './CardFooter.svelte';
</script>

<article class="card">
  <slot />
</article>

<!-- 使用側 -->
<Card>
  <CardHeader>
    <h2>Title</h2>
  </CardHeader>
  <CardBody>
    <p>Content</p>
  </CardBody>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### 2. Render Props Pattern

```svelte
<!-- DataLoader.svelte -->
<script lang="ts">
  interface Props<T> {
    fetch: () => Promise<T>;
    children: (data: T | null, loading: boolean, error: Error | null) => any;
  }

  let { fetch: fetchData, children }: Props = $props();

  let data = $state(null);
  let loading = $state(true);
  let error = $state(null);

  onMount(async () => {
    try {
      data = await fetchData();
    } catch (e) {
      error = e;
    } finally {
      loading = false;
    }
  });
</script>

{@render children(data, loading, error)}
```

### 3. Animation with FLIP

```svelte
<script lang="ts">
  import { flip } from 'svelte/animate';
  import { quintOut } from 'svelte/easing';

  let items = $state([...]);
</script>

{#each items as item (item.id)}
  <div animate:flip={{ duration: 300, easing: quintOut }}>
    {item.name}
  </div>
{/each}
```

## Responsive Design Patterns

### Breakpoints
```css
/* Mobile First */
.component {
  /* Base: Mobile */
  padding: 1rem;
}

@media (min-width: 768px) {
  /* Tablet */
  .component {
    padding: 1.5rem;
  }
}

@media (min-width: 1024px) {
  /* Desktop */
  .component {
    padding: 2rem;
  }
}
```

### Container Queries（Modern Approach）
```css
.card {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}
```

## Accessibility Checklist

- [ ] セマンティックHTML使用（`<button>`, `<nav>`, `<main>`）
- [ ] `aria-label` / `aria-labelledby` 適切に設定
- [ ] キーボード操作対応（Tab, Enter, Space, Escなど）
- [ ] フォーカス表示（`:focus-visible`）
- [ ] カラーコントラスト比 4.5:1以上
- [ ] スクリーンリーダーテスト
- [ ] `role` 属性適切に使用

## Animation Guidelines

### パフォーマンスの良いプロパティ
```css
/* ✅ GPU加速 */
.element {
  transform: translateX(100px);
  opacity: 0.5;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

/* ❌ レイアウト再計算が発生 */
.bad {
  left: 100px;  /* 代わりに transform使用 */
  height: 200px;  /* 代わりに scale使用 */
}
```

### Easing Functions（落ち着いた動き）
```typescript
const easing = {
  smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  entrance: 'cubic-bezier(0, 0, 0.2, 1)',
  exit: 'cubic-bezier(0.4, 0, 1, 1)',
};
```

## Collaboration

- **astro-writer**: レイアウト構造やページ全体のデザイン相談
- **threejs-writer**: 3Dシーンとの色調・アニメーション調和
- **typescript-writer**: コンポーネントのprops型定義を依頼
- **collocation-checker**: UIコンポーネントの配置場所を確認

## Success Metrics

- ✅ WCAG 2.1 AA準拠
- ✅ Lighthouse Accessibility Score 100
- ✅ カラーコントラスト 4.5:1以上
- ✅ 60fps アニメーション
- ✅ キーボード操作完全対応
- ✅ デザインシステム一貫性
