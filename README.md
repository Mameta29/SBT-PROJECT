# 【Alamoa 学習用】Soulbound Token (SBT)

このプロジェクトは、Alamoa のブロックチェーン学習の教材開発にてでもアプリケーションとして実装したものです。Solidity スマートコントラクトとリアクトベースのフロントエンドインターフェースを使用した Soulbound Token (SBT) システムを実装しています。SBT は、特定のウォレットアドレスに永続的に紐づけられた、譲渡不可能な NFT であり、実績、資格、メンバーシップなどを表現することができます。

## プロジェクト構成

```
├── src/
│   └── SoulboundToken.sol       # メインのSBTスマートコントラクト
├── script/
│   └── DeploySoulboundToken.s.sol # デプロイメントスクリプト
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── SBTMinter.tsx    # SBTミント用インターフェース
    │   └── utils/
    │       ├── contractUtils.ts  # コントラクト操作ユーティリティ
    │       ├── pinata-client.ts  # Pinata IPFSクライアント
    │       ├── pinata-utils.ts   # IPFSアップロード用ユーティリティ
    │       └── viem-client.ts    # Ethereumクライアント設定
```

## 技術スタック

- **スマートコントラクト**: Solidity 0.8.20
- **開発フレームワーク**: Foundry
- **フロントエンド**: React + TypeScript + Vite
- **スタイリング**: TailwindCSS
- **ブロックチェーン連携**: viem + wagmi
- **ストレージ**: IPFS (Pinata)
- **ネットワーク**: Sepolia テストネット

## 主な機能

- 譲渡不可能な ERC721 トークンの実装
- IPFS を利用したメタデータストレージ（Pinata 経由）
- SBT ミント用 Web インターフェース
- ウォレット接続機能
- カスタムメタデータと属性の管理
- 画像アップロード機能

## スマートコントラクトの詳細

`SoulboundToken`コントラクトは、OpenZeppelin の ERC721 実装を拡張し、以下の機能を追加しています：

- ミント後のトークン譲渡防止機能
- メタデータ用の URI 保存機能
- オーナーのみがミント可能な権限管理

## 開始方法

### 必要条件

- Node.js（最新の LTS バージョン）
- Foundry
- MetaMask または互換性のある Web3 ウォレット
- Pinata の API 認証情報

### 環境変数の設定

frontend ディレクトリに`.env`ファイルを作成し、以下を設定：

```
VITE_PINATA_JWT=your_pinata_jwt_token
```

コントラクトデプロイ用に、ルートディレクトリに`.env`ファイルを作成し、以下を設定：

```
PRIVATE_KEY=your_private_key
```

### インストール手順

1. スマートコントラクトの依存関係をインストール：

```bash
forge install
```

2. フロントエンドの依存関係をインストール：

```bash
cd frontend
npm install
```

### 開発環境の起動

1. フロントエンド開発サーバーの起動：

```bash
cd frontend
npm run dev
```

2. コントラクトのデプロイ（Sepolia テストネット）：

```bash
forge script script/DeploySoulboundToken.s.sol --rpc-url sepolia --broadcast
```

## 使用方法

1. Web3 ウォレットを接続
2. SBT 用の画像をアップロード
3. トークンのメタデータを入力：
   - 名前
   - 説明
   - カスタム属性
4. 「Mint SBT」をクリックして Soulbound トークンを作成

## セキュリティ考慮事項

- コントラクトに譲渡制限を実装
- トークンのミントはコントラクトオーナーのみが可能
- メタデータは IPFS 上に永続的に保存
- フロントエンドにウォレット接続の検証機能を実装
