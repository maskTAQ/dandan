const fs = require('fs');
const path = require('path')
function t(path) {
    fs.readFile(path, function (err, data) {
        data = String(data).replace(/([0-9]+)px/gmi, (word) => {
            const px = +/[0-9]+/.exec(word)[0];
            if (px === 1) {
                return '1px'
            }
            return (px / 100) + 'rem'
        })
        fs.writeFile(path, data, function () { })
    })
}
function mapDir(dir, callback, finish) {
    if (dir.includes('node_modules') || dir.includes('git') || dir.includes('nuxt')) {
        return
    }
    fs.readdir(dir, function (err, files) {
        if (err) {
            console.error(err)
            return
        }
        files.forEach((filename, index) => {
            let pathname = path.join(dir, filename)
            fs.stat(pathname, (err, stats) => { // 读取文件信息
                if (err) {
                    console.log('获取文件stats失败')
                    return
                }
                if (stats.isDirectory()) {
                    mapDir(pathname, callback, finish)
                } else if (stats.isFile()) {
                    if (['.json', '.scss'].includes(path.extname(pathname))) {  // 排除 目录下的 json scss 文件
                        return
                    }
                    fs.readFile(pathname, (err, data) => {
                        if (err) {
                            console.error(err)
                            return
                        }
                        callback && callback(pathname)
                    })
                }
            })
            if (index === files.length - 1) {
                finish && finish()
            }
        })
    })
}

mapDir(
    './',
    function (file) {
        if (file.includes('vue') || file.includes('css')) {
            t(file)
        }

        // console.log('TCL: file', file.toString())
        // 读取文件后的处理
    },
    function () {
        // console.log('xxx文件目录遍历完了')
    }
)