from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity
from marshmallow import ValidationError
from app import db
from app.models import Report, User
from app.schemas.report_schema import CreateReportSchema, UpdateReportSchema, ReportQuerySchema
from app.middleware.auth import login_required, get_current_user

reports_bp = Blueprint('reports', __name__)


@reports_bp.route('', methods=['GET'])
def get_reports():
    """
    Get all reports with optional filtering
    Query Parameters: ?status=pending&incident_type=accident&page=1&per_page=20
    """
    try:
        # Validate query parameters
        schema = ReportQuerySchema()
        params = schema.load(request.args)
        
        # Build query
        query = Report.query
        
        if params.get('status'):
            query = query.filter_by(status=params['status'])
        
        if params.get('incident_type'):
            query = query.filter_by(incident_type=params['incident_type'])
        
        if params.get('user_id'):
            query = query.filter_by(user_id=params['user_id'])
        
        # Order by most recent
        query = query.order_by(Report.created_at.desc())
        
        # Paginate
        page = params.get('page', 1)
        per_page = params.get('per_page', 20)
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)
        
        return jsonify({
            'reports': [report.to_dict() for report in pagination.items],
            'pagination': {
                'page': pagination.page,
                'per_page': pagination.per_page,
                'total': pagination.total,
                'pages': pagination.pages,
                'has_next': pagination.has_next,
                'has_prev': pagination.has_prev
            }
        }), 200
        
    except ValidationError as err:
        return jsonify({'error': 'Validation error', 'messages': err.messages}), 400
    except Exception as e:
        return jsonify({'error': 'Failed to fetch reports', 'message': str(e)}), 500


@reports_bp.route('/<report_id>', methods=['GET'])
def get_report(report_id):
    """Get a single report by ID"""
    try:
        report = Report.query.get(report_id)
        
        if not report:
            return jsonify({'error': 'Report not found'}), 404
        
        return jsonify({'report': report.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch report', 'message': str(e)}), 500


@reports_bp.route('', methods=['POST'])
@login_required
def create_report():
    """
    Create a new incident report
    ---
    Request Body:
    {
        "title": "Multi-vehicle collision on Uhuru Highway",
        "description": "A major accident involving three vehicles...",
        "incident_type": "accident",
        "latitude": -1.3031,
        "longitude": 36.8254,
        "address": "Uhuru Highway, Nairobi"
    }
    """
    try:
        # Validate request data
        schema = CreateReportSchema()
        data = schema.load(request.get_json())
        
        # Get current user
        user_id = get_jwt_identity()
        
        # Create report
        report = Report(
            title=data['title'],
            description=data['description'],
            incident_type=data['incident_type'],
            latitude=data['latitude'],
            longitude=data['longitude'],
            address=data.get('address'),
            user_id=user_id
        )
        
        db.session.add(report)
        db.session.commit()
        
        return jsonify({
            'message': 'Report created successfully',
            'report': report.to_dict()
        }), 201
        
    except ValidationError as err:
        return jsonify({'error': 'Validation error', 'messages': err.messages}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to create report', 'message': str(e)}), 500


@reports_bp.route('/<report_id>', methods=['PUT'])
@login_required
def update_report(report_id):
    """Update an existing report (by owner or admin)"""
    try:
        # Validate request data
        schema = UpdateReportSchema()
        data = schema.load(request.get_json())
        
        # Get report
        report = Report.query.get(report_id)
        
        if not report:
            return jsonify({'error': 'Report not found'}), 404
        
        # Check ownership or admin
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if report.user_id != user_id and not user.is_admin():
            return jsonify({'error': 'You can only edit your own reports'}), 403
        
        # Update fields
        for key, value in data.items():
            if hasattr(report, key):
                setattr(report, key, value)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Report updated successfully',
            'report': report.to_dict()
        }), 200
        
    except ValidationError as err:
        return jsonify({'error': 'Validation error', 'messages': err.messages}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update report', 'message': str(e)}), 500


@reports_bp.route('/stats/<user_id>', methods=['GET'])
@login_required
def get_user_stats(user_id):
    """Get user report statistics"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        # Users can only view their own stats, admins can view any stats
        if user_id != current_user_id and not user.is_admin():
            return jsonify({'error': 'Access denied'}), 403
        
        # Get report counts by status
        total = Report.query.filter_by(user_id=user_id).count()
        pending = Report.query.filter_by(user_id=user_id, status='pending').count()
        resolved = Report.query.filter_by(user_id=user_id, status='resolved').count()
        rejected = Report.query.filter_by(user_id=user_id, status='rejected').count()
        
        return jsonify({
            'total': total,
            'pending': pending,
            'resolved': resolved,
            'rejected': rejected
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch stats', 'message': str(e)}), 500


@reports_bp.route('/<report_id>', methods=['DELETE'])
@login_required
def delete_report(report_id):
    """Delete a report (only by owner)"""
    try:
        # Get report
        report = Report.query.get(report_id)
        
        if not report:
            return jsonify({'error': 'Report not found'}), 404
        
        # Check ownership
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if report.user_id != user_id and not user.is_admin():
            return jsonify({'error': 'You can only delete your own reports'}), 403
        
        # Delete associated media files
        from app.utils.file_utils import delete_file
        for media in report.media.all():
            delete_file(media.file_path)
        
        db.session.delete(report)
        db.session.commit()
        
        return jsonify({'message': 'Report deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to delete report', 'message': str(e)}), 500