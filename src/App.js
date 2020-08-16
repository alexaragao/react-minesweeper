import React from 'react';
import PropTypes from 'prop-types';

// Importing images
import { ReactComponent as Bomb } from './imgs/bomb.svg';
import { ReactComponent as Flag } from './imgs/flag.svg';
import { ReactComponent as Unknow } from './imgs/unknow.svg';
import Routes from './Routes';

function Slot({ isBomb, handleSlotClick, handleSlotAuxClick }) {
  const [isSelected, setIsSelected] = React.useState(false);
  const [isProtected, setIsProtected] = React.useState(false);

  const handleClick = () => {
    setIsSelected(true);
    if (isBomb) {
      alert("Fim de jogo!");
      // handleSlotClick();
    }
  }

  const handleAuxClick = e => {
    e.preventDefault();
    if (!isSelected) {
      setIsProtected(old => !old);
      // handleSlotAuxClick();
    }
  }

  return isSelected ? (
    <div className="slot selected">

    </div>
  ) : (
      isProtected ? (
        <div className="slot" onAuxClick={handleAuxClick}>
          <div className="slot-content">
            <Flag className="slot-icon" />
          </div>
        </div>
      ) : (
          <div className="slot" onClick={handleClick} onAuxClick={handleAuxClick} />
        )
    );
}

Slot.propTypes = {
  isBomb: PropTypes.bool
};

Slot.defaultProps = {
  isBomb: false
};

function App() {
  const [bombsAmount, setBombAmount] = React.useState(10);
  const [flagCount, setFlatCount] = React.useState(0);
  const [isGameStarted, setIsGameStarted] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);
  const [width, setWidth] = React.useState(8);
  const [height, setHeight] = React.useState(8);

  const handleChange = e => {
    const target = e.target;
    if (target) {
      setBombAmount(Number.parseInt(target.value));
    }
  }

  const handleWidthChange = e => {
    const target = e.target;
    if (target) {
      setWidth(Number.parseInt(target.value));
    }
  }

  const handleHeightChange = e => {
    const target = e.target;
    if (target) {
      setHeight(Number.parseInt(target.value));
    }
  }

  const startGame = () => {
    if (bombsAmount) {
      if (width > 0 && height > 0) {
        if (bombsAmount < width * height) {
          setIsGameStarted(true);
        } else {
          alert(`O número de bombas é inválido. Deve ser menor que ${width * height} (tamanho atual do tabuleiro).`);
        }
      } else {
        alert("Insira um tamanho válido");
      }
    } else {
      alert("Insira a quantidade de bombas desejadas");
    }
  }

  const endGame = () => {
    alert("Fim de jogo!");
    setIsGameStarted(false);
  }

  return (
      <Routes />
  );
      /* <div className="game">
        {isGameStarted && Minesweeper()}
      </div>
      <div className="menu">
        {isGameStarted ? (
          <div className="menu-content">
            <p>Bombs Remaining</p>
            <Bomb className="menu-icon" />

            <div className="menu-item">
              <Flag className="menu-icon" />
              <p>{`${flagCount}/${bombsAmount}`}</p>
            </div>

            <p>Unknow Slots</p>
            <Unknow className="menu-icon" />

            <br />
            <button onClick={endGame}>Recomeçar</button>
            <button onClick={endGame}>Alterar dificuldade</button>
            <button onClick={endGame}>{isPaused ? "Continuar" : "Pausar"}</button>
          </div>
        ) : (
            <div className="menu-content">
              <p>Bomb Amount</p>
              <input type='number' onChange={handleChange} />

              <p>Size</p>
              <input type='number' onChange={handleWidthChange} />
              <input type='number' onChange={handleHeightChange} />

              <button onClick={startGame}>Start Game!</button>
            </div>
          )}
      </div> */
}

export default App;
