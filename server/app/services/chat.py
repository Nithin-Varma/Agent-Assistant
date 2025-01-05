
import pandas as pd
from pydantic import BaseModel
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader, ServiceContext, StorageContext, load_index_from_storage
from llama_index.llms.ollama import Ollama

from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.embeddings.ollama import OllamaEmbedding

from llama_index.llms.openai import OpenAI
from llama_index.core.agent import ReActAgent
from llama_index.core.tools import FunctionTool
from llama_index.core import Settings

import requests
import dateparser
from app.utils.email import send_email, MailDetails



from app.settings import settings


def extract_date_from_text(date_text):
    """
    Parses a natural language date string into a datetime object.

    Args:
        date_text (str): The date in natural language (e.g., "tomorrow", "next Monday").

    Returns:
        datetime or None: The parsed datetime object if successful, or None if parsing fails.
    """
    parsed_date = dateparser.parse(date_text)
    if parsed_date:
        return pd.to_datetime(parsed_date.date())
    else:
        return None

# Function to get weather for a natural date
def email_sender(subject: str, body: str, send_email_to: str):
    """
    Sends an email to the user given the subject, body and email

    Args:
        subject (str): The subject of the email
        body (str): the complete email
        send_email_to (str): person you are sending to

    Returns:
        str: Status if email was sent successfully
    """

    my_mail = settings.MAILER_SEND_DOMAIN
    subscriber_list = send_email_to

    mail_details = MailDetails(subject=subject, text=body, html=body, sender_email=my_mail, subscriber_list=subscriber_list)
    send_email(mail_details)

    try:
        return f"Email sent successfully"
    except:
        return f"Error in sending email"

email_tool = FunctionTool.from_defaults(fn=email_sender)
date_tool = FunctionTool.from_defaults(fn=extract_date_from_text)

# Define the system prompt for the weather assistant
system_prompt = """
You are a helpful and friendly agent assistant who's task to send emails. Make sure you understand the context of date/time if given to you. When users ask you questions you will create actions items, and  insightful agendas for meetings and then send the email.
"""

# Create the chat agent with the system prompt
chat_agent = ReActAgent.from_tools(
    tools=[date_tool, email_tool],
    verbose=True,
    system_prompt=system_prompt
)
