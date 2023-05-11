import { APIClient, Board } from "../APIClient"
import { BoardPageLayout } from "./BoardPageLayout"

export class BoardBookletLayout extends OO.ui.BookletLayout {
    client: APIClient

    constructor(client: APIClient, config?: OO.ui.BookletLayout.ConfigOptions) {
        super(config)
        this.client = client
        //debugger
        this.client.get_boards(this.onBoardsLoaded.bind(this))
    }

    onBoardsLoaded(boards: Board[]) {
        const pages = boards.map((board) => new BoardPageLayout(board, this.client))
        this.addPages(pages, 0)
    }
}
