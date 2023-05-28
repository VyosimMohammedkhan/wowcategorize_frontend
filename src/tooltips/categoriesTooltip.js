import React, { useMemo } from 'react';
import '../App.css';

 const CustomTooltipForCategories= (props) => {
    const data = useMemo(
      () => props.api.getDisplayedRowAtIndex(props.rowIndex).data,
      []
    );
  
    return (
      <div
        className="custom-tooltip"
        style={{ backgroundColor: 'white', color: 'black' }}
      >
        <p>
          <span>URL: </span>{data.HREF}
        </p>
        <p>
          <span>linkText: </span> {data.linkText}
        </p>
        <p>
          <span>keywordFound: </span> {data.keywordFound}
        </p>
      </div>
    );
  };
  
  export default CustomTooltipForCategories;