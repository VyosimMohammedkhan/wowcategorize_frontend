import React, { useRef, useEffect, useCallback, useState, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import "bootstrap/js/src/collapse.js";
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community'
import axios from 'axios'
import Papa, { parse } from "papaparse";
import CustomTooltipForCategories from '../tooltips/categoriesTooltip'
import CustomTooltipForMetaData from '../tooltips/metadataTooltip';
import GetURI from '../components/URI';
let uri = GetURI();// using this method because uri start with http for some calls and ws for some calls. need to think how to use proxy in this case

export default function CrawlMany() {

  const [rowClickLoading, setRowClickLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [taskcount, setTaskcount] = useState("")
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [rowClicked, setRowClicked] = useState(false);
  const [submitClicked, setSubmitClicked] = useState(false);
  const [queue, setQueue] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [rowClickMessage, setRowClickMessage] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [matchCountRowData, setMatchCountRowData] = useState([]);
  const [categoryRowData, setCategoryRowData] = useState();
  const [badDomainsRowData, setBadDomainsRowData] = useState([])
  const [metadataRowData, setMetadataRowData] = useState([]);
  const [htmlData, setHTMLdata] = useState({ data: "Not Found!" })
  const [progressStatus, setProgressStatus] = useState("")
  const [cols, setCols] = useState(30);

  const gridApiRef = useRef(null);
  const gridRef = useRef();
  const onGridReady = (params) => {
    gridApiRef.current = params.api;
  };


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
    cellStyle: { textAlign: "center" },
    tooltipComponent: CustomTooltipForCategories,
  }), []);

  const defaultColDefForBadDomains = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true,
    editable: true,
    wrapText: true,
  }), []);

  const defaultColDefForMetaData = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true,
    editable: true,
    tooltipComponent: CustomTooltipForMetaData,
    autoHeight: true,
  }), []);

  const metaDataColumnDefs = [
    { field: 'metaTagName', tooltipField: 'metaTagName', width: 150, headerClass: 'custom-header-class' },
    { field: 'value', tooltipField: 'value', wrapText: true, headerClass: 'custom-header-class' }
  ]

  const badDomainsColumnDefs = [
    { headerName: "Row", valueGetter: "node.rowIndex + 1", pinned: 'left', width: 90 },
    { field: 'Site', headerClass: 'custom-header-class' },
    { field: 'error', }
  ]

  const matchCountColumnDefs = [
    { headerName: "Row", valueGetter: "node.rowIndex + 1", pinned: 'left', width: 70 },
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
    { field: 'Exclude', width: 100, headerClass: 'custom-header-class' }
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
    { field: 'keywordFound', tooltipField: 'keywordFound', cellStyle: { textAlign: "left" } },
  ];


  //to hide resizeObservor error which is coming because of rendering HTML data of domains
  useEffect(() => {
    window.addEventListener('error', e => {
      if (e.message === 'ResizeObserver loop limit exceeded') {
        const resizeObserverErrDiv = document.getElementById(
          'webpack-dev-server-client-overlay-div'
        );
        const resizeObserverErr = document.getElementById(
          'webpack-dev-server-client-overlay'
        );
        if (resizeObserverErr) {
          resizeObserverErr.setAttribute('style', 'display: none');
        }
        if (resizeObserverErrDiv) {
          resizeObserverErrDiv.setAttribute('style', 'display: none');
        }
      }
    });
  }, []);

  //to get updated keywords from server
  useEffect(() => {
    const fetchData = async () => {
      try {
        const request = { url: `${uri}/keywords`, method: 'GET' };
        const response = await axios(request);
        setKeywords(response.data);
        console.log("keywords:", response.data);
      } catch (err) {
        console.log("Error while getting master keywords", err);
        setKeywords([]);
      }
    };

    fetchData();
  }, []);

