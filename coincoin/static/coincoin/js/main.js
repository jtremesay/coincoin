$(function () {

    function BoardPageLayout(board, config) {
        BoardPageLayout.super.call(this, board.slug, config);
        this.board = board

        this.$element.append(this.board.name);
    }
    OO.inheritClass(BoardPageLayout, OO.ui.PageLayout);
    BoardPageLayout.prototype.setupOutlineItem = function () {
        this.outlineItem.setLabel(this.board.name);
    };

    // Get the app container
    const $coincoin = $(".coincoin").first()

    // Create the booklet
    const booklet = new OO.ui.BookletLayout({
        outlined: true
    });
    $coincoin.append(booklet.$element)

    // Get the API urls
    const api_root_url = $coincoin.data("api-root")
    axios({
        method: 'get',
        url: api_root_url
    }).then(function (response) {
        const api_urls = response.data

        // Get the boards
        axios({
            method: 'get',
            url: api_urls.boards
        }).then(function (response) {
            const boards = response.data
            for (let board of boards) {
                const page = new BoardPageLayout(board)
                booklet.addPages([page])
            }
        })
    })
});
