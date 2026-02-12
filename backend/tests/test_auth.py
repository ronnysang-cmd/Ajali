import pytest


def test_register_success(client):
    """Test successful user registration"""
    response = client.post('/api/auth/register', json={
        'email': 'newuser@example.com',
        'username': 'newuser',
        'password': 'SecurePass123',
        'full_name': 'New User',
        'phone_number': '+254712345678'
    })
    
    assert response.status_code == 201
    assert 'access_token' in response.json
    assert response.json['user']['email'] == 'newuser@example.com'


def test_register_duplicate_email(client, test_user):
    """Test registration with duplicate email"""
    response = client.post('/api/auth/register', json={
        'email': 'test@example.com',
        'username': 'anotheruser',
        'password': 'SecurePass123',
        'full_name': 'Another User'
    })
    
    assert response.status_code == 409
    assert 'Email already registered' in response.json['error']


def test_register_weak_password(client):
    """Test registration with weak password"""
    response = client.post('/api/auth/register', json={
        'email': 'weak@example.com',
        'username': 'weakuser',
        'password': 'weak',
        'full_name': 'Weak User'
    })
    
    assert response.status_code == 400


def test_login_success(client, test_user):
    """Test successful login"""
    response = client.post('/api/auth/login', json={
        'email': 'test@example.com',
        'password': 'TestPass123'
    })
    
    assert response.status_code == 200
    assert 'access_token' in response.json
    assert response.json['user']['email'] == 'test@example.com'


def test_login_invalid_credentials(client, test_user):
    """Test login with invalid credentials"""
    response = client.post('/api/auth/login', json={
        'email': 'test@example.com',
        'password': 'WrongPassword'
    })
    
    assert response.status_code == 401
    assert 'Invalid email or password' in response.json['error']


def test_login_nonexistent_user(client):
    """Test login with nonexistent user"""
    response = client.post('/api/auth/login', json={
        'email': 'nonexistent@example.com',
        'password': 'SomePassword123'
    })
    
    assert response.status_code == 401