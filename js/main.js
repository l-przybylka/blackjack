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

if(!(localStorage.getItem('playerMoney'))) {
    localStorage.setItem('playerMoney', 5000)
}

if(!(localStorage.getItem('gameOn'))) {
    localStorage.setItem('gameOn', 'false')
}

if(!(localStorage.getItem('playerBet'))) {
    localStorage.setItem('playerBet', '0')
}

document.getElementById('wallet').innerText = localStorage.playerMoney

document.getElementById('start').addEventListener('click', start)

function start() {
  
  if(localStorage.gameOn != 'true') {
    document.querySelectorAll('.cards').forEach(el => {el.style.display = 'none'})
    localStorage.setItem('gameOn', 'true')
    localStorage.setItem('playerBet', document.getElementById('betAmount').value) 
    let bet = localStorage.playerBet
    if(bet != 0) {
        let money = localStorage.playerMoney
        localStorage.setItem('playerMoney', money - bet)
        document.getElementById('wallet').innerText = localStorage.playerMoney
        fetch(`https://deckofcardsapi.com/api/deck/${localStorage.getItem('deckID')}/draw/?count=4`)
            .then(res => res.json()) // parse response as JSON
            .then(data => {
              //Dealer
              document.querySelector('#cardDealer-1').src = data.cards[0].image
              document.querySelector('#cardDealer-1').style.display = 'inline'
              document.querySelector('#cardDealer-2').src = data.cards[1].image
              document.querySelector('#cardDealer-2').style.display = 'inline'
              let dealerScore = convertToNum(data.cards[0].value) + convertToNum(data.cards[1].value)
              localStorage.setItem('dealerScore', dealerScore)
              let dealerCards = [data.cards[0].value, data.cards[1].value]
              localStorage.setItem('dealerCards', dealerCards)
              localStorage.setItem('dealerCount', 2)

              //Player
              document.querySelector('#cardPlayer-1').src = data.cards[2].image
              document.querySelector('#cardPlayer-1').style.display = 'inline'
              document.querySelector('#cardPlayer-2').src = data.cards[3].image
              document.querySelector('#cardPlayer-2').style.display = 'inline'
              let playerScore = convertToNum(data.cards[2].value) + convertToNum(data.cards[3].value)
              localStorage.setItem('playerScore', playerScore)
              let playerCards = [data.cards[2].value, data.cards[3].value]
              localStorage.setItem('playerCards', playerCards)
              localStorage.setItem('playerCount', 2)
            
              if(checkBlackjack(localStorage.playerCards)) {
                  if(checkBlackjack(localStorage.dealerCards)) {
                      localStorage.setItem('playerMoney', Number(money) + bet)
                      localStorage.setItem('gameOn', 'false')
                      return alert("It's a tie")
                  }
                  localStorage.setItem('playerMoney', Number(money) + (bet * 2.5))
                  document.getElementById('wallet').innerText = localStorage.playerMoney
                  localStorage.setItem('gameOn', 'false')
                  return alert("BLACKJACK! You win!")
              }

            })
            .catch(err => {
                console.log(`error ${err}`)
             })
    } else {
        localStorage.setItem('gameOn', 'false')
        alert('You need to place a bet')
}
} else {
    alert("The game is already running")
}
}

document.getElementById('hit').addEventListener('click', hit)

function hit() {
    if(localStorage.gameOn === 'true') {
    fetch(`https://deckofcardsapi.com/api/deck/${localStorage.getItem('deckID')}/draw/?count=1`)
        .then(res => res.json())
        .then(data => {
            let playerCount = Number(localStorage.playerCount) + 1
            localStorage.setItem('playerCount', playerCount)
            document.querySelector(`#cardPlayer-${Number(localStorage.playerCount)}`).src = data.cards[0].image
            document.querySelector(`#cardPlayer-${Number(localStorage.playerCount)}`).style.display = 'inline'
            let playerScore = convertToNum(localStorage.playerScore) + convertToNum(data.cards[0].value)
            localStorage.setItem('playerScore', playerScore)
            if(localStorage.playerScore > 21) {
                localStorage.setItem('gameOn', 'false')
                document.getElementById("betAmount").innerText = ""
                alert('Bust, you lose')
                document.querySelectorAll('.cards').forEach(el => {el.style.display = 'none'})
            }
        })
} else {
    alert("The game isn't on")
}
}

document.getElementById('stand').addEventListener('click', stand)

function stand() {
    // ADD OPTION TO TREAT ACE + FACE AS BLACKJACK INSTEAD OF 1


    // SELF NOTE: It looks like the while loop doesn't wait for the fetch to do it's thing, when localStorage.setItem('dealerScore', dealerScore) was inside of the fetch, causing loop to be infinite. Setting variable outside of the loop and then updating it outside of the fetch solved the problem
    let bet = localStorage.playerBet
    let i = Number(localStorage.dealerScore)
    let dealerScore = Number(localStorage.dealerScore)
    while( i < 17) {
        fetch(`https://deckofcardsapi.com/api/deck/${localStorage.getItem('deckID')}/draw/?count=1`)
        .then(res => res.json())
        .then(data => {
            let dealerCount = Number(localStorage.dealerCount) + 1
            localStorage.setItem('dealerCount', dealerCount)
            document.querySelector(`#cardDealer-${Number(localStorage.dealerCount)}`).src = data.cards[0].image
            document.querySelector(`#cardDealer-${Number(localStorage.dealerCount)}`).style.display = 'inline'
            dealerScore = Number(localStorage.dealerScore) + convertToNum(data.cards[0].value)
            localStorage.setItem('dealerScore', dealerScore)
        })
        i+=Number(localStorage.dealerScore)

}
    if(Number(dealerScore) > Number(localStorage.playerScore)) {
        localStorage.setItem('gameOn', 'false')
        alert("House wins")
    } else if(Number(dealerScore) === Number(localStorage.playerScore)) {
        localStorage.setItem('gameOn', 'false')
        alert("It's a tie, bet returns")
    } else if (Number(localStorage.playerScore) > Number(dealerScore)) {
        localStorage.setItem('gameOn', 'false')
        localStorage.setItem('playerMoney', Number(localStorage.playerMoney) + (bet * 2))
        alert(`You win ${bet * 2}`)
        
        
    }
    document.getElementById('betAmount').value = ''
}


document.getElementById('reset').addEventListener('click', reset)

function reset() {
    document.querySelectorAll('.cards').forEach(el => {el.style.display = 'none'}) // IMPORTANT TO REMEMBER
    localStorage.setItem('playerMoney', 5000)
    localStorage.setItem('gameOn', false)
    localStorage.setItem('dealerScore', 0)
    document.getElementById('betAmount').value = ''
    document.getElementById('wallet').innerText = localStorage.playerMoney
    fetch(`https://deckofcardsapi.com/api/deck/${localStorage.getItem('deckID')}/shuffle`)
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