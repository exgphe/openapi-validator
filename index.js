const fs = require('fs')
const { OpenApiValidator } = require('express-openapi-validate')
const jsYaml = require('js-yaml')
const grpc = require('@grpc/grpc-js')
const messages = require('./proto/api_pb')
const services = require('./proto/api_grpc_pb')

let PORT = 50051
if (process.env.GRPC_PORT) {
  PORT = Number(process.env.GRPC_PORT)
}

const openApiDocument = jsYaml.load(
  fs.readFileSync(process.argv[2], 'utf-8')
)
const validator = new OpenApiValidator(openApiDocument, {
  ajvOptions: {},
  disallowAdditionalPropertiesByDefault: true
})

const server = new grpc.Server()

function validate ({ request }, callback) {
  try {
    const path = request.getPath()
    const params = Object.fromEntries(request.getParamsMap().toObject())
    const query = Object.fromEntries(request.getQueryMap().toObject())
    const validatingResponse = request.getValidatingResponse()
    const method = request.getMethod().toLowerCase()
    const headers = Object.fromEntries(request.getHeadersMap().toObject())
    const rawBody = request.getBody()
    const body = rawBody && rawBody.length > 0 ? JSON.parse(new TextDecoder().decode(request.getBody())) : null
    const handler = validatingResponse ? validator.validateResponse(method, path) : validator.validate(method, path)
    handler({ query, headers, params, body, statusCode: 200 }, null, (err) => {
      const reply = new messages.ValidationResponse()
      if (err) {
        reply.setOk(false)
        reply.setMessage(JSON.stringify(err, null, 4))
      } else {
        reply.setOk(true)
      }
      callback(null, reply)
    })
  } catch (err) {
    const reply = new messages.ValidationResponse()
    reply.setOk(false)
    reply.setMessage(err.toString())
    callback(null, reply)
  }
}

server.addService(services.ApiService, {
  validate
})

server.bindAsync(`localhost:${PORT}`, grpc.ServerCredentials.createInsecure(), () => {
  console.log(`OpenAPI Validation Service Listening on localhost:${PORT}`)
  server.start()
})
