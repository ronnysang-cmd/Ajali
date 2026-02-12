import pytest
from app import create_app, db
from app.models import User, Report
from config import TestingConfig


@pytest.fixture(scope='session')
def app():
    """Create application for testing"""
    app = create_app('testing')
    
    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()


@pytest.fixture(scope='function')
def client(app):
    """Create test client"""
    return app.test_client()


@pytest.fixture(scope='function')
def db_session(app):
    """Create database session for testing"""
    with app.app_context():
        yield db.session
        db.session.rollback()


@pytest.fixture
def test_user(db_session):
    """Create a test user"""
    user = User(
        email='test@example.com',
        username='testuser',
        full_name='Test User',
        role='user'
    )
    user.set_password('TestPass123')
    db_session.add(user)
    db_session.commit()
    return user


@pytest.fixture
def test_admin(db_session):
    """Create a test admin user"""
    admin = User(
        email='admin@example.com',
        username='admin',
        full_name='Admin User',
        role='admin'
    )
    admin.set_password('AdminPass123')
    db_session.add(admin)
    db_session.commit()
    return admin


@pytest.fixture
def auth_headers(client, test_user):
    """Get authentication headers for test user"""
    response = client.post('/api/auth/login', json={
        'email': 'test@example.com',
        'password': 'TestPass123'
    })
    token = response.json['access_token']
    return {'Authorization': f'Bearer {token}'}


@pytest.fixture
def admin_headers(client, test_admin):
    """Get authentication headers for admin user"""
    response = client.post('/api/auth/login', json={
        'email': 'admin@example.com',
        'password': 'AdminPass123'
    })
    token = response.json['access_token']
    return {'Authorization': f'Bearer {token}'}