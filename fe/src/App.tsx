import { useEffect, useState } from 'react';
import './App.css';
// import { HfInference } from "@huggingface/inference"

function App() {
  const [audioUrl, setAudioUrl] = useState('');

  

  const fetchAudio = async () => {
    try {
      const response = await fetch(`http://localhost:3000/blob`, {
        method: 'GET',
      });
      console.log('Response:', response); 
      console.log(response.headers)// Fetch the audio from the backend
      const result = await response.blob();
      console.log("---", result)
      const contentType = response.headers.get('Content-Type');
      console.log('Content-Type:', contentType);
// @ts-ignore
      const url = URL.createObjectURL(result); // Create a URL for the blob
      console.log("---", url)

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
