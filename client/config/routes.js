import SingleDataReport from '../views/singleDataReport.vue'
import MultiDataReport from '../views/multiDataReport.vue'
import MonitorDataReport from '../views/monitorDataReport.vue'
import AlarmProcessedDataReport from '../views/alarmProcessedDataReport.vue'
import AlarmCountDataReport from '../views/alarmCountDataReport.vue'
import AreaDistributionDataReport from '../views/areaDistributionDataReport.vue'

export default [{
  path: '/singleDataReport',
  component: SingleDataReport,
}, {
  path: '/multiDataReport',
  component: MultiDataReport,
}, {
  path: '/monitorDataReport',
  component: MonitorDataReport,
}, {
  path: '/alarmProcessedDataReport',
  component: AlarmProcessedDataReport,
}, {
  path: '/alarmCountDataReport',
  component: AlarmCountDataReport,
}, {
  path: '/areaDistributionDataReport',
  component: AreaDistributionDataReport,
}, {
  path: '/',
  component: SingleDataReport,
}]
