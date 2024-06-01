const express = require("express");
var cors = require("cors");
const { HfInference } = require("@huggingface/inference");
const { YoutubeTranscript } = require("youtube-transcript");
const axios = require("axios");
const { Buffer } = require("buffer");
const hf = new HfInference("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");
const translate = require("translate-api"); // Replace with your actual API key

const videoId = "DkE0Hmzwl-o";
const app = express();
app.use(cors());
app.get("/blob", async (req, res) => {
  try {
    // Fetch the transcript from YouTube
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    console.log("Transcript fetched successfully:", transcript);

    // Extract the text from the transcript and concatenate into a single string
    const transcriptText = transcript.map((segment) => segment.text).join(" ");
    console.log("Transcript text:", transcriptText);

    const src_lang = "ko_KR";// Assuming the transcript is in Hindi
    const tgt_lang = "en_XX"; 
    const translationResponse = await fetch(
      "https://api-inference.huggingface.co/models/facebook/mbart-large-50-many-to-many-mmt",
      {
        headers: {
          Authorization: "Bearer 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",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: transcriptText,
          parameters: {
            src_lang: src_lang,
            tgt_lang: tgt_lang
          }
        }),
      }
    );
    const translatedTextJson = await translationResponse.json();
    console.log("Translated text:", translatedTextJson);
    console.log("Translated text:", translatedTextJson[0].translation_text);
    // Convert text to speech using Hugging Face Inference API
    // const timeout = 20000;
    // setTimeout(async () => {
      
    // }, timeout);

    const response = await fetch(
      "https://api-inference.huggingface.co/models/facebook/mms-tts-eng",
      {
        headers: {
          Authorization: "Bearer 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",
        },
        method: "POST",
        body: JSON.stringify(translatedTextJson[0].translation_text),
        responseType: "arraybuffer",
      }
    );
    const arrayBuffer = await response.arrayBuffer();

    // Set the content type header
    res.setHeader("Content-Type", "audio/mpeg"); // Assuming the response is audio
    res.send(Buffer.from(arrayBuffer));
  } catch (error) {
    console.error("Error occurred:", error.message);
    res.status(500).send("Error fetching transcript or generating speech");
  }
});

app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});
