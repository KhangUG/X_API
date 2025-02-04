import express from 'express'
const app = express()
const port = 3000

const router = express.Router()


app.get('/', (req, res) => {
  res.send('Hello World!')
})

router.get('/test', (req, res) => {
  res.json({ data: [{
    id : 1,
    name: 'test'
    
  }] })
})
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
