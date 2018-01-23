const path = require("path")
const fs = require("fs")

/**
 * 路由配置
 * @returns {*}
 */
function routers() {
  var mildArr = new Array()
  var files = findFile(process.cwd() + path.sep + "server" + path.sep + "controllers", /^trouter\.js$/)
  files.forEach(function(file) {
    mildArr.push(require(file).routes())
  })
  return compose(mildArr)
}

/**
 * 组装中间件
 * @param middleware
 * @returns {Function}
 */
function compose(middleware) {
  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
  for (const fn of middleware) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
  }
  return function(context, next) {
    // last called middleware #
    let index = -1
    return dispatch(0)

    function dispatch(i) {
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))
      index = i
      let fn = middleware[i]
      if (i === middleware.length) fn = next
      if (!fn) return Promise.resolve()
      try {
        return Promise.resolve(fn(context, function next() {
          return dispatch(i + 1)
        }))
      } catch (err) {
        return Promise.reject(err)
      }
    }
  }
}


/**
 * 匹配指定模式的文件
 * @param pathArr
 * @param filePattern
 * @returns {Array}
 */
function findFile(pathArr, filePattern) {
  if (typeof pathArr == "string") {
    pathArr = [pathArr]
  }
  var matchFiles = [],
    filePaths = []
  pathArr.forEach(function(pah, index, pathArr) {
    filePaths = explorer(pah)
    filePaths.forEach(function(file, fileIndex, files) {
      var fileName = file.substr(file.lastIndexOf(path.sep) + 1)
      if (filePattern.test(fileName)) {
        matchFiles.push(file)
      }
    })
  })
  return matchFiles
}

/**
 * 递归文件路径
 * @param pth
 * @returns {Array}
 */
function explorer(pth) {
  var pathArr = []
  var files = fs.readdirSync(pth)
  files.forEach(function(file) {
    var nextPath = pth + path.sep + file
    if (fs.lstatSync(nextPath).isDirectory()) {
      pathArr = pathArr.concat(explorer(nextPath))
    } else {
      pathArr.push(nextPath)
    }
  })
  return pathArr
}

module.exports = routers