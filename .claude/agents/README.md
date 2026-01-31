# Claude Code Agents

このディレクトリには、Task toolから呼び出すカスタムエージェントが含まれています。

## 📚 Agents vs Skills

### Skills（スキル）
- **呼び出し方**: `/skill-name`
- **用途**: ユーザーが直接呼び出すコマンド
- **例**: `/astro-writer`

### Agents（エージェント）
- **呼び出し方**: Task toolの`subagent_type`パラメータ
- **用途**: 自律的に動作するサブエージェント
- **例**: `Task(subagent_type="astro-writer", ...)`

## 🤖 Available Agents

### 1. `astro-writer`
**専門分野:** Astroページ・レイアウトファイルの作成

**使用例:**
```typescript
// Claude Codeから
Task(
  subagent_type="astro-writer",
  description="Create about page",
  prompt="Create an About page at src/pages/about.astro with Layout and basic content"
)
```

---

### 2. `threejs-writer`
**専門分野:** Three.js 3Dシーンの作成

**使用例:**
```typescript
Task(
  subagent_type="threejs-writer",
  description="Create particle effect",
  prompt="Create a particle effect scene for ArticleVisual feature at src/components/features/ArticleVisual/scene.ts"
)
```

**デザイン要件:**
- カラーパレット: navy-950, navy-700, gold-500
- アニメーション: 緩やかで静謐
- パフォーマンス: 60fps維持必須

---

### 3. `typescript-writer`
**専門分野:** 型安全なTypeScriptロジック

**使用例:**
```typescript
Task(
  subagent_type="typescript-writer",
  description="Create blog filters",
  prompt="Create type-safe blog post filtering and sorting utilities"
)
```

**要件:**
- `any`型禁止
- strict mode準拠
- 関数型プログラミング推奨

---

### 4. `ui-designer`
**専門分野:** Svelteコンポーネント設計

**使用例:**
```typescript
Task(
  subagent_type="ui-designer",
  description="Design article card",
  prompt="Design an article card component at src/components/features/ArticleCard/index.svelte with title, excerpt, date, and tags"
)
```

**デザインシステム:**
- タイポグラフィ: Cormorant Garamond（見出し）、Source Sans 3（本文）
- スペーシング: 8px base（0.5rem, 1rem, 1.5rem...）
- アクセシビリティ: WCAG 2.1 AA必須

---

### 5. `collocation-checker`
**専門分野:** アーキテクチャ検証

**使用例:**
```typescript
Task(
  subagent_type="collocation-checker",
  description="Validate architecture",
  prompt="Check if the codebase follows collocation principles and report any violations"
)
```

**検証項目:**
- ディレクトリ構造（禁止パターン検出）
- インポートパス（相対/絶対の使い分け）
- ファイル配置（機能固有ファイルの位置）

---

## 🔄 Workflow Examples

### Example 1: 新機能「お問い合わせフォーム」を追加

```typescript
// Step 1: UI設計
Task(
  subagent_type="ui-designer",
  description="Design contact form UI",
  prompt="Create a contact form component at src/components/features/ContactForm/index.svelte with name, email, message fields"
)

// Step 2: バリデーション実装
Task(
  subagent_type="typescript-writer",
  description="Create form validation",
  prompt="Create type-safe form validation logic at src/components/features/ContactForm/validation.ts"
)

// Step 3: Astroページ作成
Task(
  subagent_type="astro-writer",
  description="Create contact page",
  prompt="Create /contact page that imports and uses the ContactForm component"
)

// Step 4: アーキテクチャ検証
Task(
  subagent_type="collocation-checker",
  description="Validate architecture",
  prompt="Verify that the ContactForm feature follows collocation principles"
)
```

### Example 2: ブログ記事一覧ページ

```typescript
// Step 1: 記事カードUI
Task(
  subagent_type="ui-designer",
  description="Design article card",
  prompt="Create an article card component with thumbnail, title, excerpt, date, and tags"
)

// Step 2: 記事フィルタリング
Task(
  subagent_type="typescript-writer",
  description="Create blog utilities",
  prompt="Create utilities for filtering and sorting blog posts by date, tags, and search query"
)

// Step 3: 3D背景効果（オプション）
Task(
  subagent_type="threejs-writer",
  description="Create blog background",
  prompt="Create a subtle particle background for the blog list page"
)

// Step 4: ブログページ作成
Task(
  subagent_type="astro-writer",
  description="Create blog list page",
  prompt="Create /blog page that displays all articles with filtering UI"
)
```

