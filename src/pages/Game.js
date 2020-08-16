import React from 'react';
import { Redirect, useHistory } from 'react-router-dom';

// Importing images
import { ReactComponent as Clock } from '../imgs/clock.svg';
import { ReactComponent as Flag } from '../imgs/flag.svg';

// Importing components
import Slot from '../components/Slot';

const Game = (props) => {
  const history = useHistory();
  const [minesweeper, setMinesweeper] = React.useState(null);
  const [flagCount, setFlatCount] = React.useState(0);
  const [data, setData] = React.useState(null);
  
  const [isGameEnd, setIsGameEnd] = React.useState(false);
  const [isGameStarted, setIsGameStarted] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);
  const [time, setTime] = React.useState(0);
  const [timer, setTimer] = React.useState(null);

  const handleRestart = () => {
    clearTimeout(timer);
    setMinesweeper(null);
    setFlatCount(0);
    setIsGameEnd(false);
    setIsGameStarted(false);
    setIsPaused(false);
    setTime(0);
    setTimer(null);
  }

  const handleChangeDifficulty = () => {
    history.push("/");
  }

  // React.useEffect(() => {
  //   if (minesweeper) {
  //     console.log(minesweeper);
  //   }
  // }, [minesweeper]);

  React.useState(() => {
    console.log("Getting data...");
    const query = new URLSearchParams(props.location.search);

    const data = {};
    for (let params of query.entries()) {
      data[params[0]] = Number.parseInt(params[1]);
    }
    const { width, height, mines } = data;
    if (!isNaN(width) && !isNaN(height) && !isNaN(mines)) {
      if ((100 < width || width < 4) || (100 < height || height < 4) || (Math.floor(width * height - 9) < mines || mines < 0)) {
        return null;
      }
    } else {
      return null;
    }
    // setMinesweeper(Array(data.height * data.width).fill({
    //   isBomb: false,
    //   value: 0
    // }));
    setData(data);
  }, []);

  const handleTimeChange = () => {
    setTimer(setTimeout(timeChange(time), 1000));
  }

  const timeChange = (time) => () => {
    setTimer(setTimeout(timeChange(++time), 1000));
    setTime(time);
  }

  if (!data) {
    return <Redirect to="/" />;
  }

  const getNearSlots = (index, max) => {
    const near = [];
    const m = Math.floor(index / data.width);
    for (let i = -1; i <= 1; i++) {
      const px = index + i;
      if ((m + 1) * data.width > px && px >= m * data.width) {
        for (let j = -1; j <= 1; j++) {
          const bombSlot = px + (j * data.height);
          if (bombSlot >= 0 && bombSlot < max) {
            near.push(bombSlot);
          }
        }
      }
    }

    return near;
  }

  const handleSlotClick = (index) => () => {
    if (!isGameStarted) {
      let minesweeper = Array(data.width * data.height).fill();
      const indexes = minesweeper.map((v, i) => i);
      setIsGameStarted(true);

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
      console.log(mines);

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
      // console.log(mines);
      // console.log(temp);
      // setMinesweeper(old => old.map((v, i) => mines.includes(i) ? ({ ...v, isBomb: true }) : ({ ...v, value: getNearSlots(i, old.length).filter(s => mines.includes(s)).length })));
    }
    if (minesweeper[index].isBomb) {
      setIsGameEnd(true);
    }
    setMinesweeper(propague(index, minesweeper.map(i => i)));
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

  const handleSlotAuxClick = (isProteced) => {
    setFlatCount(old => old + (isProteced ? 1 : -1));
  }

  const changeFlags = (amount) => {
    setFlatCount(old => old + amount);
  }

  const handlePause = () => {
    setIsPaused(old => !old);
    if (!isPaused) {
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

  return (
    <div className="game-container">
      <div className="game">
        {minesweeper ? (
          minesweeper.map((slot, index) => (
            <Slot
              // isBomb={minesArray.includes(minesweeper[ri][ci])}
              index={index}
              style={{
                flexBasis: `${100 / data.width}%`,
                minWidth: `${100 / data.width}%`,
                minHeight: `${100 / data.width}%`
              }}
              onClick={handleSlotClick(index)}
              isFlagLimit={data.mines === flagCount}
              changeFlags={changeFlags}
              isGameEnd={isGameEnd}
              {...slot}
            />
          ))) : (
            Array(data.width * data.height).fill().map((slot, index) => (
              <Slot
                index={index}
                style={{
                  flexBasis: `${100 / data.width}%`,
                  minWidth: `${100 / data.width}%`,
                  minHeight: `${100 / data.width}%`
                }}
                onClick={handleSlotClick(index)}
                isFlagLimit={data.mines === flagCount}
                changeFlags={changeFlags}
                {...slot}
              />
            ))
          )}
        {/* {minesweeper.map((r, ri) => (
          <div className="slot-row">
            {r.map((c, ci) => (
              <Slot
                // isBomb={minesArray.includes(minesweeper[ri][ci])}
                state={c}
                onStateChange={handleStateChange(ri, ci)}
                handleSlotClick={handleSlotClick(ri, ci)}
                handleSlotAuxClick={handleSlotAuxClick}
              />
            ))}
          </div>
        ))} */}
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
        <button disabled={!isGameStarted} onClick={handleRestart}>Recomeçar</button>
        <button onClick={handleChangeDifficulty}>Alterar dificuldade</button>
        <button onClick={handlePause}>{isPaused ? "Continuar" : "Pausar"}</button>
        </div>
      </div>
    </div>
  );
}

export default Game;