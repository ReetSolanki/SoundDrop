import { useState, useRef, useEffect } from 'react';

interface AudioPlayerProps {
  src: string;
  coverUrl: string;
  title: string;
  artistName: string; // <-- New prop added!
  onNext: () => void;
  onPrev: () => void;
}

const AudioPlayer = ({ src, coverUrl, title, artistName, onNext, onPrev }: AudioPlayerProps) => {
  const audio = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    audio.current = new Audio(src);
    const a = audio.current;
    a.volume = volume;

    const setAudioData = () => setDuration(a.duration);
    const setAudioTime = () => {
      setCurrentTime(a.currentTime);
      setProgress((a.currentTime / a.duration) * 100 || 0);
    };
    const handleAudioEnd = () => onNext(); // Auto-play next song!

    a.addEventListener("loadedmetadata", setAudioData);
    a.addEventListener("timeupdate", setAudioTime);
    a.addEventListener("ended", handleAudioEnd);

    a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));

    return () => {
      a.pause();
      a.src = "";
      a.removeEventListener("loadedmetadata", setAudioData);
      a.removeEventListener("timeupdate", setAudioTime);
      a.removeEventListener("ended", handleAudioEnd);
    };
  }, [src]);

  const playpause = () => {
    if (!playing) {
      audio.current?.play().catch(err => console.error("Play failed:", err));
      setPlaying(true);
    } else {
      audio.current?.pause();
      setPlaying(false);
    }
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (audio.current) audio.current.currentTime = (val / 100) * duration;
    setProgress(val);
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    if (audio.current) audio.current.volume = val;
  };

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  return (
    <div style={{ 
      position: "fixed", bottom: 0, left: 0, right: 0, height: "80px",
      backgroundColor: "#121212", /* Darker background from your image */
      borderTop: "1px solid #282828",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 20px", color: "white", zIndex: 1000
    }}>
      
      {/* CSS to make the sliders look professional */}
      <style>{`
        .custom-slider {
          -webkit-appearance: none;
          height: 4px;
          border-radius: 2px;
          outline: none;
        }
        .custom-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 12px; height: 12px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 0 5px rgba(0,0,0,0.5);
        }
      `}</style>

      {/* LEFT: Circular Cover, Title, and Artist */}
      <div style={{ display: "flex", alignItems: "center", gap: "15px", width: "25%" }}>
        <img src={coverUrl} alt="Cover" style={{ width: "48px", height: "48px", borderRadius: "50%", objectFit: "cover" }} />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <h4 style={{ margin: "0 0 4px 0", fontSize: "14px", fontWeight: "600" }}>{title}</h4>
          <p style={{ margin: 0, fontSize: "12px", color: "#b3b3b3" }}>{artistName}</p>
        </div>
      </div>

      {/* CENTER-LEFT: Playback Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: "25px", width: "20%", justifyContent: "center" }}>
        <button style={{ background: "none", border: "none", color: "#b3b3b3", cursor: "pointer" }}>
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M13.151.922a.75.75 0 1 0-1.06 1.06L13.109 3H11.16a3.75 3.75 0 0 0-2.873 1.34l-6.173 7.356A2.25 2.25 0 0 1 .39 12.5H0V14h.391a3.75 3.75 0 0 0 2.873-1.34l6.173-7.356a2.25 2.25 0 0 1 1.724-.804h1.947l-1.017 1.018a.75.75 0 0 0 1.06 1.06L15.98 3.75 13.15.922zM.391 3.5H0V2h.391c1.106 0 1.986.423 2.64 1.12l.338.358-1.128 1.343-.323-.342A2.25 2.25 0 0 0 .39 3.5zm10.77 9a2.25 2.25 0 0 0-1.724-.804h-1.947l1.017-1.018a.75.75 0 1 0-1.06-1.06L4.606 12.45l.323.342A3.75 3.75 0 0 0 7.8 14h3.36l-1.018 1.018a.75.75 0 1 0 1.06 1.06L15.98 12.25l-2.829-2.828a.75.75 0 1 0-1.06 1.06l1.017 1.018h-1.947z"/></svg>
        </button>
        
        <button onClick={onPrev} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }}>
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M3.3 1a.7.7 0 0 1 .7.7v5.15l9.95-5.744a.7.7 0 0 1 1.05.606v12.575a.7.7 0 0 1-1.05.607L4 9.149V14.3a.7.7 0 0 1-1.4 0V1.7a.7.7 0 0 1 .7-.7z"/></svg>
        </button>
        
        {/* The Blue Play Button */}
        <button onClick={playpause} style={{ width: "38px", height: "38px", borderRadius: "50%", border: "none", backgroundColor: "#3f70e0", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {playing ? 
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z"/></svg> : 
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style={{ marginLeft: "3px" }}><path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"/></svg>
          }
        </button>
        
        <button onClick={onNext} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }}>
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M12.7 1a.7.7 0 0 0-.7.7v5.15L2.05 1.107A.7.7 0 0 0 1 1.712v12.575a.7.7 0 0 0 1.05.607L12 9.149V14.3a.7.7 0 0 0 1.4 0V1.7a.7.7 0 0 0-.7-.7z"/></svg>
        </button>

        <button style={{ background: "none", border: "none", color: "#b3b3b3", cursor: "pointer" }}>
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M0 4.75A3.75 3.75 0 0 1 3.75 1h8.5A3.75 3.75 0 0 1 16 4.75v5a3.75 3.75 0 0 1-3.75 3.75H9.81l1.018 1.018a.75.75 0 1 1-1.06 1.06L6.939 12.75l2.829-2.828a.75.75 0 1 1 1.06 1.06L9.811 12h2.439a2.25 2.25 0 0 0 2.25-2.25v-5a2.25 2.25 0 0 0-2.25-2.25h-8.5A2.25 2.25 0 0 0 1.5 4.75v5A2.25 2.25 0 0 0 3.75 12H5v1.5H3.75A3.75 3.75 0 0 1 0 9.75v-5z"/></svg>
        </button>
      </div>

      {/* CENTER-RIGHT: Gradient Progress Bar */}
      <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "0 30px", gap: "5px" }}>
        <input 
          type="range" min={0} max={100} value={progress} onChange={seek}
          className="custom-slider"
          style={{ 
            width: "100%", 
            // The magic gradient that fills up based on the state!
            background: `linear-gradient(to right, #4a90e2 0%, #d94fd5 ${progress / 2}%, #f9d423 ${progress}%, #404040 ${progress}%, #404040 100%)`
          }} 
        />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#b3b3b3" }}>
          <span>{fmt(currentTime)}</span>
          <span>{fmt(currentTime)} / {fmt(duration)}</span>
        </div>
      </div>

      {/* RIGHT: Volume Slider */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", width: "15%", gap: "10px" }}>
        <svg width="16" height="16" fill="#b3b3b3" viewBox="0 0 16 16"><path d="M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z"/><path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.61 3.89l.706.706z"/><path d="M8.707 11.182A4.486 4.486 0 0 0 10.025 8a4.486 4.486 0 0 0-1.318-3.182L8 5.525A3.489 3.489 0 0 1 9.025 8 3.49 3.49 0 0 1 8 10.475l.707.707zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06z"/></svg>
        <input 
          type="range" min={0} max={1} step={0.01} value={volume} onChange={handleVolume} 
          className="custom-slider"
          style={{ 
            width: "80px", 
            background: `linear-gradient(to right, #3f70e0 ${volume * 100}%, #404040 ${volume * 100}%, #404040 100%)`
          }} 
        />
      </div>

    </div>
  );
};

export default AudioPlayer;