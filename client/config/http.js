import axios from 'axios'

axios.defaults.timeout = 5000

axios.interceptors.request.use(
  config => {
    config.headers.token = localStorage['dashboard-token']
    return config
  },
  err => {
    console.log('err:', err) // eslint-disable-line
  },
)

export default axios
