// pm2 start index.js -i 0 (it will figure out how many instance)
// pm2 delete <name of cluster>
// pm2 show  <name of cluster>
// pm2 monit
// loadtest -n 1 http://localhost:3000/
// ab -c 1 -n 1 http://localhost:3000/

// in a child act like a server
const crypto = require('crypto');
const express = require('express');
const app = express();
const Worker = require('webworker-threads').Worker;

app.get('/', (req, res) => {
    const worker = new Worker(function () {
        this.onmessage = function () {
            let counter = 0;
            while (counter < 1e9) {
                counter++;
            }
            postMessage(counter);
        }
    });

    worker.onmessage = function (message) {
        console.log(message.data);
        res.send(message);
    }
    worker.postMessage();
});

app.get('/fast', (req, res) => {
    res.send('Hi this is fast');
})

app.listen(3000);


// npmm install --save webworker-threads
/*
    Worker Intterface
    +------------------------+
    | postMessge | onmessge  |
    +------------------------+
        |             ^
        V             |
    +------------------------+
    | onmessage  postMessage |
    +-------------------------
              Worker
 */