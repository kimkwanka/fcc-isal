const mongo = require('mongodb').MongoClient;

let db = null;
let uri = '';

const close = () => {
  if (db) {
    db.close();
  }
};

const setURI = (_uri) => {
  uri = _uri;
};

const connect = (cb) => {
  mongo.connect(uri, (err, _db) => {
    if (err) console.log(err); // eslint-disable-line no-console
    db = _db;
    cb(db);
  });
};

// Used by the other functions to get a connection to MongoDB.
// Connects, if no connection is established yet.
const get = (cb) => {
  if (db) {
    cb(db);
  } else {
    connect(cb);
  }
};

const find = (query, cb) => {
  get((_db) => {
    _db.collection('searchTerms').find(query)
      .toArray((err, docs) => {
        if (err) console.log(err); // eslint-disable-line no-console
        if (docs && docs.length > 0) {
          return cb(docs);
        }
        return cb(null);
      });
  });
};

const sort = (opt, cb) => {
  get((_db) => {
    _db.collection('searchTerms').find().sort(opt)
      .toArray((err, docs) => {
        if (err) console.log(err); // eslint-disable-line no-console
        if (docs && docs.length > 0) {
          return cb(docs);
        }
        return cb(null);
      });
  });
};

const save = (obj, cb) => {
  get((_db) => {
    _db.collection('searchTerms').insert(obj, (err) => {
      if (err) console.log(err); // eslint-disable-line no-console
      if (cb) cb(obj);
    });
  });
};

// Since we're reusing the MongoDB connection throughout the app
// make sure to close it when the server is shut down
process.on('SIGINT', () => {
  close();
});
process.on('SIGTERM', () => {
  close();
});
process.on('SIGUSR2', () => {
  close();
});

module.exports = {
  setURI,
  find,
  close,
  save,
  sort,
};
