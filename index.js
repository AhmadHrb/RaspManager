const express = require('express')
const os = require("os");
const { exec } = require("child_process");
const bodyParser = require("body-parser");

const app = express()
const port = 3000
const config = require("./config.json");
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', (req, res) => {
    switch(req.url) {
        case "/status/memory/":
        res.setHeader('Content-Type', 'application/json');

        let totalMem = (os.totalmem()/1073741824);
        let mem = totalMem - (os.freemem()/1073741824);
        res.send(JSON.stringify({total: Math.round(totalMem * 10)/10, mem: Math.round(mem * 10)/10}));
        break;
        case "/status/temp/":
            var temp = require("fs").readFileSync("/sys/class/thermal/thermal_zone0/temp");
            var temp_c = Math.round(temp/1000);
            res.send(JSON.stringify({temp: temp_c}));
        break;
        case "/system/":
        res.send(JSON.stringify({platform: os.platform(),arch: os.arch()}))
        break;
        case "/system/terminal/":
            exec(req.body.cmd, (error, stdout, stderr) => {
                if (error) {
                    res.send(`${error.message}`);
                    return;
                }
                if (stderr) {
                    res.send(`${stderr}`);
                    return;
                }
                res.send(`${stdout}`);
            });
        break;
        default:
        res.send("Error 404 - Rasp Manager");
        console.log(req.url);
        break;
    }
})
app.use('/panel', express.static('panel'))

app.get('/',(req,res) => {
    res.redirect("/panel");
})
app.listen(port, () => {
  console.log(`Rasp-Manager: http://localhost:${port}`)
})