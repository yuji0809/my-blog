---
title: 'CC-Recommender: Claude Code向けインテリジェント推薦システム'
description: 'プロジェクトを自動分析し、最適なプラグイン、MCPサーバー、スキルを提案するMCPサーバーを開発・公開しました。'
pubDate: 2026-01-29T00:00:00.000Z
tags: ['MCP', 'Claude Code', 'TypeScript', 'Open Source']
featured: true
github: 'https://github.com/yuji0809/cc-recommender'
npm: 'https://www.npmjs.com/package/@yuji0809/cc-recommender'
externalLinks:
  - platform: 'qiita'
    url: 'https://qiita.com/example'
    title: 'CC-Recommenderの開発と公開'
  - platform: 'zenn'
    url: 'https://zenn.dev/example'
---

## プロジェクト概要

Claude Codeユーザー向けに、プロジェクトに最適なツールを自動推薦するMCPサーバー「**CC-Recommender**」を開発し、npmパッケージとして公開しました。

## 解決する課題

Claude Codeのエコシステムには数多くのプラグイン、MCPサーバー、スキルが存在しますが、「自分のプロジェクトに何が必要か」を判断するのは困難でした。CC-Recommenderは、プロジェクトを自動分析し、文脈に応じた最適な推薦を提供します。

## コア機能

### 1. プロジェクト自動検出
言語、フレームワーク、依存関係を解析し、プロジェクトの特性を把握します。

### 2. インテリジェント推薦
- **プラグイン提案**: 公式マーケットプレイスから最適なプラグインを提案
- **MCPサーバー推薦**: コミュニティ管理のサーバーコレクションを検索
- **スキル・ワークフロー**: 関連するコマンドやスキルを提案

### 3. リアルタイムデータ取得
GitHubから最新情報を毎週自動取得し、常に最新の推薦を提供します。

## インストール

### 必須要件
- Node.js 22.0.0以上

### 3つのセットアップ方法

#### 1. npx経由（推奨）
```json
// ~/.claude/settings.json
{
  "mcpServers": {
    "cc-recommender": {
      "command": "npx",
      "args": ["-y", "@yuji0809/cc-recommender"]
    }
  }
}
```

#### 2. グローバルインストール
```bash
npm install -g @yuji0809/cc-recommender
```

#### 3. ローカル開発
```bash
git clone https://github.com/yuji0809/cc-recommender.git
cd cc-recommender
pnpm install
pnpm build
```

## 使用例

Claudeに以下のように質問するだけ：

> "このプロジェクトに何をインストールすべき？"

システムが以下を返します：
- 関連度スコア付きのプラグイン提案
- インストール手順付きのMCPサーバー推薦
- 各推薦の目的説明（タグ付き）

## 技術スタック

- **TypeScript**: 型安全な実装
- **MCP SDK**: Model Context Protocolの実装
- **GitHub API**: データソースの自動更新

## データソース

3つの厳選されたリポジトリから情報を集約（毎週更新）：
1. 公式プラグインマーケットプレイス
2. コミュニティ管理のMCPサーバーコレクション
3. Claude Codeスキル・ワークフローの編集

## アーキテクチャの特徴

### 責務分離
- **データ取得層**: GitHub APIからの情報収集
- **分析層**: プロジェクト特性の解析
- **推薦層**: スコアリングとランキング
- **表示層**: 構造化された結果の返却

### 拡張性
新しいデータソースやスコアリングアルゴリズムを容易に追加可能な設計。

## 今後の展開

- [ ] プラグイン間の依存関係分析
- [ ] ユーザーフィードバックに基づく学習機能
- [ ] カスタム推薦ルールの設定
- [ ] 多言語サポート

## リンク

- [GitHub リポジトリ](https://github.com/yuji0809/cc-recommender)
- [npm パッケージ](https://www.npmjs.com/package/@yuji0809/cc-recommender)

---

Claude Codeをより効率的に使いたい方、ぜひお試しください！
