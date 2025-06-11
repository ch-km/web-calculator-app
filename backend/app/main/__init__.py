from flask import Blueprint

# 'main'という名前のBlueprintを作成
bp = Blueprint('main', __name__)

# このBlueprintに属するルート定義ファイルをインポート
# このファイルの下部でインポートするのが循環参照を避けるためのコツ
from . import routes

