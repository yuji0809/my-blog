# Astro Blog with Collocation Architecture

圧倒的な視覚体験と「落ち着いた大人の雰囲気」を両立した個人技術ブログ。

**コロケーション（Collocation）原則**と**責務分離（SoC）**を両立させた、保守性の高いアーキテクチャを採用。

## 🏗️ アーキテクチャの核心

### 従来のアンチパターン（❌ 禁止）

```text
src/
├── lib/
│   └── three/           # ← ロジックが散らばる「ゴミ屋敷」化
│       ├── hero.ts
│       ├── article.ts
│       └── utils.ts
├── components/
│   ├── Hero.svelte      # ← UIが別の場所に
│   └── Article.svelte
```

### 採用パターン（✅ コロケーション）

```text
src/
├── components/
│   ├── features/              # 機能単位のコンポーネント
│   │   ├── TopHero/           # Hero機能がここに完結
│   │   │   ├── index.svelte   # View層（Canvas設置）
│   │   │   └── scene.ts       # Logic層（Three.js描画）
│   │   └── ArticleVisual/     # 記事用3D（同パターン）
│   │       ├── index.svelte
│   │       └── scene.ts
│   └── ui/                    # 汎用UIパーツ
│       └── Button.svelte
```

### メリット

1. **削除・修正の単純化**: `TopHero` を消したい → フォルダごと削除
2. **依存関係の明確化**: `index.svelte` は `./scene` からのみインポート
3. **スケールしやすさ**: 新機能 = 新フォルダを作るだけ
4. **コードレビューの効率化**: 変更範囲が1フォルダに収まる

## 🚀 技術スタック

- **Astro** - Static Site Generator
- **Svelte 5** - Reactive UI
- **Three.js** - 3D Graphics
- **Tailwind CSS** - Styling
- **Cloudflare Pages** - Hosting
- **TypeScript** - Type Safety
- **pnpm** - Package Manager

## 📦 セットアップ

```bash
# 依存関係のインストール
pnpm install

# 開発サーバー起動
pnpm dev

# ビルド
pnpm build

# プレビュー
pnpm preview
```

## 🎨 デザインシステム

### カラーパレット

| 名前 | 用途 | Hex |
|------|------|-----|
| navy-950 | 背景 | `#0a0e1c` |
| navy-700 | 主要オブジェクト | `#27355e` |
| gold-500 | アクセント | `#b8984a` |
| ink-200 | テキスト | `#dee2e6` |

### タイポグラフィ

- **見出し**: Cormorant Garamond（セリフ体）
- **本文**: Source Sans 3 + Noto Sans JP
- **コード**: JetBrains Mono

## 📁 ディレクトリ構造

```text
src/
├── components/
│   ├── features/        # 機能単位（コロケーション適用）
│   │   ├── TopHero/
│   │   │   ├── index.svelte
│   │   │   └── scene.ts
│   │   └── ArticleVisual/
│   │       ├── index.svelte
│   │       └── scene.ts
│   └── ui/              # 汎用UI（複数機能から参照）
│       └── Button.svelte
├── layouts/
│   └── Layout.astro     # 共通レイアウト
├── pages/
│   └── index.astro      # トップページ
├── content/
│   └── blog/            # ブログ記事（Markdown）
└── env.d.ts             # 型定義

public/
└── favicon.svg

astro.config.mjs         # Astro設定
tailwind.config.mjs      # Tailwind設定
tsconfig.json            # TypeScript設定
package.json
```

## 🔧 設定ファイル

### astro.config.mjs

```javascript
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import tailwind from '@astrojs/tailwind';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'server',
  adapter: cloudflare(),
  integrations: [svelte(), tailwind()],
});
```

### tsconfig.json パスエイリアス

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@features/*": ["src/components/features/*"]
    }
  }
}
```

## 🎯 コロケーションの実践ルール

### ✅ DO

- 機能固有のロジックは `features/[機能名]/` に配置
- `index.svelte` から `./scene` のように相対パスでインポート
- 機能追加時は新しいフォルダを作成

### ❌ DON'T

- `src/lib/three/` のような「ロジック置き場」を作らない
- 機能固有のコードを `utils/` に入れない
- 遠く離れたファイル間で密結合を作らない

## 📝 新機能の追加方法

例: 記事詳細ページに波紋エフェクトを追加

```bash
# 1. 機能フォルダを作成
mkdir -p src/components/features/RippleEffect

# 2. ファイルを作成
touch src/components/features/RippleEffect/index.svelte
touch src/components/features/RippleEffect/scene.ts
```

```typescript
// scene.ts
export class RippleScene {
  // Three.jsロジック
}
```

```svelte
<!-- index.svelte -->
<script>
  import { RippleScene } from './scene';
  // ...
</script>
```

## 📄 ライセンス

MIT
