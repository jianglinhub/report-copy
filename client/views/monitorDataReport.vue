<template>
  <div>
    <!-- 搜索区域 -->
    <div class="ne-search">
      <Label>时间：</Label>
      <DatePicker type="daterange" split-panels placeholder="请选择时间" style="width: 200px" v-model="queryParams.dateRange"></DatePicker>
      <Button type="primary" @click="queryMonitorReport">搜索</Button>
    </div>

    <!-- 中间区域 -->
    <div class="container">
      <div id="monitorContainer" style="width:1000px;height:600px;margin:0 auto;"></div>
    </div>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import Http from '../common/js/http'
  import Utils from '../common/js/utils'

  export default {
    data() {
      return {
        monitorChart: null,
        queryParams: {
          dateRange: ['', ''],
          startTime: '',
          endTime: '',
        },
      }
    },

    methods: {
      async queryMonitorReport() {
        if (this.queryParams.dateRange[0] !== '') {
          const startDate = Utils.activeDateFilter(this.queryParams.dateRange[0].getTime())
          this.queryParams.startTime = new Date(startDate).getTime()
          const endDate = Utils.activeDateFilter(this.queryParams.dateRange[1].getTime())
          this.queryParams.endTime = new Date(`${endDate.substring(0, 10)} 23:59:59`).getTime()
        }

        const copyQueryParams = JSON.parse(JSON.stringify(this.queryParams))
        delete copyQueryParams.dateRange
        const result = await Http.queryMonitorReport(copyQueryParams)

        if (result.data.status === 'SUCCEED') {
          const labels = this.assignValue(result.data.data, 'name')
          this.dataDistribution(result.data.data, labels)
        }
      },

      /*
        [{keyword: 'LSX091827678', sortId: '1skjd871'}, {keyword: 'LSX091827679', sortId: '1skjd871'}]
        => assignValue(array, keyword)
        => ['LSX091827678', 'LSX091827679']
      */
      assignValue(array, key) {
        array = JSON.parse(JSON.stringify(array))
        const arrs = []
        for (let i = 0; i < array.length; i += 1) {
          if (array[i].hasOwnProperty(key)) { // eslint-disable-line
            arrs.push(array[i][key])
          }
        }
        return arrs
      },

      // echarts数据附加
      dataDistribution(datas, labels) {
        datas = this.combiEchartsData(datas)
        const legend = {
          data: labels,
        }
        this.monitorChart.setOption({ series: datas, legend })
      },

      // echarts数据组装
      combiEchartsData(datas) {
        let i
        const arry = []

        for (i = 0; i < datas.length; i += 1) {
          const result = Object.entries(datas[i].datas)
          arry.push({
            name: datas[i].name,
            type: 'line',
            data: result,
          })
        }
        return arry
      },

      initMonitorContainer() {
        const params = {
          container: 'monitorContainer',
          xName: '监控数',
          yName: '时间',
        }
        const { chart, option } = this.initContainer(params)
        chart.setOption(option)
        this.monitorChart = chart
      },

      // params: { container, seriesData, xName, yName }
      initContainer(params) {
        const chart = echarts.init(document.getElementById(params.container))
        let option = {
          xAxis: {
            name: params.xName,
            type: 'time',
            splitLine: { show: false },
            axisLabel: {
              formatter: (value) => {
                const date = new Date(value)
                const minutes = (date.getMinutes() >= 10 ? date.getMinutes() : `0${date.getMinutes()}`)
                const texts = [date.getHours(), minutes]
                return texts.join(':')
              },
            },
          },
          tooltip: { trigger: 'axis' },
          yAxis: { name: params.yName, type: 'value' },
          series: params.series,
        }
        option = Object.assign(option, params.option)
        return { chart, option }
      },

      // 控制日期在1个星期以内
      // ctrlDate(date) {
      //   console.log('date:', date)
      // },

    },

    mounted() {
      this.initMonitorContainer()
    },
  }

</script>

<style scoped>
  .vehicle-info span {
    margin-left: 30px;
  }
</style>
