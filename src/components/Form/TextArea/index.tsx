"use client";
import { useState } from "react";
import cn from "classnames";

import "./index.scss";

type Props = {
  field: FormField;
  error: boolean;
  onChange: (value: string, key: string) => void;
}

export default function FormTextArea(props: Props) {
  const { field, onChange, error } = props;
  const [isFocused, setIsFocused] = useState(false);
  const label = `${field.label}${field.required ? '*' : ''}`;
  const placeholder = `${field.placeholder || field.label}${field.required ? '*' : ''}`;
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value, field.name);
  }
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  return (
    <div className={cn("form-text-area", { focused: isFocused, error })}>
      <label className="tag" dangerouslySetInnerHTML={{ __html: label }}/>
      <textarea
        rows={5}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        onChange={handleChange}
      />
    </div>
  )
}