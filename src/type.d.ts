interface User {
    id: number
    username: string
    email: string
    nickname: string
    created: Date
    updated: Date
}

interface Library {
    id: number
    name: string
    path: String,
    user_id: number,
    is_public: boolean,
    created: Date,
    updated: Date,
}

interface Song {
    id: number;
    title: string;
    path: string;
    library_id?: number;
    album?: string;
    artist?: string;
    album_artist?: string;
    year?: number;
    genre?: string;
    track_number?: number;
    duration?: number;
    artwork: number[];
    created: Date; // ISO 8601 datetime string
    updated: Date; // ISO 8601 datetime string
};

interface Album {
    album_name: string
    album_artist: string
    song_count: number
    total_duration: number
    artwork?: number[]
    coverUrl?: string
    year?: number
    tracks?: number
}

interface DirectoryInfo {
    base_path: string
    directories: string[]
}