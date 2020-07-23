const express = require('express')
const app = express()
const port = 9000

app.get('/token', (req, res) => res.send('true'))
app.get('/_status', (req, res) => res.send(''))

app.listen(port, () => console.log(`listening at http://localhost:${port}`))
