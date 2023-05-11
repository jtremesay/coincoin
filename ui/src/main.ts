
import $ from 'jquery'
import { APIClient } from "./APIClient";
import { BoardBookletLayout } from './widgets/BoardBookletLayout';


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

main()
