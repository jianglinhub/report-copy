import SingleDataReport from '../views/singleDataReport.vue'
import MultiDataReport from '../views/multiDataReport.vue'

export default [{
  path: '/singleDataReport',
  component: SingleDataReport,
}, {
  path: '/multiDataReport',
  component: MultiDataReport,
}, {
  path: '/',
  component: SingleDataReport,
}]
