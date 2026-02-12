import uuid
from datetime import datetime
from app import db


class StatusHistory(db.Model):
    """Track status changes for reports"""
    
    __tablename__ = 'status_history'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    old_status = db.Column(db.String(50), nullable=True)
    new_status = db.Column(db.String(50), nullable=False)
    comment = db.Column(db.Text, nullable=True)
    changed_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    
    # Foreign Keys
    report_id = db.Column(db.String(36), db.ForeignKey('reports.id'), nullable=False, index=True)
    changed_by_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    
    # Relationships
    changed_by = db.relationship('User', backref='status_changes')
    
    def __repr__(self):
        return f'<StatusHistory {self.id}: {self.old_status} -> {self.new_status}>'
    
    def to_dict(self):
        """Convert status history to dictionary"""
        return {
            'id': self.id,
            'old_status': self.old_status,
            'new_status': self.new_status,
            'comment': self.comment,
            'changed_at': self.changed_at.isoformat(),
            'changed_by': self.changed_by.to_dict() if self.changed_by else None
        }