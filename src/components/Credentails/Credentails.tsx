import React, { useState } from 'react';
import { isCredFilled } from '../../utils/functions';

const Credentails = ({ handleChange }: CredentailsType) => {
  const [cred, setCred] = useState<CredType>({
    api_key: '',
    client_code: '',
    client_pin: '',
    client_totp_pin: '',
  });
  const saveToLocalStorage = (cred: CredType) => {
    localStorage.setItem('credentials', JSON.stringify(cred));
  };
  return (
    <div className="flex justify-center items-center h-screen w-[500px] opacity-90">
      <div className="container max-w-md bg-gray-100 p-6 rounded-lg shadow-md">
        <div className="mb-4 flex justify-center">
          <label className="block text-lg font-bold mb-2">
            Enter credentials details
          </label>
        </div>
        <div className="mb-4">
          <input
            type="text"
            className="w-full px-4 py-2 border rounded"
            placeholder="Enter API Key"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setCred((prev) => ({
                ...prev,
                api_key: event.target.value,
              }));
            }}
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            className="w-full px-4 py-2 border rounded"
            placeholder="Enter Client Code"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setCred((prev) => ({
                ...prev,
                client_code: event.target.value,
              }));
            }}
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            className="w-full px-4 py-2 border rounded"
            placeholder="Enter Client Pin"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setCred((prev) => ({
                ...prev,
                client_pin: event.target.value,
              }));
            }}
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            className="w-full px-4 py-2 border rounded"
            placeholder="Enter Client Totp Pin"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setCred((prev) => ({
                ...prev,
                client_totp_pin: event.target.value,
              }));
            }}
          />
        </div>
        <div className="mb-4 flex justify-center w-full">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
            onClick={() => {
              if (isCredFilled(cred)) {
                handleChange(true, cred);
                saveToLocalStorage(cred);
              } else {
                handleChange(false, cred);
              }
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};
export default Credentails;
