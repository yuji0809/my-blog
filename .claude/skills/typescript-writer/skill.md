---
name: typescript-writer
description: 型安全で保守性の高いTypeScriptコードの作成
when_to_use: |
  以下の場合にこのスキルを使用してください：
  - 複雑な型定義が必要な場合
  - ユーティリティ関数の作成
  - 状態管理ロジックの実装
  - APIクライアントの型定義
  - バリデーション関数の作成
  - 既存コードの型安全性向上
  - インターフェース・型エイリアスの設計
---

# TypeScript Writer Skill

**Role:** 型安全で保守性の高いTypeScriptコードの作成スペシャリスト

## Mission

厳格な型システムを活用し、ランタイムエラーを最小化する堅牢なコードを構築する。
コロケーション原則に従い、機能固有のロジックを適切な場所に配置。

## Core Principles

1. **型安全性第一**: `any` 禁止、strict mode必須
2. **コロケーション遵守**: 機能固有のロジックは `features/[機能名]/` 内
3. **関数型プログラミング**: イミュータビリティとピュア関数を優先
4. **自己文書化**: 型とコードが仕様書となる

## TypeScript Configuration Standards

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "esModuleInterop": true
  }
}
```

## Type Design Patterns

### 1. Interface vs Type

#### Interface（拡張可能性が必要）
```typescript
interface SceneConfig {
  canvas: HTMLCanvasElement;
  backgroundColor?: number;
}

interface ExtendedConfig extends SceneConfig {
  particleCount: number;
}
```

#### Type（ユニオン・交差型）
```typescript
type Status = 'idle' | 'loading' | 'success' | 'error';
type Result<T> = { ok: true; data: T } | { ok: false; error: string };
```

### 2. Utility Types活用

```typescript
// Readonly（イミュータブル）
const PALETTE: Readonly<Record<string, number>> = {
  background: 0x0a0e1c,
  primary: 0x27355e,
} as const;

// Partial（オプショナル化）
type UpdateConfig = Partial<SceneConfig>;

// Pick / Omit（プロパティ選択）
type PublicAPI = Pick<HeroScene, 'start' | 'dispose'>;
```

### 3. Generics（汎用性）

```typescript
// 型安全なストレージユーティリティ
class LocalStorage<T> {
  constructor(private key: string) {}

  get(): T | null {
    const item = localStorage.getItem(this.key);
    return item ? JSON.parse(item) : null;
  }

  set(value: T): void {
    localStorage.setItem(this.key, JSON.stringify(value));
  }
}

const userPrefs = new LocalStorage<UserPreferences>('user-prefs');
```

## Code Quality Standards

### ✅ DO

```typescript
// 明確な型定義
interface BlogPost {
  slug: string;
  title: string;
  publishedAt: Date;
  tags: readonly string[];
}

// ピュア関数
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('ja-JP').format(date);
}

// 型ガード
function isError(result: Result<Data>): result is { ok: false; error: string } {
  return !result.ok;
}

// const assertion
const CONFIG = {
  API_ENDPOINT: '/api',
  TIMEOUT: 5000,
} as const;
```

### ❌ DON'T

```typescript
// ❌ any使用
function process(data: any) { }

// ❌ 非nullアサーション乱用
const element = document.querySelector('.foo')!;  // null可能性を無視

// ❌ 副作用のある関数
function getTotal(items: Item[]): number {
  items.sort();  // 引数を変更
  return items.reduce((sum, item) => sum + item.price, 0);
}

// ❌ マジックナンバー
if (status === 200) { }  // 定数化すべき
```

## File Structure Patterns

### 機能固有のロジック
```
src/components/features/TopHero/
├── index.svelte
├── scene.ts              # Three.jsロジック
└── types.ts              # この機能専用の型定義
```

### 汎用ユーティリティ（複数機能から使用）
```
src/utils/
├── date.ts               # 日付フォーマット
├── validation.ts         # バリデーション
└── types.ts              # 共通型定義
```

## Advanced Patterns

### 1. Branded Types（型安全性強化）
```typescript
type Slug = string & { __brand: 'Slug' };
type Email = string & { __brand: 'Email' };

function createSlug(title: string): Slug {
  return title.toLowerCase().replace(/\s+/g, '-') as Slug;
}

function sendEmail(to: Email) { }

const slug = createSlug('Hello World');
sendEmail(slug);  // ❌ コンパイルエラー
```

### 2. Discriminated Unions（状態管理）
```typescript
type LoadingState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

function render(state: LoadingState<BlogPost>) {
  switch (state.status) {
    case 'idle':
      return 'Click to load';
    case 'loading':
      return 'Loading...';
    case 'success':
      return state.data.title;  // data は存在が保証される
    case 'error':
      return state.error.message;
  }
}
```

### 3. Builder Pattern（複雑な初期化）
```typescript
class SceneBuilder {
  private config: Partial<SceneConfig> = {};

  withCanvas(canvas: HTMLCanvasElement): this {
    this.config.canvas = canvas;
    return this;
  }

  withBackgroundColor(color: number): this {
    this.config.backgroundColor = color;
    return this;
  }

  build(): SceneConfig {
    if (!this.config.canvas) throw new Error('Canvas required');
    return this.config as SceneConfig;
  }
}

const config = new SceneBuilder()
  .withCanvas(canvasElement)
  .withBackgroundColor(0x000000)
  .build();
```

## Error Handling

### Result型パターン
```typescript
type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

async function fetchPost(slug: string): Promise<Result<BlogPost>> {
  try {
    const response = await fetch(`/api/posts/${slug}`);
    const data = await response.json();
    return { ok: true, value: data };
  } catch (error) {
    return { ok: false, error: error as Error };
  }
}

// 使用側
const result = await fetchPost('hello-world');
if (result.ok) {
  console.log(result.value.title);
} else {
  console.error(result.error.message);
}
```

## Documentation Standards

### JSDocによる型補完強化
```typescript
/**
 * ブログ記事を日付でソートする
 *
 * @param posts - ソート対象の記事配列
 * @param order - ソート順（'asc' | 'desc'）
 * @returns ソートされた新しい配列
 *
 * @example
 * const sorted = sortByDate(posts, 'desc');
 */
function sortByDate(
  posts: readonly BlogPost[],
  order: 'asc' | 'desc' = 'desc'
): BlogPost[] {
  return [...posts].sort((a, b) => {
    const diff = a.publishedAt.getTime() - b.publishedAt.getTime();
    return order === 'asc' ? diff : -diff;
  });
}
```

## Collaboration

- **threejs-writer**: シーンクラスの型定義をサポート
- **astro-writer**: Astro.propsの型定義を提供
- **ui-designer**: Svelteコンポーネントのprops型を定義
- **collocation-checker**: 型定義ファイルの配置場所を検証

## Success Metrics

- ✅ Zero `any` types（unavoidableな外部ライブラリを除く）
- ✅ 100% type coverage
- ✅ Zero TypeScript errors
- ✅ ESLint `no-explicit-any` rule通過
- ✅ コロケーション原則遵守
