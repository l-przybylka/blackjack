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
if(!(localStorage.getItem('dealerScore'))) {
    localStorage.setItem('dealerScore', 0)
}

if(!(localStorage.getItem('playerScore'))) {
    localStorage.setItem('playerScore', 0)
}

document.getElementById('start').addEventListener('click', start)

function start() {
    fetch(`https://deckofcardsapi.com/api/deck/${localStorage.getItem('deckID')}/draw/?count=4`)
        .then(res => res.json()) // parse response as JSON
        .then(data => {
          console.log(data)
          document.querySelector('#cardDealer-1').src = data.cards[0].image
          document.querySelector('#cardDealer-2').src = data.cards[1].image
          document.querySelector('#cardPlayer-1').src = data.cards[2].image
          document.querySelector('#cardPlayer-2').src = data.cards[3].image
        })
        .catch(err => {
            console.log(`error ${err}`)
         })
}

document.getElementById('hit').addEventListener('click', hit)

function hit() {
    fetch(`https://deckofcardsapi.com/api/deck/${localStorage.getItem('deckID')}/draw/?count=1`)
        .then(res => res.json())
        .then(data => {
            document.querySelector('#cardPlayer-3').src = data.cards[0].image
        })
}


document.getElementById('reset').addEventListener('click', reset)

function reset() {
    // hides all the cards, figure out how to show only the current cards in the game above.
    // document.querySelectorAll('.cards').forEach(el => {el.style.display = 'none'})
    fetch(`https://deckofcardsapi.com/api/deck/${localStorage.getItem('deckID')}/shuffle`)
        .then(res => res.json()) // parse response as JSON
        .then(data => {
          console.log(data)
        })
        .catch(err => {
            console.log(`error ${err}`)
    })
}

function convertToNum(val) {
    if(val === 'ACE') {
        return 1
    } else if (val === 'KING' || val === 'QUEEN' || val === 'JACK') {
        return 10
      } else {
        return Number(val)
      }
}