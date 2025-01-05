from typing import List
import mailersend
from app.settings import settings
from pydantic import BaseModel

class MailDetails(BaseModel):
    subject: str
    text: str
    html: str
    sender_email: str
    subscriber_list: List[str]


from typing import List
from mailersend import emails
from dotenv import load_dotenv
from pydantic import BaseModel
import os


class MailDetails(BaseModel):
    subject: str
    text: str
    html: str
    sender_email: str
    subscriber_list: List[str]

def send_email(mail_details: MailDetails):
    # Initialize the mailer with API key
    mailer = emails.NewEmail(settings.MAILER_SEND_API_KEY)

    # Define the sender
    mail_from = {
        "name": "Your Name",  # Replace with your sender name
        "email": mail_details.sender_email,
    }

    # Define recipients
    recipients = [{"name": "", "email": email} for email in mail_details.subscriber_list]

    # Create the mail body
    mail_body = {}
    mailer.set_mail_from(mail_from, mail_body)
    mailer.set_mail_to(recipients, mail_body)
    mailer.set_subject(mail_details.subject, mail_body)
    mailer.set_html_content(mail_details.html, mail_body)
    mailer.set_plaintext_content(mail_details.text, mail_body)

    # Send the email
    try:
        response = mailer.send(mail_body)
        print("Email sent successfully:", response)
    except Exception as e:
        print("Error sending email:", str(e))
