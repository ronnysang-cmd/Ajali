from marshmallow import Schema, fields, validate


class RegisterSchema(Schema):
    """Schema for user registration"""
    email = fields.Email(required=True)
    username = fields.Str(required=True, validate=validate.Length(min=3, max=80))
    password = fields.Str(required=True, validate=validate.Length(min=8))
    full_name = fields.Str(required=True, validate=validate.Length(min=2, max=120))
    phone_number = fields.Str(required=False, allow_none=True)


class LoginSchema(Schema):
    """Schema for user login"""
    email = fields.Email(required=True)
    password = fields.Str(required=True)