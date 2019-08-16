const mysql     = require('mysql')
const config    = require('./config.json')

exports.handler = async(event, context, callback) => {
    const sql_query = 'SELECT * from foo.table1 join foo.Order_and_Referring on foo.table1.npi=foo.Order_and_Referring.npi where foo.Order_and_Referring.npi=\''+event.npi+'\''
    let connection    = mysql.createConnection({
        host     : config.dbhost,
        user     : config.dbuser,
        password : config.dbpassword,
        database : config.dbname
    })
    connection.connect()
    let response = {}
    
    // context.callbackWaitsForEmptyEventLoop = false
    
    await new Promise((resolve, reject) => {
        connection.query(sql_query, (err, rows, fields) => {
            if(err){
                response = {
                    statusCode: 500,
                    body: JSON.stringify({
                        code: err.code,
                        message: err.message
                    })
                }
                console.log('here')
                // console.log(response)
                reject()
            }
            else {
                response = {
                    statusCode: 200,
                    body: rows[0].NPI
                }
                console.log('response')
                resolve()
            }
            
        })
    })
    connection.end()
    callback(null, response)
}