//to send calculated totalcount data to DB
  useEffect(() => {
    try {
      // console.log("queue size : ", queue.length)
      if (queue.length > 0) {
        console.log("sending queued data to db")
        let data = queue.pop()
        sendDataToDB(data)
        setQueue(data => data.slice(1))
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [queue]);

  //to chnage column size of textarea based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 992) {
        setCols(30);
      } else if (window.innerWidth >= 992) {
        setCols(65);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  //recrawl checkbox
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  }

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

//for submit button after file upload
  const handleFileSubmit = async () => {
    setSubmitClicked(true);
    setBadDomainsRowData([])


    const reader = new FileReader();
    let urlList = [];

    await new Promise((resolve, reject) => {
      reader.onload = ({ target }) => {
        const csv = Papa.parse(target.result);
        const parsedData = csv?.data;
        urlList = parsedData?.flat();
        //urlList = urlList.flatMap(element => element.split(/[,|;]/));
        //urlList = urlList.flatMap(element => element.trim());
        urlList = urlList.flatMap(element => element.split(' '));
        urlList = urlList.filter(element => element);
        urlList = [...new Set(urlList)]
        resolve();
      };

      reader.onerror = () => {
        reject(new Error('File reading error.'));
      };

      reader.readAsText(selectedFile);
    });

    await startWebSocketAndManageIncomingData(urlList);
  };


//for submit button after TextArea
  const handleSubmit = async () => {
    setSubmitClicked(true);
    setBadDomainsRowData([])

    let urlList = inputValue.split(/\r?\n|\r|\t/);
    urlList = urlList.flatMap(element => element.split(/[,|;]/));
    urlList = urlList.flatMap(element => element.trim())
    urlList = urlList.flatMap(element => element.split(' '))
    urlList = urlList.filter(element => element)
    urlList = [...new Set(urlList)]

    await startWebSocketAndManageIncomingData(urlList);

  }

//to export failed domains to csv
  const onBtnExport = useCallback(() => {
    gridRef.current.api.exportDataAsCsv();
  }, []);

  //calculation methods ahead-----------------------------------------------------------------------------------------------------------------
  async function startWebSocketAndManageIncomingData(urlList) {
    try {
      if (gridApiRef.current) {
        clearRows();
      }
      setLoading(false);
      const socket = new WebSocket('ws://' + uri.replace('http://', '') + '/categorizeBulk');
      socket.onopen = () => {
        const message = {
          recrawl: isChecked,
          urlList: urlList,
        };
        socket.send(JSON.stringify(message));
      }
      socket.onmessage = async event => {
        const DataArray = await JSON.parse(event.data);
        if (DataArray.taskcount) {
          // console.log("mesage ", DataArray.message)
          setTaskcount(DataArray.taskcount);
        } else if (DataArray.progressStatus) {
          setProgressStatus(DataArray.progressStatus)
        } else {
          await setDataToGrid(DataArray)
        }
      }
      socket.onclose = event => {
        setProgressStatus("")
        setTaskcount("")
      }
    } catch (error) {
      console.error('Error posting data:', error);
    } finally {
      setSubmitClicked(false);
    }
  }

  async function setDataToGrid(DataArray) {
    DataArray.forEach(Data => {
      let totalCount;
      if (Object.keys(Data).length == 2 && Data.metaData.Site) {
        let url = Data.metaData.Site;
        // console.log(url)
        let categoryData = countMatchingKeywordsFromGivenSetOfLinks(Data.urlList, keywords, url)
        totalCount = countTotalperCategory(categoryData)
        let metaData = Data.metaData;
        let dataforDB = { url, categoryData, totalCount, metaData }
        // console.log(dataforDB)
        totalCount.Site = url;
        setQueue(prevData => [...prevData, dataforDB])
      } else if (Object.keys(Data).length === 5) {
        totalCount = Data.totalCount;
        totalCount.Site = Data.metaData['Site'];
      }
      if (totalCount) {
        addRows(totalCount)
      } else if (Data) {
        console.log("Data : ", Data)
        setBadDomainsRowData(prevData => [...prevData, ...Data])
      }
    })
  }

  const addRows = (data) => {
    let newRows = [
      data
    ];

    const transaction = {
      add: newRows,
    };
    gridApiRef.current.applyTransaction(transaction);
  };

  const clearRows = useCallback(() => {
    const rowData = [];
    gridApiRef.current.forEachNode(function (node) {
      rowData.push(node.data);
    });
    const res = gridApiRef.current.applyTransaction({
      remove: rowData,
    });
  }, []);

  async function sendDataToDB(data) {
    await axios.post(uri + '/dbData', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

//when a row is clicked in totalcount grid, display meta data and detailed categorydata for that domain
  const onRowClicked = async (event) => {
    const site = event.data.Site;
    setRowClickLoading(true);
    try {
      const response = await fetch(uri + '/dbData?Site=' + site, { method: 'Get' });

      let jsondata = await response.json();

      if (!jsondata.message) {
        let categorydata = await jsondata.categoryData;
        let metaData = await jsondata.metaData;
        setRowClicked(true);
        setCategoryRowData(categorydata);
        setMetadataRowData(formatMetaData(metaData))
        //console.log('Data retrieved:', categorydata);
        setRowClickMessage("data for selected row found successfully!")
      } else {
        // console.log("no data found");
        setRowClickMessage("Selected Row contains Exclude keyword!")
        setCategoryRowData([]);
        setMetadataRowData([])
      }

      const responseHTML = await fetch(uri + '/dbData/HTMLdata?Site=' + site, { method: 'Get' });
      let HTMLjsondata = await responseHTML.json();

      const filteredData = Object.entries(HTMLjsondata);
      filteredData.shift()
      filteredData.shift()
      console.log(filteredData)
      setHTMLdata(filteredData)

      setRowClickLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error);
      setRowClickLoading(false)
    }
  };

//format metadata columns => rows
  const formatMetaData = (data) => {
    let dataArray = [];
    Object.entries(data).map(([key, value]) => {
      dataArray.push({ metaTagName: key, value: value })
    })
    return dataArray;
  }

//parent method for looping through checkkeywordsOnUrl
  function countMatchingKeywordsFromGivenSetOfLinks(PageUrlsAndUrlTexts, keywords, url) {
    let categoryData = [];
    for (let UrlsAndUrlText of PageUrlsAndUrlTexts) {
      try {
        const keywordMatchCountData = checkKeywordsOnUrl(UrlsAndUrlText, keywords);
        keywordMatchCountData.Site = url
        categoryData.push(keywordMatchCountData);
      } catch (error) {
        console.log(`failed to classify ${url}`)
        console.log(error)
        continue;
      }
    }
    return categoryData;
  }

//takes an href and its linktext and returns categoryData for that href (1 row with 1 for keyword found category and empty for no keyword found category)
  function checkKeywordsOnUrl(urlHrefAndTextArray, keywords) {
    let Categories = { "HREF": urlHrefAndTextArray[0], "linkText": urlHrefAndTextArray[1].replace(/\r?\n|\r/g, ""), "About": "", "Contact": "", "Team": "", "Investor": "", "Product": "", "Career": "", "News": "", "ECommerce": "", "Resources": "", "Pricing": "", "Social": "", "Portal": "", "Legal": "", "Blog": "", "keywordFound": "None" };
    let keywordsArry = Object.entries(keywords);
    Categories.linkText = Categories.linkText.replace(/\s+/g, ' ').trim();
    for (let [category, keywordset] of keywordsArry) {
      const word = category.toString()

      for (let keyword of keywordset) {
        if (Categories.HREF.toLowerCase().includes(keyword.toLowerCase()) || Categories.linkText.toLowerCase().includes(keyword.toLowerCase())) {
          Categories[`${word}`] = 1;
          if (Categories.keywordFound === "None") {
            Categories.keywordFound = keyword;
          } else {
            Categories.keywordFound = Categories.keywordFound + ", " + keyword;
          }
        }
      }
    }
    return Categories;
  }



//takes categoryData and returns total count per category for that domain
  function countTotalperCategory(data) {
    let countArray = {
      "About": 0, "Contact": 0, "Team": 0, "Investor": 0, "Product": 0, "Career": 0, "News": 0, "ECommerce": 0,
      "Resources": 0, "Pricing": 0, "Social": 0, "Portal": 0, "Legal": 0, "Blog": 0, "Exclude": 0
    };
    const categories = Object.keys(countArray);
    data.forEach((webpage) => {
      categories.forEach((category) => {
        if (webpage[category] === 1) countArray[category]++;
      });
    });

    return countArray;
  }

//------------------------------------------------------Frontend UI---------------------------------------------------------
  return (
    <div >
      <div className='container-fluid mb-2' style={{ borderStyle: "ridge", borderColor: 'blue', borderWidth: '1px' }}>
        <nav className="navbar navbar-bulk row">
          <div className='col-md-6 d-flex align-items-center flex-wrap justify-content-center'>
            <div>
              <textarea
                style={{ fontSize: "20px", width: "100%" }}
                id="searchBox"
                rows="3"
                cols={cols}
                placeholder="Enter a list of URLs or domains to get categorization details for them"
                value={inputValue}
                className="form-control"
                onChange={handleInputChange}
              ></textarea>
            </div>
            <div className="ml-2">
              <button type="submit" className="btn btn-primary btn-sm m-2" style={{ height: '30px' }} onClick={handleSubmit}>Submit</button>
            </div>
          </div>
          <div className='col-md-1 text-center my-auto'>
            <span className="font-weight-bold" style={{ fontSize: '1.5rem' }} >OR</span>
            <div className="d-flex justify-content-center align-content-center">
              <label htmlFor="recrawl" className='my-auto'>Recrawl?</label>
              <input
                type="checkbox"
                id="recrawl"
                checked={isChecked}
                onChange={handleCheckboxChange}
                className="ml-2"
              />
            </div>
          </div>
          <div className='col-md-5'>
            <div className=" d-flex flex-wrap justify-content-center align-items-center">
              <input style={{ width: '80%' }} className="form-control m-3" type="file" id="myFile" name="filename" accept="text/csv, application/csv" onChange={handleFileChange} />
              <button type="submit" className="btn btn-primary btn-sm m-2" style={{ height: '30px' }} onClick={handleFileSubmit}>Submit</button>
            </div>
          </div>
        </nav>
      </div>

      {loading && !submitClicked ? (
        <div id='beforeSubmitDiv' className="text-center">
          <div className="mt-5">
            <span className='loadingTextbulkpage'>
              Please enter a comma-separated URL list in the textbox and click on the submit button to get the data
              <br /> OR <br /> upload a CSV file to bulk categorize.
            </span>
          </div>
        </div>
      ) : (<></>)}


      {submitClicked ? (
        <div>
          <div><span className="ag-custom-loading"></span></div>
        </div>
      ) : (
        <div></div>
      )}

      <div> {!loading && !submitClicked ? (
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-9">
              <div className="ag-theme-balham text-center" style={{ width: '100%', height: '26vh' }}>
                <div className="row">
                  <div className="col-md-4">
                    <h6>{taskcount}</h6>
                  </div>
                  <div className="col-md-4">
                    <h6>Total count of matches per category</h6>
                  </div>
                  <div className="col-md-4">
                  </div>
                </div>
                <AgGridReact
                  rowHeight={35}
                  headerHeight={35}
                  columnDefs={matchCountColumnDefs}
                  rowData={matchCountRowData}
                  defaultColDef={defaultColDefForMatchCount}
                  columnHoverHighlight={true}
                  onRowClicked={onRowClicked}
                  onGridReady={onGridReady}
                  animateRows={true}
                />
              </div>
            </div>

            <div className="col-md-3 ">
              <div className="ag-theme-alpine" style={{ width: '100%', height: '26vh' }}>
                <div className='row justify-content-center '>
                  <div className='col-md-2'>
                    <button style={{ borderColor: "#adb1b8", borderStyle: "solid", borderWidth: "1px", borderRadius: "3px", height: '20px' }} onClick={onBtnExport}>Download</button>
                  </div>
                  <div className='col-md-10'>
                    <h6 className="text-center">Failed to crawl these domains</h6>
                  </div>
                </div>
                <AgGridReact
                  ref={gridRef}
                  rowHeight={35}
                  headerHeight={35}
                  columnDefs={badDomainsColumnDefs}
                  rowData={badDomainsRowData}
                  defaultColDef={defaultColDefForBadDomains}
                />
              </div>
            </div>
          </div>
        </div>

      ) : (
        <div></div>
      )}</div>

      {rowClicked && rowClickLoading ? (<div><span className="ag-custom-loading2"></span></div>) : (<></>)}

      {!loading && !submitClicked && !rowClicked && !rowClickLoading ? (
        <div className="position-absolute start-50 translate-middle" style={{ top: '70%' }}>
          <div >
            <h5>
              Please select a Row to display details
            </h5>
          </div>
        </div>
      ) : (
        <></>
      )}

      {rowClicked && !rowClickLoading ? (
        <div className='container-fluid mt-5'>
          <ul class="nav nav-tabs" id="myTab" role="tablist">
            <li class="nav-item" role="presentation">
              <button class="nav-link active" id="categorizationtab" data-bs-toggle="tab" data-bs-target="#tab1" type="button" role="tab" aria-controls="categorizationData" aria-selected="true">Categorization Data</button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="nav-link" id="HTMLtab" data-bs-toggle="tab" data-bs-target="#tab2" type="button" role="tab" aria-controls="renderedHTML" aria-selected="false">HTML rendered</button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="nav-link" id="HTMLtab" data-bs-toggle="tab" data-bs-target="#tab3" type="button" role="tab" aria-controls="HTMLText" aria-selected="false">HTML Text</button>
            </li>
          </ul>

          <div class="tab-content" id="myTabContent">
            <div className="mt-1 tab-pane fade show active" id="tab1" role="tabpanel" aria-labelledby="tab1">
              <div className="row">
                <div className="col-md-9">
                  <div className="ag-theme-alpine" style={{ width: '100%', height: '34vh' }}>
                    <div className="row">
                      <div className="col-md-3 text-center">{rowClickMessage}</div>
                      <div className="col-md-6 text-center">
                        <h6>Details for selected Domain</h6>
                      </div>
                    </div>
                    <AgGridReact
                      rowHeight={35}
                      headerHeight={35}
                      columnDefs={categoryColumnDefs}
                      rowData={categoryRowData}
                      defaultColDef={defaultColDefForCategories}
                      tooltipShowDelay={0}
                      columnHoverHighlight={true}
                      animateRows={true}
                    />
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="ag-theme-alpine" style={{ width: '100%', height: '34vh' }}>
                    <h6 className="text-center">MetaData</h6>
                    <AgGridReact
                      rowHeight={35}
                      headerHeight={35}
                      columnDefs={metaDataColumnDefs}
                      rowData={metadataRowData}
                      defaultColDef={defaultColDefForMetaData}
                      tooltipShowDelay={0}
                      columnHoverHighlight={true}
                      animateRows={true}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="tab-pane fade overflow-auto" id="tab2" role="tabpanel" aria-labelledby="tab2" style={{ height: "320px", padding: "5%" }}>
              {
                htmlData.map(item => (
                  <div className='mb-3' style={{ borderStyle: 'solid', borderWidth: "2px", borderColor: 'black', borderRadius: '5px', padding: "2%" }}>
                    <p className='mb-0 text-primary text-center ' style={{ borderStyle: 'solid', borderWidth: "2px", borderColor: 'black', borderRadius: '5px' }}>LinkText : {item[0]}</p>
                    <div dangerouslySetInnerHTML={{ __html: (item[1]) }}></div>
                    <br />
                  </div>
                ))
              }
            </div>
            <div className="tab-pane fade overflow-auto" id="tab3" role="tabpanel" aria-labelledby="tab3" style={{ height: "320px", padding: "5%" }}>
              {
                htmlData.map(item => (
                  <div className='mb-3' style={{ borderStyle: 'solid', borderWidth: "2px", borderColor: 'black', borderRadius: '5px', padding: "2%" }}>
                    <p className='mb-0 text-primary text-center ' style={{ borderStyle: 'solid', borderWidth: "2px", borderColor: 'black', borderRadius: '5px' }}>LinkText : {item[0]}</p>
                    <code >{item[1]}</code>
                    <br />
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}

      <div className='position-fixed bottom-0 start-0 ' style={{ zIndex: '1000', opacity: '1', backgroundColor: 'whitesmoke' }}>
        <span className='border border-top-0 border-1 rounded'>{progressStatus}</span>
      </div>
    </div>

  )
}
