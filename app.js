const http = require("http");

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

http.createServer((request, response) => {
  http.get('http://www.icbc.com.cn/ICBCDynamicSite/Charts/GoldTendencyPicture.aspx', (res) => {
    res.setEncoding('utf8')
    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk })
    res.on('end', () => {
      try {
        const firstClean = cutString(rawData, '人民币账户黄金', '交易')
        console.log(firstClean)
        response.write(rawData)
        response.end()
      } catch (e) {
        console.error(e.message)
      }
    })
  })
}).listen(3000)
console.log(`程序运行在3000端口!`)