class Utils {
  static activeDateFilter(value) {
    const d = new Date(parseInt(value, 10))
    const date = {
      Y: d.getFullYear(),
      M: d.getMonth() > 8 ? (d.getMonth() + 1) : `0${d.getMonth() + 1}`,
      D: d.getDate() > 9 ? d.getDate() : `0${d.getDate()}`,
      h: d.getHours() > 9 ? d.getHours() : `0${d.getHours()}`,
      m: d.getMinutes() > 9 ? d.getMinutes() : `0${d.getMinutes()}`,
      s: d.getSeconds() > 9 ? d.getSeconds() : `0${d.getSeconds()}`,
    }
    return `${date.Y}-${date.M}-${date.D} ${date.h}:${date.m}:${date.s}`
  }

  static httpBuilderUrl(url, obj) {
    url = `${url}?`
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i += 1) {
      url += `${keys[i]}=${obj[keys[i]]}&`
    }
    return url.substring(0, url.length - 1)
  }
}

export default Utils
