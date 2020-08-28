import React from 'react';
import { Redirect, useHistory } from 'react-router-dom';

// Importing images
import { ReactComponent as Clock } from '../imgs/clock.svg';
import { ReactComponent as Flag } from '../imgs/flag.svg';

// Importing components
import Slot from '../components/Slot';

const state = {
  LOADED: 0,
  STARTED: 1,
  PAUSED: 2,
  ENDED_LOSED: 3,
  ENDED_WINNED: 4
}

const Game = (props) => {
  const history = useHistory();

  const [minesweeper, setMinesweeper] = React.useState(null);
  const [flagCount, setFlatCount] = React.useState(0);
  const [data, setData] = React.useState(null);

  const [gameState, setGameState] = React.useState(state.LOADED);
  const [time, setTime] = React.useState(0);
  const [timer, setTimer] = React.useState(null);

  const handleRestart = () => {
    clearTimeout(timer);
    setMinesweeper(Array(data.width * data.height).fill());
    setFlatCount(0);
    setGameState(state.LOADED);
    setTime(0);
    setTimer(null);
  }

  const handleChangeDifficulty = () => {
    history.push("/react-minesweeper");
  }

  React.useState(() => {
    console.log("Getting data...");
    const query = new URLSearchParams(props.location.search);

    const data = {};
    for (let params of query.entries()) {
      data[params[0]] = Number.parseInt(params[1]);
    }
    const { width, height, mines } = data;
    if (!isNaN(width) && !isNaN(height) && !isNaN(mines)) {
      if ((40 < width || width < 4) || (30 < height || height < 4) || (Math.floor(width * height - 9) < mines || mines < 0) || (width < height)) {
        alert("Entradas inválidas.");
        return null;
      }
    } else {
      return null;
    }

    if (height < 10) {
      document.documentElement.setAttribute('data-scale', '1.x');
    } else {
      document.documentElement.removeAttribute('data-scale');
    }
    setData(data);
    setMinesweeper(Array(data.width * data.height).fill());
  }, []);

  const handleTimeChange = () => {
    setTimer(setTimeout(timeChange(time), 1000));
  }

  const timeChange = (time) => () => {
    setTimer(setTimeout(timeChange(++time), 1000));
    setTime(time);
  }

  if (!data) {
    return <Redirect to="/react-minesweeper/custom" />;
  }

  const getNearSlots = (index, max) => {
    const near = [];
    const row = Math.floor(index / data.width);
    for (let i = -1; i <= 1; i++) {
      const px = index + i;

      // Validar se px está na mesma linha que index
      const px_row = Math.floor(px / data.width);
      if (row === px_row) {
        for (let j = -1; j <= 1; j++) {
          const bombSlot = px + (j * data.width);
          if (bombSlot >= 0 && bombSlot < max) {
            near.push(bombSlot);
          }
        }
      }
    }

    return near;
  }

  const handleSlotClick = (index) => () => {
    if (gameState === state.ENDED_LOSED || gameState === state.ENDED_WINNED) {
      return;
    }
    if (gameState === 0) {
      let minesweeper = Array(data.width * data.height).fill();
      const indexes = minesweeper.map((v, i) => i);
      setGameState(state.STARTED);

      getNearSlots(index, indexes.length).forEach(s => {
        indexes.splice(indexes.indexOf(s), 1);
      });

      const mines = [];
      for (let q = 0; q < data.mines; q++) {
        const randomIndex = Math.floor(Math.random() * indexes.length);
        const randomElement = indexes[randomIndex];
        indexes.splice(randomIndex, 1);
        mines.push(randomElement);
      }

      minesweeper = minesweeper.map((v, i) => mines.includes(i) ? ({
        isPressed: false,
        isBomb: true,
        value: null
      }) : ({
        isPressed: false,
        isBomb: false,
        value: getNearSlots(i, minesweeper.length).filter(s => mines.includes(s)).length
      }));

      minesweeper = propague(index, minesweeper);
      setMinesweeper(minesweeper);
      handleTimeChange();
      return;
    }
    if (minesweeper[index].isBomb) {
      setGameState(state.ENDED_LOSED);
      clearTimeout(timer);
    }
    const updatedMinesweeper = propague(index, minesweeper.map(i => i));
    setMinesweeper(updatedMinesweeper);
    if (updatedMinesweeper.filter(s => s.isPressed && !s.isBomb).length === data.width * data.height - data.mines) {
      onWin();
    }
  }

  const propague = (index, minesweeper) => {
    const current = minesweeper[index];
    minesweeper[index] = { ...current, isPressed: true };
    if (current.value === 0) {
      getNearSlots(index, minesweeper.length).forEach(s => {
        const near = minesweeper[s];
        if (s !== index && !near.isPressed) {
          minesweeper[s] = { ...near, isPressed: true };
          if (near.value === 0) {
            minesweeper = propague(s, minesweeper);
          }
        }
      });
    }

    return minesweeper;
  }

  function onWin() {
    setGameState(state.ENDED_WINNED);
    alert("You win! Total time: " + getTime(time));
  }

  const changeFlags = (amount) => {
    setFlatCount(old => old + amount);
  }

  const handlePause = () => {
    setGameState(old => old === state.PAUSED ? state.STARTED : state.PAUSED);
    if (gameState === state.STARTED) {
      clearTimeout(timer);
    } else {
      handleTimeChange();
    }
  }

  const getTime = (time) => {
    const sec = time % 60;
    time = (time - sec) / 60;
    const min = time % 60;
    const h = (time - min) / 60;

    return (h > 0 ? h.toString().padStart(2, 0) + ":" : "")
      + min.toString().padStart(2, 0) + ":"
      + sec.toString().padStart(2, 0)
  }

  const slotStyle = {
    flexBasis: `${100 / data.width}%`,
    width: (window.innerHeight - 40) / data.height,
    height: (window.innerHeight - 40) / data.height,
  }

  return (
    <div className="game-container">
      <div className={gameState === state.PAUSED ? "game paused" : "game"} style={{ maxWidth: slotStyle.height * data.width }}>
        {minesweeper.map((slot, index) => (
          <Slot
            index={index}
            style={slotStyle}
            onClick={handleSlotClick(index)}
            isFlagLimit={data.mines === flagCount}
            changeFlags={changeFlags}
            gameState={gameState}
            {...slot}
          />
        ))
        }
        {gameState === state.PAUSED && <span className="paused-text">Pausado</span>}
      </div>
      <div className="game-menu">
        <div className="game-menu-item-container">
          <div className="game-menu-item">
            <Flag className="menu-icon" />
            <p>{`${flagCount}/${data.mines}`}</p>
          </div>
          <div className="game-menu-item">
            <Clock className="menu-icon" />
            <p>{getTime(time)}</p>
          </div>
        </div>
        <div className="game-menu-button-container">
          <button disabled={gameState === 0} onClick={handleRestart}>Recomeçar</button>
          <button onClick={handleChangeDifficulty}>Alterar dificuldade</button>
          <button disabled={gameState === 0} onClick={handlePause}>{gameState !== state.STARTED ? "Continuar" : "Pausar"}</button>
        </div>
      </div>
    </div>
  );
}

export default Game;