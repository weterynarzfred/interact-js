import { shell } from 'electron';
import $ from 'cash-dom';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import ItemContainer from './components/ItemContainer';

$('body').on('click', 'a', event => {
  event.preventDefault();
  shell.openExternal(event.target.href);
});

window.addEventListener('load', showItems);
$('#button-update').on('click', showItems);

function showItems() {
  ReactDOM.render(<ItemContainer />, $('#app')[0]);
}
