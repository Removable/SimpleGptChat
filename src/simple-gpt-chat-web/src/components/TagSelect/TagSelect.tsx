import React, { useRef, useState } from 'react';

import SelectTag from '../SelectTag/SelectTag';
import { ArrowSvg } from './ArrowSvg';

const SelectHeight = 80;

export const TagSelect = (props: TagSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
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
  const inputRef = useRef<HTMLInputElement>(null);
  const divRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    setIsOpen(!isOpen);
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

  // React.useEffect(() => {
  //   setTags([
  //     ,
  //   ]);
  // });

  return (
    <div className={props.className} style={props.style}>
      <div
        className={`h-full w-full h-[${SelectHeight}px] min-w-[50px] overflow-auto rounded-[6px] border border-[#d9d9d9] hover:border-[#4096ff] transition duration-200 flex flex-row cursor-text`}
        onClick={handleClick}
      >
        <div className="flex-none w-[calc(100%-25px)]">
          <div ref={divRef} className="w-full flex flex-row flex-wrap justify-start">
            {tags.map((tag) => (
              <SelectTag key={tag} label={tag} onClose={handleCloseTag} />
            ))}
            <input
              ref={inputRef}
              className={`h-full ${
                tags.length <= 0 ? 'w-full' : 'w-[25px]'
              } p-2 placeholder-black/25 text-base focus:outline-none border-none`}
              placeholder={tags.length <= 0 ? props.placeholder : ''}
            />
          </div>
        </div>
        <div
          className={`w-[25px] h-[${
            divRef?.current?.scrollHeight ?? 38
          }px] flex justify-start items-center`}
        >
          <ArrowSvg style={{ color: '#d9d9d9' }} />
        </div>
      </div>
    </div>
  );
};

interface TagSelectProps {
  className?: string;
  style?: React.CSSProperties;
  placeholder?: string;
}
