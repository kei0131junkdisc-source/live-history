# LiveLog - ライブ参戦記録アプリ

ライブ・コンサート参戦履歴を記録・管理するPWAアプリです。
データはすべてあなたのデバイス内（IndexedDB）に保存されます。

---

## 📁 ファイル構成

```
live-log-pwa/
├── index.html      ← アプリ本体（全機能内蔵）
├── manifest.json   ← PWAマニフェスト（ホーム画面追加用）
├── sw.js           ← Service Worker（オフライン対応）
├── icon-192.png    ← アプリアイコン
├── icon-512.png    ← アプリアイコン（大）
└── README.md       ← このファイル
```

---

## 🚀 セットアップ手順（iPhone で使う）

### 方法A: ローカルサーバーを立てる（推奨）

**PCが必要です。**

1. このフォルダを好きな場所に置く
2. Python がある場合:
   ```bash
   cd live-log-pwa
   python3 -m http.server 8080
   ```
3. PCとiPhoneを同じWi-Fiにつなぐ
4. iPhoneのSafariで `http://[PCのIPアドレス]:8080` を開く
   - PCのIPは `ifconfig` (Mac) や `ipconfig` (Windows) で確認
5. Safariの共有ボタン(□↑) → 「ホーム画面に追加」

### 方法B: GitHub Pages（無料ホスティング）

1. [github.com](https://github.com) でアカウント作成（無料）
2. 新しいリポジトリを作成（Private推奨）
3. このフォルダのファイルをアップロード
4. Settings → Pages → Branch: main → Save
5. 発行されたURL (`https://[username].github.io/[repo]/`) をiPhoneで開く
6. Safari → 共有 → ホーム画面に追加

### 方法C: VS Code + Live Server

1. VS Code に「Live Server」拡張機能をインストール
2. フォルダを開いて `index.html` を右クリック → 「Open with Live Server」
3. iPhoneから同じWi-Fi経由でアクセス

---

## 📱 使い方

### ライブを記録する
1. 右下の **＋ボタン** をタップ
2. 📷 カメラで会場の看板・パネルを撮影（またはカメラロールから選択）
3. **OCRが自動実行**されてイベント名・日付・会場名を自動入力
4. 内容を確認・修正して「保存する」

### 一覧を見る
- 下タブ「一覧」から全記録を新しい順に表示
- 上部の検索バーでイベント名・会場・アーティストを検索
- タグチップで絞り込み

### 年別タイムラインを見る
- 下タブ「年別」で年・月ごとの参戦記録を時系列表示
- 「2026年 12公演」など合計件数も表示

### バックアップ
- 「設定」タブ → 「JSONエクスポート」でファイル保存
- 「JSONインポート」で復元

---

## 🔍 OCR機能について

- **Tesseract.js** を使用（完全ローカル処理・外部送信なし）
- 日本語・英語に対応
- 初回使用時はTesseract.jsのダウンロードが必要（数MB）
- 認識精度は画像の品質・フォントに依存
- 誤認識は手動で修正できます

**OCR精度を上げるコツ:**
- 明るい場所で撮影
- 看板に対して正面から撮影
- 文字が大きく写るようにズーム

---

## 🔧 技術仕様

| 項目 | 技術 |
|------|------|
| フロントエンド | HTML / CSS / Vanilla JS |
| データ保存 | IndexedDB |
| 画像保存 | IndexedDB (Base64) |
| OCR | Tesseract.js 5.x |
| オフライン | Service Worker |
| ホーム画面追加 | Web App Manifest |

---

## 🗺 将来の拡張（Next.js版で対応予定）

- [ ] 年間参戦回数グラフ
- [ ] アーティスト別統計
- [ ] 会場別回数
- [ ] セットリストURL保存
- [ ] チケット画像保存
- [ ] 「今年の参戦まとめ」シェア機能
- [ ] iCloud Drive同期

---

## ⚠️ 注意事項

- データはブラウザのIndexedDBに保存されます
- iPhoneのSafariで「サイトデータを削除」するとデータが消えます
- **定期的にJSONエクスポートでバックアップを取ることを推奨します**
