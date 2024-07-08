"use client";
import cn from "classnames";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { isPossiblePhoneNumber } from "libphonenumber-js";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import SuccessIcon from "@/assets/icons/form-success.svg";
import SecondaryButton from "../Buttons/SecondaryButton";
import { US_STATES, CANADIAN_PROVINCES } from "@/core/states";
import FormMap from "./form-map";
import { validateEmail } from "@/core/utils";
import api from "@/core/api";

import "./index.scss";

type Props = {
  fields: Array<FormField>;
  submitLabel: string;
  messages: ContactPage["acf"]["form_mesages"];
  options?: { [key: string]: Array<Option> };
  defaultValues?: { [key: string]: string };
};
export default function Form(props: Props) {
  const { fields, submitLabel, defaultValues, messages } = props;
  const { locale } = useParams();
  const [formValues, setFormValues] = useState<{ [key: string]: string }>(defaultValues || {});
  const prevFormValues = useRef(formValues);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [innerOptions, setInnerOptions] = useState<{[key: string]: Array<Option>;}>({});
  const [optionsLoading, setOptionsLoading] = useState<{[key: string]: boolean;}>({});
  const [showError, setShowError] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const nodeRef = useRef<HTMLDivElement>(null);

  const Fields = fields.map(
    (field) => FormMap[field.type as keyof typeof FormMap]
  );

  const handleFormChange = (value: string, key: string) => {
    if (formErrors.includes(key)) setFormErrors(formErrors.filter((error) => error !== key));
    setFormValues({ ...formValues, [key]: value });
  };

  const validateForm = () => {
    let valid = true;
    let errors: string[] = [];
    fields.forEach((field) => {
      if (!formValues[field.name]) {
        if (field.name === 'state_province') {
          valid = !(formValues['country'] === 'US' || formValues['country'] === 'CA');
          if (!valid) errors.push(field.name);
        } else {
          valid = false;
          errors.push(field.name);
        }
      } else if (field.type === 'email' && !validateEmail(formValues[field.name])) {
        valid = false;
        errors.push(field.name);
      } else if (field.type === 'tel' && !isPossiblePhoneNumber(formValues[field.name])) {
        valid = false;
        console.log(formValues[field.name]);
        errors.push(field.name);
      }
    });
    if (!valid) {
      setFormErrors(errors);
      setShowError(true);
    }
    console.log(formErrors, formValues);
    return valid;
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (validateForm()) {
      api.submitForm('email', formValues).then((response) => {
        if (!response?.success) setServerError(true);
        else {
          setServerError(false);
          setShowSuccess(true);
        }
      });
    }
  };

  const updateOptions = async (depends_on: string, id: string, field_key: string) => {
    if (depends_on === 'division') {
      setOptionsLoading({ ...optionsLoading, [field_key]: true });
      setFormValues({ ...formValues, [field_key]: '' });
      const options = await api.getProducts(locale as string, id);
      if (options) {
        const opts = options.map((option) => ({ value: `${option.ID}`, label: option.post_title }));
        setInnerOptions({ ...innerOptions, [field_key]: opts });
        setOptionsLoading({ ...optionsLoading, [field_key]: false });
      }
    } else if (depends_on === 'country' && formValues['state_province']) {
      setFormValues({ ...formValues, state_province: '' });
    }
  };
  const getOptions = (key: string) => {
    if (key === 'state_province' && formValues['country']) {
      const value = formValues['country'];
      if (value === 'US') return US_STATES;
      if (value === 'CA') return CANADIAN_PROVINCES;
      return [];
    }
    if (props.options && props.options[key]) return props.options[key];
    if (innerOptions[key]) return innerOptions[key];
    return [];
  };

  const getFieldProps = (field: FormField) => {
    const additionalProps: any = {};
    if (field.type === "select" || field.type === 'radio') {
      const opts = getOptions(field.name);
      additionalProps["options"] = opts;
      if (field.name === 'state_province') additionalProps["hideOnDisabled"] = true;
      if (formValues[field.name]) {
        const value = formValues[field.name];
        const option = opts.find((opt: Option) => opt.value === value);
        if (option) additionalProps["defaultValue"] = option;
      }
    }
    if (field.depends_on) additionalProps["disabled"] = !formValues[field.depends_on] || optionsLoading[field.name];
    return additionalProps;
  };

  useEffect(() => {
    if (!formErrors.length) setShowError(false);
  }, [formErrors])

  useEffect(() => {
    if (fields && fields.length) {
      fields.forEach((field) => {
        if (field.type === "select" && field.depends_on) {
          if (
            formValues[field.depends_on] !==
            prevFormValues.current[field.depends_on]
          ) {
            updateOptions(field.depends_on, formValues[field.depends_on], field.name);
          }
        }
      });
    }
    prevFormValues.current = formValues;
  }, [formValues]);

  return (
    <SwitchTransition mode="out-in">
    <CSSTransition
      key={showSuccess ? 'success' : 'form'}
      nodeRef={nodeRef}
      classNames="fade"
      addEndListener={(done) => nodeRef.current!.addEventListener("transitionend", done, false)}
    >
      <div ref={nodeRef}>
        {showSuccess ? (
          <div className="form__success">
            <div className="content">
              <SuccessIcon className="icon" />
              <h3 className="subtitle-3">{messages.form_success_title}</h3>
              <p className="body-medium">{messages.form_success_body}</p>
            </div>
          </div>
        ) : (
          <form className="form">
            {Fields.map((Field, index) => (
                <Field
                  key={index}
                  field={fields[index]}
                  onChange={handleFormChange}
                  error={formErrors.includes(fields[index].name)}
                  { ...getFieldProps(fields[index]) }
                />
              ))}
            <div className="form__submit">
              
              <SecondaryButton label={submitLabel} onClick={handleSubmit} />
            </div>
          </form>
        )}
      </div>
      </CSSTransition>
    </SwitchTransition>
  );
}
