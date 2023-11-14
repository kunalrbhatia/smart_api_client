import React, { useState } from 'react';
import { MenuItem, FormControl } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';

export interface Option {
  value: string;
  label: string;
}

export interface SelectOptionProps {
  options: Option[];
  label: string;
  onChange: (selectedOption: string | null | undefined) => void;
  selected: string | null | undefined;
}
export default function SelectOption({
  options,
  label,
  onChange,
  selected,
}: SelectOptionProps) {
  const [selectedOption, setSelectedOption] = useState<Option | null>();
  if (selected) {
    setSelectedOption(options.find((option) => option.value === selected));
  }
  const handleChange = (event: SelectChangeEvent) => {
    const selectedValue = event.target.value as string;
    const selectedOption =
      options.find((option) => option.value === selectedValue) ?? null;
    setSelectedOption(selectedOption);
    onChange(selectedOption?.value);
  };
  return (
    <FormControl>
      <Select
        value={selectedOption?.value ?? ''}
        onChange={handleChange}
        displayEmpty
        inputProps={{ 'aria-label': label }}
      >
        <MenuItem value="" disabled>
          {label}
        </MenuItem>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
