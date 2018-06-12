const http = require("http");
http.createServer((request, response) => {
  let returnData = {text: '你好!'}
  response.write(JSON.stringify(returnData))
  response.end()
}).listen(process.env.PORT || 3000)