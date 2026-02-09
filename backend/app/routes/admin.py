from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from app import db
from app.models import Report, StatusHistory
from app.schemas.report_schema import UpdateStatusSchema
from app.middleware.auth import admin_required, get_current_user

admin_bp = Blueprint('admin', __name__)


@admin_bp.route('/reports', methods=['GET'])
@admin_required
def get_all_reports():
    """Get all reports (Admin only)"""
    try:
        from app.schemas.report_schema import ReportQuerySchema
        
        # Validate query parameters
        schema = ReportQuerySchema()
        params = schema.load(request.args)
        
        # Build query
        query = Report.query
        
        if params.get('status'):
            query = query.filter_by(status=params['status'])
        
        if params.get('incident_type'):
            query = query.filter_by(incident_type=params['incident_type'])
        
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


@admin_bp.route('/reports/<report_id>/status', methods=['PATCH'])
@admin_required
def update_report_status(report_id):
    """
    Update report status (Admin only)
    ---
    Request Body:
    {
        "status": "under_investigation",
        "comment": "Investigation team has been dispatched"
    }
    """
    try:
        # Validate request data
        schema = UpdateStatusSchema()
        data = schema.load(request.get_json())
        
        # Get report
        report = Report.query.get(report_id)
        
        if not report:
            return jsonify({'error': 'Report not found'}), 404
        
        # Get current user (admin)
        current_user = get_current_user()
        
        # Store old status
        old_status = report.status
        
        # Update status
        report.status = data['status']
        
        # Create status history record
        status_history = StatusHistory(
            report_id=report_id,
            old_status=old_status,
            new_status=data['status'],
            comment=data.get('comment'),
            changed_by_id=current_user.id
        )
        
        db.session.add(status_history)
        db.session.commit()
        
        # TODO: Trigger notification service here
        # from app.services.notification_service import send_status_update_notification
        # send_status_update_notification(report, old_status, data['status'])
        
        return jsonify({
            'message': 'Report status updated successfully',
            'report': report.to_dict(),
            'status_change': status_history.to_dict()
        }), 200
        
    except ValidationError as err:
        return jsonify({'error': 'Validation error', 'messages': err.messages}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update status', 'message': str(e)}), 500


@admin_bp.route('/reports/<report_id>/history', methods=['GET'])
@admin_required
def get_status_history(report_id):
    """Get status change history for a report (Admin only)"""
    try:
        # Get report
        report = Report.query.get(report_id)
        
        if not report:
            return jsonify({'error': 'Report not found'}), 404
        
        # Get status history
        history = StatusHistory.query.filter_by(report_id=report_id).order_by(StatusHistory.changed_at.desc()).all()
        
        return jsonify({
            'report_id': report_id,
            'history': [h.to_dict() for h in history]
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch history', 'message': str(e)}), 500


@admin_bp.route('/stats', methods=['GET'])
@admin_required
def get_statistics():
    """Get platform statistics (Admin only)"""
    try:
        from sqlalchemy import func
        from app.models import User, ReportStatus, IncidentType
        
        # Count reports by status
        status_counts = db.session.query(
            Report.status,
            func.count(Report.id)
        ).group_by(Report.status).all()
        
        # Count reports by incident type
        type_counts = db.session.query(
            Report.incident_type,
            func.count(Report.id)
        ).group_by(Report.incident_type).all()
        
        # Total users
        total_users = User.query.count()
        
        # Total reports
        total_reports = Report.query.count()
        
        return jsonify({
            'statistics': {
                'total_users': total_users,
                'total_reports': total_reports,
                'reports_by_status': {status: count for status, count in status_counts},
                'reports_by_type': {itype: count for itype, count in type_counts}
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch statistics', 'message': str(e)}), 500