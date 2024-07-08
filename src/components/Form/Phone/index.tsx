"use client";
import { useEffect, useMemo, useState } from "react";
import cn from "classnames";
import Select from "../Select";
import Countries from "@/core/countries";
import { AsYouType, CountryCode } from "libphonenumber-js";

import "./index.scss";

type Props = {
  field: FormField;
  error: boolean;
  onChange: (value: string, key: string) => void;
}

export default function FormPhone(props: Props) {
  const { field, onChange, error } = props;
  const [phoneValue, setPhoneValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const options = Countries;
  const [country, setCountry] = useState(options[0]);
  const placeholder = useMemo(() => {
    let placeholder = "";
    if (country) {
      const foundCountry = Countries.find((cntry) => cntry.value === country.value);
      if (foundCountry) placeholder = foundCountry.placeholderPhoneNumber;
    }
    return placeholder;
  }, [country]);

  const label = `${field.label}${field.required ? "*" : ""}`;

  const handleSelectChange = (opt: string) => {
    const selectedCountry = options.find((option) => option.value === opt)!;
    setCountry(selectedCountry);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const extractCountryCode = (phoneNumber: string): string | null => {
      const pattern = /^\+(\d+?)(\s|$)/;
      const match = phoneNumber.match(pattern);
      return match ? match[1] : null;
    };
    const callingCode = extractCountryCode(placeholder!);
    const code = country?.value as CountryCode;
    const parser = new AsYouType(code);
    const value = e.target.value.replace(`+${callingCode}`, "");
    if (value !== " ") {
      const phoneNumber = parser.input(`+${callingCode}${value}`);
      setPhoneValue(phoneNumber);
    } else {
      setPhoneValue("");
    }
  };

  useEffect(() => {
    onChange(phoneValue, field.name);
  }, [phoneValue]);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <div className={cn("form-phone", field.width, { focused: isFocused, error })}>
      <label className="tag" dangerouslySetInnerHTML={{ __html: label }}/>
      <div className="form-phone__input">
        <Select
          onChange={handleSelectChange}
          options={options}
          useDisplayLabel
          value={country}
        />
        <input
          type="tel"
          placeholder={placeholder}
          value={phoneValue}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
}
