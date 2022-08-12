import React, { useEffect, useState } from 'react';
import './App.css';
import { Autocomplete, Paper, TextField } from '@mui/material';
import axios from 'axios';
import * as _ from 'lodash';
function App() {
  const [data, setData] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [autoCompleteData, setAutoCompleteData] = useState<object[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await axios
          .get(
            'https://margincalculator.angelbroking.com/OpenAPI_File/files/OpenAPIScripMaster.json'
          )
          .then((response: object) => {
            let acData: object[] = _.get(response, 'data', []) || [];
            let newData: object[] = [];
            acData.forEach((elm, idx) => {
              if (idx < 100) {
                if (isNaN(_.get(elm, 'name', ''))) newData.push(elm);
              }
            });
            setAutoCompleteData(
              newData.map((elm, i) => {
                return {
                  ...elm,
                  label: _.get(elm, 'name', '') || '',
                  key: '0' + i,
                };
              })
            );
          })
          .catch((evt: object) => {
            console.log(evt);
          });
      } catch (error) {
        console.error(_.get(error, 'message', '') || '');
      }
      setLoading(false);
    };
    fetchData();
  }, []);

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
          disablePortal
          id="combo-box-demo"
          options={autoCompleteData}
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
