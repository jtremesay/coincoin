import { APIClient, Board, Post } from "../APIClient";
import { PostLayout } from "./PostLayout";

export class BoardPageLayout extends OO.ui.PageLayout {
    board: Board
    client: APIClient

    constructor(board: Board, client: APIClient, config?: OO.ui.PageLayout.ConfigOptions) {
        super(board.slug, config)
        this.board = board
        this.client = client

        this.client.get_posts(this.board, this.onPostsLoaded.bind(this))
    }

    setupOutlineItem() {
        this.getOutlineItem()!.setLabel(this.board.name)
    }

    onPostsLoaded(posts: Post[]) {
        const posts_layouts = posts.map((post) => new PostLayout(post).$element)
        this.$element.append(posts_layouts)
    }
}
