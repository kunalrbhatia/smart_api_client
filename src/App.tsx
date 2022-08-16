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
  Typography,
} from '@mui/material';
import axios from 'axios';
import * as _ from 'lodash';
import AddIcon from '@mui/icons-material/Add';
function App() {
  const [loading, setLoading] = useState(false);
  const [scriptInput, setScriptInput] = useState<string>('');
  const [fetchedScrips, setFetchedScrips] = useState<object[]>([]);
  const [currentToSpot, setCurrentToStop] = useState<number>(0);
  const [nextToSpot, setNextToStop] = useState<number>(0);
  const [isGoodOpportunity, setIsGoodOpportunity] = useState<boolean>(false);
  const [isOrderNowDisabled, setIsOrderNowDisabled] = useState<boolean>(true);
  const fetchDataForAutoComplete = async () => {
    setLoading(true);
    const payload = JSON.stringify({
      scriptName: scriptInput.toLocaleUpperCase(),
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
  const onScripAddClick = (__event: object, row: object, _i: number) => {
    console.log(row);
  };
  const onArbitrageClick = async () => {
    setLoading(true);
    const config = {
      method: 'get',
      url: 'http://localhost:5000/arbitrage',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      await axios(config)
        .then((response: object) => {
          type responseData = {
            currentToSpot: number;
            nextToCurrent: number;
            isGoodOpportunity: boolean;
            status: string;
          };
          const data: responseData = _.get(response, 'data', null) || null;
          if (data && data.status === 'ok') {
            if (data.isGoodOpportunity) setIsOrderNowDisabled(false);
            else setIsOrderNowDisabled(true);
            setCurrentToStop(data.currentToSpot);
            setNextToStop(data.nextToCurrent);
            setIsGoodOpportunity(data.isGoodOpportunity);
            setLoading(false);
          } else {
            setIsOrderNowDisabled(true);
          }
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
                  <TableCell>ACTION</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fetchedScrips.length > 0 &&
                  fetchedScrips.map((row, i) => (
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
                      <TableCell>
                        <Button
                          id={`addButton_${i}`}
                          variant="contained"
                          disabled={false}
                          color="success"
                          onClick={(event) => {
                            onScripAddClick(event, row, i);
                          }}
                        >
                          <AddIcon /> <div style={{ marginLeft: 8 }}>Add</div>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <div className="arbitrageButton">
          <Button fullWidth variant="contained" onClick={onArbitrageClick}>
            Get arbitrage data
          </Button>
        </div>
        <div className="arbitrageData">
          <div className="arbitrageRow">
            <Typography variant="body1" marginRight={1}>
              <b>Current To Spot</b>
            </Typography>
            <Typography variant="body1">{currentToSpot}</Typography>
          </div>
          <div className="arbitrageRow">
            <Typography variant="body1" marginRight={1}>
              <b>Next To Current</b>
            </Typography>
            <Typography variant="body1">{nextToSpot}</Typography>
          </div>
          <div className="arbitrageRow">
            <Typography variant="body1" marginRight={1}>
              <b>Is Good Opportunity?</b>
            </Typography>
            <Typography variant="body1">
              {isGoodOpportunity ? 'Yes' : 'No'}
            </Typography>
          </div>
          <div className="arbitrageRow">
            <Button
              variant="contained"
              color="success"
              disabled={isOrderNowDisabled}
            >
              Order Now
            </Button>
          </div>
        </div>
      </Paper>
    </div>
  );
}

export default App;
