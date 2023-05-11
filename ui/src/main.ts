
import $ from 'jquery'
import { APIClient } from "./APIClient";

const $coincoin = $('.coincoin').first();
const api_root = $coincoin.data("api-root")!

const client = new APIClient(api_root)
client.get_boards(boards => {
  for (let board of boards) {
    client.get_posts(board, (posts) => {
      console.log(board, posts)
    })
  }
})
