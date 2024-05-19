import { useEffect, useState } from 'react';
import './App.css';
// import { HfInference } from "@huggingface/inference"

function App() {
  const [audioUrl, setAudioUrl] = useState('');

  // const hf = new HfInference('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'); 

  // const ttsResponse = await hf.textToSpeech({
  //   inputs: 'transcriptText Example app listening on port 3000!',
  //   model: 'espnet/kan-bayashi_ljspeech_vits'
  // });
  // console.log('Text-to-speech response:', ttsResponse);

  async function query(data: any) {
		const response = await fetch(
			"https://api-inference.huggingface.co/models/facebook/mms-tts-fra",
			{
				headers: { Authorization: "Bearer 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" },
				method: "POST",
				body: JSON.stringify(data),
			}
		);
			const result = await response.blob();
			return result;
		}

  const fetchAudio = async () => {
    try {
      const data = { "inputs": "The answer to the universe is 42" };
      const response = await query(data)
      console.log('Response:', response); // Fetch the audio from the backend
      const url = URL.createObjectURL(response); // Create a URL for the blob

      setAudioUrl(url); // Set the audio URL
    } catch (error) {
      console.error('Error fetching audio:', error);
    }
  };

  useEffect(() => {
    console.log('+++++++',document.getElementById('aud'));
    
  })

  return (
    <div>
      <div className='text-3xl font-bold underline flex justify-center items-center'>
        Dub It Up
      </div>
      <div className='flex justify-center items-center mt-4'>
        <button onClick={fetchAudio} className='px-4 py-2 bg-blue-500 text-white rounded'>
          Fetch Audio
        </button>
      </div>
      <div className='flex justify-center items-center mt-4'>
      {audioUrl && (
        <audio controls>
          <source src={audioUrl} type="audio/wav" />
          Your browser does not support the audio element.
        </audio>
      )}
      </div>
    </div>
  );
}

export default App;
