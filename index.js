const childProcess = require('child_process');
const terminal = require("terminal-write");
function trim(str) {
    return str.trim();
}
//
class Exec {
    m_command = undefined;
    m_show = true;
    m_args = [];
    m_env = {};
    m_pwd = undefined;
    m_asString = false
    constructor(command) {
        this.m_command = command;
    }

    // Аргументы
    args(args) {
        this.m_args = args;
        return this;
    }

    // Добавить аргумент
    arg(arg) {
        this.m_args.push(arg);
        return this;
    }

    // Директория выполнения
    pwd(pwd) {
        this.m_pwd = pwd;
        return this;
    }

    // Установить переменную
    env(key, value) {
        this.m_env[key] = value;
        return this;
    }

    // Выводить результат выполнения
    show(show) {
        this.m_show = show;
        return this;
    }

    // Получить результат работы в виде строки
    asString(asString) {
        this.m_asString = asString;
        return this;
    }

    // Выполнить
    run() {
        const args = [].concat(this.m_args).filter((arg) => {
            return typeof (arg) != 'undefined';
        });
        if (this.m_command) {
            args.unshift(this.m_command);
        }
        const runCommand = args.map((arg) => {
            if (arg.indexOf(' ') >= 0) {
                if (arg.substring(0, 1) != '"' && arg.substring(arg.length - 1, arg.length) != '"') {
                    return '"' + arg + '"';
                }
            }
            return arg;
        }).join(' ');
        if (this.m_show) terminal.hr("<FgMagenta>", '>');
        if (this.m_show) terminal.writeLn(">><Title>exec</>:", "<Command>" + runCommand + "</>");
        if (this.m_show) {
            const colorFile = typeof (this.m_pwd) == 'undefined' ? 'Disable' : 'File';
            terminal.writeLn("   <Title>pwd</>:", "<" + colorFile + ">" + this.m_pwd + "</>");
        }

        var resultCode = 0;
        var ret = resultCode;
        var env = structuredClone(process.env);
        var hasEnv = false;
        for (const key in this.m_env) {
            env[key] = this.m_env[key];
            hasEnv = true;
        }
        if (!hasEnv) {
            env = undefined;
        }
        const options = {
            cwd: this.m_pwd,
            env: env
        };
        var cp;
        try {
            if (this.m_asString) {
                // Для windows установить кодовую страницу utf-8
                if (process.platform === "win32") {
                    cp = trim(childProcess.execSync('chcp', options).toString().split(':')[1]);
                    childProcess.execSync('chcp 65001', options);
                }
                //options.encoding = 'utf8';
            } else {
                if (this.m_show) {
                    options.stdio = ['inherit', 1, 'inherit'];
                } else {
                    options.stdio = ['ignore', 'ignore', 'ignore'];
                }
            }
            //*
            //console.log(options);
            const rc = childProcess.execSync(runCommand, options);
            if (this.m_asString) {
                ret = rc.toString();
                if (this.m_show) process.stdout.write(ret);
            }
        } catch (error) {
            if (this.m_show) terminal.writeLn("\t <Fail>errorCode</> [<Fail>" + error.status + "</>]");
            ret = resultCode = error.status;
        }
        // Если кодировку меняли
        if (cp) {
            // то вернуть её обратно
            childProcess.execSync('chcp ' + cp, options);
        }
        if (this.m_show) {
            terminal.writeLn("<<<Title>exec</>:", "<Command>" + runCommand + "</>");
            terminal.writeLn('resultCode: ' + (resultCode == 0 ? '<Success>' : '<Fail>') + resultCode);
            terminal.hr("<FgMagenta>", '<');
        }
        return ret;
    }
}
//
module.exports = function (command) {
    return new Exec(command);
};