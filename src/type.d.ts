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

}