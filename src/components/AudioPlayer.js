import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeUp, faVolumeMute } from "@fortawesome/free-solid-svg-icons";

const AudioPlayer = () => {
  const audioRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);

  // Fonction pour jouer un son
  const playSound = (soundFile) => {
    if (isMuted) return; // Si le son est coupé, ne rien jouer

    if (audioRef.current) {
      audioRef.current.pause(); // Arrêter tout son en cours
      audioRef.current.currentTime = 0; // Réinitialiser au début
    }

    const audio = new Audio(soundFile);
    audioRef.current = audio; // Stocker l'instance audio
    audio.play().catch((error) => {
      console.error("Erreur lors de la lecture du son", error);
    });

    // Arrêter le son après 3 secondes
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }, 3000);
  };

  // Fonction pour basculer l'état muet/non muet
  const toggleMute = () => {
    setIsMuted((prevMuted) => !prevMuted);
  };

  return {
    playSound,
    MuteButton: () => (
      <button
        onClick={toggleMute}
        className="text-white bg-transparent border-none cursor-pointer"
      >
        <FontAwesomeIcon icon={isMuted ? faVolumeMute : faVolumeUp} />
      </button>
    ),
  };
};

export default AudioPlayer;
