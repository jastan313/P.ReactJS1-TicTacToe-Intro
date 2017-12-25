import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
class Square extends React.Component {
    render() {
        const style = {fontWeight: this.props.selected ? 'bold' : 'normal',
            background: this.props.winningSquare ? 'yellow' : 'white'};
        return (
                <button className="square" style={style}
                        onClick={() => this.props.onClick()}>
                    {this.props.value}
                </button>
                );
    }
}

class Board extends React.Component {
    renderSquare(i) {
        let winningSquare = this.props.winningMoves[i];
        return (
                <Square
                    value={this.props.squares[i]}
                    winningSquare={winningSquare}
                    selected={this.props.selected === i}
                    onClick={() => this.props.onClick(i)}
                    />
                );
    }

    render() {
        var rows = [];
        let squares = [];
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                squares.push(this.renderSquare(i * 3 + j));
            }
            rows.push(<div className="board-row">{squares}</div>);
            squares = [];
        }
        return (
                <div>
                    {rows}
                </div>
                );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                    squares: Array(9).fill(null),
                    mark: ' ',
                    index: -1,
                }],
            moves: Array(9).fill(-1),
            selected: -1,
            stepNumber: 0,
            xIsNext: true,
            movesListDesc: true,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const moves = this.state.moves;
        if (squares[i]) {
            this.setState({
                selected: i,
            });
            return;
        }

        if (calculateWinner(squares)) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        moves[i] = history.length;
        this.setState({
            history: history.concat([{
                    squares: squares,
                    mark: squares[i],
                    index: i,
                }]),
            moves: moves,
            selected: i,
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    toggleListOrder() {
        this.setState({
            movesListDesc: !this.state.movesListDesc,
        });
    }

    render() {
        let prevMovesHistory = this.state.movesListDesc ? this.state.history : this.state.history.slice(0).reverse();
        const history = this.state.history;
        const current = history[this.state.stepNumber];

        let previousMoves = prevMovesHistory.map((step, move) => {
            const desc = move ? 'Go to move #' + move + ", " +
                    step.mark + " at (" + (parseInt(step.index / 3) + 1) + ", " + (step.index % 3 + 1) + ")" : "Go to game start";
            const style = this.state.moves[this.state.selected] === move ? {fontWeight: 'bold'} : {fontWeight: 'normal'};
            return (
                    <li key={move}>
                        <button style={style}
                                onClick={() => this.jumpTo(move)}>{desc}</button>
                    </li>
                    );
        });


        let status;
        let winningMoves = Array(9).fill(false);
        let winningSquares = calculateWinner(current.squares);
        if (winningSquares) {
            status = 'Winner: ' + (!this.state.xIsNext ? 'X' : 'O') + " with moves at " + winningSquares;
            for (var index = 0; index < winningSquares.length; index++) {
                winningMoves[winningSquares[index]] = true;
            }
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
                <div className="game">
                    <div className="game-board">
                        <Board
                            squares={current.squares}
                            selected={this.state.selected}
                            winningMoves={winningMoves}
                            onClick={(i) => this.handleClick(i)}
                            />
                    </div>
                    <div className="game-info">
                        <div>{status}</div>
                        <div> Current Order: {this.state.movesListDesc ? "Descending" : "Ascending"}
                            <button onClick={() => this.toggleListOrder()}>
                                {this.state.movesListDesc ? "-> Ascending" : "-> Descending"}</button>
                        </div>
                        <ol>{previousMoves}</ol>
                    </div>
                
                </div>
                );
    }
}

// ========================================

ReactDOM.render(
        <Game />,
        document.getElementById('root')
        );



function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return [a, b, c];
        }
    }
    return null;
}

