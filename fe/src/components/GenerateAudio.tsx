import { useState } from 'react';

function TTSComponent() {
  const [text, setText] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);
// @ts-ignore
  const query = async (data) => {
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
  };

  const handleFetchAudio = async () => {
    try {
      const data = { inputs: text };
      const audioBlob = await query(data);
      const audioUrl = URL.createObjectURL(audioBlob);
      // @ts-ignore
      setAudioUrl(audioUrl);
    } catch (error) {
      console.error('Error fetching audio:', error);
    }
  };

  return (
    <div>
      <h1>Text-to-Speech Converter</h1>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to convert to speech"
      />
      <br />
      <button onClick={handleFetchAudio}>Convert to Speech</button>
      <br />
      {audioUrl && (
        <audio controls>
          <source src={audioUrl} type="audio/wav" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
}

export default TTSComponent;
