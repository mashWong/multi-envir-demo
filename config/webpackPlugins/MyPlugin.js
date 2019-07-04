const inquirer = require('inquirer');
const fs = require('fs');
const processChild = require('child_process');
const chalk = require('chalk');
const path = require('path');

// global.TEL
global.TEL = {
    name: JSON.parse(process.env.npm_config_argv)['remain'][0],
    statue: 'init',
    BASE_PATH: '',
};

module.exports = class MyPlugin {
    apply(compiler) {
        let TEL, TEL_VAL;
        compiler.hooks.emit.tapPromise("MyPlugin", () => {

            let list = [
                "common",
                "scdx--四川电信",
                "zsdx--中山电信",
                "yndx--云南电信",
                "sydx--沈阳电信",
            ];
            let search = list.map(function (tel) {
                console.log("config  ", tel.includes(global.TEL.name));
                if (global.TEL.name && tel.includes(global.TEL.name) && global.TEL.statue === 'init') {
                    TEL = tel;
                    TEL_VAL = TEL.split("--")[0];
                    global.TEL.statue = "beforeRunning"; // 生命周期 init, beforeRunning||choice, running, end
                    return "yes";
                } else if (global.TEL.name && !tel.includes(global.TEL.name)) {
                    console.error(chalk.red("未找到 " + global.TEL.name + " 配置")) ;
                    // process.exit(0);
                    // return "配置false"
                }
            });
            console.log(search);
            const promptList = [{
                type: 'list',
                message: '请选择以下电信:',
                name: 'telecommunication',
                choices: list,
                filter: function (val) {
                    return val.toLowerCase();
                }
            }];

            const prompts = async () => {
                if (global.TEL.statue === "init") {
                    await inquirer.prompt(promptList).then((answers) => {
                        TEL = answers['telecommunication'];
                        TEL_VAL = TEL.split("--")[0];
                        console.log(answers);
                        global.TEL.statue = "choice"
                    });
                } else if (global.TEL.statue === "running") return false;
                global.TEL.BASE_PATH = path.resolve('center/', TEL_VAL);
                if (TEL_VAL !== 'common' && fs.existsSync(global.TEL.BASE_PATH))
                    await writeDiff(global.TEL.BASE_PATH);
                console.log(chalk.yellow(TEL.split("--")[1] + " ready now!!"));
                return true;
            };

            const writeDiff = async (filesPath) => {
                console.log("filesPath", filesPath);
                let isDone = true;
                let files = await fs.readdirSync(filesPath, {withFileTypes: true});
                console.log("files", files);
                files.forEach((file) => {
                    let this_path = filesPath + '\\' + file.name;
                    if (file.isFile()) {
                        fs.copyFileSync(this_path, this_path.replace('center\\' + TEL_VAL, 'src'))
                    } else if (file.isDirectory()) {
                        isDone = false;
                        writeDiff(this_path).then();
                    } else if (filename === files[files.length - 1] && isDone) {
                        return true;
                    }
                });
            };

            return prompts().then(() => {
                if (global.TEL.statue !== "running" && TEL_VAL !== 'common') {
                    processChild.exec('git ls-files src/', (err, stdout) => {
                        let str = stdout.replace(new RegExp("\n", "g"), " ");
                        let isSkip = '';
                        TEL_VAL === 'common' ? isSkip = 'no-' : isSkip = '';
                        let command = 'git update-index --' + isSkip + 'skip-worktree ' + str;
                        processChild.exec(command, function (error) {
                            if (error !== null) {
                                console.log('skip git worktree error: ' + error);
                            } else {
                                global.TEL.statue = "running";
                                console.log(chalk.yellow("skip git worktree"));
                            }
                        });
                    });
                }
            });
        });

        /**
         * 编译时把更改的文件写入center/里面
         *
         */
        compiler.hooks.compilation.tap("MyPlugin", compilation => {
            compilation.hooks.finishModules.tap("MyPlugin", () => {
                if (!TEL_VAL) return;
                if (TEL_VAL === 'common') return;
                const changedFiles = compiler.watchFileSystem.watcher.mtimes;

                for (let file in changedFiles) {
                    let pathObj = path.parse(file);
                    fs.mkdir(pathObj.dir.replace('src', 'center/' + TEL_VAL), {recursive: true}, (error) => {
                        if (error) throw error;
                        let targetPath = pathObj.dir.replace('src', 'center/' + TEL_VAL) + '/' + pathObj.base;
                        fs.copyFile(file, targetPath, err => {
                            if (err) throw err;
                            processChild.exec('git add ' + targetPath, (error) => {
                                if (error !== null) {
                                    console.log('edit file have a error: ' + error);
                                }
                            })
                        });
                    });
                }
            });
        });
    };
};
