import axios, { AxiosResponse } from 'axios'

export class Board {
    uuid: string
    name: string
    slug: string

    constructor(uuid: string, name: string, slug: string) {
        this.uuid = uuid
        this.name = name
        this.slug = slug
    }
}

export interface BoardData {
    uuid: string
    name: string
    slug: string
}

export class Post {
    uuid: string
    id: number
    timestamp: Date
    login: string
    message: string
    info: string

    constructor(uuid: string, id: number, timestamp: Date, login: string, message: string, info: string) {
        this.uuid = uuid
        this.id = id
        this.timestamp = timestamp
        this.login = login
        this.message = message
        this.info = info
    }
}

export interface PostData {
    uuid: string
    id: string
    timestamp: string
    login: string
    message: string
    info: string
}

export class APIClient {
    api_root: string

    constructor(api_root: string) {
        this.api_root = api_root
    }

    get_boards(callback: (boards: Board[]) => void) {
        this.get(`boards`,
            (data: BoardData[]) => callback(data.map(d => new Board(
                d.uuid,
                d.name,
                d.slug
            )))
        )
    }

    get_posts(board: Board, callback: (posts: Post[]) => void) {
        this.get(`boards/${board.uuid}/posts`,
            (data: PostData[]) => callback(data.map(d => new Post(
                d.uuid,
                parseInt(d.id),
                new Date(d.timestamp),
                d.login,
                d.message,
                d.info
            )))
        )
    }

    get(suffix: string, callback: (data: any) => void) {
        axios({
            method: 'get',
            url: `${this.api_root}${suffix}`,
            headers: {
                "Accept": "application/json"
            }
        }).then(function (response: AxiosResponse) {
            callback(response.data)
        })
    }
}
