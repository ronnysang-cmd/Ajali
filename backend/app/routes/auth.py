from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from marshmallow import ValidationError
from app import db
from app.models import User
from app.schemas.auth_schema import RegisterSchema, LoginSchema

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/register', methods=['POST'])
def register():
    """
    Register a new user
    ---
    Request Body:
    {
        "email": "user@example.com",
        "username": "johndoe",
        "password": "SecurePass123",
        "full_name": "John Doe",
        "phone_number": "+254712345678"
    }
    """
    try:
        # Validate request data
        schema = RegisterSchema()
        data = schema.load(request.get_json())
        
        # Check if user already exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already registered'}), 409
        
        if User.query.filter_by(username=data['username']).first():
            return jsonify({'error': 'Username already taken'}), 409
        
        # Create new user
        user = User(
            email=data['email'],
            username=data['username'],
            full_name=data['full_name'],
            phone_number=data.get('phone_number'),
            role='user'
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        # Generate access token
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'message': 'User registered successfully',
            'access_token': access_token,
            'user_id': user.id,
            'role': user.role,
            'user': user.to_dict(include_email=True)
        }), 201
        
    except ValidationError as err:
        return jsonify({'error': 'Validation error', 'messages': err.messages}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Registration failed', 'message': str(e)}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    """
    Login user
    ---
    Request Body:
    {
        "email": "user@example.com",
        "password": "SecurePass123"
    }
    """
    try:
        # Validate request data
        schema = LoginSchema()
        data = schema.load(request.get_json())
        
        # Find user
        user = User.query.filter_by(email=data['email']).first()
        
        if not user or not user.check_password(data['password']):
            return jsonify({'error': 'Invalid email or password'}), 401
        
        if not user.is_active:
            return jsonify({'error': 'Account is deactivated'}), 403
        
        # Generate access token
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'message': 'Login successful',
            'access_token': access_token,
            'user_id': user.id,
            'role': user.role,
            'user': user.to_dict(include_email=True)
        }), 200
        
    except ValidationError as err:
        return jsonify({'error': 'Validation error', 'messages': err.messages}), 400
    except Exception as e:
        return jsonify({'error': 'Login failed', 'message': str(e)}), 500