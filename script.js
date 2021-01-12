class Die {
   constructor(num) {
      this.no = num;
      this.value = 0;
   }

   throw() {
      this.value = Math.ceil(Math.random() * 6);
      return this.value;
   }
}

class Dice {
   constructor(num = 5) {
      this.dice = [];
      this.diceValues = [];
      this.throws_left = 2;
      for (let i = 0; i < num; i++) {
         let d = new Die('die' + (i + 1));
         this.dice.push(d);
      }
      this.throw();
   }

   throw() {
      document.getElementById('checkdice').addEventListener('click', () => {
         //Tärningslogiken från föreläsningen
         let dice = Array.from(
            document.querySelectorAll('input[type=checkbox]')
         );
         if (this.throws_left >= 0) {
            let checked = dice
               .filter((current_die) => {
                  return current_die.checked;
               })
               .map((die) => die.value);
            this.diceValues = [];
            for (let die of this.dice) {
               if (checked.includes(die.no)) {
                  this.diceValues.push(die.value);
               } else {
                  die.throw();
                  this.diceValues.push(die.value);
               }
            }
            this.draw();
            this.throws_left--;
         }
      });
   }

   draw() {
      let throws_text = document.getElementById('throws-left');
      let draw_dice = document.getElementsByClassName('die');
      let value = 1;
      throws_text.innerText = `Antal kast kvar: ${this.throws_left}`;
      Array.from(draw_dice).forEach((die) => {
         if (die.children[1].checked == false) {
            die.innerHTML = `<label for="die${value}">
				<img src="images/dice/${this.diceValues[value - 1]}.png" width="75px">
			   </label>
            <input type="checkbox" value="die${value}" id="die${value}">`;
            value++;
         } else {
            value++;
         }
      });
   }
}

class Player {
   constructor(name, avatar, fields) {
      this.name = name;
      this.avatar = avatar;
      this.fields = fields;
      this.myturn = false;
      this.round = 0;
      this.dice_values;

      this.fields[0].addEventListener('mousemove', (event) => {
         if (this.myturn) {
            if (this.round < 7) {
               for (let i = 1; i <= 7; i++) {
                  if (
                     event.target.parentElement.children[i].classList.contains(
                        'free'
                     )
                  ) {
                     event.target.parentElement.children[i].innerText = '';
                     event.target.parentElement.children[i].classList.remove(
                        'lighten'
                     );
                     if (
                        event.target == event.target.parentElement.children[i]
                     ) {
                        event.target.classList.add('lighten');
                        event.target.innerText = this.countValues(
                           i,
                           this.dice_values
                        );
                     }
                  }
               }
            } else {
               for (let i = 9; i <= 18; i++) {
                  if (
                     event.target.parentElement.children[i].classList.contains(
                        'free'
                     )
                  ) {
                     event.target.parentElement.children[i].classList.remove(
                        'lighten'
                     );
                     event.target.parentElement.children[i].innerText = '';
                     if (
                        event.target == event.target.parentElement.children[i]
                     ) {
                        event.target.classList.add('lighten');
                        event.target.innerText = this.countPairs(
                           i,
                           this.dice_values,
                           event.target
                        );
                     }
                  }
               }
            }
         }
      });

      this.fields[0].addEventListener('click', (event) => {
         //Lägg in funktion så att man inte kan komma framåt genom att klicka
         // på det fältet som man inte är på
         if (this.myturn) {
            //console.log(event);
            if (event.target.classList.contains('free')) {
               if (this.round < 7) {
                  if (event.target.classList.contains('round1')) {
                     event.target.classList.remove('free');
                     event.target.classList.remove('lighten');
                     event.target.parentElement.classList.remove('green');
                     this.myturn = false;
                     this.countScore();
                     game.playTurn();
                  }
               } else {
                  if (event.target.classList.contains('round2')) {
                     event.target.classList.remove('free');
                     event.target.classList.remove('lighten');
                     event.target.parentElement.classList.remove('green');
                     this.myturn = false;
                     this.countTotal();
                     game.playTurn();
                  }
               }
            }
         }
      });

      this.setupPlayer();
   }
   setupPlayer() {
      this.fields[0].children[0].innerText = this.name;
   }

   drawTurn(dice_values, turn) {
      this.dice_values = dice_values;
      this.myturn = turn;
      this.round++;
      if (this.round == 16) {
         game.endGame();
      }
   }

