import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import * as _ from 'lodash';
import { GET_STOCK } from '../../constants';
import AddIcon from '../../assets/svg/addIcon.svg';
import RemoveIcon from '../../assets/svg/removeIcon.svg';
import {
  SearchStockType,
  SelectedScripsType,
  rowType,
} from 'typings/search-stock';
const SearchStock = ({
  isLoading,
  cred,
  onChangeLoading,
  onChangeSelectedScrips,
}: SearchStockType) => {
  const [scriptInput, setScriptInput] = useState<string>('');
  const [fetchedScrips, setFetchedScrips] = useState<rowType[]>([]);
  const [selectedScrips, setSelectedScrips] = useState<SelectedScripsType[]>(
    []
  );
  const onScripInputChange = (event: object) => {
    const changedInput = _.get(event, 'target.value', '') || '';
    setScriptInput(changedInput);
  };
  const isSelected = (row: rowType) => {
    if (Array.isArray(selectedScrips)) {
      return selectedScrips.some(
        (value) => value.symbol === row.symbol && value.token === row.token
      );
    } else return false;
  };
  const fetchDataForAutoComplete = async () => {
    onChangeLoading(true);
    const payload = JSON.stringify({
      api_key: cred.api_key,
      client_code: cred.client_code,
      client_pin: cred.client_pin,
      client_totp_pin: cred.client_totp_pin,
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
            onChangeLoading(false);
            setFetchedScrips(_.get(response, 'data', []) || []);
          })
          .catch((err) => {
            onChangeLoading(false);
            console.log(err);
          });
      } catch (err) {
        onChangeLoading(false);
        console.log(err);
      } finally {
        onChangeLoading(false);
      }
    }
  };
  const onScripAddRemoveClick = (__event: object, row: rowType, _i: number) => {
    const tragetid = _.get(__event, 'currentTarget.id');
    if (
      tragetid &&
      tragetid.includes('remove') &&
      row &&
      Array.isArray(selectedScrips)
    ) {
      setSelectedScrips(
        selectedScrips.filter((value) => value.token !== row.token)
      );
    } else if (row) {
      const updatedScrips = Array.isArray(selectedScrips)
        ? [...selectedScrips, { symbol: row.symbol, token: row.token }]
        : [{ symbol: row.symbol, token: row.token }];
      setSelectedScrips(updatedScrips);
    }
  };
  const memoizedCallback = useCallback(() => {
    onChangeSelectedScrips(selectedScrips);
  }, [selectedScrips, onChangeSelectedScrips]);

  useEffect(() => {
    memoizedCallback();
  }, [memoizedCallback]);
  return (
    <>
      <div className="bg-white p-8 flex flex-col items-center w-full opacity-90 h-full mb-4">
        <div className="scripBox flex">
          <input
            type="text"
            placeholder="Scrip"
            disabled={isLoading}
            onChange={onScripInputChange}
            value={scriptInput}
            className="scripTextField w-full border border-gray-300 p-2 mr-2"
          />
          <button
            onClick={fetchDataForAutoComplete}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Search
          </button>
        </div>
      </div>
      {Array.isArray(fetchedScrips) && fetchedScrips.length > 0 && (
        <div className="bg-white p-8 flex flex-col items-center w-full opacity-90 h-full mb-4">
          <div className="mt-4 w-full">
            <div className="overflow-auto max-h-[300px]">
              <table className="table-fixed border w-full">
                <thead>
                  <tr>
                    <th className="border-b border-separate border-hidden border-blue-gray-100 bg-blue-gray-50 p-4 sticky top-0 bg-white">
                      Symbol
                    </th>
                    <th className="border-b border-separate border-hidden border-blue-gray-100 bg-blue-gray-50 p-4 sticky top-0 bg-white">
                      Token
                    </th>
                    <th className="border-b border-separate border-hidden border-blue-gray-100 bg-blue-gray-50 p-4 sticky top-0 bg-white"></th>
                  </tr>
                </thead>
                <tbody>
                  {fetchedScrips.length > 0 &&
                    fetchedScrips.map((row, i) => {
                      const isLast = i === fetchedScrips.length - 1;
                      const classes = isLast
                        ? 'p-4 text-center'
                        : 'p-4 text-center border-b border-blue-gray-50';
                      return (
                        <tr key={row.token}>
                          <td className={classes}>{row.symbol}</td>
                          <td className={classes}>{row.token}</td>
                          <td className={classes}>
                            <button
                              id={`${
                                isSelected(row as rowType) ? 'remove' : 'add'
                              }_${i}`}
                              className={`${
                                isSelected(row as rowType)
                                  ? 'bg-red-500'
                                  : 'bg-blue-500'
                              } text-white px-4 py-2 rounded`}
                              onClick={(event) => {
                                onScripAddRemoveClick(event, row as rowType, i);
                              }}
                            >
                              {isSelected(row as rowType) ? (
                                <img
                                  className="w-[24px] text-white fill-white stroke-white"
                                  src={RemoveIcon}
                                  alt="add-icon"
                                />
                              ) : (
                                <img
                                  className="w-[24px] text-white"
                                  src={AddIcon}
                                  alt="add-icon"
                                />
                              )}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default SearchStock;
