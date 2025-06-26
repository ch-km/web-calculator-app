from flask import jsonify, request
from . import bp # 同じディレクトリの__init__.pyで定義したBlueprintインスタンスをインポート
from app import db # __init__.pyで定義したdbインスタンスをインポート
from app.models import Calculation # Calculationモデルをインポート
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


# --- PBI-08 & PBI-09: 計算APIエンドポイント実装 (履歴保存機能追加) ---
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
        calculated_result = eval(expression)

        # --- PBI-09: 計算履歴保存ロジックの追加 ---
        # Calculateonモデルのインスタンス作成
        new_calculation = Calculation(
            expression = expression,
            result = calculated_result
            # created_at と updated_at はモデル定義で server_default=func.now() や onupdate=func.now() で自動的に設定される
        )

        # データベースセッションにオブジェクトを追加
        db.session.add(new_calculation)

        # 変更をコミットしてデータベースに永続化する
        db.session.commit()

        # --- PBI-09 ロジックここまで ---

        return jsonify({"result": calculated_result}), 200
    
    except (SyntaxError, TypeError, NameError, ZeroDivisionError) as e:
        # 計算エラーのハンドリング
        # 計算エラー時もDBセッションをロールバック (念のため、これまでのセッション操作をクリア)
        db.session.rollback()
        return jsonify({"error":f"Calculation error: {str(e)}"}), 400
    
    except Exception as e:
        # その他の予期せぬエラー
        # 計算エラー時もDBセッションをロールバック
        db.session.rollback()
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500


# --- PBI-10: 計算履歴取得APIエンドポイント実装 ---
@bp.route('/api/history', methods=['GET'])
def get_histry():
    try:
        all_calculation = Calculation.query.all()

        all_calculation.sort(key=lambda x: x.created_at, reverse=True)

        history_data = []
        for calc in all_calculation:
            history_data.append({
                "id": calc.id,
                "expression": calc.expression,
                "result": calc.result,
                "created_at": calc.created_at.isoformat()
            })
        
        return jsonify(history_data), 200
    
    except Exception as e:
        # エラーハンドリング
        print(f"Error fetching history: {e}") # サーバーログに出力
        return jsonify({"error": f"Failed to retrieve history: {str(e)}"}), 500
