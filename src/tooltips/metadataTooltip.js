import React, { useMemo } from 'react';
import '../App.css';

 const CustomTooltipForMetaData= (props) => {
    const data = useMemo(
      () => props.api.getDisplayedRowAtIndex(props.rowIndex).data,
      []
    );
  
    return (
      <div
        className="custom-tooltip1"
        style={{ backgroundColor: 'white', color: 'black' }}
      >
        <p>
          <span>metaTag : </span>{data.metaTagName}
        </p>
        <p>
          <span>Value : </span> {data.value}
        </p>
      </div>
    );
  };
  
  export default CustomTooltipForMetaData;