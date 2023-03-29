import './TagSelect.css';

import { useToggle } from 'ahooks';
import React, { useEffect, useRef, useState } from 'react';

import SelectTag from '../SelectTag/SelectTag';
import { ArrowSvg } from './ArrowSvg';
import { CheckedSvg } from './CheckedSvg';

export const TagSelect = (props: TagSelectProps) => {
  const [isOpen, setIsOpen] = useToggle(false);
  const [inputVal, setInputVal] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [options, setOptions] = useState<SelectOption[]>([
    { value: '食材1', label: '食材1' },
    { value: '食材2', label: '食材2' },
    { value: '食材3', label: '食材3' },
    { value: '食材4', label: '食材4' },
    { value: '食材5', label: '食材5' },
    { value: '食材6', label: '食材6' },
    { value: '食材7', label: '食材7' },
    { value: '食材8', label: '食材8' },
    { value: '食材9', label: '食材9' },
    { value: '食材10', label: '食材10' },
    { value: '食材11', label: '食材11' },
    { value: '食材12', label: '食材12' },
    { value: '食材13', label: '食材13' },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerDivRef = useRef<HTMLDivElement>(null);
  const bodyDivRef = useRef<HTMLDivElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    setIsOpen.toggle();
  };

  const handleCloseTag = (val: string) => {
    alert(val);
    const tempTags = [...selectedItems];
    const valIdx: number = tempTags.indexOf(val);
    if (valIdx > -1) {
      tempTags.splice(valIdx, 1);
    }
    setSelectedItems(tempTags);
  };

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (!inputRef.current || !spanRef.current) return;
    const { value, style } = event.target;
    spanRef.current.textContent = value;
    setInputVal(value);
    const width = spanRef.current.offsetWidth <= 0 ? 2 : spanRef.current.offsetWidth;
    style.width = width + 'px';
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (
      isOpen &&
      containerDivRef?.current &&
      event.target &&
      !containerDivRef.current.contains(event.target as Node)
    ) {
      setIsOpen.toggle();
    }
  };

  const handleSelectOption = (option: SelectOption) => {
    const tempTags = [...selectedItems];

    const valIdx: number = tempTags.indexOf(option.value);
    if (valIdx === -1) {
      tempTags.push(option.value);
    } else {
      tempTags.splice(valIdx, 1);
    }
    setSelectedItems(tempTags);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [bodyDivRef, isOpen]);

  // React.useEffect(() => {
  //   if (inputRef?.current) {
  //     inputRef.current.style.width = tags.length <= 0 ? '100%' : '25px';
  //   }
  // }, [tags]);

  return (
    <>
      <div
        className={`select-container ${props.className ?? ''}`}
        style={props.style}
        ref={containerDivRef}
      >
        <div className="select-body-container" onClick={handleClick}>
          <div className="select-body-inner-container">
            <div ref={bodyDivRef} className="select-body-inner-tags-container">
              {selectedItems.map((tag) => (
                <SelectTag key={tag} label={tag} onClose={handleCloseTag} />
              ))}
              <div
                style={
                  selectedItems.length <= 0
                    ? { width: '100%', marginLeft: '10px' }
                    : {
                        width: '2px',
                        marginLeft: '2px',
                      }
                }
              >
                <input
                  value={inputVal}
                  ref={inputRef}
                  className="select-body-inner-input"
                  placeholder={selectedItems.length <= 0 ? props.placeholder : ''}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          <div className="select-body-inner-arrow">
            <ArrowSvg />
          </div>
        </div>
        {isOpen && (
          <div className="select-options-container">
            {options.length <= 0 ? (
              <>123</>
            ) : (
              options.map((option) => {
                const selected = selectedItems.indexOf(option.value) > -1;
                return (
                  <div
                    className={
                      'select-option' +
                      (selected ? ' select-option-selected' : ' select-option-normal')
                    }
                    key={option.value}
                    onClick={() => handleSelectOption(option)}
                  >
                    {option.label}
                    <CheckedSvg
                      style={{
                        visibility: selected ? 'visible' : 'hidden',
                      }}
                    />
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
      <span className="hidden-span" ref={spanRef} />
    </>
  );
};

interface TagSelectProps {
  className?: string;
  style?: React.CSSProperties;
  placeholder?: string;
}

interface SelectOption {
  label: string;
  value: string;
}
