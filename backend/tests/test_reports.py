import pytest


def test_create_report_success(client, auth_headers):
    """Test successful report creation"""
    response = client.post('/api/reports', 
        headers=auth_headers,
        json={
            'title': 'Test Accident Report',
            'description': 'This is a detailed description of the test accident that occurred.',
            'incident_type': 'accident',
            'latitude': -1.3031,
            'longitude': 36.8254,
            'address': 'Uhuru Highway, Nairobi'
        }
    )
    
    assert response.status_code == 201
    assert response.json['report']['title'] == 'Test Accident Report'
    assert response.json['report']['status'] == 'pending'


def test_create_report_unauthorized(client):
    """Test report creation without authentication"""
    response = client.post('/api/reports', json={
        'title': 'Test Report',
        'description': 'This is a test description that is long enough.',
        'incident_type': 'fire',
        'latitude': -1.3031,
        'longitude': 36.8254
    })
    
    assert response.status_code == 401


def test_create_report_invalid_data(client, auth_headers):
    """Test report creation with invalid data"""
    response = client.post('/api/reports',
        headers=auth_headers,
        json={
            'title': 'Short',  # Too short
            'description': 'Short desc',  # Too short
            'incident_type': 'invalid_type',
            'latitude': 200,  # Invalid
            'longitude': 36.8254
        }
    )
    
    assert response.status_code == 400


def test_get_reports(client):
    """Test getting all reports"""
    response = client.get('/api/reports')
    
    assert response.status_code == 200
    assert 'reports' in response.json
    assert 'pagination' in response.json


def test_get_single_report(client, auth_headers, db_session):
    """Test getting a single report"""
    # Create a report first
    create_response = client.post('/api/reports',
        headers=auth_headers,
        json={
            'title': 'Single Report Test',
            'description': 'This is a detailed description for testing single report retrieval.',
            'incident_type': 'medical',
            'latitude': -1.2921,
            'longitude': 36.8219
        }
    )
    
    report_id = create_response.json['report']['id']
    
    # Get the report
    response = client.get(f'/api/reports/{report_id}')
    
    assert response.status_code == 200
    assert response.json['report']['id'] == report_id


def test_update_own_report(client, auth_headers, db_session):
    """Test updating own report"""
    # Create a report
    create_response = client.post('/api/reports',
        headers=auth_headers,
        json={
            'title': 'Original Title',
            'description': 'This is the original description that needs to be updated.',
            'incident_type': 'crime',
            'latitude': -1.3031,
            'longitude': 36.8254
        }
    )
    
    report_id = create_response.json['report']['id']
    
    # Update the report
    response = client.put(f'/api/reports/{report_id}',
        headers=auth_headers,
        json={
            'title': 'Updated Title',
            'description': 'This is the updated description with more details.'
        }
    )
    
    assert response.status_code == 200
    assert response.json['report']['title'] == 'Updated Title'


def test_delete_own_report(client, auth_headers, db_session):
    """Test deleting own report"""
    # Create a report
    create_response = client.post('/api/reports',
        headers=auth_headers,
        json={
            'title': 'Report to Delete',
            'description': 'This report will be deleted as part of the test.',
            'incident_type': 'other',
            'latitude': -1.3031,
            'longitude': 36.8254
        }
    )
    
    report_id = create_response.json['report']['id']
    
    # Delete the report
    response = client.delete(f'/api/reports/{report_id}', headers=auth_headers)
    
    assert response.status_code == 200
    
    # Verify deletion
    get_response = client.get(f'/api/reports/{report_id}')
    assert get_response.status_code == 404