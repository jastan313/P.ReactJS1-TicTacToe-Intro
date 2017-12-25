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

    renderRow(i, j) {
        var tmp = [];
        for (var index = i; i < j; i++) {
            tmp.push(index);
        }
        var squares = tmp.map((i) => (this.renderSquare(i)));
        return (
                <div className="board-row">
                    {squares}
                </div>
                );
    }

    render() {
        return (
                <div>
                    <div className="board-row">
                        {this.renderSquare(0)}
                        {this.renderSquare(1)}
                        {this.renderSquare(2)}
                    </div>
                    <div className="board-row">
                        {this.renderSquare(3)}
                        {this.renderSquare(4)}
                        {this.renderSquare(5)}
                    </div>
                    <div className="board-row">
                        {this.renderSquare(6)}
                        {this.renderSquare(7)}
                        {this.renderSquare(8)}
                    </div>
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
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const moves = this.state.moves;
        if (squares[i]) {
            this.setState({
                history: history,
                moves: moves,
                selected: i,
                stepNumber: this.state.stepNumber,
                xIsNext: this.state.xIsNext,
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

    checkWinner() {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const moves = this.state.moves;
        const winningMoves = this.state.winningMoves;
        let winningSquares = calculateWinner(squares);
        if (winningSquares) {
            for (var index = 0; index < winningSquares.length; index++) {
                winningMoves[winningSquares[index]] = true;
            }
            this.setState({
                history: history,
                moves: moves,
                winningMoves: winningMoves,
                selected: this.state.selected,
                stepNumber: this.state.stepNumber,
                xIsNext: this.state.xIsNext,
            });
        }
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const previousMoves = history.map((step, move) => {
            const desc = move ?
                    'Go to move #' + move + ", " +
                    step.mark + " at (" + (parseInt(step.index / 3) + 1) + ", " + (step.index % 3 + 1) + ")" :
                    'Go to game start';
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

