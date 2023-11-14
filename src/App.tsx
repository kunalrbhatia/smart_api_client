import React, { useEffect, useState } from 'react';
import './App.css';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

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
import TableInput, { SelectedValue } from './components/TableInput/TableInput';
import { GET_STOCK, ORB_ALGO } from './constants';
function App() {
  const [loading, setLoading] = useState(false);
  const [selected_scrips, setSelected_scrips] =
    useState<{ symbol: string; token: string }[]>();
  const [scriptInput, setScriptInput] = useState<string>('');
  const [fetchedScrips, setFetchedScrips] = useState<rowType[]>([]);
  const runOrb = async (payload: payloadType) => {
    setLoading(true);
    const config = {
      method: 'post',
      url: ORB_ALGO,
      headers: {
        'Content-Type': 'application/json',
      },
      data: payload,
    };
    try {
      return await axios(config)
        .then((response: object) => {
          setLoading(false);
          console.log(response);
          return response;
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
  const fetchDataForAutoComplete = async () => {
    setLoading(true);
    const payload = JSON.stringify({
      api_key: 'YK4WsJ6X',
      client_code: 'K94372',
      client_pin: '5143',
      client_totp_pin: '2RGK7VSYECJVZTPUN3Q5BGTD44',
      script_name: scriptInput.toLocaleUpperCase(),
    });
    const config = {
      method: 'post',
      url: GET_STOCK,
      headers: {
        'Content-Type': 'application/json',
      },
      data: payload,
    };
    if (scriptInput) {
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
    }
  };
  type rowType = {
    exch_seg: string;
    expiry: string;
    instrumenttype: string;
    key: string;
    label: string;
    lotsize: string;
    name: string;
    strike: string;
    symbol: string;
    tick_size: string;
    token: string;
    price?: string;
    max_sl?: string;
    trade_direction?: string;
  };
  type payloadType = {
    api_key: string;
    client_code: string;
    client_pin: string;
    client_totp_pin: string;
    script_name: string;
    price: string;
    max_sl: string;
    trade_direction: string;
  };
  const onScripAddRemoveClick = (__event: object, row: rowType, _i: number) => {
    const tragetid = _.get(__event, 'currentTarget.id');
    if (
      tragetid &&
      tragetid.includes('remove') &&
      row &&
      Array.isArray(selected_scrips)
    ) {
      setSelected_scrips(
        selected_scrips.filter((value) => value.token !== row.token)
      );
    } else if (row) {
      const updatedScrips = Array.isArray(selected_scrips)
        ? [...selected_scrips, { symbol: row.symbol, token: row.token }]
        : [{ symbol: row.symbol, token: row.token }];
      setSelected_scrips(updatedScrips);
    }
  };
  useEffect(() => {
    console.log('selected_scrip: ', selected_scrips);
  }, [selected_scrips]);
  const onScripInputChange = (event: object) => {
    const changedInput = _.get(event, 'target.value', '') || '';
    setScriptInput(changedInput);
  };

  const isSelected = (row: rowType) => {
    if (Array.isArray(selected_scrips)) {
      return selected_scrips.some(
        (value) => value.symbol === row.symbol && value.token === row.token
      );
    } else return false;
  };
  const scheduleAlgo = async (data: SelectedValue[]) => {
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      const payload: payloadType = {
        api_key: 'YK4WsJ6X',
        client_code: 'K94372',
        client_pin: '5143',
        client_totp_pin: '2RGK7VSYECJVZTPUN3Q5BGTD44',
        max_sl: element.maxSL?.toString() || '0',
        price: element.price?.toString() || '0',
        script_name: element.symbol.replace(/-EQ$/, ''),
        trade_direction: element.tradeDirection?.toString() || '',
      };
      const res = await runOrb(payload);
      console.log(res);
    }
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
                  <TableCell>TOKEN</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fetchedScrips.length > 0 &&
                  fetchedScrips.map((row, i) => {
                    return (
                      <TableRow key={row.token}>
                        <TableCell>{row.symbol}</TableCell>
                        <TableCell>{row.token}</TableCell>
                        <TableCell>
                          <Button
                            id={`${
                              isSelected(row as rowType) ? 'remove' : 'add'
                            }_${i}`}
                            variant="contained"
                            disabled={false}
                            color={
                              isSelected(row as rowType) ? 'error' : 'primary'
                            }
                            onClick={(event) => {
                              onScripAddRemoveClick(event, row as rowType, i);
                            }}
                          >
                            {isSelected(row as rowType) ? (
                              <DeleteIcon />
                            ) : (
                              <AddIcon />
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Paper>
      {Array.isArray(selected_scrips) && selected_scrips.length > 0 && (
        <TableInput
          data={selected_scrips}
          onSubmit={async (data) => {
            setInterval(() => {
              scheduleAlgo(data);
            }, 900000);
          }}
        />
      )}
    </div>
  );
}

export default App;
