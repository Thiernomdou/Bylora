const { PDFParse } = require('pdf-parse');
const fs = require('fs');
const buf = fs.readFileSync('C:/Users/tdiallo-hns/Downloads/DRIS Naturalisation.pdf');
const parser = new PDFParse();
parser.parse(buf).then(data => {
  console.log(JSON.stringify(data).substring(0, 8000));
}).catch(e => console.error(e.message));
