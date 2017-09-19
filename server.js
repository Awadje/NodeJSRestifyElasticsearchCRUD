const restify = require('restify')
const errors = require('restify-errors')
const elasticsearch = require('elasticsearch')

// instanciate elasticsearch connection:
const esClient = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
})

const server = restify.createServer()
server.use(restify.plugins.bodyParser())

require('./controllers/Hello')(server, errors, esClient)

server.listen(8080, () => {
  console.log(`${server.name} listening at ${server.url}`)
})