"""
Notification Service - Placeholder for future implementation

This service will handle:
1. Email notifications
2. SMS notifications
3. Push notifications

When a report status changes, notifications will be sent to:
- Report owner
- Relevant authorities
"""

from flask import current_app


class NotificationService:
    """Service for sending notifications"""
    
    @staticmethod
    def send_status_update_notification(report, old_status, new_status):
        """
        Send notification when report status changes
        
        Args:
            report: Report object
            old_status: Previous status
            new_status: New status
        
        Future Implementation:
        - Send email to report owner
        - Send SMS to report owner
        - Send push notification
        """
        current_app.logger.info(
            f"[NOTIFICATION] Report {report.id} status changed: {old_status} -> {new_status}"
        )
        
        # TODO: Implement email notification
        # EmailService.send_status_update_email(
        #     to=report.reporter.email,
        #     report_id=report.id,
        #     title=report.title,
        #     old_status=old_status,
        #     new_status=new_status
        # )
        
        # TODO: Implement SMS notification
        # if report.reporter.phone_number:
        #     SMSService.send_status_update_sms(
        #         to=report.reporter.phone_number,
        #         report_id=report.id,
        #         new_status=new_status
        #     )
    
    @staticmethod
    def send_new_report_notification(report):
        """
        Send notification when new report is created
        
        Args:
            report: Report object
        
        Future Implementation:
        - Notify relevant authorities based on incident type and location
        - Send confirmation email to report owner
        """
        current_app.logger.info(
            f"[NOTIFICATION] New report created: {report.id} - {report.incident_type}"
        )
        
        # TODO: Notify authorities
        # AuthorityNotificationService.notify_new_incident(report)


class EmailService:
    """Email notification service - To be implemented"""
    
    @staticmethod
    def send_status_update_email(to, report_id, title, old_status, new_status):
        """Send email notification for status update"""
        # TODO: Implement using Flask-Mail or SendGrid
        pass
    
    @staticmethod
    def send_welcome_email(to, username):
        """Send welcome email to new users"""
        # TODO: Implement
        pass


class SMSService:
    """SMS notification service - To be implemented"""
    
    @staticmethod
    def send_status_update_sms(to, report_id, new_status):
        """Send SMS notification for status update"""
        # TODO: Implement using Twilio or Africa's Talking
        pass