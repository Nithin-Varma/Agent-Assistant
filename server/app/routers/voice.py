
from tempfile import NamedTemporaryFile
import asyncio
from typing import List

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from fastapi.responses import JSONResponse

import whisper
import torch

router = APIRouter(
    prefix="/whisper",
    tags=["Whisper"],
    responses={404: {"description": "Not found"}},
)


# # WHISPER ENDPOINT
@router.post("/")
async def handler(files: List[UploadFile] = File(...)):
    device = "cpu"

    # Load the Whisper model
    voice_model = whisper.load_model("small", device=device)
    
    if not files:
        raise HTTPException(status_code=400, detail="No files were provided")

    # For each file, let's store the results in a list of dictionaries.
    results = []

    for file in files:
        # Create a temporary file.
        with NamedTemporaryFile(delete=True) as temp:
            # Write the user's uploaded file to the temporary file.
            with open(temp.name, "wb") as temp_file:
                temp_file.write(file.file.read())

            # Let's get the transcript of the temporary file.
            result = voice_model.transcribe(temp.name)

            # Now we can store the result object for this file.
            results.append({
                'filename': file.filename,
                'transcript': result['text'],
            })

    return JSONResponse(content={'results': results})
