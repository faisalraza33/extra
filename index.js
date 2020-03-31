process.env.UV_THREADPOOL_SIZE = 1;

const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

// pm2
// loadtest -n 1 http://localhost:3000/
// ab -c 1 -n 1 http://localhost:3000/

// if the file being executed in master mode
if (cluster.isMaster) {
    // cause inde.js to be executed again but in child mode
    //for (let i = 0; i < numCPUs; i++){
    cluster.fork();
    cluster.fork();
   // }
    console.log(`Create ${numCPUs} process`);
} else {

    // in a child act like a server
    const crypto = require('crypto');
    const express = require('express');
    const app = express();
    
    function doWork(duration) {
        const start = Date.now();
        while (Date.now() - start < duration) {
        
        }
    }

    function doEncryption() {
        const start = Date.now();
        crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
            console.log('Encrypted ', Date.now() - start);
        })
    }

    app.get('/', (req, res) => {
        //doWork(5000);
        crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
            res.send('Hi There');
        });      
    });

    app.get('/fast', (req, res) => {
        res.send('Hi this is fast');
    })

    app.listen(3000);
}