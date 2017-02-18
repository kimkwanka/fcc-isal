const express = require('express');
const path = require('path');
const stylus = require('stylus');
const axios = require('axios');

const app = express();

const apiURL = 'https://api.imgur.com/3';
const apiClientID = process.env.IMGURCLIENTID;
console.log('ID???:', apiClientID);
// Use process.env.PORT if set for Heroku, AWS, etc.
const port = process.env.PORT || 8080;

// Configure templating engine
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'pug');

// Enable Stylus preprocessor as middleware
app.use(stylus.middleware({
  src: path.join(__dirname, '/res'),
  dest: path.join(__dirname, '/public'),
  compile: (str, filepath) => (
    stylus(str)
    .set('filename', filepath)
    .set('compress', true)
  ),
}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index', {
    title: 'Image Search Abstraction Layer',
    url: 'https://fcc-isearch.herokuapp.com',
  });
});

app.get('/api/search/:term', (req, res) => {
  const term = req.params.term;
  const offset = req.query.offset || 0;
  const apiCall = `${apiURL}/gallery/search/top/?q=${term}&page=${offset}`;
  console.log(apiClientID);
  axios({
    method: 'get',
    url: apiCall,
    headers: {
      Authorization: `Client-ID ${apiClientID}`,
    },
  }).then((apiRes) => {
    if (apiRes.data.data.length > 0) {
      const img = apiRes.data.data[0];
      console.log(':O', apiRes.data.data);
      res.json({ imgURL: img.link, pageURL: `https://imgur.com/${img.id}`, alt: img.title });
    } else {
      res.json({ error: 'Your search yieled no results.' });
    }
  }).catch((error) => {
    console.log(error);
    res.json({ error: 'Couldn\'t fulfill your request. Try again or use different search terms / offset. ' });
  });
});

app.get('/api/latest/', (req, res) => {
  res.json({ term: '', when: '' });
});


app.get('*', (req, res) => {
  res.render('404', {});
});

const server = app.listen(port);

// Make sure to shutdown server when process ends to free the port
process.on('SIGINT', () => {
  console.log('SIGINT: Shutting down server.'); // eslint-disable-line no-console
  server.close();
});
process.on('SIGTERM', () => {
  console.log('SIGTERM: Shutting down server.');  // eslint-disable-line no-console
  server.close();
});
/* Closing on SIGUSR2 somehow breaks browser reflecting changes, so uncomment for now
  process.on('SIGUSR2', () => {
  server.close();
});*/

// Export functions for testing in server-test.js
module.exports = {
};
