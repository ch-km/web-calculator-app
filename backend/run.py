from app import create_app

# アプリケーションファクトリを呼び出して、appインスタンスを作成
app = create_app()

if __name__ == '__main__':
    # 開発サーバーを起動
    # hostとportは環境変数などから取得するのがより望ましいが、ここでは直接指定
    app.run(host='0.0.0.0', port=5001, debug=True)
