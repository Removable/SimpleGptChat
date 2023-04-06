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
  const [keywordItems, setKeywordItems] = useState<SelectOption[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);
  const outerContainerRef = useRef<HTMLDivElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);
  const debounceFn = UseDebounce((keyWord: string) => {
    props.onSearch && props.onSearch(keyWord);
    if (
      props.options &&
      props.options.findIndex((item) => item.label === keyWord) === -1
    ) {
      if (keyWord === '') {
        setKeywordItems([]);
        return;
      }
      const items: SelectOption[] = [
        {
          label: keyWord,
          value: keyWord,
        },
      ];
      setKeywordItems(items);
      console.log('keywordItems: ', keywordItems);
    }
  }, 500);

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

      if (props.onSearch) {
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
        outerContainerRef.current &&
        event.target &&
        !outerContainerRef.current.contains(event.target as Node)
      ) {
        setIsOpen.toggle();
      }
    },
    [inputVal, isOpen, setIsOpen, addOrRemoveTag],
  );

  useOutsideClick(outerContainerRef, handleClickOutside);

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

  const generateOptions = useCallback(() => {
    const conbineOptions = [...(props.options ?? [])];
  }, [props.options, keywordItems, selectedItems]);

  return (
    <div className="tag-select-outer-container" ref={outerContainerRef}>
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
                  height={`calc(${props.defaultHeight} - 4px)`}
                />
              );
            })}
            <div
              className="tag-select-body-input-container"
              style={{ height: props.defaultHeight }}
              ref={inputContainerRef}
            >
              <input
                type="text"
                placeholder="选择食材 - 可以搜索选择也可以自定义输入"
                ref={inputRef}
                value={inputVal}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>
        </div>
        <div className="select-arrow-container">
          <ArrowSvg />
        </div>
      </div>
      {isOpen && (
        <div
          className="select-options-container"
          style={{ top: `calc(${props.defaultHeight} + 6px)` }}
        >
          {keywordItems.length <= 0 && (!props.options || props.options.length <= 0) ? (
            <div className="no-content-prompt">输入食材名称吧！</div>
          ) : (
            keywordItems.concat(props.options ?? []).map((option) => (
              <div className="select-option" key={option.value}>
                {option.label}
              </div>
            ))
          )}
        </div>
      )}
      <span className="hidden-span" ref={spanRef} />
    </div>
  );
};

interface TagSelectProps {
  defaultHeight?: string;
  placeholder?: string;
  onSearch?: (value: string) => void;
  maxLength?: number;
  options?: SelectOption[];
}

export interface SelectOption {
  label: string;
  value: string;
}
