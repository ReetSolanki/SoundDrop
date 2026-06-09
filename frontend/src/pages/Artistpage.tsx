import { useState, useEffect } from 'react';
import AudioPlayer from '../components/AudioPlayer.tsx';
import Tracklist from '../components/Tracklist.tsx';
import { useParams } from 'react-router-dom';

// 1. Tell TypeScript about the MongoDB ID format
interface MongoId {
  $oid: string;
}

interface Song {
  title: string;
  duration: number;
  audio_url: string;
}

interface Album {
  _id: MongoId;
  title: string;
  artist_name: string;
  cover_url: string;
  songs: Song[];
}

function Artistpage() {
  const { id } = useParams();

  // 2. State to hold our database data
  const [loading, setLoading] = useState(true);
  
  // 3. State to track what the user is currently listening to
  const [activeAlbum, setActiveAlbum] = useState<Album | null>(null);
  const [activeSong, setActiveSong] = useState<Song | null>(null);

  // 4. Fetch data from Axum when the app loads
  useEffect(() => {
    fetch('http://localhost:3000/api/albums')
        .then((res) => res.json())
        .then((data: Album[]) => {
        const album = data.find(a => a._id.$oid === id);  // ← filter by id
        if (album) {
            setActiveAlbum(album);
            setActiveSong(album.songs[0]);
        }
        setLoading(false);
        })
        .catch((err) => {
        console.error("Failed to fetch albums:", err);
        setLoading(false);
        });
    }, [id]); // Empty array means this runs once on mount

  // --- NEW LOGIC FOR NEXT AND PREV BUTTONS ---
  const handleNext = () => {
    if (!activeAlbum || !activeSong) return;
    
    // Find where we are in the tracklist
    const currentIndex = activeAlbum.songs.findIndex(s => s.title === activeSong.title);
    
    // If it's not the last song, play the next one
    if (currentIndex < activeAlbum.songs.length - 1) {
      setActiveSong(activeAlbum.songs[currentIndex + 1]);
    } else {
      // Optional: Loop back to the first song if we hit the end
      setActiveSong(activeAlbum.songs[0]); 
    }
  };

  const handlePrev = () => {
    if (!activeAlbum || !activeSong) return;
    
    const currentIndex = activeAlbum.songs.findIndex(s => s.title === activeSong.title);
    
    // If it's not the first song, play the previous one
    if (currentIndex > 0) {
      setActiveSong(activeAlbum.songs[currentIndex - 1]);
    }
  };

  // 5. Loading and Error states
  if (loading) return <div style={{ color: 'white', padding: "20px" }}>Loading Database...</div>;
  if (!activeAlbum || !activeSong) return <div style={{ color: 'white', padding: "20px" }}>No albums found.</div>;
//   if (albums.length === 0 || !activeAlbum || !activeSong) return <div style={{ color: 'white', padding: "20px" }}>No albums found.</div>;

  return (
    // <div style={{ padding: "20px", paddingBottom: "120px", maxWidth: "600px", color: "white", fontFamily: "sans-serif" }}>
    <div style={{ 
      padding: "20px", 
      paddingBottom: "120px", // Prevents the tracklist from hiding behind the player!
      maxWidth: "800px", 
      margin: "0 auto", 
      color: "white", 
      fontFamily: "sans-serif" 
    }}>
      
      {/* --- The Album Details --- */}
      <div style={{ marginTop: "20px", marginBottom: "30px", display: "flex", gap: "20px", alignItems: "flex-end" }}>
        <img src={activeAlbum.cover_url} alt="Cover" style={{ width: "150px", height: "150px", boxShadow: "0 4px 15px rgba(0,0,0,0.5)" }} />
        <div>
          <p style={{ margin: "0 0 5px 0", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>Album</p>
          <h1 style={{ margin: "0 0 10px 0", fontSize: "48px" }}>{activeAlbum.title}</h1>
          <p style={{ margin: 0, color: "#b3b3b3", fontWeight: "bold" }}>{activeAlbum.artist_name}</p>
        </div>
      </div>

      {/* --- The Audio Player --- */}
      <AudioPlayer 
        src={activeSong.audio_url} 
        title={activeSong.title}
        coverUrl={activeAlbum.cover_url} 
        onNext={handleNext}
        onPrev={handlePrev}
        artistName={activeAlbum.artist_name}
      />

      {/* --- The Tracklist --- */}
      <Tracklist 
        songs={activeAlbum.songs} 
        activeSong={activeSong} 
        onPlaySong={setActiveSong} // We are saying: "Hey Tracklist, if someone clicks a song, use this function!"
      />

    </div>
  );
}

export default Artistpage;
// Insert data in this format
// {
//   "title": "Shibuya Nights",
//   "artist_name": "Chanel",
//   "cover_url": "http://localhost:3000/assets/covers/shibuya-nights.jpg",
//   "songs": [
//     {
//       "title": "American Shibuya Chanel (Remix)",
//       "duration": 195,
//       "audio_url": "http://localhost:3000/assets/audio/American-Shibuya-Chanel-remix.mp3"
//     }
//   ]
// }