   countValues(row_value, values) {
      let counter = 0;
      for (let value of values.diceValues) {
         if (value == row_value) {
            counter++;
         }
      }
      return counter * row_value;
   }
   countPairs(row_value, values, target) {
      let dice = values.diceValues.sort(function (a, b) {
         return a - b;
      });
      //PAR
      if (target == target.parentElement.children[9]) {
         for (let x = 6; x > 0; x--) {
            let test = dice.filter((current) => current == x);
            if (test.length >= 2) {
               return test[0] * 2;
            }
         }
         return 0;
         //TVÅ PAR
      } else if (target == target.parentElement.children[10]) {
         for (let a = 6; a > 0; a--) {
            let first = dice.filter((current) => current == a);
            if (first.length >= 2) {
               for (let b = 1; b < 6; b++) {
                  let second = dice.filter((current) => current == b);
                  if (second.length >= 2 && second[0] != first[0]) {
                     return first[0] * 2 + second[0] * 2;
                  }
               }
            }
         }
         return 0;
         //TRISS
      } else if (target == target.parentElement.children[11]) {
         for (let x = 6; x > 0; x--) {
            let test = dice.filter((current) => current == x);
            if (test.length >= 3) {
               return test[0] * 3;
            }
         }
         return 0;
      }
      //FYRTAL
      else if (target == target.parentElement.children[12]) {
         for (let x = 6; x > 0; x--) {
            let test = dice.filter((current) => current == x);
            if (test.length >= 4) {
               return test[0] * 4;
            }
         }
         return 0;
      }
      //LITEN STEGE
      else if (target == target.parentElement.children[13]) {
         for (let x = 1; x < 6; x++) {
            if (dice[x - 1] != x) {
               return 0;
            }
         }
         return 15;
      }
      //STOR STEGE
      else if (target == target.parentElement.children[14]) {
         for (let x = 2; x < 7; x++) {
            if (dice[x - 2] != x) {
               return 0;
            }
         }
         return 20;
      }
      //KÅK
      else if (target == target.parentElement.children[15]) {
         for (let a = 6; a > 1; a--) {
            let first = dice.filter((current) => current == a);
            if (first.length >= 2) {
               for (let b = 1; b < 6; b++) {
                  let second = dice.filter((current) => current == b);
                  if (first.length == 3 && second.length == 2) {
                     return first[0] * 3 + second[0] * 2;
                  } else if (second.length == 3 && first.length == 2) {
                     return first[0] * 2 + second[0] * 3;
                  }
               }
            }
         }
         return 0;
      }
      //CHANS
      else if (target == target.parentElement.children[16]) {
         return dice.reduce((prev, curr) => prev + curr, 0);
      }
      //YATZY
      else if (target == target.parentElement.children[17]) {
         for (let x = 6; x > 0; x--) {
            let test = dice.filter((current) => current == x);
            if (test.length == 5) {
               return 50;
            }
         }
         return 0;
      }
   }
   //RÄKNAR UT POÄNGEN PÅ DET ÖVRE FÄLTET
   countScore() {
      let score = Array.from(this.fields[0].children)
         .filter((field) => field.classList.contains('round1'))
         .map((field) => field.innerText)
         .filter((value) => Number(value))
         .reduce((prev, curr) => eval(prev) + eval(curr), 0);
      this.fields[0].children[7].innerText = score;
      if (score >= 63) {
         this.fields[0].children[8].innerText = 50;
      }
   }
   //RÄKNAR UT POÄNGEN PÅ DET NEDRE FÄLTET
   countTotal() {
      let score = Array.from(this.fields[0].children)
         .filter((field) => field.classList.contains('round2'))
         .map((field) => field.innerText)
         .filter((value) => Number(value))
         .reduce((prev, curr) => eval(prev) + eval(curr), 0);
      let sum =
         Number(this.fields[0].children[7].innerText) +
         Number(this.fields[0].children[8].innerText);
      this.fields[0].children[18].innerText = score + sum;
   }
}

