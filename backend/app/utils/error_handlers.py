from flask import jsonify
from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError
from werkzeug.exceptions import HTTPException


def register_error_handlers(app):
    """Register error handlers for the application"""
    
    @app.errorhandler(ValidationError)
    def handle_validation_error(error):
        """Handle marshmallow validation errors"""
        return jsonify({
            'error': 'Validation error',
            'messages': error.messages
        }), 400
    
    @app.errorhandler(IntegrityError)
    def handle_integrity_error(error):
        """Handle database integrity errors"""
        return jsonify({
            'error': 'Database integrity error',
            'message': 'A record with this information already exists'
        }), 409
    
    @app.errorhandler(404)
    def handle_not_found(error):
        """Handle 404 errors"""
        return jsonify({
            'error': 'Not found',
            'message': 'The requested resource was not found'
        }), 404
    
    @app.errorhandler(403)
    def handle_forbidden(error):
        """Handle 403 errors"""
        return jsonify({
            'error': 'Forbidden',
            'message': 'You do not have permission to access this resource'
        }), 403
    
    @app.errorhandler(401)
    def handle_unauthorized(error):
        """Handle 401 errors"""
        return jsonify({
            'error': 'Unauthorized',
            'message': 'Authentication required'
        }), 401
    
    @app.errorhandler(500)
    def handle_internal_error(error):
        """Handle 500 errors"""
        app.logger.error(f'Internal server error: {str(error)}')
        return jsonify({
            'error': 'Internal server error',
            'message': 'An unexpected error occurred'
        }), 500
    
    @app.errorhandler(HTTPException)
    def handle_http_exception(error):
        """Handle all HTTP exceptions"""
        return jsonify({
            'error': error.name,
            'message': error.description
        }), error.code