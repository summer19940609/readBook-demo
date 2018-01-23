const fse = require("fs-extra")
const fs = require("fs")
const path = require("path")

let readFolder = path.join(__dirname, `/book/西游记 最新章节更新列表`)

let testPath = path.join(__dirname, '/西游记.txt')

const start = function () {
    // 读取西游记文件夹下所有的文件
    // fs.readdir(readFolder, (err, data) => {
    //     if (err) throw err
    //     console.log(data)
    //     data.forEach((el, index) => {
    //         console.log(el)
    //         let filePath = path.join(readFolder, `/${el}`)
    //         getStr(filePath)
    //     })
    // });
    getStr(testPath)
}

// 读取文件获得需要的带p标签的str
const getStr = function (filePath) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        console.log(data)
        if (err) throw err
        // 四个空格转换成</p><p>
        // let replaceData = data.replace(/\s{4}/g, '</p><p>')
        // // 处理开头多余的</p>和结尾少的</p>
        // replaceData = replaceData.replace(/<\/p>/, '')
        // replaceData = replaceData + '</p>'
        // console.log(replaceData)
        // let name = path.basename(filePath, '.txt')
        // let htmlPath = path.join(__dirname, `/html/西游记/${name}.html`)
        // creatHtml(htmlPath, replaceData)
        let replaceData = data.replace(/\/n{2}/g, 'hello')
        console.log(replaceData)
    });
}

// 生成html文件
const creatHtml = function (path, str) {
    fse.ensureFile(path, (err) => {
        if (err) {
            console.log(err);
        }
        fse.outputFile(path, str, (err) => {
            if (err) {
                console.log(err);
            }
        })
    })
}



start()