class Game {
   constructor(players) {
      this.no_of_players = players;
      this.setup();
      this.players = [];
      this.whos_turn = 0;
      this.elements = document.getElementsByClassName('score_board');
      this.clear_dice = document.querySelectorAll('.die');
   }
   setup() {
      document.getElementById('no-of-players').style.display = 'none';
      document.getElementById('player-info').style.display = 'block';
      let name_input = document.getElementById('input-name');
      let name_label = document.getElementById('name-label');
      let player_slots = document.querySelectorAll('.user');
      let name = 0;
      name_label.innerText = `Namn på spelare ${name + 1}`;
      document.querySelectorAll('.avatar').forEach((item) => {
         item.addEventListener('click', (event) => {
            if (name_input.value != '') {
               name++;
               name_label.innerText = `Namn på spelare ${name + 1}`;
               if (!item.classList.contains('grey')) {
                  item.innerHTML += name_input.value;
                  //SKAPA EN KLASS PLAYER OCH SPARA NAMN OCH AVATAR TILL DENNA
                  let x = new Player(
                     name_input.value,
                     item.innerHTML,
                     document.querySelectorAll(`.player${name}`)
                  );
                  this.players.push(x);
                  item.classList.add('grey');
                  player_slots[this.players.length - 1].innerHTML =
                     item.innerHTML;
                  name_input.value = '';
                  if (name >= this.no_of_players) {
                     document.getElementById('splash').style.display = 'none';
                     this.playTurn();
                  }
               }
            }
         });
      });
   }

   playTurn() {
      this.clearDice();
      this.whos_turn =
         this.whos_turn === this.no_of_players ? 1 : this.whos_turn + 1;

      let current_player = document.getElementsByClassName(
         `player${this.whos_turn}`
      );

      let current_avatar = document.querySelectorAll(
         `.avatar${this.whos_turn}`
      );
      current_player[0].classList.add('green');
      for (let child of current_avatar[0].parentElement.children) {
         child.classList.remove('active-avatar');
      }
      current_avatar[0].classList.add('active-avatar');
      let dice = new Dice();
      this.players[this.whos_turn - 1].drawTurn(dice, true);
   }
   endGame() {
      let end_splash = document.getElementById('endscreen');
      end_splash.style.display = 'block';
      let board = document.querySelectorAll('.player');
      let scores = [];
      for (let result of board) {
         let player = {
            name: result.children[0].innerText,
            score: result.children[18].innerText,
         };
         scores.push(player);
      }
      scores.sort((a, b) => a.score - b.score);
      let winner = scores.pop();
      end_splash.innerHTML = `<div id="close-endscreen">&#10008;</div>
      <p>${winner.name} vann med</p><h2>${winner.score} poäng!</h2>`;

      localStorage.setItem(
         `winner${localStorage.length + 1}`,
         `${winner.name} ${winner.score}`
      );

      let end_btn = document.getElementById('close-endscreen');
      this.clearDice();
      end_btn.addEventListener('click', () => {
         location.reload();
      });
   }
   clearDice() {
      this.clear_dice.forEach((die) => {
         die.innerHTML = `<label for="die"><img src="images/dice/blank.png" width="75px"></label>
			<input type="checkbox" value="die" id="die" disabled="true">`;
      });
   }
}

let game;
window.addEventListener('DOMContentLoaded', () => {
   let add_player_button_1 = document.getElementById('btn1');
   let add_player_button_2 = document.getElementById('btn2');
   let add_player_button_3 = document.getElementById('btn3');
   let add_player_button_4 = document.getElementById('btn4');
   let splash = document.getElementById('splash');
   let start_btn = document.getElementById('start');
   let highscore = document.getElementById('highscore');
   start_btn.addEventListener('click', () => {
      splash.style.display = 'block';
      start_btn.style.display = 'none';
   });

   add_player_button_1.addEventListener('click', () => {
      game = new Game(1);
   });
   add_player_button_2.addEventListener('click', () => {
      game = new Game(2);
   });
   add_player_button_3.addEventListener('click', () => {
      game = new Game(3);
   });
   add_player_button_4.addEventListener('click', () => {
      game = new Game(4);
   });
   highscores = [];
   for (let i = 1; i < localStorage.length + 1; i++) {
      if (localStorage.getItem(`winner${i}`)) {
         let tmp = localStorage.getItem(`winner${i}`).split(' ');
         let obj = { name: `${tmp[0]}`, score: `${tmp[1]}` };
         highscores.push(obj);
      }
   }

   highscores.sort((a, b) => b.score - a.score);

   for (let winner of highscores) {
      let p_tag_left = document.createElement('p');
      let p_tag_right = document.createElement('p');
      let name = document.createTextNode(winner.name);
      let score = document.createTextNode(winner.score + ' poäng');
      p_tag_left.appendChild(name);
      p_tag_right.appendChild(score);
      highscore.children[0].appendChild(p_tag_left);
      highscore.children[1].appendChild(p_tag_right);
   }
});
