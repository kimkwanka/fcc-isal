const express = require('express');
const path = require('path');
const stylus = require('stylus');

const app = express();

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

app.get('*', (req, res) => {
  res.render('404', {});
});

const server = app.listen(port);

// Make sure to shutdown server when process ends to free the port
process.on('SIGINT', () => {
  server.close();
});
process.on('SIGTERM', () => {
  server.close();
});
process.on('SIGUSR2', () => {
  server.close();
});

// Export functions for testing in server-test.js
module.exports = {
};
