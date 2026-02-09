from marshmallow import Schema, fields, validate, validates_schema, ValidationError
from app.models.report import ReportStatus, IncidentType


class CreateReportSchema(Schema):
    """Schema for creating a report"""
    title = fields.Str(required=True, validate=validate.Length(min=5, max=200))
    description = fields.Str(required=True, validate=validate.Length(min=20))
    incident_type = fields.Str(required=True, validate=validate.OneOf(IncidentType.all()))
    latitude = fields.Float(required=True, validate=validate.Range(min=-90, max=90))
    longitude = fields.Float(required=True, validate=validate.Range(min=-180, max=180))
    address = fields.Str(required=False, allow_none=True, validate=validate.Length(max=255))


class UpdateReportSchema(Schema):
    """Schema for updating a report"""
    title = fields.Str(required=False, validate=validate.Length(min=5, max=200))
    description = fields.Str(required=False, validate=validate.Length(min=20))
    incident_type = fields.Str(required=False, validate=validate.OneOf(IncidentType.all()))
    latitude = fields.Float(required=False, validate=validate.Range(min=-90, max=90))
    longitude = fields.Float(required=False, validate=validate.Range(min=-180, max=180))
    address = fields.Str(required=False, allow_none=True, validate=validate.Length(max=255))


class UpdateStatusSchema(Schema):
    """Schema for updating report status (admin only)"""
    status = fields.Str(required=True, validate=validate.OneOf(ReportStatus.all()))
    comment = fields.Str(required=False, allow_none=True, validate=validate.Length(max=500))


class ReportQuerySchema(Schema):
    """Schema for querying reports"""
    status = fields.Str(required=False, validate=validate.OneOf(ReportStatus.all()))
    incident_type = fields.Str(required=False, validate=validate.OneOf(IncidentType.all()))
    page = fields.Int(required=False, validate=validate.Range(min=1), missing=1)
    per_page = fields.Int(required=False, validate=validate.Range(min=1, max=100), missing=20)
    user_id = fields.Str(required=False)