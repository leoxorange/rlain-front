interface UserPreferences {
    volume?: number
    tc_enable?: boolean
    tc_target?: string
    tc_bitrate?: number
    theme?: string
    notification?: boolean
}

interface User {
    id: number
    username: string
    email: string
    nickname: string
    preferences?: UserPreferences
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

interface AuthResponse {
    token: string
    user_id: number
    username: string
    email: string
    nickname: string
    preferences?: UserPreferences
}

interface UserInfo {
    user_id: number
    username: string
    email: string
    nickname: string
    preferences?: UserPreferences
}
