
# import pandas as pd
# from pydantic import BaseModel
# from llama_index.core import VectorStoreIndex, SimpleDirectoryReader, ServiceContext, StorageContext, load_index_from_storage
# from llama_index.llms.ollama import Ollama

# from llama_index.embeddings.openai import OpenAIEmbedding
# from llama_index.embeddings.ollama import OllamaEmbedding

# from llama_index.llms.openai import OpenAI
# from llama_index.core.agent import ReActAgent
# from llama_index.core.tools import FunctionTool
# from llama_index.core import Settings

# import requests
# import dateparser
# from utils.email import send_email, MailDetails



# from app_settings import settings


# def extract_date_from_text(date_text):
#     """
#     Parses a natural language date string into a datetime object.

#     Args:
#         date_text (str): The date in natural language (e.g., "tomorrow", "next Monday").

#     Returns:
#         datetime or None: The parsed datetime object if successful, or None if parsing fails.
#     """
#     parsed_date = dateparser.parse(date_text)
#     if parsed_date:
#         return pd.to_datetime(parsed_date.date())
#     else:
#         return None

# # Function to get weather for a natural date
# def email_sender(subject: str, body: str, send_email_to: str):
#     """
#     Sends an email to the user given the subject, body and email

#     Args:
#         subject (str): The subject of the email
#         body (str): the complete email
#         send_email_to (str): person you are sending to

#     Returns:
#         str: Status if email was sent successfully
#     """

#     my_mail = settings.MAILER_SEND_DOMAIN
#     subscriber_list = send_email_to

#     mail_details = MailDetails(subject=subject, text=body, html=body, sender_email=my_mail, subscriber_list=subscriber_list)
#     send_email(mail_details)

#     try:
#         return f"Email sent successfully"
#     except:
#         return f"Error in sending email"

# email_tool = FunctionTool.from_defaults(fn=email_sender)
# date_tool = FunctionTool.from_defaults(fn=extract_date_from_text)

# # Define the system prompt for the weather assistant
# system_prompt = """
# You are a helpful and friendly agent assistant who's task to send emails. Make sure you understand the context of date/time if given to you. When users ask you questions you will create actions items, and  insightful agendas for meetings and then send the email.
# """

# # Create the chat agent with the system prompt
# chat_agent = ReActAgent.from_tools(
#     tools=[date_tool, email_tool],
#     verbose=True,
#     system_prompt=system_prompt
# )




import pandas as pd
from pydantic import BaseModel
from llama_index.core import (
    VectorStoreIndex,
    SimpleDirectoryReader,
    ServiceContext,
    StorageContext,
    load_index_from_storage,
)
from llama_index.llms.ollama import Ollama
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.embeddings.ollama import OllamaEmbedding
from llama_index.llms.openai import OpenAI
from llama_index.core.agent import ReActAgent
from llama_index.core.tools import FunctionTool
from llama_index.core import Settings
import requests
import dateparser
from utils.email import send_email, MailDetails
from app_settings import settings
import uuid


def extract_date_from_text(date_text: str) -> pd.Timestamp:
    """
    Parses a natural language date string into a pandas Timestamp object.

    Args:
        date_text (str): The date in natural language (e.g., "tomorrow", "next Monday").

    Returns:
        pd.Timestamp or None: The parsed datetime object if successful, or None if parsing fails.
    """
    parsed_date = dateparser.parse(date_text)
    if parsed_date:
        return pd.to_datetime(parsed_date.date())
    else:
        return None


def generate_miro_meeting_link() -> str:
    """
    Generates a unique Video Meeting link.

    Returns:
        str: A unique Video Meeting URL.
    """
    unique_id = str(uuid.uuid4())[:6]
    meet_link = f"https://p2p.mirotalk.com/join/{unique_id}"
    return meet_link


