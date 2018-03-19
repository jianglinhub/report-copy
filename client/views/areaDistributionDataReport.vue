<template>
  <div>
    <!-- 搜索区域 -->
    <div class="ne-search" style="border-bottom:1px solid #dddee1;padding:20px;">
      <Label>时间：</Label>
      <DatePicker type="month" placeholder="请选择月份" style="width:200px" />
      <!--<Button type="primary" @click="">搜索</Button>-->
    </div>

    <!-- 中间区域 -->
    <div class="container">
      <Row style="margin-bottom:12px;margin-top:20px;display:flex;justify-content:space-between;">
        <Col>
          <div id="alarmProcessedContainer" style="width:800px;height:400px;"></div>
        </Col>
        <Col>
          <div id="tableContainer" style="width:400px;height:400px;overflow:scroll;">
            <!--<Table :columns="" :data="" border>-->
            </Table>
          </div>
        </Col>
      </Row>
    </div>
  </div>
</template>

<script>
  // import echarts from 'echarts'
  // import Utils from '../common/js/utils'
  // import Http from '../common/js/http'

  /*
  export default {
    methods: {
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
          yName: '报警车次',
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
          },
          tooltip: { trigger: 'axis' },
          yAxis: { name: params.yName, type: 'value' },
          series: params.series,
        }

        return { chart, option }
      },
    },
  }
  */
</script>
