const http = require("http")
const fs = require("fs")
const WebSocket = require('ws')

function cutString(original, before, after, index) {
  index = index || 0;
  if (typeof index === "number") {
    const P = original.indexOf(before, index);
    if (P > -1) {
      if (after) {
        const f = original.indexOf(after, P + 1);
        return (f > -1) ? original.slice(P + before.toString().length, f) : console.error("owo [在文本中找不到 参数三 " + after + "]");
      } else {
        return original.slice(P + before.toString().length);
      }
    } else {
      console.error("owo [在文本中找不到 参数一 " + before + "]");
    }
  } else {
    console.error("owo [sizeTransition:" + index + "不是一个整数!]");
  }
}
function cutStringArray(original, before, after, index) {
  let aa = [], ab = 0
  while (original.indexOf(before, index) > 0) {
    aa[ab] = cutString(original, before, after, index)
    index = original.indexOf(before, index) + 1
    ab++
  }
  return aa;
}

console.log(`服务运行在8001端口!`)

const wss = new WebSocket.Server({ port: 8001 })

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    http.get('http://www.icbc.com.cn/ICBCDynamicSite/Charts/GoldTendencyPicture.aspx', (res) => {
      res.setEncoding('utf8')
      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk })
      res.on('end', () => {
        try {
          // 截取字符串并去掉空格
          const oneClean = cutString(rawData, '人民币账户黄金', 'AccGold.aspx').replace(/\ /g, '')
          // 批量截取
          const twoClean = cutStringArray(oneClean, `align="middle">\r\n`, `\r\n<`)
          // 转化为对象
          const threeClean = {
            buy: parseFloat(twoClean[1]),
            sell: parseFloat(twoClean[2])
          }
          ws.send(JSON.stringify(threeClean))
        } catch (e) {
          console.error(e.message)
        }
      })
    })
  })
})

http.createServer((request, response) => {
  response.writeHead(200, {
    "Content-Type": "text/html"
  })
  response.write(fs.readFileSync("index.html"))
  response.end()
}).listen(8002)
console.log(`页面运行在8002端口!`)