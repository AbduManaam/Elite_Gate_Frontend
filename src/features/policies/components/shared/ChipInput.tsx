import React, { useState } from 'react';

interface ChipInputProps {
  readonly label: string;
  readonly placeholder?: string;
  readonly chips: string[];
  readonly onAdd: (chip: string) => void;
  readonly onRemove: (chip: string) => void;
  readonly validation?: (value: string) => string | null;
}

export const ChipInput: React.FC<ChipInputProps> = ({
  label,
  placeholder = 'Add new...',
  chips,
  onAdd,
  onRemove,
  validation,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAdd = () => {
    const value = inputValue.trim();
    if (!value) return;

    if (chips.includes(value)) {
      setError('Duplicate values are not allowed.');
      return;
    }

    if (validation) {
      const valErr = validation(value);
      if (valErr) {
        setError(valErr);
        return;
      }
    }

    setError(null);
    onAdd(value);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    } else if (e.key === 'Backspace' && !inputValue && chips.length > 0) {
      onRemove(chips[chips.length - 1]);
    }
  };

  return (
    <div className="flex flex-col gap-xs text-xs font-semibold text-on-surface-variant w-full">
      <span className="uppercase tracking-wide">{label}</span>
      <div className="flex flex-wrap gap-xs items-center border border-outline-variant rounded-lg p-2 bg-white focus-within:border-[#587c94] focus-within:ring-1 focus-within:ring-[#587c94] transition-all min-h-[40px]">
        {chips.map((chip, index) => (
          <span
            key={index}
            className="flex items-center gap-1 px-2 py-0.5 bg-surface-container border border-outline-variant rounded text-on-surface text-[11px] font-sans font-medium"
          >
            {chip}
            <button
              type="button"
              onClick={() => onRemove(chip)}
              className="text-on-surface-variant hover:text-error text-[10px] p-0.5 cursor-pointer font-bold leading-none"
            >
              ×
            </button>
          </span>
        ))}
        <div className="flex-grow flex gap-xs min-w-[120px]">
          <input
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setError(null);
            }}
            onKeyDown={handleKeyDown}
            placeholder={chips.length === 0 ? placeholder : ''}
            className="flex-grow border-none p-0 outline-none focus:ring-0 text-sm font-sans font-normal text-on-surface bg-transparent"
          />
          <button
            type="button"
            onClick={handleAdd}
            className="px-2 py-1 text-[11px] font-bold text-[#587c94] hover:underline cursor-pointer"
          >
            + Add
          </button>
        </div>
      </div>
      {error && <span className="text-error text-[10px] mt-0.5">{error}</span>}
    </div>
  );
};
