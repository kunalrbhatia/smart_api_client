import React, { useState } from 'react';
import './App.css';
import { Paper } from '@mui/material';
import * as _ from 'lodash';
function App() {
  const [data, setData] = useState<string>('');
  const socket: WebSocket = new WebSocket('ws://localhost:5000');
  socket.addEventListener('open', (evt: any) => {});
  socket.addEventListener('message', (evt: any) => {
    setData(_.get(JSON.parse(evt.data)[0], 'tvalue', 'no value') || 'no value');
  });
  return (
    <div className="App">
      <Paper elevation={3}>
        <div>{data}</div>
      </Paper>
    </div>
  );
}

export default App;
