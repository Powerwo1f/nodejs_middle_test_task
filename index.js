// Псевдокод для импорта данных из файла в базу данных

const fs = require('fs');
const readline = require('readline');
const mysql = require('mysql2/promise');

// Настройки подключения к базе данных
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'employees'
};

(async () => {
    // const connection = await mysql.createConnection(dbConfig);

    let line2 = '';

    // Функция для обработки строк файла
    const processLine = async (line) => {
        // Логика парсинга строки и вставки данных в базу данных

        console.log(line);
        line2 += line;
    };

    const fileStream = fs.createReadStream('../dump.txt');
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let count = 0;

    for await (const line of rl) {
        await processLine(line);
        count++;
        if (count > 500) break;
    }

    console.log(line2);

    // await connection.end();
})();
