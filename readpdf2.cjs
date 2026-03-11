const { PDFParse } = require('pdf-parse');
const fs = require('fs');
const buf = fs.readFileSync('C:/Users/tdiallo-hns/Downloads/DRIS Naturalisation.pdf');
const parser = new PDFParse();
parser.parse(buf).then(data => {
  // Get text content
  if (data.text) console.log(data.text.substring(0, 15000));
  else if (data.pages) {
    data.pages.forEach((p,i) => {
      console.log(`\n--- PAGE ${i+1} ---`);
      if (p.text) console.log(p.text);
      else if (p.content) p.content.forEach(c => { if(c.str) process.stdout.write(c.str+' '); });
    });
  } else {
    console.log(Object.keys(data));
  }
}).catch(e => console.error(e.message));
