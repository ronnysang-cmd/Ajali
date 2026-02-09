import uuid
from datetime import datetime
from app import db


class ReportStatus:
    """Report status constants"""
    PENDING = 'pending'
    UNDER_INVESTIGATION = 'under_investigation'
    RESOLVED = 'resolved'
    REJECTED = 'rejected'
    
    @classmethod
    def all(cls):
        return [cls.PENDING, cls.UNDER_INVESTIGATION, cls.RESOLVED, cls.REJECTED]


class IncidentType:
    """Incident type constants"""
    ACCIDENT = 'accident'
    FIRE = 'fire'
    MEDICAL = 'medical'
    CRIME = 'crime'
    NATURAL_DISASTER = 'natural_disaster'
    OTHER = 'other'
    
    @classmethod
    def all(cls):
        return [cls.ACCIDENT, cls.FIRE, cls.MEDICAL, cls.CRIME, cls.NATURAL_DISASTER, cls.OTHER]


class Report(db.Model):
    """Incident report model"""
    
    __tablename__ = 'reports'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    incident_type = db.Column(db.String(50), nullable=False)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    address = db.Column(db.String(255), nullable=True)
    status = db.Column(db.String(50), nullable=False, default=ReportStatus.PENDING, index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False, index=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Foreign Keys
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False, index=True)
    
    # Relationships
    media = db.relationship('Media', backref='report', lazy='dynamic', cascade='all, delete-orphan')
    status_history = db.relationship('StatusHistory', backref='report', lazy='dynamic', cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<Report {self.id}: {self.title}>'
    
    def to_dict(self, include_media=True, include_user=True):
        """Convert report to dictionary"""
        data = {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'incident_type': self.incident_type,
            'location': {
                'latitude': self.latitude,
                'longitude': self.longitude,
                'address': self.address
            },
            'status': self.status,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
        
        if include_user and self.reporter:
            data['user'] = self.reporter.to_dict()
        
        if include_media:
            data['media'] = {
                'images': [m.to_dict() for m in self.media.filter_by(media_type='image').all()],
                'videos': [m.to_dict() for m in self.media.filter_by(media_type='video').all()]
            }
        
        return data