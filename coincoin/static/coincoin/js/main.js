"use strict"

//----------------------------------------------------------------------------
// API client
//----------------------------------------------------------------------------

function APIClient(api_root) {
    this.api_root = api_root
}

APIClient.prototype.getBoards = function (callback) {
    this.get(`boards`, callback)
}

APIClient.prototype.getPosts = function (board, callback) {
    this.get(`boards/${board.uuid}/posts`, (posts) => {
        posts.map((post) => {
            post.timestamp = new Date(post.timestamp)

            return post
        })

        callback(posts)
    })
}

APIClient.prototype.get = function (suffix, callback) {
    axios({
        method: 'get',
        url: `${this.api_root}${suffix}`,
        headers: {
            "Accept": "application/json"
        }
    }).then(function (response) {
        callback(response.data)
    })
}

//----------------------------------------------------------------------------
// Post Layout
//----------------------------------------------------------------------------

function PostLayout(post, config) {
    PostLayout.super.call(this, config)

    this.timstamp_label = new OO.ui.LabelWidget()
    this.login_label = new OO.ui.LabelWidget()
    this.message_label = new OO.ui.LabelWidget()
    this.addItems([this.timstamp_label, this.login_label, this.message_label])

    this.setPost(post)
}

OO.inheritClass(PostLayout, OO.ui.HorizontalLayout)

PostLayout.prototype.setPost = function (post) {
    this.post = post
    this.timstamp_label.setLabel(`${this.post.timestamp.getHours()}:${this.post.timestamp.getMinutes()}:${this.post.timestamp.getSeconds()}`)
    this.login_label.setLabel(`<${this.post.login}>`)
    this.message_label.setLabel(this.post.message)
}

//----------------------------------------------------------------------------
// Board PageLayout
//----------------------------------------------------------------------------

function BoardPageLayout(board, client, config) {
    BoardPageLayout.super.call(this, board.slug, config)
    this.board = board
    this.client = client

    this.client.getPosts(this.board, this.onPostsLoaded.bind(this))
}

OO.inheritClass(BoardPageLayout, OO.ui.PageLayout);

BoardPageLayout.prototype.setupOutlineItem = function () {
    this.outlineItem.setLabel(this.board.name)
};

BoardPageLayout.prototype.onPostsLoaded = function (posts) {
    const posts_layouts = posts.map((post) => new PostLayout(post).$element)
    this.$element.append(posts_layouts)
}


//----------------------------------------------------------------------------
// Board BookletLayout
//----------------------------------------------------------------------------

function BoardBookletLayout(client, config) {
    BoardBookletLayout.super.call(this, config)
    this.client = client
    //debugger
    this.client.getBoards(this.onBoardsLoaded.bind(this))
}

OO.inheritClass(BoardBookletLayout, OO.ui.BookletLayout)

BoardBookletLayout.prototype.onBoardsLoaded = function (boards) {
    const pages = boards.map((board) => new BoardPageLayout(board, this.client))
    this.addPages(pages)
}


//----------------------------------------------------------------------------
// Main
//----------------------------------------------------------------------------
function main() {
    // Get the app container
    const $coincoin = $(".coincoin").first()

    // Create the API client
    const api_root = $coincoin.data("api-root")
    const client = new APIClient(api_root)

    // Create the booklet
    const booklet = new BoardBookletLayout(client, {
        outlined: true
    });
    $coincoin.append(booklet.$element)
}


$(main)
