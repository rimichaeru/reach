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

 *  With the results from this request, inside "content", return
 *  the "name" of the package that has the oldest "date" value
 */

module.exports = async function oldestPackageName() {
  const fetch = require('node-fetch');

  let name;

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

      let oldestPackageName = '';
      let oldestPackageDate = 0;

      for (let i = 0; i < content.length; i++) {
        let millisecondsDate = Date.parse(content[i]['package']['date']);

        // set initial package date
        if (oldestPackageDate === 0 || millisecondsDate < oldestPackageDate) {
          oldestPackageDate = millisecondsDate;
          oldestPackageName = content[i]['package']['name'];
        }
      }

      name = oldestPackageName;

    });

  return name;
};
