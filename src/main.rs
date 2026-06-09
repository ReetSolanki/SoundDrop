use axum::{
    extract::State,
    routing::get,
    Json, Router,
};
use mongodb::{Client, options::ClientOptions};
use futures::stream::StreamExt;
use std::sync::Arc;
use tower_http::{
    cors::CorsLayer,
    services::ServeDir,
};

mod models;
use models::Album; 

// The shared state for the database connection
struct AppState {
    db: mongodb::Database,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // 1. Connect to MongoDB Atlas (Make sure your password is correct here!)
    let client_options = ClientOptions::parse("mongodb+srv://reetsolankitechfest_db_user:reetSoundDrop@cluster0.fg0f2ay.mongodb.net/?appName=Cluster0").await?;
    let client = Client::with_options(client_options)?;
    let db = client.database("spotify_clone");
    let shared_state = Arc::new(AppState { db });

    // 2. Build the Router (Merging your code with the database code)
    let app = Router::new()
        // Your API routes
        .route("/api/albums", get(get_albums))
        .route("/api/hello", get(|| async { "Hello Axum!" }))
        // Serve local images and audio
        .nest_service("/assets", ServeDir::new("assets"))
        // YOUR NEW ADDITION: Serve the built React frontend!
        .fallback_service(ServeDir::new("frontend/dist"))
        // Your permissive CORS layer
        .layer(CorsLayer::permissive())
        .with_state(shared_state);

    // 3. Start the Server
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    println!("Server running on http://localhost:3000");
    axum::serve(listener, app).await.unwrap();

    Ok(())
}

// 4. The Route Handler to fetch albums from the cloud
async fn get_albums(State(state): State<Arc<AppState>>) -> Json<Vec<Album>> {
    let collection = state.db.collection::<Album>("albums");
    
    let mut cursor = collection.find(None, None).await.expect("Failed to fetch documents");
    let mut albums: Vec<Album> = Vec::new();

    while let Some(result) = cursor.next().await {
        match result {
            Ok(document) => albums.push(document),
            Err(e) => println!("Error processing document: {}", e),
        }
    }

    Json(albums)
} //reetSoundDrop | reetsolankitechfest_db_user | mongodb+srv://reetsolankitechfest_db_user:reetSoundDrop@cluster0.fg0f2ay.mongodb.net/?appName=Cluster0 | mongodb://reetsolankitechfest_db_user:reetSoundDrop@ac-amimlz4-shard-00-00.fg0f2ay.mongodb.net:27017,ac-amimlz4-shard-00-01.fg0f2ay.mongodb.net:27017,ac-amimlz4-shard-00-02.fg0f2ay.mongodb.net:27017/?ssl=true&replicaSet=atlas-1hp93s-shard-0&authSource=admin&appName=Cluster0