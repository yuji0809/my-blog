# Claude Code Skills for Blog Project

このディレクトリには、コロケーション原則に基づくブログプロジェクト専用のClaude Codeスキルが含まれています。

## 📚 Available Skills

### 1. `/astro-writer` - Astro Page & Layout Specialist
**専門分野:** Astroファイルの作成、レイアウト設計、SSR/SSG設定

**使用タイミング:**
- 新しいページ作成（`/about`, `/blog/[slug]`）
- レイアウトコンポーネントの設計
- SEO・OGタグの最適化
- `astro.config.mjs` の調整

**Example:**
```bash
# Claude Codeで使用
/astro-writer

# または自然言語で
「Aboutページを作成してください」と伝えると、自動的にこのスキルが呼ばれます
```

---

### 2. `/threejs-writer` - Three.js Scene Creator
**専門分野:** Three.jsによる3Dビジュアル表現、パフォーマンス最適化

**使用タイミング:**
- 新しい3D機能の追加（Hero, ArticleVisual, Gallery）
- 既存シーンのパフォーマンス改善
- アニメーションの洗練化
- シェーダーマテリアルの実装

**Example:**
```bash
/threejs-writer

# プロンプト例
「記事ページ用のパーティクルエフェクトを作成してください」
→ src/components/features/ArticleParticles/scene.ts を作成
```

**カラーパレット（必須）:**
- Background: `0x0a0e1c` (navy-950)
- Primary: `0x27355e` (navy-700)
- Accent: `0xb8984a` (gold-500)

---

### 3. `/typescript-writer` - Type-Safe Logic Specialist
**専門分野:** 型安全なTypeScriptコード、ユーティリティ関数、状態管理

**使用タイミング:**
- 複雑な型定義が必要
- ユーティリティ関数の作成
- APIクライアントの型定義
- バリデーション関数の実装

**Example:**
```bash
/typescript-writer

# プロンプト例
「ブログ記事のフィルタリング関数を型安全に実装してください」
→ src/utils/blogFilters.ts を作成（複数機能で使う場合）
→ src/components/features/BlogList/filters.ts を作成（機能固有の場合）
```

---

### 4. `/ui-designer` - UI Component Designer
**専門分野:** Svelteコンポーネント設計、デザインシステム、アクセシビリティ

**使用タイミング:**
- 新しいUIコンポーネントの設計
- デザインシステムの拡張
- アニメーション・トランジションの実装
- アクセシビリティ改善

**Example:**
```bash
/ui-designer

# プロンプト例
「記事カード用のコンポーネントを作成してください」
→ src/components/features/ArticleCard/index.svelte を作成
```

**デザインシステム準拠:**
- カラー: `--navy-*`, `--gold-*`, `--ink-*`
- タイポグラフィ: Cormorant Garamond（見出し）、Source Sans 3（本文）
- Spacing: 8px base（0.5rem, 1rem, 1.5rem...）

---

### 5. `/collocation-checker` - Architecture Guardian
**専門分野:** コロケーション原則の検証、ディレクトリ構造監査

**使用タイミング:**
- 新機能追加後のアーキテクチャ検証
- プルリクエスト前のセルフチェック
- リファクタリング後の構造確認
- 定期的なコードベース監査

**Example:**
```bash
/collocation-checker

# 自動検出内容
✅ Structure: OK
✅ Import Paths: OK
⚠️  Warnings: 2
  - features/TopHero/index.svelte で絶対パスインポート検出
  - ui/HeroButton.svelte は単一機能専用（移動推奨）
```

---

## 🔄 Skills Workflow

### 新機能追加の典型的なワークフロー

#### Step 1: UI設計
```bash
/ui-designer
「記事一覧ページにカードレイアウトを作成してください」
```

#### Step 2: Astroページ作成
```bash
/astro-writer
「/blogページを作成し、ArticleCardを表示してください」
```

#### Step 3: Three.js追加（必要に応じて）
```bash
/threejs-writer
「記事一覧の背景に浮遊するパーティクルを追加してください」
```

#### Step 4: TypeScript補強
```bash
/typescript-writer
「記事フィルタリングとソート機能を型安全に実装してください」
```

#### Step 5: アーキテクチャ検証
```bash
/collocation-checker
「コロケーション原則に違反していないか確認してください」
```

---

## 🎯 Collocation Principles

すべてのスキルが従う共通原則：

### ✅ DO
```
src/components/features/ArticleList/
├── index.svelte          # UI Designer が作成
├── scene.ts              # Three.js Writer が作成（必要時）
├── filters.ts            # TypeScript Writer が作成
└── types.ts              # TypeScript Writer が作成
```

### ❌ DON'T
```
src/
├── lib/three/articleScene.ts     # ❌ レイヤー構造
├── components/ArticleList.svelte # ❌ 機能がバラバラ
└── utils/articleFilters.ts       # ❌ 機能固有なのにutils
```

---

## 🛠️ Setup & Configuration

### Path Aliases（推奨設定）

```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@features/*": ["src/components/features/*"],
      "@ui/*": ["src/components/ui/*"],
      "@layouts/*": ["src/layouts/*"],
      "@utils/*": ["src/utils/*"]
    }
  }
}
```

### Claude Code Settings

```json
// .claude/settings.local.json
{
  "skills": {
    "astro-writer": { "enabled": true },
    "threejs-writer": { "enabled": true },
    "typescript-writer": { "enabled": true },
    "ui-designer": { "enabled": true },
    "collocation-checker": { "enabled": true }
  }
}
```

---

## 📊 Success Metrics

各スキル実行後、以下を確認：

- **Astro Writer**
  - [ ] Lighthouse Performance 90+
  - [ ] Zero TypeScript errors
  - [ ] Valid HTML5

- **Three.js Writer**
  - [ ] 60fps維持
  - [ ] メモリリークなし
  - [ ] dispose()実装済み

- **TypeScript Writer**
  - [ ] Zero `any` types
  - [ ] 100% type coverage
  - [ ] ESLint通過

- **UI Designer**
  - [ ] WCAG 2.1 AA準拠
  - [ ] Lighthouse Accessibility 100
  - [ ] デザインシステム一貫性

- **Collocation Checker**
  - [ ] Zero forbidden directories
  - [ ] 100% correct import paths
  - [ ] Zero circular dependencies

---

## 🤝 Skills Collaboration Matrix

| スキル | 連携先 | 連携内容 |
|--------|--------|----------|
| Astro Writer | UI Designer | レイアウト・ページ構造相談 |
| Astro Writer | Collocation Checker | インポートパス検証 |
| Three.js Writer | TypeScript Writer | 型定義サポート |
| Three.js Writer | UI Designer | 色調・アニメーション調和 |
| TypeScript Writer | 全スキル | 型定義提供 |
| UI Designer | Astro Writer | デザインシステム共有 |
| Collocation Checker | 全スキル | 最終検証 |

---

## 📝 Notes

- すべてのスキルは **コロケーション原則** を最優先
- **機能単位** でフォルダを作成（レイヤー構造禁止）
- **責務分離** を守る（ロジックとUIは別ファイル）
- **型安全性** を徹底（`any` 禁止、strict mode必須）

---

## 🔗 Related Documentation

- [README.md](../../README.md) - プロジェクト全体の概要
- [Astro Documentation](https://docs.astro.build/)
- [Svelte 5 Documentation](https://svelte-5-preview.vercel.app/)
- [Three.js Documentation](https://threejs.org/docs/)
