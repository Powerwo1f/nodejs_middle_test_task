const mysql = require("mysql2");
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodejs_middle_test_task'
};

const AppService = {
    getRewards() {
        return new Promise(async (resolve, reject) => {
            const totalPool = 10000;
            const minimumDonation = 100;

            try {
                const connection = await mysql.createConnection(dbConfig);
                console.log('Connected to the MySQL server.');

                await connection.execute(`
                    SELECT e.id,
                           e.first_name,
                           e.surname,
                           d.amount,
                           d.currency,
                           r.rate,
                           IF(d.amount * r.rate > ?, (d.amount * r.rate / total.total_amount) * ?, 0) AS reward
                    FROM Employee e
                             JOIN Donation d ON e.id = d.employee_id
                             JOIN Rate r ON d.currency = r.currency AND d.date = r.date,
                         (SELECT SUM(d.amount * r.rate) AS total_amount
                          FROM Donation d
                                   JOIN Rate r ON d.currency = r.currency AND d.date = r.date
                          WHERE d.amount * r.rate > ?) AS total
                    WHERE d.amount * r.rate > ?
                `, [minimumDonation, totalPool, minimumDonation, minimumDonation], async (err, result, fields) => {
                    console.log('Query executed successfully.');

                    await connection.end();
                    console.log('Connection closed.');

                    resolve(result);
                });
            } catch (error) {
                console.error('Error executing query:', error);
            }
        })
    }
}

module.exports = AppService;
