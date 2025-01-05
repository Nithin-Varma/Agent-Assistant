import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import FormData from "form-data";
import fetch from "node-fetch";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "Error parsing form data" });
    }

    const audioFile = files.audio as formidable.File;

    if (!audioFile) {
      return res.status(400).json({ error: "No audio file found" });
    }

    const audioStream = fs.createReadStream(audioFile.filepath);

    const formData = new FormData();
    formData.append(
      "files",
      audioStream,
      audioFile.originalFilename || "recording.mp3"
    );

    try {
      const apiResponse = await fetch("http://0.0.0.0:8000/whisper/", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });
      console.log(formData);

      if (!apiResponse.ok) {
        return res
          .status(apiResponse.status)
          .json({ error: "Transcription failed" });
      }

      const data = await apiResponse.json();
      console.log(data);
      res.status(200).json({
        transcript: data.results[0]?.transcript || "No transcript found",
      });
    } catch (error) {
      console.error(
        "Error communicating with the transcription service:",
        error
      );
      res.status(500).json({ error: "Error in transcription service" });
    }
  });
}

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Allow", ["POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
