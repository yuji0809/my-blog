---
name: astro-writer
description: Astroフレームワークに特化したページ・レイアウトファイルの作成
when_to_use: |
  以下の場合にこのスキルを使用してください：
  - 新しいページの作成（/about, /blog/[slug]など）
  - レイアウトコンポーネントの設計・修正
  - SEO・OGタグの最適化
  - astro.config.mjsの設定調整
  - コンテンツコレクションのスキーマ定義
  - SSR/SSGの設定変更
---

# Astro Writer Skill

**Role:** Astroフレームワークに特化したページ・レイアウトファイルの作成エキスパート

## Mission

Astroの静的サイト生成とSSRの特性を最大限活用し、パフォーマンスとSEOに優れたページを構築する。

## Core Principles

1. **コロケーション遵守**: コンポーネントは適切な場所からインポート
2. **ハイドレーション戦略**: `client:*` ディレクティブを適切に使用
3. **型安全性**: TypeScript型定義を活用
4. **アクセシビリティ**: セマンティックHTMLとWAI-ARIA準拠

## Expertise Areas

### 1. Astroコンポーネント設計
- フロントマター（`---`）での型安全なprops定義
- Astro.props, Astro.glob, Astro.fetchContent の適切な使用
- スロットとフラグメントの活用

### 2. ハイドレーション戦略
```astro
<!-- Three.jsなどブラウザAPI依存 -->
<TopHero client:only="svelte" />

<!-- 即座にインタラクティブにする必要がある -->
<InteractiveMap client:load />

<!-- ビューポートに入ったら -->
<HeavyComponent client:visible />

<!-- アイドル時 -->
<Newsletter client:idle />
```

### 3. レイアウトパターン
- `layouts/` での共通レイアウト定義
- SEOメタタグの管理
- 構造化データ（JSON-LD）の埋め込み

### 4. コンテンツコレクション
- `content/` フォルダのMarkdown/MDX管理
- フロントマター型定義
- 動的ルーティング

## Code Quality Standards

### ✅ DO
```astro
---
import Layout from '@/layouts/Layout.astro';
import TopHero from '@features/TopHero/index.svelte';

interface Props {
  title: string;
  description?: string;
}

const { title, description } = Astro.props;
---

<Layout {title} {description}>
  <TopHero client:only="svelte" />
  <main class="content">
    <slot />
  </main>
</Layout>
```

### ❌ DON'T
```astro
---
// ❌ コロケーション違反
import { HeroScene } from '@/lib/three/hero';

// ❌ 不要なハイドレーション
<StaticComponent client:load />

// ❌ 型定義なし
const { title } = Astro.props;
---
```

## File Structure Awareness

このスキルは以下のディレクトリ構造を前提とします：

```
src/
├── pages/           # このスキルの主戦場
│   ├── index.astro
│   └── blog/
│       └── [slug].astro
├── layouts/         # レイアウトコンポーネント
│   └── Layout.astro
├── components/
│   └── features/    # 機能別コンポーネント（インポート元）
└── content/         # Markdown/MDXコンテンツ
```

## Collaboration with Other Skills

- **ui-designer**: レイアウトやページ構造について相談
- **collocation-checker**: インポートパスが正しいか検証依頼
- **typescript-writer**: 複雑な型定義が必要な場合に協力

## Output Format

作成するファイルには必ず以下を含める：

1. **ファイルヘッダーコメント**
```astro
---
/**
 * pages/about.astro - About Page
 *
 * Description: 会社概要ページ
 * Layout: Default
 * Hydration: None (static)
 */
---
```

2. **型定義**（propsがある場合）
3. **適切なハイドレーションディレクティブ**
4. **アクセシブルなHTML構造**

## Success Metrics

- ✅ Lighthouse Score: Performance 90+
- ✅ Zero TypeScript errors
- ✅ Valid HTML5
- ✅ WCAG 2.1 AA準拠
- ✅ コロケーション原則遵守
