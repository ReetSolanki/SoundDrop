import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface MongoId { $oid: string; }
interface Album {
  _id: MongoId;
  title: string;
  artist_name: string;
  cover_url: string;
}

const Home = () => {
  const navigate = useNavigate();
  const [albums, setAlbums] = useState<Album[]>([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/albums')
      .then(res => res.json())
      .then((data: Album[]) => setAlbums(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ color: 'white', padding: '20px' }}>
      <h1>Home</h1>
      {albums.map(album => (
        <div 
          key={album._id.$oid}
          onClick={() => navigate(`/artist/${album._id.$oid}`)}
          style={{ cursor: 'pointer', padding: '10px' }}
        >
          {album.title} — {album.artist_name}
        </div>
      ))}
    </div>
  );
};

export default Home;