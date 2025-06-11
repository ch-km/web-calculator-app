from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from .config import Config

# SQLAlchemyとMigrateのインスタンスを作成
# この時点では、まだ特定のアプリケーションには紐付いていない
db = SQLAlchemy()
migrate = Migrate()


def create_app(config_class=Config):
    """
    アプリケーションファクトリ関数
    """
    # Flaskアプリケーションのインスタンスを作成
    app = Flask(__name__)

    # 設定ファイルを読み込む
    app.config.from_object(config_class)

    # 上で作成したインスタンスを、アプリケーションに紐付ける
    db.init_app(app)
    migrate.init_app(app, db)

    # --- Blueprintの登録 ---
    # ルート(APIエンドポイント)を登録するために、Blueprintをインポートしてappに登録します。
    # ここで、以前 app.py にあった @app.route('/ping') などを管理します。
    from .main.routes import bp as main_blueprint
    app.register_blueprint(main_blueprint)

    # 他のBlueprintがあればここに追加
    # from .api import bp as api_blueprint
    # app.register_blueprint(api_blueprint, url_prefix='/api')

    # Flask-Migrateがモデルを認識できるように、モデルをインポート
    # この場所でインポートすることが循環参照を避けるためのポイント
    from . import models

    return app

