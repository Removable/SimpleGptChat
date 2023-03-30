import './TagSelect.css';

import { useToggle } from 'ahooks';
import React, { ChangeEvent, KeyboardEvent, useCallback, useRef, useState } from 'react';

import useOutsideClick from '../../hooks/useOutsideClick';
import SelectTag from '../SelectTag/SelectTag';
import { ArrowSvg } from './ArrowSvg';
import { CheckedSvg } from './CheckedSvg';

export const TagSelect = (props: TagSelectProps) => {
  const [isOpen, setIsOpen] = useToggle(false);
  const [inputVal, setInputVal] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [options, setOptions] = useState<SelectOption[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerDivRef = useRef<HTMLDivElement>(null);
  const bodyDivRef = useRef<HTMLDivElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);

  const handleClick = useCallback(() => {
    inputRef.current?.focus();
    setIsOpen.toggle();
  }, [setIsOpen]);

  const addOrRemoveTag = useCallback((tagVal: string) => {
    tagVal = tagVal.trim();
    if (tagVal === '') return;
    setSelectedItems((prevSelectedItems) => {
      const tagExists = prevSelectedItems.includes(tagVal);
      if (tagExists) {
        return prevSelectedItems.filter((item) => item !== tagVal);
      } else {
        return [...prevSelectedItems, tagVal];
      }
    });
  }, []);

  const handleCloseTag = useCallback((val: string) => {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.filter((item) => item !== val),
    );
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        addOrRemoveTag(inputVal.trim());
        setInputVal('');
        resetInputWidth('');
      } else if (event.key === 'Backspace' && inputVal === '') {
        setSelectedItems((prevSelectedItems) => {
          const newSelectedItems = [...prevSelectedItems];
          newSelectedItems.pop();
          return newSelectedItems;
        });
      }
    },
    [inputVal, addOrRemoveTag],
  );

  const handleChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      if (!inputRef.current || !spanRef.current) return;
      const { value } = event.target;
      let tempValue = value.replace('，', ',').trim();
      if (tempValue[tempValue.length - 1] === ',') {
        const tagValue = tempValue.substring(0, tempValue.length - 1);
        addOrRemoveTag(tagValue);
        tempValue = '';
      }
      setInputVal(tempValue);
      resetInputWidth(tempValue);

      if (props.onSearch && tempValue.length > 0) {
        await props.onSearch(tempValue);
      }
    },
    [addOrRemoveTag],
  );

  const resetInputWidth = useCallback(
    (inputVal: string) => {
      if (!inputRef.current || !spanRef.current) return;
      spanRef.current.textContent = inputVal;
      const width = spanRef.current.offsetWidth <= 0 ? 2 : spanRef.current.offsetWidth;
      inputRef.current.style.width = width + 'px';

      if (selectedItems.length < 1) {
        inputRef.current.style.width = '100%';
      }
    },
    [selectedItems.length],
  );

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      addOrRemoveTag(inputVal);
      setInputVal('');
      resetInputWidth('');
      if (
        isOpen &&
        containerDivRef.current &&
        event.target &&
        !containerDivRef.current.contains(event.target as Node)
      ) {
        setIsOpen.toggle();
      }
    },
    [inputVal, isOpen, setIsOpen, addOrRemoveTag],
  );

  useOutsideClick(containerDivRef, handleClickOutside);

  const handleSelectOption = useCallback((option: SelectOption) => {
    setSelectedItems((prevSelectedItems) => {
      const isSelected = prevSelectedItems.includes(option.value);
      if (isSelected) {
        return prevSelectedItems.filter((item) => item !== option.value);
      } else {
        return [...prevSelectedItems, option.value];
      }
    });
  }, []);

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
                  onKeyDown={handleKeyDown}
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
              <div className="select-no-option-container">暂无数据</div>
            ) : (
              options.map((option) => {
                const selected = selectedItems.includes(option.value);
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
  onSearch?: (val: string) => Promise<SelectOption[]>;
}

interface SelectOption {
  label: string;
  value: string;
}
