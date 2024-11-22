const fs = require('fs');

let data = {
    Version: "2024-02-22",
    Year: "2024",
    author: "Yuzhii",
    email: "null",
    copyright: {
        text: "© 2024 Yuzhii",
        url: "https://www.yuzhii0718.eu.org"
    },
    beian: {
        text: "Undefined ICP备 NULL 号",
        url: "https://beian.miit.gov.cn"
    }
};

let jsonData = JSON.stringify(data, null, 2);

fs.writeFile('config.json', jsonData, (err) => {
    if (err) throw err;
    console.log('Data written to file');
});
