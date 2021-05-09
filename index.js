const http = require("http");
const fs = require("fs");
var request = require("request");

const homeFile = fs.readFileSync("home.html","utf-8");

const replaceVal = (temporaryVal, orgValue)=>{
    let temperatures = temporaryVal.replace("{%tempValue%}",orgValue.main.temp);
    temperatures = temperatures.replace("{%tempMinValue%}",orgValue.main.temp_min);
    temperatures = temperatures.replace("{%tempMaxValue%}",orgValue.main.temp_max);
    temperatures = temperatures.replace("{%location%}",orgValue.name);
    temperatures = temperatures.replace("{%country%}",orgValue.sys.country);
    temperatures = temperatures.replace("{%tempareratureStatus%}",orgValue.weather[0].main);
    return temperatures;
}
const server = http.createServer((requests, response) =>{
    if(requests.url == "/") {
      request("http://api.openweathermap.org/data/2.5/weather?q=Pokhara&appid=29fdc965955ce13c6ca215bcb07012a9")
      .on("data", (chunk)=>{
          const objData = JSON.parse(chunk);
          const arrayData = [objData]
         
         const realTimeData = arrayData.map(val => replaceVal(homeFile,val)).join("");
         response.write(realTimeData);
        
      })
      .on("end", (err)=>{
          if(err) return console.log('Connection closed due to error', err);
          response.end();
      });
    }
});

server.listen(4000, "127.0.0.1"); 