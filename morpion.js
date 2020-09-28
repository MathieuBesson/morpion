
class Morpion {

    constructor(element_id, dimension = 9) {
        this.element = document.querySelector(element_id);
        this.winMessage = this.createElements({
            message: { 'element': 'div', 'HTMLClass': 'win-message', 'content': '' },
        });
        this.dimension = dimension;
        this.rows = this.cols = Math.sqrt(dimension);

        this.turn = 1;
        this.stateGame = false;

        this.players = {
            score: [0, 0],
            winner: '',
            items: ['X', 'O'],
            playersItems: [],
        };

        this.move = 0;
        this.board = Array(this.dimension).fill(null);
        this.element.addEventListener('click', (event) => this.handle_click(event));
        this.start();
    }

    resetValue (){
        this.stateGame = true;
        this.players = {
            score: [0, 0],
            winner: '',
            items: ['X', 'O'],
            playersItems: [],
        };
        this.board = Array(this.dimension).fill(null);
    }

    start() {
        this.displayItemChoice();
        let choice = [document.querySelector('.btn-primary'), document.querySelector('.btn-secondary')];
        choice.map((item, index) => {
            item.addEventListener('click', (event) => {
                this.stateGame = false;
                this.players.playersItems[0] = event.target.textContent;
                this.players.playersItems[1] = (this.players.playersItems[0] == this.players.items[0]) ? this.players.items[1] : this.players.items[0];
                this.render();
            });
        });
    }

    displayPlayersInfos() {
        let item = this.next(this.turn);
        let createdElements = this.createElements({
            players: { 'element': 'div', 
                       'HTMLClass': 'turn', 
                       'innerHTML': 'It\'s player <span class="item-' + item + '">' + item + '</span>\'s turn'},
            },
        );
        return createdElements.players;
    }



    displayItemChoice() {
        let createdElements = this.createElements({
            'title': { 'element': 'h1', 'HTMLClass': 'title', 'content': 'Morpion' },
            'choice': { 'element': 'div', 'HTMLClass': 'choice' },
            'sentence': { 'element': 'p', 'HTMLClass': 'sentence', 'content': 'Pick Your side !' },
            'items': { 'element': 'div', 'HTMLClass': 'items' },
            'itemJ1': { 'element': 'button', 'HTMLClass': 'btn btn-primary', 'content': this.players.items[0] },
            'itemJ2': { 'element': 'button', 'HTMLClass': 'btn btn-secondary', 'content': this.players.items[1] },
        });

        createdElements.items.prepend(createdElements.itemJ1, createdElements.itemJ2);
        createdElements.choice.prepend(this.winMessage.message, createdElements.sentence, createdElements.items);
        this.element.innerHTML = '';
        this.element.prepend(createdElements.title, createdElements.choice);
    }

    handle_click(event) {
        let target = event.target.dataset.target;
        if (target !== undefined) {
            if (this.board[target] == null) {
                this.board[target] = this.next(this.turn);
                this.turn = (this.turn === 1) ? 2 : 1;
            }
            this.render();
        }
    }

    render() {
        let tab = this.splitArray(this.board, this.rows);

        let hightElements = this.createElements({
            'title': { 'element': 'h1', 'HTMLClass': 'title', 'content': 'Morpion' },
            'div': { 'element': 'div', 'HTMLClass': 'border-table' },
            'table': { 'element': 'table', 'HTMLClass': 'game' },
        });

        let target = 0;
        for (let i = 0; i < tab.length; i++) {
            let tr = document.createElement('tr');
            for (let j = 0; j < tab[i].length; j++) {
                let lowElements = this.createElements({
                    'span': { 'element': 'span', 'content': this.board[target]},
                    'td': { 'element': 'td', 'HTMLClass': 'morp', 'attribute': ['data-target', target] }
                });

                if (this.board[target] !== null) {
                    lowElements.td.classList.add((this.board[target] == this.players.items[0]) ? 'playerX' : 'playerO');
                }
                
                lowElements.td.appendChild(lowElements.span);
                tr.appendChild(lowElements.td);
                hightElements.table.appendChild(tr);
                target++;
            }
        }
        this.win();
        if (!this.stateGame) {
            hightElements.div.appendChild(hightElements.table);
            this.element.innerHTML = '';
            this.element.prepend(hightElements.title, this.displayPlayersInfos(), hightElements.div);
        }
    }


    win() {
        const winningConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        let completed = 0;
        let roundWon = false;
        for (let i = 0; i < winningConditions.length; i++) {
            const winCondition = winningConditions[i];
            let a = this.board[winCondition[0]];
            let b = this.board[winCondition[1]];
            let c = this.board[winCondition[2]];
            if (a === null || b === null || c === null) {
                this.stateGame = false;
                continue;
            }
            if(a !== null && b !== null && c !== null){
                completed++;
            }
            if (a === b && b === c) {
                this.players.winner = a;
                roundWon = true;
                break;
            }
        }

        let conditions = [
            {'condition' : roundWon, 'content' : '<div class="item-' + this.players.winner + '">Game won by player ' + this.players.winner + '</div>'}, 
            {'condition' : completed == winningConditions.length, 'content' : '<div><span class="item-X">Equa</span><span class="item-O">lity !</span></div>'},
        ];
        conditions.map((item, index) => {
            if(item.condition){
                this.winMessage.message.innerHTML = item.content;
                this.resetValue();
                roundWon = false;
                this.start();
            }
        })
    }


    //Useful functions

    next(turn){
        return (turn == 1) ? this.players.playersItems[0] : this.players.playersItems[1];
    }

    createElements(elements) {
        let createdElements = {};
        for (let property in elements) {
            createdElements[property] = document.createElement(elements[property].element);
            if (elements[property].hasOwnProperty('HTMLClass')) {
                createdElements[property].classList.add(...elements[property].HTMLClass.split(' '));
            }
            if (elements[property].hasOwnProperty('content')) {
                createdElements[property].textContent = elements[property].content;
            }
            if (elements[property].hasOwnProperty('attribute')) {
                createdElements[property].setAttribute(...elements[property].attribute);
            }
            if (elements[property].hasOwnProperty('innerHTML')) {
                createdElements[property].innerHTML = elements[property].innerHTML;
            }
        }
        return createdElements;
    }

    splitArray(array, chunk) {
        var i, j, rslt = [];
        chunk = chunk;
        for (i = 0, j = array.length; i < j; i += chunk) {
            rslt.push(array.slice(i, i + chunk));
        }
        return rslt;
    }
}

let morpion = new Morpion('#morpion');




