import React from 'react';
interface p_Input {
  id?: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type: string;
  placeholder?: string;
  error?: string;
  min?: number;
  max?: number;
  pattern?: string;
  inputStyle?: string;
  accept?: string;
  isVertical?: boolean;
}
export default function Input({
  id,
  onChange,
  label,
  type,
  min,
  max,
  value,
  pattern = '',
  placeholder = '',
  inputStyle = '',
  accept = '',
  isVertical = true,
}: p_Input) {
  return (
    <>
      <style jsx>{`
        input {
          min-height: 2.5rem;
        }
      `}</style>

      <div className={`d-flex ${isVertical ? 'flex-column justify-content-center' : 'flex-row'}`}>
        <label htmlFor={id} className={`text-capitalize`}>
          {label}
        </label>
        <input
          className={inputStyle}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={async (e) => {
            e.preventDefault();
            onChange(e);
          }}
          min={min}
          max={max}
          accept={accept}
          spellCheck
        />
      </div>
    </>
  );
}
