# backend/app.py
from flask import Flask

# Flaskアプリケーションのインスタンスを作成
app = Flask(__name__)

# メインの実行ブロック
if __name__ == '__main__':
    # 開発サーバーを起動
    # host='0.0.0.0' はコンテナ外からのアクセスを許可するために指定
    # port=5001 はFlaskアプリがリッスンするポート番号 (他のサービスと衝突しないように注意)
    # debug=True は開発モードを有効にし、コード変更時に自動リロードしたり、詳細なエラー情報を表示したりする
    app.run(host='0.0.0.0', port=5001, debug=True)
