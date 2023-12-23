import React, { useState } from 'react';

export interface SelectedValue {
  symbol: string;
  token: string;
  price?: string;
  maxSL?: string;
  tsl?: string;
}
interface TableComponentProps {
  data: SelectedValue[];
  onSubmit: (data: SelectedValue[]) => void;
}
const TableInput: React.FC<TableComponentProps> = ({ data, onSubmit }) => {
  const [editedData, setEditedData] = useState<SelectedValue[]>([]);
  const handleInputChange = (
    index: number,
    field: keyof SelectedValue,
    value: string | number
  ) => {
    const newData = [...editedData];
    newData[index] = { ...newData[index], [field]: value };
    setEditedData(newData);
  };
  const handleSubmit = () => {
    onSubmit(editedData);
  };
  return (
    /* 
    text-align: center;
    
    display: flex;
    flex-direction: column;
    max-height: 500px;
    overflow: auto;
    padding: 2rem;
    */
    <>
      <div className="opacity-90 item-center flex flex-col max-h-[300px] overflow-auto p-8 bg-white mb-4 w-full">
        <table>
          <thead>
            <tr>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                Symbol
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                Token
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                Price
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                Max SL
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                Trailing SL
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data) &&
              data.map((item, index) => {
                const isLast = index === data.length - 1;
                const classes = isLast
                  ? 'p-4 text-center'
                  : 'p-4 text-center border-b border-blue-gray-50';
                const newArray = [...editedData];
                const existingIndex = newArray.findIndex(
                  (eitem) => eitem.symbol === item.symbol
                );
                if (existingIndex === -1) {
                  newArray.push({ symbol: item.symbol, token: item.token });
                  setEditedData(newArray);
                } else {
                  editedData[existingIndex].symbol = item.symbol;
                  editedData[existingIndex].token = item.token;
                }
                return (
                  <tr key={index}>
                    <td className={classes}>{item.symbol}</td>
                    <td className={classes}>{item.token}</td>
                    <td className={classes}>
                      <input
                        className="bg-white border-2 border-gray-300 rounded-md p-2 max-w-[160px] text-center"
                        type="number"
                        value={editedData[index]?.price || ''}
                        onChange={(e) =>
                          handleInputChange(index, 'price', e.target.value)
                        }
                      />
                    </td>
                    <td className={classes}>
                      <input
                        type="number"
                        className="bg-white border-2 border-gray-300 rounded-md p-2  max-w-[160px] text-center"
                        value={editedData[index]?.maxSL || ''}
                        onChange={(e) =>
                          handleInputChange(index, 'maxSL', e.target.value)
                        }
                      />
                    </td>
                    <td className={classes}>
                      <input
                        type="number"
                        className="bg-white border-2 border-gray-300 rounded-md p-2  max-w-[160px] text-center"
                        value={editedData[index]?.tsl || ''}
                        onChange={(e) =>
                          handleInputChange(index, 'tsl', e.target.value)
                        }
                      />
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center opacity-90 w-full">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </>
  );
};

export default TableInput;
