import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, Float } from "@react-three/drei";
import "./HoloAssistant.css";

const HoloAvatar = ({ speechText }) => {
  const ref = useRef();
  useFrame(() => {
    if (ref.current) ref.current.rotation.y += 0.01; // slow rotation
  });

  return (
    <Float floatIntensity={0.5} rotationIntensity={0.3}>
      <mesh ref={ref}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#4caf50" transparent opacity={0.6} emissive="#4caf50" />
        {speechText && (
          <Html position={[0, 1.5, 0]}>
            <div className="speech-bubble">{speechText}</div>
          </Html>
        )}
      </mesh>
    </Float>
  );
};

const HologramAssistant = () => {
  const [speechText, setSpeechText] = useState("");

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Your browser does not support voice recognition!");

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onresult = async (event) => {
      const query = event.results[0][0].transcript;
      setSpeechText(`You said: ${query}`);

      try {
        const res = await fetch(`https://grocery-ai-backend.onrender.com/api/items?q=${query}`);
        const data = await res.json();
        if (data.length > 0) {
          const itemsText = data.map(item => item["Item Name"]).join(", ");
          setSpeechText(`I found: ${itemsText}`);
          speak(`I found ${data.length} items for ${query}`);
        } else {
          setSpeechText("No items found");
          speak(`No items found for ${query}`);
        }
      } catch (err) {
        console.error(err);
        setSpeechText("Server error");
        speak("Sorry, there was an error connecting to the server.");
      }
    };

    recognition.onerror = (err) => console.error(err);
    recognition.start();
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="holo-container">
      <button onClick={startListening} className="voice-btn">🎤 Speak</button>
      <Canvas style={{ height: 400 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} />
        <HoloAvatar speechText={speechText} />
      </Canvas>
    </div>
  );
};

export default HologramAssistant;
