from flask import jsonify
from . import bp # 同じディレクトリの__init__.pyで定義したBlueprintインスタンスをインポート

@bp.route('/ping', methods=['GET'])
def ping_pong():
    return jsonify(message="pong!")
