import './SelectTag.css';

import React from 'react';

import { CloseSvg } from '../TagSelect/CloseSvg';

const SelectTag = (props: SelectTagProps) => {
  return (
    <div className="tag-container" style={{ height: props.height, width: props.width }}>
      <div className="tag-label-container">
        <span>{props.label}</span>
      </div>
      <div className="tag-close-container">
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
  height?: string;
  width?: string;
}

export default SelectTag;
