"use client";
import { useState, useRef, KeyboardEvent, useEffect, useLayoutEffect } from "react";
import gsap from 'gsap';
import cn from "classnames";
import Caret from "@/assets/icons/caret.svg";

import "./index.scss";

interface CustomSelectProps {
  options: Option[];
  onChange: (value: string, key?: string) => void;
  defaultValue?: Option;
  value?: Option;
  error?: boolean;
  field?: FormField;
  disabled?: boolean;
  hideOnDisabled?: boolean;
  isPhone?: boolean;
  useDisplayLabel?: boolean;
  debug?: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  onChange,
  defaultValue,
  value,
  field,
  disabled,
  debug,
  hideOnDisabled,
  error,
  useDisplayLabel
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(defaultValue || value || null);
  const [hightlightedOption, setHighlightedOption] = useState<Option | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  let searchTimeout = useRef<NodeJS.Timeout>();
  const optionRefs = useRef<HTMLElement[]>([]);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const baseHeight = useRef(0);
  const duration  = useRef(0);
  const isDisabled = disabled || !options.length;

  const label = useDisplayLabel ? selectedOption?.displayLabel : selectedOption?.label;
  const placeholder =  field ? field.placeholder || field.label : "Select an option";

  const checkTarget = (e: MouseEvent) => {
    if (!root.current?.contains(e.target as Node)) {
      handleClose();
      document.removeEventListener("click", checkTarget);
    }
  };

  const handleToggleDropdown = () => {
    if (isOpen) handleClose();
    else {
      setIsOpen(true);
      document.addEventListener("click", checkTarget);
    }
  };

  const handleOptionClick = (option: Option) => {
    setSelectedOption(option);
    onChange(option.value, field?.name);
    handleClose();
  };
  const handleClose = () => {
    setHighlightedOption(null);
    setIsOpen(false);
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    const char = e.key;
    if (char === "Escape") {
      setIsOpen(false);
    } else if (char === "ArrowDown" || char === "ArrowUp") {
      e.preventDefault();
      const active = hightlightedOption || selectedOption;
      const currentIndex = options.findIndex((option) => option.value === active?.value);
      const nextIndex = e.key === "ArrowDown" ? currentIndex + 1 : currentIndex - 1;
      if (nextIndex >= 0 && nextIndex < options.length) setHighlightedOption(options[nextIndex]);
    } else if (e.key === "Enter") {
      if (hightlightedOption) handleOptionClick(hightlightedOption);
    } else if (char.length === 1 && char.match(/\S/)) {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
      setSearchQuery(prev => prev + char.toLowerCase());
      searchTimeout.current = setTimeout(() => { setSearchQuery(''); }, 500);
      const foundOption = options.find(option => option.label.toLowerCase().startsWith(searchQuery + char.toLowerCase()));
      if (foundOption) {
        const foundOptionIndex = options.findIndex(option => option.label.toLowerCase().startsWith(searchQuery + char.toLowerCase()));
        const scrollPos = optionRefs.current[foundOptionIndex].offsetTop - listRef.current!.offsetTop;
        gsap.to(listRef.current, { scrollTop: scrollPos - 16, duration: 0.2 });
        setHighlightedOption(foundOption);
      }
      e.preventDefault();
    }
  };
  const checkBlur = (e: React.FocusEvent) => {
    if (!root.current?.contains(e.relatedTarget as Node)) setIsOpen(false);
  };
  const setOptionRefs = (el: HTMLElement | null, index: number) => {
    if (el) optionRefs.current[index] = el;
  };
  useEffect(() => {
    if (isOpen) listRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (value) setSelectedOption(value);
  }, [value]);

  useEffect(() => {
    if (selectedOption) setSelectedOption(value || defaultValue || null);
  }, [options]);

  useEffect(() => {
    return () => clearTimeout(searchTimeout.current);
  }, []);

  useLayoutEffect(() => {
    if (!root.current) return;
    if (!baseHeight.current) baseHeight.current = root.current.clientHeight || root.current.scrollHeight;
    if (hideOnDisabled) { 
      if (isDisabled) {
        gsap.set(root.current, { overflow: "hidden" });
        gsap.to(root.current, { height: 0, marginBottom: 0, duration: duration.current, ease: "power2.inOut", onComplete: () => {
          duration.current = 0.3;
        } });
      } else {
        gsap.to(root.current, {
          height: 64,
          marginBottom: 16,
          duration: 0.3,
          ease: "power2.inOut",
          onComplete: () => { gsap.set(root.current, { clearProps: 'all' }) },
        });
      }
    }
  }, [isDisabled]);

  if (debug) {
    console.log(value, 'value');
    console.log(label, 'label');
    console.log(placeholder, 'placeholder');
  }

  return (
    <div className={cn("form-select", field && `${field.width} ${field.name}`, { disabled: isDisabled, error })} ref={root}>
      {
        field && (
          <label className="tag" dangerouslySetInnerHTML={{ __html: `${field.label}${field.required ? '*' : ''}` }}/>
        )
      }
      <button
        ref={toggleRef}
        onClick={handleToggleDropdown}
        onKeyDown={handleKeyDown}
        onBlur={checkBlur}
        type="button"
        aria-haspopup="listbox"
        className="form-select__button"
        aria-expanded={isOpen}
      >
        <p className="body-small" dangerouslySetInnerHTML={{ __html: label || placeholder }}/>
        <Caret className="caret" />
      </button>
      <div className={cn("form-select__list-wrapper", isOpen && "open")} style={{ '--child-count': Math.min(options.length, 6) } as React.CSSProperties}>
        <ul
          ref={listRef}
          tabIndex={-1}
          className="form-select__list"
          onKeyDown={handleKeyDown}    
          role="listbox"
          aria-activedescendant={selectedOption?.value}
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              role="option"
              ref={(el) => setOptionRefs(el, index)}
              className={cn(
                "form-select__list__item",
                selectedOption?.value === option.value && "selected",
                hightlightedOption?.value === option.value && "highlighted"
              )}
              aria-selected={selectedOption?.value === option.value}
              onClick={() => handleOptionClick(option)}
            >
              <p
                className="body-small list-item-label"
                dangerouslySetInnerHTML={{ __html: option.label }}
              />
              <span className="circle" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CustomSelect;
