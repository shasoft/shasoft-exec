const exec = require("../index");
const terminal = require("terminal-write");
/*
for (const show of [true, false]) {
    terminal.hr('<FgRed>', '>');
    const rc = exec('npm')              // Команда для запуска
        .args(['--version'])            // Аргументы
        .pwd(__dirname)                 // Рабочая директория
        .env('ADD_ENV_PATH', __dirname) // Добавить переменную среды
        .show(show)                     // Выводить результата работы на экран
        .run();
    terminal.hr('<FgRed>', '<');
    terminal.write('result code(show=' + show + '):<Success>', rc);

    console.log('');
    terminal.hr('<FgRed>', '>');
    const version = exec('npm')         // Команда для запуска
        .arg('--version')               // Добавить аргумент
        .asString(true)                 // Возвращать не код возврата, а строку, 
        // которую программа вывела в результате работы
        .show(show)                     // Выводить результата работы на экран
        .run();
    terminal.hr('<FgRed>', '<');
    terminal.write('npm version(show=' + show + '):<Success>', version);
}
//*/
const version = exec('npm') // Команда для запуска
    .arg('--version')       // Добавить аргумент
    .asString(true)         // Возвращать не код возврата, а строку, 
    // которую программа вывела в результате работы
    .show(true)             // Выводить результата работы на экран
    .run();
console.log('npm version:', version);