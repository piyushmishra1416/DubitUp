import { useEffect, useState } from "react";
import "./App.css";
// import { HfInference } from "@huggingface/inference"


function App() {
  const [audioUrl, setAudioUrl] = useState("");
  const [videoId, setVideoId] = useState("");

  useEffect(() => {
    const getActiveTab = async () => {
      const queryOptions = { active: true, currentWindow: true };
      const [tab] = await chrome.tabs.query(queryOptions);
      const data = document.getElementsByClassName("ytp-time-current")[0]
      console.log("data",data);
      if (tab && tab.url) {
        const url = new URL(tab.url);
        if (url.hostname.includes("youtube.com") && url.searchParams.has("v")) {
          const videoId = url.searchParams.get("v");
          setVideoId(videoId || "");
          console.log("Received video ID:", videoId);
        } else {
          console.error("No video ID found in the URL");
        }
      }
    };

    getActiveTab();
  }, []);


  const fetchAudio = async () => {
    try {
      alert('Hello world from content.js');
      if (videoId){
      const response = await fetch(`http://localhost:3001/blob?videoId=${videoId}`, {
        method: "GET",
      });
      console.log("Response:", response);
      console.log(response.headers); // Fetch the audio from the backend
      const result = await response.blob();
      console.log("---", result);
      const contentType = response.headers.get("Content-Type");
      console.log("Content-Type:", contentType);
      // @ts-ignore
      const url = URL.createObjectURL(result); // Create a URL for the blob
      console.log("---", url);

      setAudioUrl(url); // Set the audio URL
    } else {
      console.error("Invalid videoId:", videoId);
    }
  } catch (error) {
    console.error("Error fetching audio:", error);
  }
  };

  

  useEffect(() => {
    console.log("+++++++", document.getElementById("aud"));
  });

  return (
    <div className="bg-black min-h-screen w-[800px] flex flex-col justify-center items-center text-white">
      <div className="text-6xl font-extrabold  mb-8">DubITUp</div>
      <div className="flex justify-center items-center">
        <button
          onClick={fetchAudio}
          className="px-6 py-3 border-2 border-teal-400 text-teal-400 rounded-lg shadow-lg transform hover:scale-105 hover:bg-teal-400 hover:text-black transition-all duration-300"
        >
          Watch Videos in Your Language
        </button>
      </div>
      <div className="flex justify-center items-center mt-4">
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
