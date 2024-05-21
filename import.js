const mysql = require('mysql2');
const {createPool} = require("mysql2");

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodejs_middle_test_task'
};

const saveDataToDatabase = async (data) => {
    const connection = await mysql.createConnection(dbConfig);

    try {
        for (const employee of data) {
            const { id, name, surname, Department, Salary, Donation } = employee;

            const department = Department[0];
            await connection.execute(
                'INSERT INTO Department (id, name) VALUES (?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name)',
                [department.id, department.name]
            );

            await connection.execute(
                'INSERT INTO Employee (id, first_name, surname, department_id) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE first_name = VALUES(first_name), surname = VALUES(surname), department_id = VALUES(department_id)',
                [id, name, surname, department.id]
            );

            for (const salary of Salary) {
                for (const statement of salary.Statement) {
                    await connection.execute(
                        'INSERT INTO Statement (id, employee_id, date, amount) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE date = VALUES(date), amount = VALUES(amount)',
                        [statement.id, id, new Date(statement.date), statement.amount]
                    );
                }
            }

            if (!Donation) continue;
            for (const donation of Donation) {
                const splitValue = donation.amount.split(' ');
                const amount = splitValue[0];
                const currency = splitValue[1];

                await connection.execute(
                    'INSERT INTO Donation (id, employee_id, date, amount, currency) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE date = VALUES(date), amount = VALUES(amount)',
                    [donation.id, id, new Date(donation.date),amount, currency]
                );
            }
        }

        console.log('Data has been successfully saved to the database.');
    } catch (error) {
        console.error('Error saving data to the database:', error);
    } finally {
        await connection.end();
    }
};

const saveRatesToDatabase = async (data) => {
    const connection = await mysql.createConnection(dbConfig);

    try {
        for (const rateGroup of data) {
            for (const rate of rateGroup.Rate) {
                const { date, sign, value } = rate;

                await connection.execute(
                    'INSERT INTO Rate (date, currency, rate) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE rate = VALUES(rate)',
                    [new Date(date), sign, value]
                );
            }
        }

        console.log('Rates data has been successfully saved to the database.');
    } catch (error) {
        console.error('Error saving rates data to the database:', error);
    } finally {
        await connection.end();
    }
};

module.exports = {saveDataToDatabase, saveRatesToDatabase};
