const fs = require('fs');
const pngToIco = require('png-to-ico');

async function convertIcon() {
  try {
    console.log('Converting to ico...');
    const buf = await pngToIco('src/assets/temp_icon.png');
    fs.writeFileSync('src/assets/icon.ico', buf);
    
    // Clean up
    fs.unlinkSync('src/assets/temp_icon.png');
    console.log('Icon successfully converted to icon.ico');
  } catch (err) {
    console.error('Error converting icon:', err);
  }
}

convertIcon();
