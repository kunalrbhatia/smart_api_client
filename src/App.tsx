import React, { useState } from 'react';
import './App.css';
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import axios from 'axios';
import * as _ from 'lodash';
function App() {
  const [loading, setLoading] = useState(false);
  const [scriptInput, setScriptInput] = useState<string>('');
  const [fetchedScrips, setFetchedScrips] = useState<object[]>([]);
  const fetchDataForAutoComplete = async () => {
    setLoading(true);
    const payload = JSON.stringify({
      api_key: 'YK4WsJ6X',
      client_code: 'K94372',
      client_pin: '5143',
      client_totp_pin: '2RGK7VSYECJVZTPUN3Q5BGTD44',
      scriptName: scriptInput.toLocaleUpperCase(),
    });
    const config = {
      method: 'post',
      url: 'https://smart-api-cloud-run-hjua72ioaq-uc.a.run.app/scrip/details/get-script',
      headers: {
        'Content-Type': 'application/json',
      },
      data: payload,
    };
    try {
      await axios(config)
        .then((response: object) => {
          setLoading(false);
          setFetchedScrips(_.get(response, 'data', []) || []);
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
  const onScripInputChange = (event: object) => {
    const changedInput = _.get(event, 'target.value', '') || '';
    setScriptInput(changedInput);
  };
  return (
    <div className="App">
      <Paper
        elevation={3}
        style={{
          padding: '20px',
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <div className="scripBox">
          <TextField
            label="Scrip"
            variant="standard"
            disabled={loading}
            onChange={onScripInputChange}
            value={scriptInput}
            fullWidth
            className="scripTextField"
          />
          <Button onClick={fetchDataForAutoComplete} variant="contained">
            Search
          </Button>
        </div>
        <div>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>SYMBOL</TableCell>
                  <TableCell>NAME</TableCell>
                  <TableCell>EXPIRY</TableCell>
                  <TableCell>LOTSIZE</TableCell>
                  <TableCell>INSTRUMENT TYPE</TableCell>
                  <TableCell>EXCHANGE SEGMENT</TableCell>
                  <TableCell>TOKEN</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fetchedScrips.length > 0 &&
                  fetchedScrips.map((row) => (
                    <TableRow key={_.get(row, 'token', '') || ''}>
                      <TableCell>{_.get(row, 'symbol', '') || ''}</TableCell>
                      <TableCell>{_.get(row, 'name', '') || ''}</TableCell>
                      <TableCell>{_.get(row, 'expiry', '') || ''}</TableCell>
                      <TableCell>{_.get(row, 'lotsize', '') || ''}</TableCell>
                      <TableCell>
                        {_.get(row, 'instrumenttype', '') || ''}
                      </TableCell>
                      <TableCell>{_.get(row, 'exch_seg', '') || ''}</TableCell>
                      <TableCell>{_.get(row, 'token', '') || ''}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Paper>
    </div>
  );
}

export default App;
