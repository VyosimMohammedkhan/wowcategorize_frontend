
import React, { useState, useEffect } from 'react';

 function LoadingComponent(urlcount){
  const [loadingPercentage, setLoadingPercentage] = useState(0);
  const loadingTimeInSeconds = 2*urlcount; // Set the time for 100% loading in seconds

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingPercentage(prevPercentage => {
        const newPercentage = prevPercentage + (100 / loadingTimeInSeconds);
        return newPercentage >= 100 ? 100 : newPercentage;
      });
    }, 1000); // Update the loading percentage every second

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
      <h2>Loading...</h2>
      <p>{loadingPercentage}%</p>
    </div>
  );
};

export default LoadingComponent;
