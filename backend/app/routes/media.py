from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import Report, Media
from app.utils.file_utils import save_file, delete_file

media_bp = Blueprint('media', __name__)


@media_bp.route('/<report_id>/media', methods=['POST'])
@jwt_required()
def upload_media(report_id):
    """
    Upload media (images/videos) to a report
    ---
    Form Data:
    - file: The media file to upload
    - media_type: 'image' or 'video'
    """
    try:
        # Get report
        report = Report.query.get(report_id)
        
        if not report:
            return jsonify({'error': 'Report not found'}), 404
        
        # Check ownership
        user_id = get_jwt_identity()
        if report.user_id != user_id:
            return jsonify({'error': 'You can only upload media to your own reports'}), 403
        
        # Check if file is present
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        media_type = request.form.get('media_type', 'image')
        
        if media_type not in ['image', 'video']:
            return jsonify({'error': 'Invalid media type. Must be "image" or "video"'}), 400
        
        # Save file
        file_info = save_file(file, media_type)
        
        # Create media record
        media = Media(
            filename=file_info['filename'],
            file_path=file_info['file_path'],
            media_type=media_type,
            file_size=file_info['file_size'],
            mime_type=file_info['mime_type'],
            report_id=report_id
        )
        
        db.session.add(media)
        db.session.commit()
        
        return jsonify({
            'message': 'Media uploaded successfully',
            'media': media.to_dict()
        }), 201
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to upload media', 'message': str(e)}), 500


@media_bp.route('/<report_id>/media/<media_id>', methods=['DELETE'])
@jwt_required()
def delete_media(report_id, media_id):
    """Delete media from a report"""
    try:
        # Get media
        media = Media.query.get(media_id)
        
        if not media or media.report_id != report_id:
            return jsonify({'error': 'Media not found'}), 404
        
        # Check ownership
        user_id = get_jwt_identity()
        if media.report.user_id != user_id:
            return jsonify({'error': 'You can only delete media from your own reports'}), 403
        
        # Delete file from filesystem
        delete_file(media.file_path)
        
        # Delete database record
        db.session.delete(media)
        db.session.commit()
        
        return jsonify({'message': 'Media deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to delete media', 'message': str(e)}), 500