const express = require('express')
const path = require('path')
const fetch = require('node-fetch')
const child_process = require('child_process')
// AbortController was added in node v14.17.0 globally
const AbortController = globalThis.AbortController

const app = express()
const port = 4000

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'))
})

app.get('/fetchImage', async function (req, res) {
  const imageUrl = req.query.imageUrl;
  if(imageUrl) {

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => {
        controller.abort();
      }, 3000);

      let imgFetchResponse = await fetch(imageUrl, {signal: controller.signal});
      const imgResponseBuffer = await imgFetchResponse.buffer()
      res.status(200).send(imgResponseBuffer);
    } catch (err) {
      console.log(err);
      res.status(500).send('Internal Server Error.');
    }


  } else {
    res.sendFile(path.join(__dirname, '/default.png'))
  }
})

app.get('/style.css', (req, res) => {
  res.sendFile(path.join(__dirname, '/style.css'))
})

app.get('/script.js', (req, res) => {
  res.sendFile(path.join(__dirname, '/script.js'))
})

app.listen(port, '0.0.0.0', () => {
  console.log(`Image fetcher app listening on port ${port}`)
  console.log(`Emulating EC2 metadata (IMDSv1 and IMDSv2) on port 80`)
  console.log(`Emulating EC2 metadata (IMDSv2 only) on port 2000`)
  try {
    child_process.spawn('ip', ['address', 'add', '169.254.169.254/24', 'dev', 'eth0'], { stdio: 'ignore', detached: true }).unref()
  } catch (error) {
    console.log('Could not set IP 169.254.169.254, use localhost in payloads intead. Probably missing --cap-add NET_ADMIN or not running in a container.', error)
  }
  child_process.spawn('/app/ec2-metadata-mock', ['-p', '80'], { stdio: 'ignore', detached: true }).unref()
  child_process.spawn('/app/ec2-metadata-mock', ['-p', '2000', '--imdsv2'], { stdio: 'ignore', detached: true }).unref()

})
