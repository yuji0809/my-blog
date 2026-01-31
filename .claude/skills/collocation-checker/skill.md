---
name: collocation-checker
description: コロケーション原則とアーキテクチャガイドラインの検証
when_to_use: |
  以下の場合にこのスキルを使用してください：
  - 新機能追加後のアーキテクチャ検証
  - プルリクエスト前のセルフチェック
  - リファクタリング後の構造確認
  - 定期的なコードベース監査（週次/月次）
  - インポートパスの正当性確認
  - 禁止されたディレクトリパターンの検出
  - 循環依存の確認
---

# Collocation Checker Skill

**Role:** コロケーション原則とアーキテクチャガイドラインの守護者

## Mission

コードベースがコロケーション原則を遵守し、「ゴミ屋敷化」を防ぐために、
ディレクトリ構造、インポートパス、ファイル配置を継続的に監視・検証する。

## Core Principles

1. **機能単位のコロケーション**: 関連ファイルは同一ディレクトリに配置
2. **責務分離**: ロジック（.ts）とUI（.svelte）は別ファイル
3. **アンチパターン検出**: `src/lib/three/` のような「ロジック置き場」を排除
4. **スケーラビリティ**: 新機能追加は新フォルダ作成で完結

## Directory Structure Rules

### ✅ CORRECT Pattern

```
src/
├── components/
│   ├── features/              # 機能単位のコンポーネント
│   │   ├── TopHero/           # ✅ 機能が1フォルダに完結
│   │   │   ├── index.svelte   # View層
│   │   │   ├── scene.ts       # Logic層（Three.js）
│   │   │   └── types.ts       # この機能専用の型定義（任意）
│   │   ├── ArticleVisual/
│   │   │   ├── index.svelte
│   │   │   └── scene.ts
│   │   └── ParallaxGallery/
│   │       ├── index.svelte
│   │       └── scene.ts
│   └── ui/                    # 汎用UIパーツ
│       ├── Button.svelte
│       ├── Card.svelte
│       └── Modal.svelte
├── layouts/
│   └── Layout.astro
├── pages/
│   └── index.astro
├── utils/                     # 複数機能から使う純粋関数
│   ├── date.ts
│   └── validation.ts
└── content/
    └── blog/
```

### ❌ INCORRECT Patterns（検出すべきアンチパターン）

```
src/
├── lib/
│   └── three/                 # ❌ ロジックが集約される「ゴミ屋敷」
│       ├── hero.ts
│       ├── article.ts
│       └── gallery.ts
├── components/
│   ├── Hero.svelte            # ❌ UIが遠く離れている
│   └── Article.svelte
```

```
src/
├── scenes/                    # ❌ レイヤー構造（禁止）
│   └── HeroScene.ts
├── views/
│   └── HeroView.svelte
```

```
src/
├── components/
│   └── TopHero/
│       ├── index.svelte
│       └── utils.ts           # ❌ 機能固有なのに「utils」という名前
```

## Validation Rules

### Rule 1: 機能固有のロジックはfeatures/内
```typescript
// ✅ CORRECT
import { HeroScene } from '@features/TopHero/scene';

// ❌ WRONG
import { HeroScene } from '@/lib/three/hero';
import { HeroScene } from '@/scenes/HeroScene';
```

### Rule 2: 相対パスでのインポート（同一feature内）
```typescript
// features/TopHero/index.svelte
// ✅ CORRECT
import { HeroScene } from './scene';

// ❌ WRONG
import { HeroScene } from '@features/TopHero/scene';  // 同じフォルダなのに絶対パス
```

### Rule 3: 汎用UIはui/内
```typescript
// ✅ CORRECT - 複数機能から使われる
src/components/ui/Button.svelte

// ❌ WRONG - 特定機能でしか使わないのにui/に配置
src/components/ui/HeroButton.svelte  // これはTopHero/内に置くべき
```

### Rule 4: utilsは真に汎用的な関数のみ
```typescript
// ✅ CORRECT
src/utils/date.ts              // 複数機能で使う日付フォーマット
src/utils/validation.ts        // 共通バリデーション

// ❌ WRONG
src/utils/heroAnimation.ts     // TopHero専用 → features/TopHero/内に配置
src/utils/three.ts             // 曖昧すぎる → 各featureに分散
```

## Validation Checklist

このスキルを実行する際のチェック項目：

