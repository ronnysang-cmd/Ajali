import os
from app import create_app, db
from app.models import User, Report, Media, StatusHistory

app = create_app()


@app.shell_context_processor
def make_shell_context():
    """Make database models available in Flask shell"""
    return {
        'db': db,
        'User': User,
        'Report': Report,
        'Media': Media,
        'StatusHistory': StatusHistory
    }


@app.cli.command()
def create_admin():
    """Create an admin user"""
    email = input("Enter admin email: ")
    username = input("Enter admin username: ")
    password = input("Enter admin password: ")
    full_name = input("Enter admin full name: ")
    
    # Check if user exists
    if User.query.filter_by(email=email).first():
        print("Error: Email already exists")
        return
    
    if User.query.filter_by(username=username).first():
        print("Error: Username already exists")
        return
    
    # Create admin user
    admin = User(
        email=email,
        username=username,
        full_name=full_name,
        role='admin'
    )
    admin.set_password(password)
    
    db.session.add(admin)
    db.session.commit()
    
    print(f"Admin user '{username}' created successfully!")


@app.cli.command()
def init_db():
    """Initialize the database"""
    db.create_all()
    print("Database initialized successfully!")


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)