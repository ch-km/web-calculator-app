# 1. ベースとなる公式のPythonイメージを指定
FROM mcr.microsoft.com/devcontainers/python:1-3.12-bullseye

# 2. コンテナ内の作業ディレクトリを設定
WORKDIR /workspaces/web-calculator-app

# 3. 必要なライブラリをインストールするためのファイルをコピー
COPY requirements.txt .

# 4. requirements.txt に基づいてライブラリをインストール
RUN pip install --no-cache-dir -r requirements.txt

# 5. プロジェクトのソースコードをコンテナにコピー
COPY . .

# 6. 【追加】最終的なワーキングディレクトリを backend に設定
WORKDIR /workspaces/web-calculator-app/backend