---

## 📋 Agent Communication Protocol

エージェント間の連携方法：

### Pattern 1: Sequential Tasks（逐次実行）
```typescript
// UI作成 → TypeScript実装 → アーキテクチャ検証
Task(subagent_type="ui-designer", ...)
// 完了を待つ
Task(subagent_type="typescript-writer", ...)
// 完了を待つ
Task(subagent_type="collocation-checker", ...)
```

### Pattern 2: Parallel Tasks（並列実行）
```typescript
// 独立したタスクは並列で実行可能
[
  Task(subagent_type="ui-designer", prompt="Create Button component"),
  Task(subagent_type="ui-designer", prompt="Create Card component"),
  Task(subagent_type="typescript-writer", prompt="Create date utils")
]
```

---

## 🎯 Agent Specialization Matrix

| エージェント | 作成するファイル | 主な責務 |
|--------------|------------------|----------|
| **astro-writer** | `*.astro`, `Layout.astro` | ページ、レイアウト、SEO |
| **threejs-writer** | `scene.ts` | 3Dシーン、アニメーション |
| **typescript-writer** | `*.ts`, `types.ts`, `utils.ts` | ロジック、型定義 |
| **ui-designer** | `index.svelte`, `*.svelte` | UIコンポーネント、スタイル |
| **collocation-checker** | レポート生成 | アーキテクチャ検証 |

---

## 🔒 Collocation Rules（全エージェント共通）

### ✅ 機能固有ファイルの配置

```
src/components/features/[機能名]/
├── index.svelte          # ui-designer
├── scene.ts              # threejs-writer
├── logic.ts              # typescript-writer
└── types.ts              # typescript-writer
```

### ✅ 汎用ファイルの配置

```
src/
├── components/ui/        # ui-designer（汎用UI）
│   └── Button.svelte
└── utils/                # typescript-writer（汎用ロジック）
    └── date.ts
```

### ❌ 禁止パターン

```
src/
├── lib/three/            # ❌ レイヤー構造
├── scenes/               # ❌ ロジック置き場
├── views/                # ❌ View置き場
└── controllers/          # ❌ MVC的構造
```

---

## 📊 Quality Gates

各エージェント実行後の確認項目：

### astro-writer
- [ ] Lighthouse Performance 90+
- [ ] TypeScript型エラーなし
- [ ] 適切なハイドレーション設定

### threejs-writer
- [ ] 60fps維持
- [ ] dispose()実装
- [ ] デザインパレット遵守

### typescript-writer
- [ ] `any`型なし
- [ ] 100% type coverage
- [ ] ESLint通過

### ui-designer
- [ ] WCAG 2.1 AA準拠
- [ ] デザインシステム一貫性
- [ ] レスポンシブ対応

### collocation-checker
- [ ] 禁止ディレクトリなし
- [ ] インポートパス正常
- [ ] 循環依存なし

---

## 🛠️ Development Tips

### Tip 1: エージェントの選び方

```
新しいページを作りたい
  → astro-writer

3D表現を追加したい
  → threejs-writer

UIコンポーネントが必要
  → ui-designer

ロジックや型定義が必要
  → typescript-writer

アーキテクチャが心配
  → collocation-checker
```

### Tip 2: エージェント連携の順序

```
典型的な順序:
1. ui-designer（UIプロトタイプ）
2. typescript-writer（ロジック実装）
3. threejs-writer（3D追加、必要時）
4. astro-writer（ページ統合）
5. collocation-checker（最終検証）
```

### Tip 3: エージェントへの指示

**良い指示:**
```
"Create an article card component at src/components/features/ArticleCard/index.svelte
with the following fields: title, excerpt, publishedAt, tags.
Use the design system colors and typography."
```

**悪い指示:**
```
"Make a card"  # 曖昧すぎる
```

---

## 📚 Resources

- [Skills README](../skills/README.md) - スキルとの違い
- [Main README](../README.md) - プロジェクト設定
- [Project README](../../README.md) - 全体概要

---

## 🔧 Customization

新しいエージェントを追加する場合：

1. `.claude/agents/[agent-name].json` を作成
2. 以下の構造で定義：

```json
{
  "name": "agent-name",
  "description": "Short description",
  "instructions": "Detailed system prompt...",
  "model": "sonnet"
}
```

3. このREADMEに使用方法を追記
4. コロケーション原則に準拠することを確認

---

## 📝 License

MIT
