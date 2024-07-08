"use client";
import { useState } from "react";
import cn from "classnames";

import "./index.scss";

type Props = {
  field: FormField;
  error: boolean;
  onChange: (value: string, key: string) => void;
};

export default function FormInput(props: Props) {
  const { field, onChange, error } = props;
  const [isFocused, setIsFocused] = useState(false);
  const label = `${field.label}${field.required ? "*" : ""}`;
  const placeholder = `${field.placeholder || field.label}${field.required ? "*" : ""}`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value, field.name);
  };
  
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  return (
    <div
      className={cn("form-input", field.type, field.width, {
        focused: isFocused,
        error,
      })}
    >
      <label className="tag" dangerouslySetInnerHTML={{ __html: label }} />
      <input
        type={field.type}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        onChange={handleChange}
      />
    </div>
  );
}
