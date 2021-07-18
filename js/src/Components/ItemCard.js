import React from 'react';

const ItemCard = (props) => {
  return (
    <a className={props.class} href={props.link} role="button">{props.name}</a>
  );
};

export default ItemCard;
