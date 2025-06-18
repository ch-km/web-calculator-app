from flask import jsonify, request
from . import bp # 同じディレクトリの__init__.pyで定義したBlueprintインスタンスをインポート
from app import db # __init__.pyで定義したdbインスタンスをインポート
from sqlalchemy import text # 文字列を安全なSQLとして扱うためにインポート
from flask_cors import CORS

# CORSはアプリ全体で設定することが多いですが、ここではBlueprintに対して設定する例を示します
# このBlueprintのエンドポイントに対してCORSを有効化
CORS(bp)

@bp.route('/ping', methods=['GET'])
def ping_pong():
    return jsonify(message="pong!")


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


# --- PBI-08: 計算APIエンドポイント実装 ---
@bp.route('/api/calculate', methods=['POST'])
def calculate():
    # リクエストボディがJSON形式であることを確認
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400
    
    # JSONデータから 'expression' を取得
    data = request.get_json()
    expression = data.get('expression')

    # 'expression' が存在するか確認
    if not expression:
        return jsonify({"error": "Missing 'expression' in request"}), 400
    
    try:
        result = eval(expression)
        return jsonify({"result": result}), 200
    
    except (SyntaxError, TypeError, NameError, ZeroDivisionError) as e:
        # 計算エラーのハンドリング
        return jsonify({"error":f"Calculation error: {str(e)}"}), 400
    
    except Exception as e:
        # その他の予期せぬエラー
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500