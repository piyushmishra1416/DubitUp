const express = require('express');
var cors = require('cors');
const { HfInference } = require('@huggingface/inference');
const { YoutubeTranscript } = require('youtube-transcript');
const axios = require('axios');
const { Buffer } = require('buffer');
const hf = new HfInference('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'); // Replace with your actual API key

const videoId = 'z41vJlPMqnE';
const app = express();
app.use(cors());
app.get('/blob', async (req, res) => {
  try {
    // Fetch the transcript from YouTube
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    console.log('Transcript fetched successfully:', );

    // Extract the text from the transcript and concatenate into a single string
    const transcriptText = transcript.map((segment) => segment.text).join(' ');
    console.log('Transcript text:',);
    const data = "hello how you are doing?"

    // Convert text to speech using Hugging Face Inference API
    const response = await fetch(
			"https://api-inference.huggingface.co/models/facebook/mms-tts-fra",
			{
				headers: { Authorization: "Bearer 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" },
				method: "POST",
				body: JSON.stringify(data),
        responseType: "arraybuffer" 
			}
		);
    const arrayBuffer = await response.arrayBuffer();
    
    // Set the content type header
    res.setHeader("Content-Type", "audio/mpeg"); // Assuming the response is audio
    res.send(Buffer.from(arrayBuffer));
  } catch (error) {
    console.error('Error occurred:', error.message);
    res.status(500).send('Error fetching transcript or generating speech');
  }
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
