import React, { useEffect, useState } from 'react';

const ProgressStatus = () => {
  const [status, setStatus] = useState('initiating ...');

  useEffect(() => {
    const eventSource = new EventSource('/status');

    eventSource.onmessage = (event) => {
      setStatus(event.data);

      if (event.data == '0') {
        eventSource.close();
        setStatus("All tasks complete")
      }
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div style={{ display: 'flex', textAlign:'center', marginTop:'150px', flexDirection:'column'}}>
      <div><h1>Please wait ... task is in progress</h1></div>
      <p style={{fontSize:'30px', color:'#7ebee0'}}>{status}</p>
    </div>
  );
};

export default ProgressStatus;

