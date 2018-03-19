<template>
  <div>
    <!-- 搜索区域 -->
    <div class="ne-search" style="border-bottom:1px solid #dddee1;padding:20px;">

      <Label>时间：</Label>
      <DatePicker type="month" placeholder="请选择时间" style="width:200px" v-model="queryAlarmParams.dateRange" />
      <Button type="primary" @click="queryDataList">搜索</Button>
    </div>

    <!-- 中间区域 -->
    <div class="container">
      <Row>
        <Col span="12" style="padding:20px;font-size:18px;">显示排名前五名报警统计</Col>
      </Row>
      <Row style="margin-bottom:12px;margin-top:20px;display:flex;justify-content:space-between;">
        <Col>
          <div id="alarmContainer" style="width:800px;height:400px;"></div>
        </Col>
        <Col>
          <div id="tableContainer" style="width:400px;overflow:scroll;">
            <Table :columns="alarmCountColumns" :data="alarmCountData.list" border height="400">
              <div slot="footer" style="display:flex;align-items:center;justify-content:space-between;">
                <span style="display:inline-block;width:400px;text-align:center;text-indent:-20px">合计</span>
                <span style="display:inline-block;width:200px;text-align:center;text-indent:-80px">{{alarmCountData.count}}</span>
              </div>
            </Table>
          </div>
        </Col>
      </Row>
    </div>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import Http from '../common/js/http'

  export default {
    data() {
      return {
        alarmChart: null,
        alarmCountColumns: [
          { title: '产品车型', key: 'name' },
          { title: '报警数', key: 'value' },
        ],
        alarmCountData: { count: 0, list: [] },
        queryAlarmParams: {
          month: '',
          dateRange: '',
        },
      }
    },

    methods: {
      /* ------------------------------------ alarm start ---------------------------------- */
      async queryDataList() {
        if (this.queryAlarmParams.dateRange !== '') {
          const month = this.queryAlarmParams.dateRange.getMonth() + 1
          const year = this.queryAlarmParams.dateRange.getFullYear()
          this.queryAlarmParams.month = month > 9 ? `${year}-${month}` : `${year}-0${month}`
        }

        const copyQueryAlarmParams = JSON.parse(JSON.stringify(this.queryAlarmParams))
        delete copyQueryAlarmParams.dateRange
        const result = await Http.queryModelAlarmNumReport(copyQueryAlarmParams)

        if (result.data.status === 'SUCCEED') {
          const collect = result.data.data.pop()
          this.alarmCountData = {
            count: this.assignValue(collect.total, 'value').reduce((a, b) => Number(a) + Number(b)),
            list: collect.total,
          }

          const labels = this.assignValue(collect.total.slice(0, 5), 'name')
          this.dataDistribution(result.data.data.slice(0, 5), labels)
        }
      },

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
        this.alarmDatas = this.combiEchartsData(datas)
        const legend = {
          data: labels,
        }
        this.alarmChart.setOption({ series: this.alarmDatas, legend })
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

      initAlarmContainer(datas) {
        const series = datas
        const params = {
          container: 'alarmContainer',
          series,
          xName: '时间',
          yName: '报警数',
        }
        const { chart, option } = this.initContainer(params)
        chart.setOption(option)
        this.alarmChart = chart
      },

      // params: { container, seriesData, xName, yName }
      initContainer(params) {
        const chart = echarts.init(document.getElementById(params.container))
        const option = {
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

        return { chart, option }
      },

      /* ------------------------------------ alarm end ---------------------------------- */
    },

    mounted() {
      this.initAlarmContainer()
    },
  }
</script>

<style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: all .3s; /* 如果不设置具体过渡项，默认过渡到所有状态的100% */
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
    transform: translateX(-100%)
  }
</style>
