const fs = require('fs');
const readline = require('readline');
const util = require('util');

// Функция для рекурсивного парсинга сущности
const parseEntity = (lines, level) => {
    const entity = {}; // Объект для хранения свойств текущей сущности
    let currentKey = null; // Текущий ключ, который парсится
    let currentSubEntityLines = []; // Линии для подструктур текущего ключа

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const indentLevel = line.search(/\S|$/); // Определяем уровень вложенности текущей строки

        if (line.trim() === '') {
            continue; // Пропускаем пустые строки
        }

        // Обрабатываем строки на текущем уровне вложенности
        if (indentLevel === level) {
            if (currentKey && currentSubEntityLines.length > 0) {
                // Если текущий ключ существует и есть подструктуры, парсим их рекурсивно
                if (!entity[currentKey]) {
                    entity[currentKey] = [];
                }
                entity[currentKey].push(parseEntity(currentSubEntityLines, level + 2));
                currentSubEntityLines = [];
            }

            const match = line.trim().match(/^(\w+):\s*(.*)$/); // Ищем ключ и значение
            if (match) {
                const key = match[1];
                const value = match[2];
                if (value) {
                    // Если значение существует, сохраняем его
                    entity[key] = isNaN(value) ? value : parseFloat(value);
                } else {
                    // Если значение пустое, устанавливаем текущий ключ
                    currentKey = key;
                }
            } else {
                // Если строка не содержит двоеточия, она является ключом без значения
                currentKey = line.trim();
            }
        } else if (indentLevel > level) {
            // Если строка более вложена, добавляем ее в подструктуры текущего ключа
            currentSubEntityLines.push(line);
        } else {
            // Если уровень вложенности меньше, возвращаемся на предыдущий уровень
            break;
        }
    }

    // Обрабатываем оставшиеся подструктуры текущего ключа
    if (currentKey && currentSubEntityLines.length > 0) {
        if (!entity[currentKey]) {
            entity[currentKey] = [];
        }
        entity[currentKey].push(parseEntity(currentSubEntityLines, level + 2));
    }

    return entity;
};

// Функция для чтения файла и парсинга его строк
const parseFile = async (filePath) => {
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    const lines = [];
    for await (const line of rl) {
        lines.push(line); // Сохраняем каждую строку файла в массив
    }

    const parsedData = parseEntity(lines, 0); // Начинаем парсинг с уровня вложенности 0
    return parsedData;
};

// Основная функция для запуска парсинга и вывода результата
(async () => {
    const filePath = './dump.txt'; // Указываем путь к файлу
    const data = await parseFile(filePath); // Парсим файл
    console.log(util.inspect(data, { depth: null, colors: true })); // Выводим результат в консоль
})();
