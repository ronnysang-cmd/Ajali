import os
import uuid
from werkzeug.utils import secure_filename
from flask import current_app


def allowed_file(filename, file_type='image'):
    """Check if file extension is allowed"""
    if '.' not in filename:
        return False
    
    ext = filename.rsplit('.', 1)[1].lower()
    
    if file_type == 'image':
        return ext in current_app.config['ALLOWED_IMAGE_EXTENSIONS']
    elif file_type == 'video':
        return ext in current_app.config['ALLOWED_VIDEO_EXTENSIONS']
    
    return False


def save_file(file, file_type='image'):
    """Save uploaded file and return file info"""
    if not file or file.filename == '':
        raise ValueError('No file provided')
    
    if not allowed_file(file.filename, file_type):
        raise ValueError(f'File type not allowed. Allowed types: {current_app.config[f"ALLOWED_{file_type.upper()}_EXTENSIONS"]}')
    
    # Generate unique filename
    ext = file.filename.rsplit('.', 1)[1].lower()
    unique_filename = f"{uuid.uuid4()}.{ext}"
    
    # Determine save path
    subfolder = 'images' if file_type == 'image' else 'videos'
    upload_folder = os.path.join(current_app.config['UPLOAD_FOLDER'], subfolder)
    file_path = os.path.join(upload_folder, unique_filename)
    
    # Save file
    file.save(file_path)
    
    # Get file size
    file_size = os.path.getsize(file_path)
    
    return {
        'filename': secure_filename(file.filename),
        'unique_filename': unique_filename,
        'file_path': file_path,
        'file_size': file_size,
        'mime_type': file.content_type
    }


def delete_file(file_path):
    """Delete file from filesystem"""
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
            return True
    except Exception as e:
        current_app.logger.error(f"Error deleting file {file_path}: {str(e)}")
    return False