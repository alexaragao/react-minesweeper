import React from 'react';
import PropTypes from 'prop-types';
import './styles.css'

// Importing images
import { ReactComponent as Bomb } from '../imgs/bomb.svg';
import { ReactComponent as Flag } from '../imgs/flag.svg';
import { ReactComponent as Unknow } from '../imgs/unknow.svg';

const Slot = ({ index, style, gameState, setIsFlagLimit, changeFlags, isPressed, isBomb, value, onClick }) => {
  const [isFlag, setIsFlag] = React.useState(false);
  const [isUnknow, setIsUnkow] = React.useState(false);

  React.useEffect(() => {
    if (gameState === 0) {
      setIsFlag(false);
      setIsUnkow(false);
    }
  }, [gameState]);

  const handleClick = () => {
    if (!isFlag) {
      onClick();
    }
  }

  const handleAuxClick = e => {
    e.preventDefault();
    if (gameState < 3) {
      if (!isFlag && !isUnknow) {
        if (setIsFlagLimit) {
          setIsUnkow(true);
        } else {
          setIsFlag(true);
          changeFlags(1);
        }
      } else if (isFlag) {
        setIsFlag(false);
        changeFlags(-1);
        setIsUnkow(true);
      } else if (isUnknow) {
        setIsUnkow(false);
      }
    }
  }

  return isPressed ? (
    <div className="slot" style={style}>
      <div className="slot-content selected">
        {/* {index} */}
        {isBomb && <Bomb className="slot-icon exploded" />}
        {value > 0 && <span>{value}</span>}
      </div>
    </div>
  ) : (
      <div className="slot" style={style} onClick={handleClick} onAuxClick={handleAuxClick}>
        <div className={gameState >= 4 ? 'slot-content reveal' : 'slot-content'}>
          {/* {index} */}
          {isFlag && <Flag className="slot-icon" />}
          {gameState < 3 && isUnknow && <Unknow className="slot-icon" />}
          {gameState >= 3 && isBomb && !isFlag && <Bomb className="slot-icon" />}
        </div>
      </div>);
}

Slot.propTypes = {
  isBomb: PropTypes.bool,
  gameState: PropTypes.number.isRequired
};

Slot.defaultProps = {
  isBomb: false,
};


export default Slot;