"use client";
import cn from "classnames";

import "./index.scss";
import { useState } from "react";

type Props = {
  field: FormField;
  error: boolean;
  options: Array<Option>;
  onChange: (value: string, key: string) => void;
};

export default function FormRadioGroup(props: Props) {
  const { field, onChange, options, error } = props;
  const [value, setValue] = useState<string>("");
  const label = `${field.label}${field.required ? "*" : ""}`;
  const handleChange = (val: string) => {
    setValue(val);
    onChange(value, field.name);
  };
  return (
    <div className={cn("form-radio-group", field.width, { error })}>
      <label className="tag" dangerouslySetInnerHTML={{ __html: label }} />
      <div className="form-radio-group__options">
        {options?.map((option, index) => (
          <div key={index} className={cn("form-radio-group__options__option", { active: option.value === value })}>
            <input
              type="radio"
              id={`${field.name}-${option.value}`}
              name={field.name}
              value={option.value}
              onChange={(e) => handleChange(e.target.value)}
            />
            <label htmlFor={`${field.name}-${option.value}`}>
              {option.label}
            </label>
            <div className="circle" />
          </div>
        ))}
      </div>
    </div>
  );
}
