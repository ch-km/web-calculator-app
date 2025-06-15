from flask import jsonify
from . import bp # 同じディレクトリの__init__.pyで定義したBlueprintインスタンスをインポート
from app import db # __init__.pyで定義したdbインスタンスをインポート
from sqlalchemy import text # 文字列を安全なSQLとして扱うためにインポート

@bp.route('/ping', methods=['GET'])
def ping_pong():
    return jsonify(message="pong!")

# --- ここからが新しいコード ---
@bp.route('/health', methods=['GET'])
def health_check():
    """
    アプリケーションとデータベースの健康状態を確認するエンドポイント
    """
    try:
        # データベースに最も負荷の少ない、簡単なクエリを試行する
        # text()で囲むことで、SQLAlchemyが安全なSQLとして認識してくれる
        db.session.execute(text('SELECT 1'))
        db_status="ok"
    except Exception as e:
        # 何らかの理由でDB接続に失敗した場合
        db_status = f"error: {str(e)}"

    # アプリ自体のステータスと、DBのステータスをJSONで返す
    response = {
        "app_status": "ok",
        "database_status": db_status
    }

    # db_statusが "ok" でない場合は、HTTPステータスコード 503 (Service Unavailable) を返すのが一般的
    status_code = 200 if db_status == "ok" else 503

    return jsonify(response), status_code