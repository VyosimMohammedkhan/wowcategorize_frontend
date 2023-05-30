import React, { useState, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community'
import CustomTooltipForCategories from '../tooltips/categoriesTooltip'

export default function Bulkategorize() {

  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [rowClicked, setRowClicked] = useState(false);
  const [submitClicked, setSubmitClicked] = useState(false);
  const [matchCountRowData, setResponsematchCountData] = useState();
  const [categoryRowData, setCategoryRowData] = useState();

  const defaultColDefForMatchCount = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true,
    editable: true,
    cellStyle: { textAlign: "left" },
  }), []);

  const defaultColDefForCategories = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true,
    editable: true,
    wrapText: true,
    // autoHeight: true,
    cellStyle: { textAlign: "center" },
    tooltipComponent: CustomTooltipForCategories,
  }), []);

  const matchCountColumnDefs = [
    { field: 'Site', pinned: 'left' },
    { field: 'About', width: 100, headerClass: 'custom-header-class' },
    { field: 'Contact', width: 120, headerClass: 'custom-header-class' },
    { field: 'Team', width: 100, headerClass: 'custom-header-class' },
    { field: 'Investor', width: 105, headerClass: 'custom-header-class' },
    { field: 'Product', width: 105, headerClass: 'custom-header-class' },
    { field: 'Career', width: 100, headerClass: 'custom-header-class' },
    { field: 'News', width: 100, headerClass: 'custom-header-class' },
    { field: 'ECommerce', width: 130, headerClass: 'custom-header-class' },
    { field: 'Resources', width: 120, headerClass: 'custom-header-class' },
    { field: 'Pricing', width: 105, headerClass: 'custom-header-class' },
    { field: 'Social', width: 100, headerClass: 'custom-header-class' },
    { field: 'Portal', width: 100, headerClass: 'custom-header-class' },
    { field: 'Legal', width: 100, headerClass: 'custom-header-class' },
    { field: 'Blog', width: 100, headerClass: 'custom-header-class' },
  ];

  const categoryColumnDefs = [
    //{ field: 'Site' },
    { field: 'HREF', tooltipField: 'HREF', pinned: 'left', cellStyle: { textAlign: "left" } },
    { field: 'linkText', tooltipField: 'linkText', pinned: 'left', cellStyle: { textAlign: "left" } },
    { field: 'About', width: 100, filter: 'agTextColumnFilter', filterParams: { buttons: ['reset', 'apply'], }, },
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
    { field: 'keywordFound', tooltipField: 'keywordFound', cellStyle: { textAlign: "left" }, rowGroup: true },
  ];

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };



  const handleFileSubmit = async () => {
    setSubmitClicked(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('https://wowcategorize-server.onrender.com/file', {
        method: 'POST',
        body: formData,
      });
      const jsonData = await response.json();
      console.log(Object.keys(jsonData).length)
      if (Object.keys(jsonData).length !== 0) {
        let countdataArray = [];
        for (let [key, value] of Object.entries(jsonData)) {
          console.log(`${key}: ${value}`);
          let countdata = value[1];
          countdata.Site = key;
          countdataArray.push(countdata);
        }
        console.log(countdataArray);

        setResponsematchCountData(countdataArray);
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
      const response = await fetch('https://wowcategorize-server.onrender.com/bulkCategorize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "urlList": inputValue }),
      });
      const jsonData = await response.json();
      console.log(Object.keys(jsonData).length)
      if (Object.keys(jsonData).length !== 0) {
        let countdataArray = [];
        for (let [key, value] of Object.entries(jsonData)) {
          console.log(`${key}: ${value}`);
          let countdata = value[1];
          countdata.Site = key;
          countdataArray.push(countdata);
        }
        console.log(countdataArray);

        setResponsematchCountData(countdataArray);
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


  const onRowClicked = async (event) => {
    const site = event.data.Site;

    try {
      const response = await fetch('https://wowcategorize-server.onrender.com/dbData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "Site": site }),
      });
      let jsondata = await response.json();
      let categorydata = await jsondata.categoryData;
      setRowClicked(true);
      setCategoryRowData(categorydata);
      console.log('Data retrieved:', categorydata);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };



  return (
    <div>
      <nav className="navbar-bulk">
        <div className="navbar_top">
          <label htmlFor="searchBox" style={{ marginRight: '15px', color: '#0b1012' }}>Enter comma seperated list of urls to categorize </label>
          <input id="searchBox" type="text" size='95' placeholder="http://siteone.com, http://sitetwo.com, http://sitethree.com, http://sitefour.com, http://sitefive.com, http://sitesix.com, ............." value={inputValue} className="navbar__search" onChange={handleInputChange} onKeyDown={handleKeypress} />
          <button type="submit" className="navbar__button" onClick={handleSubmit}>Submit</button>
        </div>
      </nav>
      <div className="fileuploadbar">
        <span style={{ fontSize: '1.5vw', fontWeight: 'bold', marginRight: '20px' }} >OR</span> <label htmlFor='myFile'> Upload csv file with the list of urls to categorize</label>
        <input style={{ margin: '15px' }} className="navbar__search" type="file" id="myFile" name="filename" accept="text/csv, application/csv" onChange={handleFileChange} />
        <button type="submit" className="navbar__button" onClick={handleFileSubmit}>Submit</button>
      </div>


      {loading ? (
        <div id='beforeSubmitDiv'>

          <div>
            <span className='loadingTextbulkpage' style={{ fontFamily: 'Trocchi', fontSize: '25px', fontWeight: 'normal', textAlign: 'center' }}>
              Please Enter a comma-seperated URL list in the Textbox and<br /> Click on submit button to get the data
              <br /> OR <br /> Upload a csv file to bulk categorize
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
                <div className="ag-theme-balham" style={{ textAlign: 'center', width: '100%', height: '25vh' }}>
                  <h4 style={{ color: "#0d0a0b", fontFamily: 'Trocchi', fontSize: '20px', fontWeight: 'normal', marginLeft: '20px' }}>
                    Total count of matches per category</h4>
                  <AgGridReact
                    rowHeight={'35vw'}
                    columnDefs={matchCountColumnDefs}
                    rowData={matchCountRowData}
                    defaultColDef={defaultColDefForMatchCount}
                    columnHoverHighlight={true}
                    onRowClicked={onRowClicked}
                  />

                </div>
              </div>
              {rowClicked ? (<div className='bottomgrids'>
                <div className="ag-theme-alpine left" style={{ width: '100%', height: '42vh' }}>
                  <h4 style={{ textAlign: 'center', color: "#0d0a0b", fontFamily: 'Trocchi', fontSize: '20px', fontWeight: 'normal', marginLeft: '20px' }}>
                    Details for selected Site</h4>
                  <AgGridReact
                    rowHeight={35}
                    columnDefs={categoryColumnDefs}
                    rowData={categoryRowData}
                    defaultColDef={defaultColDefForCategories}
                    tooltipShowDelay={0}
                    columnHoverHighlight={true}
                  />
                </div>
              </div>) : (

                <div><span className='loadingTextbulkpage' style={{ fontFamily: 'Trocchi', fontSize: '25px', fontWeight: 'normal', textAlign: 'center' }}>
                  Please select a Row to display details
                </span></div>
              )
              }

            </div>
          )}
        </div>
      )}


    </div>
  )

}
