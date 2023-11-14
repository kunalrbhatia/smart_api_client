import React, { useState } from 'react';

export interface SelectedValue {
  symbol: string;
  token: string;
  price?: number;
  maxSL?: number;
  tradeDirection?: string;
}

interface TableComponentProps {
  data: SelectedValue[] | undefined;
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
    <div>
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
              Trade Direction
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(data) &&
            data.map((item, index) => {
              const isLast = index === data.length - 1;
              const classes = isLast
                ? 'p-4'
                : 'p-4 border-b border-blue-gray-50';
              editedData.push({ symbol: item.symbol, token: item.token });
              return (
                <tr key={index}>
                  <td className={classes}>{item.symbol}</td>
                  <td className={classes}>{item.token}</td>
                  <td className={classes}>
                    <input
                      className="bg-white border-2 border-gray-300 rounded-md p-2"
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
                      className="bg-white border-2 border-gray-300 rounded-md p-2"
                      value={editedData[index]?.maxSL || ''}
                      onChange={(e) =>
                        handleInputChange(index, 'maxSL', e.target.value)
                      }
                    />
                  </td>
                  <td className={classes}>
                    <select
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      value={editedData[index]?.tradeDirection || ''}
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          'tradeDirection',
                          e.target.value
                        )
                      }
                    >
                      <option value="">Select</option>
                      <option value="up">Up</option>
                      <option value="down">Down</option>
                    </select>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  );
};

export default TableInput;