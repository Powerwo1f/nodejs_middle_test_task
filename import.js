const fs = require('fs');
const readline = require('readline');
const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodejs_middle_test_task'
};

const saveDataToDatabase = async (data) => {
    const connection = await mysql.createConnection(dbConfig);

    try {
        for (const employee of data.Employee) {
            const { id, name, surname, Department, Salary } = employee;

            // Сохранение департамента
            const department = Department[0];
            await connection.execute(
                'INSERT INTO Department (id, name) VALUES (?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name)',
                [department.id, department.name]
            );

            // Сохранение сотрудника
            await connection.execute(
                'INSERT INTO Employee (id, first_name, last_name, department_id) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE first_name = VALUES(first_name), last_name = VALUES(last_name), department_id = VALUES(department_id)',
                [id, name, surname, department.id]
            );

            // Сохранение зарплат
            for (const salary of Salary) {
                for (const statement of salary.Statement) {
                    await connection.execute(
                        'INSERT INTO Statement (id, employee_id, date, amount) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE date = VALUES(date), amount = VALUES(amount)',
                        [statement.id, id, new Date(statement.date), statement.amount]
                    );
                }
            }
        }

        console.log('Data has been successfully saved to the database.');
    } catch (error) {
        console.error('Error saving data to the database:', error);
    } finally {
        await connection.end();
    }
};

export default {saveDataToDatabase};
