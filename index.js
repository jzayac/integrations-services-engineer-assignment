const express = require('express')
const app = express()
const port = 3000
const path = require('path')
const fileUrl = `https://storage.googleapis.com/exp-framework.appspot.com/orders.csv`
const axios = require('axios')
const csv = require('csv-parser')
const { Parser } = require('json2csv');
const listModule = require('./orderList')

app.get('/load', (request, response) => {
    axios({
        method: 'get',
        url: fileUrl,
        responseType:'stream'
    }).then(res => {
        /* DO NOT MODIFY ABOVE */

        const list = listModule()
        const timeStart = Date.now()

        res.data.pipe(csv({
            separator: '|',
        }))
        .on('data', (data) => {
            // debugger
            list.push(data)
        })
        .on('end', () => {

            const results = list.getList()

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

app.listen(port, () => console.log(`App listening on port http://localhost:${port}`))
