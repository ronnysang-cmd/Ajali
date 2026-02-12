import uuid
from datetime import datetime
from app import db


class Media(db.Model):
    """Media files attached to reports"""
    
    __tablename__ = 'media'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    filename = db.Column(db.String(255), nullable=False)
    file_path = db.Column(db.String(500), nullable=False)
    media_type = db.Column(db.String(20), nullable=False)  # 'image' or 'video'
    file_size = db.Column(db.Integer, nullable=False)  # in bytes
    mime_type = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    
    # Foreign Keys
    report_id = db.Column(db.String(36), db.ForeignKey('reports.id'), nullable=False, index=True)
    
    def __repr__(self):
        return f'<Media {self.id}: {self.filename}>'
    
    def to_dict(self):
        """Convert media to dictionary"""
        return {
            'id': self.id,
            'filename': self.filename,
            'file_path': self.file_path,
            'media_type': self.media_type,
            'file_size': self.file_size,
            'mime_type': self.mime_type,
            'created_at': self.created_at.isoformat()
        }