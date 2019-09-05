const jsonServer = require('json-server')
const routes = require('./routes')
const server = jsonServer.create()
const router = jsonServer.router('./mock/db.json')
const middlewares = jsonServer.defaults()
const rewritter = jsonServer.rewriter(routes)

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares)
// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser)
server.use((req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT') {
    req.body.createdAt = Date.now()
  }
  res.header('X-Create-Time', Date.now())
  // Continue to JSON Server router
  next()
})
// Use default router
server.use(rewritter)
server.use(router)
server.listen(3000, () => {
  console.log('JSON Server is running')
})