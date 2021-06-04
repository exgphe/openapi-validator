const fs = require('fs')
const express = require('express')
const { OpenApiValidator } = require('express-openapi-validate')
const jsYaml = require('js-yaml')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json({
  type (req) {
    return true
  }
}))

const openApiDocument = jsYaml.load(
  fs.readFileSync(process.argv[2], 'utf-8')
)
const validator = new OpenApiValidator(openApiDocument, {
  ajvOptions: {
  },
  disallowAdditionalPropertiesByDefault: true
})

app.post('/restconf/data/example-jukebox:jukebox', validator.validate('post', '/data/example-jukebox:jukebox'), (req, res, next) => {
  res.json({ output: req.body })
})

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500
  res.status(statusCode).json({
    error: {
      name: err.name,
      message: err.message,
      data: err.data
    }
  })
})

const server = app.listen(3000, 'localhost', () => {
  console.log('Listening on', server.address())
})
