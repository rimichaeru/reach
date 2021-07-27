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

 * With the results from this request, inside "content", 
 * list every maintainer and each package name that they maintain,
 * return an array with the following shape:
[
    ...
    {
        username: "a-username",
        packageNames: ["a-package-name", "another-package"]
    }
    ...
]
 * NOTE: the parent array and each "packageNames" array should 
 * be in alphabetical order.
 */

module.exports = async function organiseMaintainers() {
  const fetch = require('node-fetch');

  const maintainers = [];
  const maintainerUsernames = [];

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

      // mapping each package
      content.map(pack => {
        // mapping each maintainer
        pack['package']['maintainers'].map(maintainer => {
          // add user if not in maintainers list
          if (!maintainerUsernames.includes(maintainer['username'])) {
            maintainerUsernames.push(maintainer['username']);
            maintainers.push({
              username: maintainer['username'],
              packageNames: [pack['package']['name']],
            });
          } else {
            // user already exists, add package only
            for (let i = 0; i < maintainers.length; i++) {
              if (maintainers[i]['username'] === maintainer['username']) {
                maintainers[i]['packageNames'].push(pack['package']['name']);
                break;
              }
            }
          }
        });
      });

      // cleanup formatting, alphabetical usernames
      maintainers.sort((a, b) => {
        if (a['username'] < b['username']) {
          return -1;
        } else {
          return 1;
        }
      });

      // sort each maintainers packageNames, alphabetical
      // could have done it before the break on line 79, but would use unecessary computation, especially for larger lists
      for (let i = 0; i < maintainers.length; i++) {
        maintainers[i]['packageNames'].sort();
      }
    });

  return maintainers;
};
