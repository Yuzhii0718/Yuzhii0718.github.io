// 用于纠正js中的路径问题
// 读取 a-cheeky-angel/assets/ 下的 js 文件
// 纠正js里有关的路径 `*/markdown/*.md` 为 `/html/application/a-cheeky-angel/markdown/*.md`

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const readdir = promisify(fs.readdir);

const root = path.resolve(__dirname, './a-cheeky-angel/assets');

async function main() {
    const files = await readdir(root);
    for (const file of files) {
        if (file.endsWith('.js')) {
        const filePath = path.resolve(root, file);
        const content = await readFile(filePath, 'utf8');
        const newContent = content.replace(/\/markdown\//g, '/html/application/a-cheeky-angel/markdown/');
        await writeFile(filePath, newContent);
        }
    }
    }

main().catch(console.error);
