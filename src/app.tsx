import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Player} from './player';
import {useContext} from 'react';

ReactDOM.render(
   <Player title='song' src='samples/song.mp3'></Player>,
    document.getElementById('root')
);