def create_email_html(subject: str, body: str, meet_link: str) -> str:
    """
    Creates a professionally styled HTML formatted email body with the provided subject, 
    body, and Video Meet link.

    Args:
        subject (str): The subject of the email.
        body (str): The main content of the email.
        meet_link (str): The Video Meet URL to be included in the email.

    Returns:
        str: The complete HTML content for the email body with modern styling.
    """
    html_content = f"""
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {{
                    font-family: Arial, Helvetica, sans-serif;
                    line-height: 1.6;
                    color: #333333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }}
                .email-container {{
                    background-color: #ffffff;
                    border-radius: 8px;
                    padding: 30px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }}
                .subject {{
                    color: #1a73e8;
                    margin-bottom: 20px;
                    font-size: 24px;
                    border-bottom: 2px solid #e0e0e0;
                    padding-bottom: 10px;
                }}
                .body-content {{
                    margin-bottom: 25px;
                }}
                .meet-link {{
                    background-color: #1a73e8;
                    color: white;
                    padding: 12px 24px;
                    text-decoration: none;
                    border-radius: 4px;
                    display: inline-block;
                    margin: 15px 0;
                }}
                
                .meet-link:a {{
                    color: white;
                }}
                .meet-link:hover {{
                    background-color: #1557b0;
                }}
                .footer {{
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 1px solid #e0e0e0;
                    color: #666666;
                }}
                @media only screen and (max-width: 600px) {{
                    body {{
                        padding: 10px;
                    }}
                    .email-container {{
                        padding: 15px;
                    }}
                }}
            </style>
        </head>
        <body>
            <div class="email-container">
                <h1 class="subject">{subject}</h1>
                <div class="body-content">
                    {body}
                </div>
                <p>Join the meeting using the following link:</p>
                <a href="{meet_link}" class="meet-link">Join Meeting</a>
                <p>Looking forward to your participation!</p>
                <div class="footer">
                    <p>Best regards</p>
                </div>
            </div>
        </body>
    </html>
    """
    return html_content

def email_sender(subject: str, body: str, send_email_to: str) -> str:
    """
    Sends an HTML formatted email to the specified recipient, including a Video Meet link.

    Args:
        subject (str): The subject of the email.
        body (str): The main content of the email.
        send_email_to (str): The recipient's email address.

    Returns:
        str: Status message indicating whether the email was sent successfully or if an error occurred.
    """
    try:
        # Generate  Meet link
        meet_link = generate_miro_meeting_link()

        # Create HTML email content
        html_body = create_email_html(subject, body, meet_link)

        # Prepare mail details
        sender_email = settings.MAILER_SEND_DOMAIN
        subscriber_list = send_email_to

        mail_details = MailDetails(
            subject=subject,
            text=body,  # Plain text version
            html=html_body,  # HTML version
            sender_email=sender_email,
            subscriber_list=subscriber_list,
        )

        # Send the email
        send_email(mail_details)

        return "Email sent successfully."
    except Exception as e:
        return f"Error in sending email: {str(e)}"


def generate_miro_meeting_link_wrapper() -> str:
    """
    Wrapper function for generating Video Meet links to be used as a tool.

    Returns:
        str: A unique Video Meet URL.
    """
    return generate_miro_meeting_link()


# Initialize Function Tools
email_tool = FunctionTool.from_defaults(fn=email_sender)
date_tool = FunctionTool.from_defaults(fn=extract_date_from_text)
miro_meeting_tool = FunctionTool.from_defaults(fn=generate_miro_meeting_link_wrapper)

# Define the system prompt for the assistant
system_prompt = """
You are a helpful and friendly agent assistant tasked with scheduling meetings and sending emails.
You understand the context of date/time if given to you. When users ask you questions, you will create action items,
insightful agendas for meetings, generate Video Meet links, and then send the email with all the relevant details.
Create a verbose email which briefs everyone of the details by create a proper agenda. You will write a verbose email for the body which is large and pass it to the email generation part.
"""

# Create the chat agent with the system prompt and tools
chat_agent = ReActAgent.from_tools(
    tools=[date_tool, email_tool, miro_meeting_tool],
    verbose=True,
    system_prompt=system_prompt,
)
