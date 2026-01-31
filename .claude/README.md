# Claude Code Configuration

このディレクトリには、ブログプロジェクト専用のClaude Code設定とスキルが含まれています。

## 📁 Structure

```
.claude/
├── README.md                      # このファイル
├── settings.local.json            # Claude Code設定
└── skills/                        # カスタムスキル
    ├── README.md                  # スキル使用ガイド
    ├── astro-writer/              # Astro専門スキル
    │   └── skill.mdl
    ├── threejs-writer/            # Three.js専門スキル
    │   └── skill.mdl
    ├── typescript-writer/         # TypeScript専門スキル
    │   └── skill.mdl
    ├── ui-designer/               # UI設計専門スキル
    │   └── skill.mdl
    └── collocation-checker/       # アーキテクチャ検証スキル
        └── skill.mdl
```

## 🎯 Philosophy

このプロジェクトは **コロケーション（Collocation）原則** を採用しています。

### 従来のアンチパターン（❌）
```
src/
├── lib/three/           # ← ロジックが散らばる
│   ├── hero.ts
│   └── article.ts
└── components/
    ├── Hero.svelte      # ← UIが別の場所
    └── Article.svelte
```

### コロケーションパターン（✅）
```
src/components/features/
├── TopHero/             # ← 機能が1箇所に完結
│   ├── index.svelte     # View
│   └── scene.ts         # Logic
└── ArticleVisual/
    ├── index.svelte
    └── scene.ts
```

## 🚀 Quick Start

### 1. スキルの使い方

Claude Codeで以下のコマンドを実行：

```bash
# Astroページを作成
/astro-writer

# Three.jsシーンを作成
/threejs-writer

# TypeScriptロジックを作成
/typescript-writer

# UIコンポーネントを設計
/ui-designer

# アーキテクチャを検証
/collocation-checker
```

### 2. 新機能追加の流れ

#### Example: 「お問い合わせフォーム」機能を追加

**Step 1: UI設計**
```
プロンプト: 「お問い合わせフォームのUIを設計してください」
使用スキル: /ui-designer
出力: src/components/features/ContactForm/index.svelte
```

**Step 2: バリデーションロジック**
```
プロンプト: 「フォームバリデーションを型安全に実装してください」
使用スキル: /typescript-writer
出力: src/components/features/ContactForm/validation.ts
```

**Step 3: Astroページ作成**
```
プロンプト: 「/contactページを作成してください」
使用スキル: /astro-writer
出力: src/pages/contact.astro
```

**Step 4: アーキテクチャ検証**
```
プロンプト: 「コロケーション原則に違反していないか確認」
使用スキル: /collocation-checker
出力: 検証レポート
```

## ⚙️ Configuration

### settings.local.json

```json
{
  "permissions": {
    "allow": [
      "mcp__plugin_serena_serena__list_dir",
      "mcp__plugin_serena_serena__activate_project"
    ]
  },
  "skills": {
    "astro-writer": { "enabled": true },
    "threejs-writer": { "enabled": true },
    "typescript-writer": { "enabled": true },
    "ui-designer": { "enabled": true },
    "collocation-checker": { "enabled": true }
  }
}
```

### Path Aliases（tsconfig.json）

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["src/*"],
      "@features/*": ["src/components/features/*"],
      "@ui/*": ["src/components/ui/*"],
      "@layouts/*": ["src/layouts/*"],
      "@utils/*": ["src/utils/*"]
    }
  }
}
```

## 📋 Skills Overview

| スキル | 専門分野 | 主な用途 |
|--------|----------|----------|
| **astro-writer** | Astroページ・レイアウト | ページ作成、SEO最適化 |
| **threejs-writer** | Three.js 3Dビジュアル | シーン作成、アニメーション |
| **typescript-writer** | TypeScriptロジック | 型定義、ユーティリティ |
| **ui-designer** | Svelteコンポーネント | UI設計、アクセシビリティ |
| **collocation-checker** | アーキテクチャ検証 | 構造監査、インポート検証 |

詳細は [skills/README.md](./skills/README.md) を参照してください。

## 🎨 Design System

すべてのスキルが従うデザインシステム：

### カラーパレット
```css
:root {
  /* Background */
  --navy-950: #0a0e1c;
  --navy-900: #141b36;
  --navy-700: #27355e;

  /* Text */
  --ink-50: #f8f9fa;
  --ink-400: #adb5bd;

  /* Accent */
  --gold-500: #b8984a;
}
```

### タイポグラフィ
- **見出し**: Cormorant Garamond（セリフ体）
- **本文**: Source Sans 3 + Noto Sans JP
- **コード**: JetBrains Mono

### スペーシング
- Base: 8px (0.5rem)
- Scale: 0.5rem, 1rem, 1.5rem, 2rem, 3rem, 4rem

## 🔒 Architecture Rules

### ✅ Allowed
```
src/
├── components/
│   ├── features/[機能名]/     # 機能単位のコロケーション
│   │   ├── index.svelte
│   │   ├── scene.ts
│   │   └── types.ts
│   └── ui/                    # 汎用UIパーツ
├── utils/                     # 真に汎用的な関数のみ
└── pages/
```

### ❌ Forbidden
```
src/
├── lib/three/                 # ❌ レイヤー構造
├── scenes/                    # ❌ ロジック置き場
├── views/                     # ❌ View置き場
└── controllers/               # ❌ MVC的構造
```

## 📊 Quality Gates

各スキル実行後、以下を確認：

### Code Quality
- [ ] Zero TypeScript errors
- [ ] Zero ESLint errors
- [ ] No `any` types
- [ ] No circular dependencies

### Performance
- [ ] Lighthouse Performance 90+
- [ ] 60fps animations
- [ ] No memory leaks

### Accessibility
- [ ] WCAG 2.1 AA compliant
- [ ] Lighthouse Accessibility 100
- [ ] Keyboard navigation support

### Architecture
- [ ] Collocation principle followed
- [ ] No forbidden directories
- [ ] Correct import paths

## 🛠️ Development Workflow

### Daily Development
```bash
# 機能開発
pnpm dev                       # 開発サーバー起動

# Claude Codeでスキル使用
/ui-designer                   # UI作成
/typescript-writer             # ロジック作成
/collocation-checker           # 検証
```

### Pre-Commit
```bash
# 品質チェック
pnpm check:collocation         # アーキテクチャ検証
pnpm type-check                # TypeScript型チェック
pnpm lint                      # ESLint
```

### Pre-Deploy
```bash
pnpm build                     # 本番ビルド
pnpm preview                   # プレビュー確認
```

## 📚 Resources

- [Project README](../README.md) - プロジェクト全体の概要
- [Skills README](./skills/README.md) - スキル詳細ガイド
- [Astro Docs](https://docs.astro.build/)
- [Svelte 5 Docs](https://svelte-5-preview.vercel.app/)
- [Three.js Docs](https://threejs.org/docs/)

## 🤝 Contributing

新しいスキルを追加する場合：

1. `.claude/skills/[skill-name]/` ディレクトリを作成
2. `skill.mdl` ファイルを作成（他のスキルを参考に）
3. `skills/README.md` に使用方法を追記
4. コロケーション原則に準拠していることを確認

## 📝 License

MIT