### Phase 1: Directory Structure Scan
- [ ] `src/lib/three/` や `src/scenes/` が存在しないか
- [ ] `src/components/features/` が正しく使われているか
- [ ] 孤立したファイル（feature外のロジック）がないか

### Phase 2: Import Path Analysis
- [ ] 同一feature内で相対パスインポートしているか
- [ ] `@features/` エイリアスが適切に使われているか
- [ ] 循環依存がないか

### Phase 3: File Naming Consistency
- [ ] `index.svelte` がエントリーポイントか
- [ ] `scene.ts` がThree.jsロジックか
- [ ] `types.ts` が型定義専用か

### Phase 4: Semantic Analysis
- [ ] 各featureフォルダが単一責任を持つか
- [ ] `utils/` 内が真に汎用的か
- [ ] `ui/` コンポーネントが複数箇所から使われるか

## Detection Patterns

### Pattern 1: レイヤー構造の検出
```bash
# ❌ 検出すべきディレクトリ
src/lib/three/
src/scenes/
src/views/
src/logic/
src/controllers/
```

### Pattern 2: 不適切なインポート検出
```typescript
// Grep pattern
// ❌ features/内からのfeaturesインポート（相対パスにすべき）
import .* from ['"]@features/TopHero/.*['"]  // in TopHero/index.svelte

// ❌ lib/からのインポート
import .* from ['"]@/lib/three/.*['"]
```

### Pattern 3: 肥大化したutils/の検出
```bash
# utils/内のファイル数をカウント
# 5ファイル以上 → 警告（機能固有のものが混ざっている可能性）
```

## Automated Checks（Implementation Example）

```typescript
// collocation-checker.ts
import { glob } from 'glob';
import * as fs from 'fs';

interface ViolationResult {
  type: 'structure' | 'import' | 'naming';
  severity: 'error' | 'warning';
  file: string;
  message: string;
}

async function checkCollocation(): Promise<ViolationResult[]> {
  const violations: ViolationResult[] = [];

  // Check 1: Forbidden directories
  const forbiddenDirs = ['src/lib/three', 'src/scenes', 'src/views'];
  forbiddenDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      violations.push({
        type: 'structure',
        severity: 'error',
        file: dir,
        message: `レイヤー構造のディレクトリが存在します。features/に移動してください。`
      });
    }
  });

  // Check 2: Import path violations
  const svelteFiles = await glob('src/components/features/**/*.svelte');
  for (const file of svelteFiles) {
    const content = fs.readFileSync(file, 'utf-8');

    // 同一feature内での絶対パスインポート
    const featureName = file.split('/features/')[1].split('/')[0];
    const pattern = new RegExp(`from ['"]@features/${featureName}/`, 'g');
    if (pattern.test(content)) {
      violations.push({
        type: 'import',
        severity: 'warning',
        file,
        message: `同一feature内では相対パスを使用してください。`
      });
    }
  }

  return violations;
}
```

## Output Format

検証結果は以下の形式で出力：

```
🔍 Collocation Check Report
============================

✅ Structure: OK
✅ Import Paths: OK
⚠️  Warnings: 2

Warnings:
  [Import] src/components/features/TopHero/index.svelte:12
    → 同一feature内では相対パスを使用してください

  [Naming] src/components/ui/HeroButton.svelte
    → このコンポーネントはTopHero専用です。features/TopHero/に移動を検討してください

📊 Summary
----------
- Total files scanned: 45
- Features detected: 3
- UI components: 5
- Utils: 3

💡 Recommendations
------------------
1. src/utils/heroAnimation.ts を features/TopHero/animation.ts に移動
2. HeroButton.svelte は単一機能でのみ使用されているため、ui/から移動を推奨
```

## Collaboration

このスキルは**すべてのスキル**と連携し、最終チェックを担当：

- **astro-writer**: インポートパスが正しいか検証
- **threejs-writer**: scene.tsが適切な場所にあるか確認
- **typescript-writer**: types.tsの配置を検証
- **ui-designer**: UIコンポーネントの配置を確認

## CLI Integration（推奨）

```json
// package.json
{
  "scripts": {
    "check:collocation": "tsx scripts/collocation-checker.ts",
    "precommit": "pnpm check:collocation && git add ."
  }
}
```

## Success Metrics

- ✅ Zero forbidden directories
- ✅ 100% correct import paths
- ✅ features/ 配下のフォルダ数 = 独立した機能数
- ✅ utils/ 内のファイル数 < 5
- ✅ 循環依存ゼロ
