if(!(localStorage.getItem('deckID'))) {
    fetch('https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=8')
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        localStorage.setItem('deckID', data.deck_id)
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

if(!(localStorage.getItem('dealerCards'))) {
    localStorage.setItem('dealerCards', [])
}

if(!(localStorage.getItem('playerCards'))) {
    localStorage.setItem('playerCards', [])
}

if(!(localStorage.getItem('dealerCount'))) {
    localStorage.setItem('dealerCount', 0)
}

if(!(localStorage.getItem('playerCount'))) {
    localStorage.setItem('playerCount', 0)
}

document.getElementById('start').addEventListener('click', start)

function start() {
    fetch(`https://deckofcardsapi.com/api/deck/${localStorage.getItem('deckID')}/draw/?count=4`)
        .then(res => res.json()) // parse response as JSON
        .then(data => {
          console.log(data)
          //Dealer
          document.querySelector('#cardDealer-1').src = data.cards[0].image
          document.querySelector('#cardDealer-2').src = data.cards[1].image

          let dealerScore = convertToNum(data.cards[0].value) + convertToNum(data.cards[1].value)
          localStorage.setItem('dealerScore', dealerScore)

          let dealerCards = [data.cards[0].value, data.cards[1].value]
          localStorage.setItem('dealerCards', dealerCards)

          localStorage.setItem('dealerCount', 2)
            
          //Player
          document.querySelector('#cardPlayer-1').src = data.cards[2].image
          document.querySelector('#cardPlayer-2').src = data.cards[3].image

          let playerScore = convertToNum(data.cards[2].value) + convertToNum(data.cards[3].value)
          localStorage.setItem('playerScore', playerScore)

          let playerCards = [data.cards[2].value, data.cards[3].value]
          localStorage.setItem('playerCards', playerCards)

          localStorage.setItem('playerCount', 2)
          
          if(checkBlackjack(localStorage.playerCards)) {
              if(checkBlackjack(localStorage.dealerCards)) {
                  return alert("It's a tie")
              }
              return alert("BLACKJACK! You win!")
          }

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
            let playerCount = Number(localStorage.playerCount) + 1
            localStorage.setItem('playerCount', playerCount)
            document.querySelector(`#cardPlayer-${Number(localStorage.playerCount)}`).src = data.cards[0].image
            let playerScore = convertToNum(localStorage.playerScore) + convertToNum(data.cards[0].value)
            localStorage.setItem('playerScore', playerScore)
            if(localStorage.playerScore > 21) {
                alert('Bust, you lose')
            }
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

function checkBlackjack(hand) {
    if(hand.includes('ACE') && hand.includes('KING') || hand.includes('ACE') && hand.includes('QUEEN') || hand.includes('ACE') && hand.includes('JACK')) {
        return true
    }
}