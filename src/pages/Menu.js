import React from 'react';
import { useHistory } from 'react-router-dom';

const MenuButton = ({ width, height, mines, custom }) => {
  const history = useHistory();

  const handleClick = () => {
    history.push(`/play?width=${width}&height=${height}&mines=${mines}`);
  }

  const handleCustomClick = () => {
    history.push('custom');
  }

  return custom ? (
    <button className="menu-button" onClick={handleCustomClick}>
      <p><strong>?</strong></p>
      <p className="label">Personalizado</p>
    </button>
  ) : (
      <button className="menu-button" onClick={handleClick}>
        <p><strong>{width} × {height}</strong></p>
        <p className="label"><strong>{mines}</strong> minas</p>
      </button>
    );
}

MenuButton.defaultProps = {
  custom: false
}

const Menu = (props) => {
  return (
    <div className="menu">
      <div className="menu-button-row">
        <MenuButton width={8} height={8} mines={10} />
        <MenuButton width={16} height={16} mines={40} />
      </div>
      <div className="menu-button-row">
        <MenuButton width={30} height={16} mines={99} />
        <MenuButton width={16} height={16} custom />
      </div>
    </div>
  );
}

export default Menu;