from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

import asyncio
import json

from fastapi import FastAPI, Request

from app_settings import settings
from utils.email import send_email, MailDetails

import logging
logger = logging.getLogger(__name__)


router = APIRouter(
    prefix="/mail",
    tags=["Mail"],
    responses={404: {"description": "Not found"}},
)

@router.post("/")
async def run_workflow(MailRequest: MailDetails):
    """
    Endpoint to email
    """

    subject = "Subject"
    text = "Greetings from the team, you got this message through MailerSend."
    html = "Greetings from the team, you got this message through MailerSend."

    my_mail = settings.MAILER_SEND_DOMAIN
    subscriber_list = [ 
    'mann.compi@gmail.com']
    
    mail_details = MailDetails(subject=subject, text=text, html=html, sender_email=my_mail, subscriber_list=subscriber_list)

    send_email(mail_details)
    return "Success"