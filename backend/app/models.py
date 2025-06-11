from app import db # __init__.py で作成したdbインスタンスをインポート
from sqlalchemy.sql import func


class Calculation(db.Model):
    # Flask-Migrateが認識するテーブル名
    __tablename__ = 'calculations'

    id = db.Column(db.Integer, primary_key=True)
    expression = db.Column(db.String(255), nullable=False)
    result = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f'<Calculation {self.id}: {self.expression} = {self.result}>'

