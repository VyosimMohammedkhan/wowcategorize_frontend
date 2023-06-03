import React, { useEffect, useState } from 'react';

const MainProgressStatus = () => {
  const [status, setStatus] = useState('starting task ... ');

  useEffect(() => {
    const eventSource = new EventSource('/mainPageProgress');

    eventSource.onmessage = (event) => {
      setStatus(event.data);

      if (event.data === 'All tasks Complete') {
        eventSource.close();
        setStatus("All tasks Complete")
      }
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div style={{ display: 'flex', textAlign:'center', marginTop:'150px', flexDirection:'column'}}>
      {/* <div><h1>Please wait ... task is in progress</h1></div> */}
      <p style={{fontSize:'30px', color:'#061526'}}>{status}</p>
    </div>
  );
};

export default MainProgressStatus;

