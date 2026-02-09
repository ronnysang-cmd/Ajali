"""
Admin Seed Script
Creates a default admin account for the AJALI system
"""
from app import create_app, db
from app.models import User

def seed_admin():
    """Create default admin account"""
    app = create_app()
    
    with app.app_context():
        # Check if admin already exists by email or username
        admin = User.query.filter(
            (User.email == 'admin@ajali.co.ke') | (User.username == 'admin')
        ).first()
        
        if admin:
            print("⚠️  Admin account already exists!")
            print(f"   Email: {admin.email}")
            print(f"   Username: {admin.username}")
            print(f"   Role: {admin.role}")
            print("\n🔄 Resetting password and role to admin...")
            admin.set_password('Admin123')
            admin.role = 'admin'
            db.session.commit()
            print("✅ Password and role updated successfully!")
            print(f"\n📝 Login with:")
            print(f"   Email: {admin.email}")
            print(f"   Password: Admin123")
            return
        
        # Create admin user
        admin = User(
            email='admin@ajali.co.ke',
            username='admin',
            full_name='System Administrator',
            phone_number='+254700000000',
            role='admin',
            is_active=True
        )
        admin.set_password('Admin123')
        
        db.session.add(admin)
        db.session.commit()
        
        print("✅ Admin account created successfully!")
        print(f"   Email: admin@ajali.co.ke")
        print(f"   Password: Admin123")
        print(f"   Role: admin")
        print("\n⚠️  IMPORTANT: Change the password after first login!")

if __name__ == '__main__':
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == '--reset':
        print("🔄 Resetting admin password...")
    seed_admin()
