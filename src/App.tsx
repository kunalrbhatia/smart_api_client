import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import * as _ from 'lodash';
import TableInput, { SelectedValue } from './components/TableInput/TableInput';
import { ORB_ALGO } from './constants';
import Credentails from './components/Credentails/Credentails';
import { isCredFilled } from './utils/functions';
import FullScreenLoader from './components/FullScreenLoader/FullScreenLoader';
import SearchStock from './components/SearchStock/SearchStock';
import { SelectedScripsType } from 'typings/search-stock';
function App() {
  const [credCheck, setCredCheck] = useState<boolean>(false);
  const [cred, setCred] = useState<CredType>({
    api_key: '',
    client_code: '',
    client_pin: '',
    client_totp_pin: '',
  });
  useEffect(() => {
    const storedCred = localStorage.getItem('credentials');
    if (storedCred) {
      const parsedCred: CredType = JSON.parse(storedCred);
      setCred(parsedCred);
    }
  }, []);
  const [mtm, setMtm] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedScrips, setSelectedScrips] = useState<SelectedScripsType[]>();

  const runOrb = async (payload: payloadType) => {
    setIsLoading(true);
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
          setIsLoading(false);
          console.log(response);
          return response;
        })
        .catch((err) => {
          setIsLoading(false);
          console.log(err);
        });
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    } finally {
      setIsLoading(false);
    }
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

  const scheduleAlgo = async (data: SelectedValue[]) => {
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      const payload: payloadType = {
        api_key: cred.api_key,
        client_code: cred.client_code,
        client_pin: cred.client_pin,
        client_totp_pin: cred.client_totp_pin,
        max_sl: element.maxSL?.toString() || '0',
        price: element.price?.toString() || '0',
        script_name: element.symbol.replace(/-EQ$/, ''),
        trade_direction: element.tradeDirection?.toString() || '',
      };
      const res = await runOrb(payload);
      const mtm = _.get(res, 'mtm', '0') || '0';
      if (res) setMtm(mtm.toString());
      else setMtm('0');
    }
  };
  useEffect(() => {
    setMtm('');
  }, []);
  useEffect(() => {
    if (isCredFilled(cred)) {
      setCredCheck(true);
    } else {
      setCredCheck(false);
    }
  }, [cred]);
  return (
    <div className="App">
      {!credCheck && (
        <Credentails
          handleChange={(value, creds) => {
            setCred(creds);
          }}
        />
      )}
      {mtm === '' && credCheck && (
        <SearchStock
          cred={cred}
          isLoading={isLoading}
          onChangeLoading={(value) => {
            setIsLoading(value);
          }}
          onChangeSelectedScrips={(value) => {
            console.log(value);
            setSelectedScrips(value);
          }}
        />
      )}
      {Array.isArray(selectedScrips) &&
        selectedScrips.length > 0 &&
        mtm === '' && (
          <TableInput
            data={selectedScrips}
            onSubmit={async (data) => {
              scheduleAlgo(data);
              setInterval(() => {
                scheduleAlgo(data);
              }, 900000);
            }}
          />
        )}
      {mtm !== '' && credCheck && (
        <div className="text-xl mt-8 w-full text-center">{`MTM: ${mtm}`}</div>
      )}
      <FullScreenLoader visible={isLoading} />
    </div>
  );
}

export default App;
