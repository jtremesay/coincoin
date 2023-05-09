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
    this.get(`boards/${board.uuid}/posts`, callback)
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
    this.$element.text(JSON.stringify(posts))
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
