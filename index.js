const express = require('express');
const { HfInference } = require('@huggingface/inference');
const { YoutubeTranscript } = require('./be/node_modules/youtube-transcript/dist');

const hf = new HfInference();

const videoId = 'z41vJlPMqnE'; 
const app = express();

app.get('/', async (req, res) => {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);

    // Extract the text from the transcript and concatenate into a single string
    const transcriptText = transcript.map(segment => segment.text).join(' ');

    // Call the Hugging Face text-to-speech model
    const response = await hf.textToSpeech({
      model: 'espnet/kan-bayashi_ljspeech_vits',
      inputs: transcriptText
    });

    // Send the TTS response (which might be a URL or binary data) back to the client
    res.send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching transcript or generating speech');
  }
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
