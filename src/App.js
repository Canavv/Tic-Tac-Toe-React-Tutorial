import React, { useState } from 'react';
import './App.css';

function Square(props) {
  return(
    <button 
      className='square' 
      onClick={props.onClick}
      style={{'background': props.styles}}    
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
      styles={this.props.winners?.includes(i) ? 'yellow' : 'white'}
      />
    );
  }
  squar(i) {
    const squ = [];
    for(let j = 0; j < 3; j++){
      const k = (i*3)+j;
      squ.push(this.renderSquare(k));
      this.winn = 'red';
    }
    return squ;
  }
  squa() {
    const sq = [];
    for (let i = 0; i < 3; i++){
      sq.push( 
      <div className='board-row'>
        {this.squar(i)}
      </div>
      );
    }
    return sq
  }

  render() {
    return (
      <div>
        {this.squa()}
      </div>
    )
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      selected: null,
      stepNumber: 0,
      xIsNext: true,
      moveh: [],
      drop: 'none'
    };
  }

  handleClick(i){
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const pos = [
      '[1,1]','[1,2]','[1,3]',
      '[2,1]','[2,2]','[2,3]',
      '[3,1]','[3,2]','[3,3]'
    ];
    const moveh = this.state.moveh.concat(this.state.xIsNext ? 'X: ' + pos[i] : 'O: ' + pos[i]);

    if(calculateWinner(squares) || squares[i]){
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      moveh: moveh
    });
  }

  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      selected: step,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moveh = this.state.moveh;
    const sortM = {
      none: (a,b) => null,
      ascending: undefined,
      descending: (a,b) => (a > b ? -1 : 1)
    }

    const moves = history.map((step, move) => {
      const desc = move ? 'Go to move #' + move : 'Go to game start';
      //console.log(desc)
      return (
        <li key={move}>
          <button style={{'fontWeight':this.state.selected === move ? 'bold' : 'normal'}} onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    const moveHis = moveh.sort(sortM[this.state.drop]).map((id,i) => {
      return (
        <li key={i}>
          {id}
        </li>
      )
    })

    function allAreFull(arr){
      return arr.every(element => element !== null);
    }

    let status;
    if(winner){
      status = 'Winner: ' + winner.xoro;
    }
    else if(allAreFull(current.squares) && !winner){
      status = 'Draw';
    }
    else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return(
      <div className='game'>
        <div className='game-board'>
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winners={winner?.win}
          />
        </div>
        <div className='game-info'>
          <div>{status}</div>
          <div>{moves}</div>
        </div>
        <div className='game-info'>
          <select defaultValue={'default'} onChange={(e) => {this.setState({drop: e.target.value})}}>
            <option value={'default'} disabled>None</option>
            <option value={'ascending'}>Ascending</option>
            <option value={'descending'}>Descending</option>
          </select>
          <div>Move History</div>
          <div>{moveHis}</div>
          <button onClick={() => {this.setState({moveh: []})}} disabled={this.state.moveh.length == 0}>Reset History</button>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares){
  const lines = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6],
  ];
  for (let i = 0; i < lines.length; i++){
    const [a,b,c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] == squares[c]){
      return {'win' : lines[i], 'xoro' : squares[a]};
    }
  }
  return null;
}

export default Game;
