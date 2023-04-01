import './TagSelect.css';

import { useToggle } from 'ahooks';
import React, { ChangeEvent, KeyboardEvent, useCallback, useRef, useState } from 'react';

import UseDebounce from '../../hooks/useDebounce';
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
  const inputContainerRef = useRef<HTMLDivElement>(null);
  const containerDivRef = useRef<HTMLDivElement>(null);
  const bodyContainerRef = useRef<HTMLDivElement>(null);
  const tagsContainerRef = useRef<HTMLDivElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);
  const debounceFn = UseDebounce((keyWord: string) => {
    props.onSearch && props.onSearch(keyWord);
  }, 1000);

  const handleClick = useCallback(() => {
    inputRef.current?.focus();
    setIsOpen.toggle();
  }, [setIsOpen]);

  const addOrRemoveTag = useCallback(
    (tagVal: string) => {
      tagVal = tagVal.trim();
      if (tagVal === '') return;
      setSelectedItems((prevSelectedItems) => {
        const tagExists = prevSelectedItems.includes(tagVal);
        if (inputContainerRef.current) {
          if (tagExists && prevSelectedItems.length === 1) {
            inputContainerRef.current.style.width = '';
          } else {
            inputContainerRef.current.style.width = '2px';
          }
        }
        if (tagExists) {
          return prevSelectedItems.filter((item) => item !== tagVal);
        } else {
          return [...prevSelectedItems, tagVal];
        }
      });
    },
    [selectedItems],
  );

  const handleCloseTag = useCallback((val: string) => {
    addOrRemoveTag(val);
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        addOrRemoveTag(inputVal.trim());
        setInputVal('');
      } else if (event.key === 'Backspace' && inputVal === '') {
        const latestItem = selectedItems[selectedItems.length - 1];
        if (latestItem) {
          addOrRemoveTag(latestItem);
        }
      }
    },
    [inputVal, addOrRemoveTag],
  );

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (!inputRef.current || !spanRef.current) return;
      const { value } = event.target;
      let tempValue = value.replace('，', ',').trim();
      if (tempValue[tempValue.length - 1] === ',') {
        const tagValue = tempValue.substring(0, tempValue.length - 1);
        addOrRemoveTag(tagValue);
        tempValue = '';
      }
      setInputVal(tempValue);
      // resetInputWidth
      if (selectedItems.length > 0 && inputContainerRef.current && spanRef.current) {
        spanRef.current.textContent = tempValue;
        const width = spanRef.current.offsetWidth <= 0 ? 2 : spanRef.current.offsetWidth;
        inputContainerRef.current.style.width = width + 'px';
      }

      if (props.onSearch && tempValue.length > 0) {
        debounceFn(tempValue);
      }
    },
    [addOrRemoveTag],
  );

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (inputVal.trim().length > 0) {
        addOrRemoveTag(inputVal);
      }
      setInputVal('');
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
        className="tag-select-container"
        style={{ minHeight: props.defaultHeight }}
        onClick={handleClick}
      >
        <div className="tag-select-body-container">
          <div className="select-body-inner-container">
            {selectedItems.map((item, index) => {
              return (
                <SelectTag
                  key={index}
                  label={item}
                  onClose={handleCloseTag}
                  height={`calc(${props.defaultHeight} - 6px)`}
                />
              );
            })}
            <div className="tag-select-body-input-container" ref={inputContainerRef}>
              <input
                type="text"
                placeholder="选择食材 - 可以搜索选择也可以自定义输入"
                ref={inputRef}
                value={inputVal}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
              <span onChange={(e) => console.log(e)}>{inputVal}</span>
            </div>
          </div>
        </div>
        <div className="select-arrow-container">
          <ArrowSvg />
        </div>
      </div>
      <span className="hidden-span" ref={spanRef} />
      {JSON.stringify(selectedItems)}
    </>
  );
};

interface TagSelectProps {
  defaultHeight?: string;
  placeholder?: string;
  onSearch?: (value: string) => void;
  maxLength?: number;
}

interface SelectOption {
  label: string;
  value: string;
}
