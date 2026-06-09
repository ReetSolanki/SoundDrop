// 1. Define the props this component expects
interface Song {
  title: string;
  duration: number;
  audio_url: string;
}

interface TracklistProps {
  songs: Song[];
  activeSong: Song | null;
  onPlaySong: (song: Song) => void;
}

const Tracklist = ({ songs, activeSong, onPlaySong }: TracklistProps) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {songs.map((song, index) => {
        const isPlaying = activeSong?.title === song.title;

        return (
          <div 
            key={index}
            onClick={() => onPlaySong(song)}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 15px",
              backgroundColor: isPlaying ? "#2a2a2a" : "transparent",
              borderRadius: "5px",
              cursor: "pointer",
              color: isPlaying ? "#1DB954" : "white"
            }}
          >
            <div style={{ display: "flex", gap: "15px" }}>
              <span style={{ color: isPlaying ? "#1DB954" : "#b3b3b3" }}>{index + 1}</span>
              <span>{song.title}</span>
            </div>
            
            <span style={{ color: "#b3b3b3" }}>
              {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
            </span>
          </div>
        )
      })}
    </div>
  );
};

export default Tracklist;