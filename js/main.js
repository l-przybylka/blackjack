if(!(localStorage.getItem('deckID'))) {
    fetch('https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=8')
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        localStorage.setItem('deckID', data.deck_id)
        console.log(data)
      })
      .catch(err => {
          console.log(`error ${err}`)
      })
    }

document.getElementById('startGame').addEventListener('click', startGame)

function startGame() {
    fetch(`https://deckofcardsapi.com/api/deck/${localStorage.getItem('deckID')}/draw/?count=2`)
    .then(res => res.json()) // parse response as JSON
    .then(data => {
      console.log(data)
    })
    .catch(err => {
        console.log(`error ${err}`)
    })
  }