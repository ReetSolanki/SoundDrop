use serde::{Deserialize, Serialize};
use mongodb::bson::oid::ObjectId;

#[derive(Debug, Serialize, Deserialize)]
pub struct Song {
    pub title: String,
    pub duration: u32,
    pub audio_url: String, // The S3 link your React player will use
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Album {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    pub title: String,
    pub artist_name: String,
    pub cover_url: String,
    pub songs: Vec<Song>, // The embedded songs array
}