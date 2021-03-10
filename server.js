const http = require('http')
const url = require('url');
const client = require('prom-client')
var os = require('os');
var osu = require('node-os-utils')
const myLoggers = require('log4js');
const PORT = 8080;

myLoggers.configure({
    appenders: { mylogger: { type:"file", filename: "trial-js.log" } },
    categories: { default: { appenders:["mylogger"], level:"ALL" } }
});

const logger = myLoggers.getLogger("default");

const register = new client.Registry()

register.setDefaultLabels({
  app: 'Doan DK'
})

client.collectDefaultMetrics({ register })

const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10] // 0.1 to 10 seconds
})

register.registerMetric(httpRequestDurationMicroseconds)


const getActualRequestDurationInMilliseconds = start => {
  const NS_PER_SEC = 1e9; //  convert to nanoseconds
  const NS_TO_MS = 1e6; // convert to milliseconds
  const diff = process.hrtime(start);
  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
};


let demoLogger = async(req, res) => { //middleware function
  let current_datetime = new Date();
  let formatted_date =
    current_datetime.getFullYear() +
    "-" +
    (current_datetime.getMonth() + 1) +
    "-" +
    current_datetime.getDate() +
    " " +
    current_datetime.getHours() +
    ":" +
    current_datetime.getMinutes() +
    ":" +
    current_datetime.getSeconds();

  let method = req.method;
  let url = req.url;
  let status = res.statusCode;
  const start = process.hrtime();
  const durationInMilliseconds = getActualRequestDurationInMilliseconds(start);
  let log = `[${formatted_date}] ${method}:${url} ${status} ${durationInMilliseconds.toLocaleString()} ms`;
  logger.info(log);
};

let mycpu;
var cpu = osu.cpu;
cpu.usage().then(info =>{
mycpu = info;
})

let ts = Date.now();
let date_ob = new Date(ts);
let date = date_ob.getDate();
let month = date_ob.getMonth() + 1;
let year = date_ob.getFullYear();

const firstPage = async (req, res) => {
   res.write("\n app-dev : \n OS Platform : " +os.platform+ " \n OS Release : " + os.release);
   res.end();
}

const server = http.createServer(async (req, res) => {
  const end = httpRequestDurationMicroseconds.startTimer();
  const route = url.parse(req.url).pathname;

  try {
      if (route === '/metrics') {
        res.setHeader('Content-Type', register.contentType)
        res.end(register.metrics())
      }

      if (route === '/') {
        await firstPage(req, res)
      }
      if (route === '/api/works') {
        res.end("Api Works.");
      }

  } catch (error) {
    res.writeHead(500);
    res.end();
  }
  if (!res.finished) {
    res.writeHead(404);
    res.end(); // Default 404 handler
  }
  await demoLogger(req,res)
  end({ route, code: res.statusCode, method: req.method })
})

server.listen(PORT, () => {
  logger.info('Server is running on http://localhost:8080')
  console.log('Server is running on http://localhost:8080, metrics are exposed on http://localhost:8080/metrics')
})
