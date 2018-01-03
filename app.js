/**
 * Created by feverdestiny on 2017/9/22.
 */
const cheerio = require("cheerio")
const request = require("request")
const fs = require('fs-extra')
const path = require("path")
const iconv = require("iconv-lite")

let url = 'http://www.x23us.com/html/7/7707/' //小说Url
let list = [] //章节List
let booksName = '' //小说名称




/**
 * 获取小说目录页
 */
const books = function () {
    request({
        url: url,
        encoding: null
    }, function (err, res, body) {
        if (!err && res.statusCode == 200) {
            console.log(`获取小说基本信息成功·······`)
            booksQuery(body)
        } else {
            console.log('err:' + err)
        }
    })
}
/**
 * 处理小说名称及其小说目录
 */
const booksQuery = function (body) {
    body = iconv.decode(body, 'gb2312')
    $ = cheerio.load(body)
    booksName = $('.bdsub').find('h1').text() //小说名称
    console.log(booksName)
    $('#at').find('.L').find('a').each(function (i, e) { //获取章节UrlList
        list.push($(e).attr('href'))
    })
    let dir = path.join(__dirname, '/book/', booksName)
    fs.ensureDir(dir, err => {
        if (err) {
            console.log(err)
        }
        list.forEach((el) => {
            getBody(el)
        })
    })

}
/**
 * 获取章节页面信息
 * 
 */
const getBody = function (el) {
    let primUrl = url + el
    // console.log(primUrl)
    request({
        url: primUrl,
        encoding: null
    }, function (err, res, body) {
        if (!err && res.statusCode == 200) {
            toQuery(body)
        } else {
            console.log('err:' + err)
        }
    })
}
/**
 * 处理章节页面信息
 */
const toQuery = function (body) {
    body = iconv.decode(body, 'gb2312')
    $ = cheerio.load(body)
    let title = $('#amain').find('h1').text() //获取章节标题
    let content = $('#amain').find('#contents').text()
    content = Trim(content, 'g') //获取当前章节文本内容并去除文本所有空格
    writeFs(title, content)
}


const writeFs = function (title, content) {
    let filePath = path.join(__dirname, `/book/${booksName}/${title}.txt`)
    console.log(filePath);
    fs.ensureFile(filePath, function (err) {
        if (err) {
            console.log(err);
        }
        fs.outputFile(filePath, content, err => {
            if (err) {
                console.log(err);
            }
            console.log(err)
        })
    });

}

/**
 * 
 * 去除所有空格
 */
const Trim = function (str, is_global) {
    let result
    result = str.replace(/(^\s+)|(\s+$)/g, "")
    if (is_global.toLowerCase() == "g") {
        result = result.replace(/\s/g, "")
    }
    return result
}

books()