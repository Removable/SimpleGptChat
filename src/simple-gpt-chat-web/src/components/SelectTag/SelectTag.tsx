import React from 'react';

import { CloseSvg } from '../TagSelect/CloseSvg';

const SelectTag = (props: SelectTagProps) => {
  return (
    <div className="bg-[#f0f0f0] border border-[#e2e2e2] rounded-[6px] overflow-auto flex flex-row m-[2px] p-[5px]">
      <span className="flex-none grow inline-block overflow-hidden whitespace-pre text-ellipsis">
        {props.label}
      </span>
      <div className="w-[20px] h-full flex justify-center items-center">
        <CloseSvg
          style={{ color: '#919191', cursor: 'pointer', fontSize: '12px' }}
          onClick={(e) => {
            e.stopPropagation();
            if (props.onClose) {
              props.onClose(props.value || props.label);
            }
          }}
        />
      </div>
    </div>
  );
};

interface SelectTagProps {
  label: string;
  value?: string;
  onClose?: (val: string) => void;
}

export default SelectTag;
