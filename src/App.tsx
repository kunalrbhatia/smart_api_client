import React, { useEffect, useState } from 'react';
import './App.css';
import { Autocomplete, Paper, TextField } from '@mui/material';
import axios from 'axios';
import * as _ from 'lodash';
function App() {
  const [loading, setLoading] = useState(false);
  const [autoCompleteData, setAutoCompleteData] = useState<object[]>([]);
  const [autoCompleteInputValue, setAutoCompleteInputValue] =
    useState<string>('');
  const fetchDataForAutoComplete = async (scriptName: string) => {
    setLoading(true);
    const payload = JSON.stringify({
      scriptName: scriptName.toLocaleUpperCase(),
    });
    const config = {
      method: 'post',
      url: 'http://localhost:5000/scrip/details/get-script',
      headers: {
        'Content-Type': 'application/json',
      },
      data: payload,
    };
    try {
      await axios(config)
        .then((response: object) => {
          setLoading(false);
          setAutoCompleteData(_.get(response, 'data', []) || []);
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
        });
    } catch (err) {
      setLoading(false);
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    console.log('autoCompleteData: ', autoCompleteData);
  }, [autoCompleteData]);
  const onAutoCompleteInputChange = (
    _event: React.SyntheticEvent,
    value: string,
    reason: string
  ) => {
    setAutoCompleteInputValue(value);
    if (reason !== 'reset') fetchDataForAutoComplete(value);
  };

  /* const socket: WebSocket = new WebSocket('ws://localhost:5000');
  socket.addEventListener('open', (evt: any) => {
    console.log('server connected');
  });
  socket.addEventListener('message', (evt: any) => {
    console.log(evt.data);
    //setData(_.get(JSON.parse(evt.data)[0], 'tvalue', 'no value') || 'no value');
  }); */
  return (
    <div className="App">
      <Paper
        elevation={3}
        style={{ padding: '20px', display: 'flex', justifyContent: 'center' }}
      >
        {/* <div>{data}</div> */}
        <Autocomplete
          disabled={loading}
          disablePortal
          inputValue={autoCompleteInputValue}
          onInputChange={onAutoCompleteInputChange}
          id="combo-box-demo"
          options={autoCompleteData}
          loadingText="Loading..."
          sx={{ width: 500 }}
          renderInput={(params) => {
            return <TextField {...params} label="Symbol" />;
          }}
        />
      </Paper>
    </div>
  );
}

export default App;
