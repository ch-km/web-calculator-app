import os
from dotenv import load_dotenv

# .envファイルを読み込む (もしあれば)
basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(basedir, '.env'))

class Config:
    """
    アプリケーションの設定を管理するクラス
    """
    # セキュリティのために必須
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'you-will-never-guess'

    # データベース設定
    DB_USER = os.environ.get('POSTGRES_USER')
    DB_PASSWORD = os.environ.get('POSTGRES_PASSWORD')
    DB_HOST = os.environ.get('POSTGRES_HOST')
    DB_PORT = os.environ.get('POSTGRES_PORT')
    DB_NAME = os.environ.get('POSTGRES_DB')

    # SQLAlchemyが使用するデータベース接続URIを構築
    SQLALCHEMY_DATABASE_URI = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

    # SQLAlchemyのイベントシステムを無効化し、オーバーヘッドを削減（推奨）
    SQLALCHEMY_TRACK_MODIFICATIONS = False
