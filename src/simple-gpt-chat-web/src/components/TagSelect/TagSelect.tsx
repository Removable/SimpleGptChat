import './TagSelect.css';

import { useToggle } from 'ahooks';
import React, { useEffect, useRef, useState } from 'react';

import SelectTag from '../SelectTag/SelectTag';
import { ArrowSvg } from './ArrowSvg';

export const TagSelect = (props: TagSelectProps) => {
  const [isOpen, setIsOpen] = useToggle(false);
  const [inputVal, setInputVal] = useState('');
  const [tags, setTags] = useState<string[]>([
    '食材1',
    '食材2',
    '食材3',
    '食材4',
    '食材5',
    '食材6',
    '食材7',
    '食材8',
    '食材9',
    '食材a',
  ]);
  const [options, setOptions] = useState<SelectOption[]>([
    { value: '食材1', label: '食材1' },
    { value: '食材2', label: '食材2' },
    { value: '食材3', label: '食材3' },
    { value: '食材4', label: '食材4' },
    { value: '食材5', label: '食材5' },
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
    const tempTags = [...tags];
    const valIdx: number = tempTags.indexOf(val);
    if (valIdx > -1) {
      tempTags.splice(valIdx, 1);
    }
    setTags(tempTags);
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
    } else {
      // handleTest();
    }
  };

  const handleTest = () => {
    const tempTags = [...tags];
    tempTags.push('食材' + tags.length + 1);
    setTags(tempTags);
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
              {tags.map((tag) => (
                <SelectTag key={tag} label={tag} onClose={handleCloseTag} />
              ))}
              <div>
                <input
                  value={inputVal}
                  ref={inputRef}
                  className="select-body-inner-input"
                  style={{ width: tags.length <= 0 ? '100%' : '2px' }}
                  placeholder={tags.length <= 0 ? props.placeholder : ''}
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
              options.map((option) => (
                <div className="select-option" key={option.value}>
                  {option.label}
                </div>
              ))
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
