import React from 'react';
import PropTypes from 'prop-types';
import './styles.css'

// Importing images
import { ReactComponent as Bomb } from '../imgs/bomb.svg';
import { ReactComponent as Flag } from '../imgs/flag.svg';
import { ReactComponent as Unknow } from '../imgs/unknow.svg';

const Slot = ({ index, style, setIsFlagLimit, isGameEnd, changeFlags, isPressed, isBomb, value, onClick }) => {
  const [isFlag, setIsFlag] = React.useState(false);
  const [isUnknow, setIsUnkow] = React.useState(false);

  const handleClick = () => {
    if (!isFlag && !isGameEnd) {
      onClick();
    }
  }

  const handleAuxClick = e => {
    e.preventDefault();
    if (!isGameEnd) {
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
        <div className={isGameEnd ? 'slot-content reveal' : 'slot-content'}>
          {/* {index} */}
          {isFlag && <Flag className="slot-icon" />}
          {!isGameEnd && isUnknow && <Unknow className="slot-icon" />}
          {isGameEnd && isBomb && !isFlag && <Bomb className="slot-icon" />}
        </div>
      </div>);
}

Slot.propTypes = {
  isBomb: PropTypes.bool,
  isGameEnd: PropTypes.bool
};

Slot.defaultProps = {
  isBomb: false,
  isGameEnd: false
};


export default Slot;