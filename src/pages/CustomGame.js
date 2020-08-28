import React from 'react';
import { useHistory } from 'react-router-dom';

const NumberInput = ({ onChange, value }) => {
  const [timeOut, changeTimeOut] = React.useState();

  const handleDecrease = (isPressing) => () => {
    if (value < 5) {
      stopTimeOut();
      return;
    }
    onChange(--value);
    changeTimeOut(setTimeout(handleDecrease(true), isPressing ? 90 : 400));
  }

  const handleIncrease = (isPressing) => () => {
    if (value > 39) {
      stopTimeOut();
      return;
    }
    onChange(++value);
    changeTimeOut(setTimeout(handleIncrease(true), isPressing ? 90 : 400));
  }

  const handleChange = (e) => {
    const target = e.target;
    if (target) {
      onChange(target.value);
    }
  }

  const stopTimeOut = () => {
    clearTimeout(timeOut);
    changeTimeOut(null);
  }

  return (
    <div className="number-input">
      <input className="number-input input" onChange={handleChange} value={value} />
      <button className="number-input btn" onMouseDown={handleDecrease(false)} onMouseUp={stopTimeOut}>-</button>
      <button className="number-input btn" onMouseDown={handleIncrease(false)} onMouseUp={stopTimeOut}>+</button>
    </div>
  );
}

const CustomGame = (props) => {
  const [data, setData] = React.useState({
    width: 8,
    height: 8,
    percent: 25
  });
  const history = useHistory();

  const handleCancel = () => {
    history.goBack();
  }

  const handleStartGame = () => {
    if (data.height > data.width) {
      alert("A altura do tabuleiro não deve ser menor que sua largura");
      return;
    }
    history.push(`/react-minesweeper/play?width=${data.width}&height=${data.height}&mines=${calcMines(data.percent)}`)
  }

  const calcMines = (percent) => Math.floor(percent / 100 * data.height * data.width);

  const handleChange = (field) => value => {
    setData(old => ({ ...old, [field]: field !== 'bombs' ? value : calcMines(value) }));
  }

  return (
    <div className="menu-custom-game">
      <div className="menu-custom-game-item-container">
        <div className="menu-custom-game-item">
          <span>Largura</span>
          <NumberInput onChange={handleChange('width')} value={data.width} />
        </div>
        <div className="menu-custom-game-item">
          <span>Altura</span>
          <NumberInput onChange={handleChange('height')} value={data.height} />
        </div>
        <div className="menu-custom-game-item">
          <span>Porcentagem de minas</span>
          <NumberInput onChange={handleChange('percent')} value={data.percent} />
        </div>
      </div>
      <div className="menu-custom-game-item-container">
        <button onClick={handleStartGame}>Iniciar jogo</button>
        <button onClick={handleCancel}>Cancelar</button>
      </div>
    </div>
  );
}

export default CustomGame;