import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  renderRows() {
    let x = []
    for (let i = 0; i < 3; i++) {
      x.push(<div className="board-row" key={i}> {this.renderSquare(i * 3)} {this.renderSquare(i * 3 + 1)} {this.renderSquare(i * 3 + 2)}  </div>)
    }
    return <div> {x}</div>;
  }

  render() {
    return (
      this.renderRows()
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      lastMove: []
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const lastMove = this.state.lastMove
    if (calculateWinner(squares) || squares[i]) {
      return;
    }


    squares[i] = this.state.xIsNext ? "X" : "O";
    let [x, y] = [Math.floor(i / 3), i - Math.floor(i / 3) * 3]
    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      lastMove: lastMove.concat([[x, y]])
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, move) => {

      // bold out selected move
      if (move === this.state.stepNumber) {

        let desc = move ?
          'Go to move #' + move + ' and the coordinates were: ' + this.state.lastMove[move - 1] :
          'Go to game start';
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}><b>{desc}</b></button>
          </li>
        );
      }
      else {
        let desc = move ?
          'Go to move #' + move + ' and the coordinates were: ' + this.state.lastMove[move - 1] :
          'Go to game start';
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      }
    });

    let status;
    if (winner) {
      status = "Winner: " + winner.props.children[1];
      alert(status)
    }
    else if (this.state.stepNumber === 9 && winner) {
      status = "Match Drawn! "
      alert(status)
    }
    else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      squares[a] = <font color="green"> {squares[a]}</font>
      squares[b] = <font color="green"> {squares[b]}</font>
      squares[c] = <font color="green"> {squares[c]}</font>
      return squares[a];
    }
  }
  return null;
}