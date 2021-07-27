/**
 * Make the following POST request with either axios or node-fetch:
 
 POST url: http://ambush-api.inyourarea.co.uk/ambush/intercept
 BODY: {
   "url": "https://api.npms.io/v2/search/suggestions?q=react",
   "method": "GET",
   "return_payload": true
  }
  
  *******
  
  The results should have this structure:
  {
    "status": 200.0,
    "location": [
      ...
    ],
    "from": "CACHE",
    "content": [
      ...
    ]
  }
  
  ******
  
  *  With the results from this request, inside "content", count
  *  the number of packages that have a MAJOR semver version 
  *  greater than 10.x.x
  */

module.exports = async function countMajorVersionsAbove10() {
  const fetch = require('node-fetch');

  let count = 0;

  const body = {
    url: 'https://api.npms.io/v2/search/suggestions?q=react',
    method: 'GET',
    return_payload: true,
  };

  await fetch('http://ambush-api.inyourarea.co.uk/ambush/intercept', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
    .then(response => response.json())
    .then(data => {
      const content = data['content'];

      for (let i = 0; i < content.length; i++) {
        const stringVersion = content[i]['package']['version'];

        // get MAJOR semver, convert to int, compare to required semver (>= 10)
        if (parseInt(stringVersion.split('.')[0]) >= 10) {
          count++;
        }
      }
    });

  return count;
};
