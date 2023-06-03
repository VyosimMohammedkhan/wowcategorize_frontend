import React, { useEffect, useState } from 'react';


const SingleProgressStatus = () => {
  const [status, setStatus] = useState('starting task ... ');

  useEffect(() => {
    const eventSource = new EventSource('/progress');

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
      <p style={{fontSize:'30px', color:'#7ebee0'}}>{status}</p>
    </div>
  );
};

export default SingleProgressStatus;

