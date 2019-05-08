const express = require('express')
const app = express()
const port = 3000
const path = require('path')
// const fileUrl = `https://storage.googleapis.com/exp-framework.appspot.com/orders.csv`
const fileUrl = `http://localhost:3000/orders.csv`
const axios = require('axios')
const csv = require('csv-parser')
const { Parser } = require('json2csv');

app.get('/load', (request, response) => {
    axios({
        method: 'get',
        url: fileUrl,
        responseType:'stream'
    }).then(res => {
        /* DO NOT MODIFY ABOVE */

        const lib = require('./src')
        const timeStart = Date.now()

        res.data.pipe(csv({
            separator: '|',
        }))
        .on('data', (data) => {
            // debugger
            lib.push(data.email, data.action, data.order_id * 1, data.item_id *1, data.price * 1)
        })
        .on('end', () => {

            const results = JSON.parse(lib.toJson())
            console.log(results[0])
            lib.flush()

            if (process.env.NODE_ENV === 'develop') {
              const took = Date.now() - timeStart
              const used = process.memoryUsage()

              for (let key in used) {
                console.log(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
              }

              console.log(`took: ${took} ms`)

              // cat orders.csv | awk -F '|' '{print $2}'|  sort | uniq -i | wc
              console.log(`orders: ${results.length}`)
            }

            const fields = ['email_id', 'order_id', 'items', 'total'];
            const opts = { fields };

            const parser = new Parser(opts);
            const parsercsv = parser.parse(results);

            response.setHeader('Content-disposition', 'attachment; filename=orders.csv');
            response.send(parsercsv)
        })

		/* DO NOT MODIFY BELOW */
    }).catch(err => console.log(err));
})


app.use(express.static('public'))


app.listen(port, () => console.log(`App listening on port http://localhost:${port}`))
