import '../App.css';
import React, { useState, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import CustomTooltipForMetaData from '../tooltips/metadataTooltip';
import CustomTooltipForCategories from '../tooltips/categoriesTooltip'
import 'ag-grid-community'


export default function MainPage() {

    const [categoryRowData, setCategoryRowData] = useState();
    const [matchCountRowData, setResponsematchCountData] = useState();
    const [metaDataRowData, setResponsemetaData] = useState();
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitClicked, setSubmitClicked] = useState(false);
    
    const categoryColumnDefs = [
      //{ field: 'Site' },
      { field: 'HREF', tooltipField: 'HREF' , pinned: 'left',cellStyle: { textAlign: "left" }},
      { field: 'linkText', tooltipField: 'linkText', pinned: 'left' ,cellStyle: { textAlign: "left" }},
      { field: 'About', width: 100 ,filter: 'agTextColumnFilter', filterParams: {buttons: ['reset', 'apply'],},},
      { field: 'Contact', width: 110 },
      { field: 'Team', width: 90 },
      { field: 'Investor', width: 110 },
      { field: 'Product', width: 110 },
      { field: 'Career', width: 100 },
      { field: 'News', width: 90 },
      { field: 'ECommerce', width: 130 },
      { field: 'Resources', width: 120 },
      { field: 'Pricing', width: 100 },
      { field: 'Social', width: 100 },
      { field: 'Portal', width: 100 },
      { field: 'Legal', width: 90 },
      { field: 'Blog', width: 90 },
      { field: 'keywordFound', tooltipField: 'keywordFound' ,cellStyle: { textAlign: "left" } , rowGroup:true},
    ];
  
    const matchCountColumnDefs = [
      { field: 'About', width: 100  ,headerClass: 'custom-header-class' },
      { field: 'Contact', width: 120 ,headerClass: 'custom-header-class'},
      { field: 'Team', width: 100 ,headerClass: 'custom-header-class'},
      { field: 'Investor', width: 105 ,headerClass: 'custom-header-class'},
      { field: 'Product', width: 105 ,headerClass: 'custom-header-class'},
      { field: 'Career', width: 100 ,headerClass: 'custom-header-class'},
      { field: 'News', width: 100 ,headerClass: 'custom-header-class'},
      { field: 'ECommerce', width: 130 ,headerClass: 'custom-header-class'},
      { field: 'Resources', width: 120 ,headerClass: 'custom-header-class'},
      { field: 'Pricing', width: 105 ,headerClass: 'custom-header-class'},
      { field: 'Social', width: 100 ,headerClass: 'custom-header-class'},
      { field: 'Portal', width: 100 ,headerClass: 'custom-header-class'},
      { field: 'Legal', width: 100 ,headerClass: 'custom-header-class'},
      { field: 'Blog', width: 100 ,headerClass: 'custom-header-class'},
    ];
  
    const metaDataColumnDefs = [
      { field: 'metaTagName',tooltipField: 'metaTagName'  },
      { field: 'value',tooltipField: 'value', wrapText: true}
    ]
  
    const defaultColDefForCategories = useMemo(() => ({
      sortable: true,
      filter: true,
      resizable: true,
      editable: true,
      wrapText:true,
      // autoHeight: true,
      cellStyle: { textAlign: "center" },
      tooltipComponent: CustomTooltipForCategories,
    }), []);
  
    const defaultColDefForMatchCount = useMemo(() => ({
      sortable: true,
      filter: true,
      resizable: true,
      editable: true,
     cellStyle: { textAlign: "left"},
    }), []);
  
    const defaultColDefForMetaData = useMemo(() => ({
      sortable: true,
      filter: true,
      resizable: true,
      editable: true,
      tooltipComponent: CustomTooltipForMetaData,
      autoHeight: true,
    }), []);
  
   
    
  
    const handleInputChange = (event) => {
      setInputValue(event.target.value);
    }
    
    const handleKeypress = e => {
      if (e.keyCode === 13) {
        handleSubmit();
      }
    };
    const handleSubmit = async () => {
      setSubmitClicked(true);
      try {
        const response = await fetch('https://wowcategorize-server.onrender.com/wowCat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ "url": inputValue }),
        });
        const jsonData = await response.json();
        console.log(Object.keys(jsonData).length)
        if (Object.keys(jsonData).length !== 0) {
           setCategoryRowData(jsonData[0]);
           setResponsemetaData(formatMetaData(jsonData[1]));
           setResponsematchCountData([jsonData[2]]);
          setLoading(false)
        } else {
          setLoading(true);
          alert("Couldn't find data for given URL! Please enter a valid URL")
        }
      } catch (error) {
        console.error('Error posting data:', error);
      } finally {
        setSubmitClicked(false);
      }
    
    };
    
    const formatMetaData = (data) => {
      let dataArray = [];
      Object.entries(data).map(([key, value]) => {
        dataArray.push({ metaTagName: key, value: value })
      })
      return dataArray;
    }
  
    const groupDisplayType = 'groupRows';

    return (
      <div style={{ backgroundColor: '#d7d8da', height:'92vh' }}>
      <div>
        <nav className="navbar-custom">
          <div className="navbar__right">
            <label for="searchBox" style={{ marginRight: '15px', color: '#0b1012' }}>Enter a URL to get data: </label>
            <input id="searchBox" type="text" size='50' placeholder="http://example.com/" value={inputValue} className="navbar__search" onChange={handleInputChange} onKeyDown={handleKeypress} />
            <button type="submit" className="navbar__button" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </nav>
  
      </div>
      {loading ? (
        <div id='beforeSubmitDiv'>
  
          <div>
            <span className='loadingText' style={{ fontFamily: 'Trocchi', fontSize: '35px', fontWeight: 'normal', margin: '20px', textAlign: 'center' }}>
              Please Enter a URL in the Textbox and<br /> Click on submit button to get the data
            </span>
          </div>
  
          <div>
            {submitClicked ? (
              <div><span className="ag-custom-loading"></span></div>
            ) : (
              <div></div>
            )}
          </div>
        </div>
  
      ) : (
        <div id='afterSubmitDiv'>
          {submitClicked ? (
            <div><span className="ag-custom-loading"></span></div>
          ) : (
            <div className='mycontainer'>
              <div className='top'>
                <div className="ag-theme-balham" style={{ textAlign: 'center',width: '100%', height: 75 }}>
                  <h4 style={{ color: "#0d0a0b", fontFamily: 'Trocchi', fontSize: '20px', fontWeight: 'normal', marginLeft: '20px' }}>
                    Total count of matches per category</h4>
                  <AgGridReact
                    rowHeight={35}
                    columnDefs={matchCountColumnDefs}
                    rowData={matchCountRowData}
                    defaultColDef={defaultColDefForMatchCount}
                    columnHoverHighlight={true}
                  />
  
                </div>
              </div>
               <div className='bottomgrids'>
               <div className="ag-theme-alpine left" style={{width: '100%', height: '65vh' }}>
                  <h4 style={{  textAlign: 'center',color: "#0d0a0b", fontFamily: 'Trocchi', fontSize: '20px', fontWeight: 'normal', marginLeft: '20px' }}>
                    Details of URLs matched</h4>
                  <AgGridReact
                    rowHeight={35}
                    columnDefs={categoryColumnDefs}
                    rowData={categoryRowData}
                    defaultColDef={defaultColDefForCategories}
                    tooltipShowDelay={0}
                   columnHoverHighlight={true}
                   groupDisplayType={groupDisplayType}
                  />
                </div>
                <div className="ag-theme-alpine right" style={{ width: '100%', height: '65vh' }}>
                  <h4 style={{ textAlign: 'center', color: "#0d0a0b", fontFamily: 'Trocchi', fontSize: '20px', fontWeight: 'normal', marginLeft: '20px' }}>
                    MetaData for Given URL</h4>
                  <AgGridReact
                    
                    columnDefs ={metaDataColumnDefs}
                    rowData={metaDataRowData}
                    defaultColDef={defaultColDefForMetaData}
                    pagination= {false}
                    tooltipShowDelay= {0}
                  />
                </div>
              </div> 
            </div>
          )}
        </div>
      )}
    </div>
  );
  }

  
