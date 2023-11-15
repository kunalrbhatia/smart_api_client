export type SearchStockType = {
  isLoading: boolean;
  onChangeLoading: (value: boolean) => void;
  onChangeSelectedScrips: (value: SelectedScripsType[]) => void;
  cred: CredType;
};
export type rowType = {
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
export type SelectedScripsType = { symbol: string; token: string };
