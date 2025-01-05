# app/dependencies.py
from fastapi import Request, Depends

def get_voice_model(request: Request):
    return request.app.state.voice_model
