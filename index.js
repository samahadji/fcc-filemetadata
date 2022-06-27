var express = require('express');
var cors = require('cors');
require('dotenv').config();
const busboy = require('busboy');

var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/fileanalyse', (req, res) => {
  const busboyWorker = busboy ({headers: req.headers});
  busboyWorker.on('file', (name, file, info) => {
    let totalSize = 0
    const { filename, encoding, mimeType } = info;
    console.log(
      `File [${name}]: filename: %j, encoding: %j, mimeType: %j`,
      filename,
      encoding,
      mimeType
    );
    file.on('data', (data) => {
      //console.log(`File [${name}] got ${data.length} bytes`);
      totalSize += data.length ;
    }).on('close', () => {
      res.json({name: filename, type: mimeType, size: totalSize})
      //console.log(`File [${name}] done`);
    });
  });
  busboyWorker.on('field', (name, val, info) => {
    console.log(`Field [${name}]: value: %j`, val);
  });
  busboyWorker.on('close', () => {
    console.log('Done parsing form!');
    //res.status(303).send({ Connection: 'close', Location: '/' });//303, 
   // res.end();
  });
  req.pipe(busboyWorker);
})



const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
