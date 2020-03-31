// pm2
// loadtest -n 1 http://localhost:3000/
// ab -c 1 -n 1 http://localhost:3000/

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
