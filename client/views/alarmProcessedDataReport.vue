<template>
  <div>
    <!-- 搜索区域 -->
    <div class="ne-search" style="border-bottom:1px solid #dddee1;padding:20px;">
      <Label>时间：</Label>
      <DatePicker type="month" placeholder="请选择月份" style="width:200px" v-model="queryAlarmProcessedParams.dateRange" />
      <Button type="primary" @click="queryDataList">搜索</Button>
    </div>

    <!-- 中间区域 -->
    <div class="container">
      <Row style="margin-bottom:12px;margin-top:20px;display:flex;justify-content:space-between;">
        <Col>
          <div id="alarmProcessedContainer" style="width:800px;height:400px;"></div>
        </Col>
        <Col>
          <div id="tableContainer" style="width:400px;height:400px;overflow:scroll;">
            <Table :columns="alarmProcessedColumns" :data="alarmProcessedData" border>
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
        alarmProcessedChart: null,
        queryAlarmProcessedParams: {
          dateRange: '',
          month: '',
          handleState: '', // UNTREATED PROCESSING ALREADY_PROCESSED
        },
        alarmProcessedColumns: [
          { title: '报警级别', key: 'level' },
          { title: '处理中', key: 'processing' },
          { title: '已处理', key: 'finished' },
          { title: '未处理', key: 'unDisposed' },
        ],
        alarmProcessedData: [],
      }
    },

    methods: {
      async queryDataList() {
        if (this.queryAlarmProcessedParams.dateRange !== '') {
          const month = this.queryAlarmProcessedParams.dateRange.getMonth() + 1
          const year = this.queryAlarmProcessedParams.dateRange.getFullYear()
          this.queryAlarmProcessedParams.month = month > 9 ? `${year}-${month}` : `${year}-0${month}`
        }

        const copyQueryAlarmParams = JSON.parse(JSON.stringify(this.queryAlarmProcessedParams))
        delete copyQueryAlarmParams.dateRange
        const result = await Http.queryWorkOrderReport(copyQueryAlarmParams)

        if (result.data.status === 'SUCCEED') {
          const filterStateDatas = result.data.data.filter(item => item.code !== 'level')
          this.dataDistribution(filterStateDatas)

          const filterLevelDatas = result.data.data.filter(item => item.code !== 'state')
          this.alarmProcessedData = this.handlerTableDatas(filterLevelDatas)

          // 注意这里字段不变，手动push一条记录进表格做统计
          this.alarmProcessedData.push(this.handlerDataCount(filterLevelDatas))
        }
      },

      // 处理表格数据
      handlerTableDatas(datas) {
        const array = []
        datas.forEach(item => {
          const obj = {}
          obj.level = item.name
          obj.processing = item.datas['处理中']
          obj.unDisposed = item.datas['未处理']
          obj.finished = item.datas['已处理']
          array.push(obj)
        })
        return array
      },

      // 处理总数
      handlerDataCount(datas) {
        const obj = { // 注意这里字段不变，手动push一条记录进表格做统计
          level: '合计',
          processing: 0,
          unDisposed: 0,
          finished: 0,
        }
        datas.forEach(item => {
          obj.processing += item.datas['处理中']
          obj.unDisposed += item.datas['未处理']
          obj.finished += item.datas['已处理']
        })
        return obj
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
      dataDistribution(datas) {
        const processedDatas = this.combiEchartsData(datas)
        const legend = {
          data: ['已处理', '处理中', '未处理'],
        }
        this.alarmProcessedChart.setOption({ series: processedDatas, legend })
      },

      // echarts数据组装
      combiEchartsData(datas) {
        let i
        const arry = []

        for (i = 0; i < datas.length; i += 1) {
          const result = Object.entries(datas[i].datas)
          arry.push({
            name: datas[i].name,
            type: 'bar',
            data: result,
          })
        }
        return arry
      },

      initAlarmProcessedContainer(datas) {
        const series = datas
        const params = {
          container: 'alarmProcessedContainer',
          series,
          xName: '报警级别',
          yName: '报警处理数',
        }
        const { chart, option } = this.initContainer(params)
        chart.setOption(option)
        this.alarmProcessedChart = chart
      },

      // params: { container, seriesData, xName, yName }
      initContainer(params) {
        const chart = echarts.init(document.getElementById(params.container))
        const option = {
          xAxis: {
            name: params.xName,
            type: 'category',
            data: ['1级', '2级', '3级'],
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
            },
          },
          yAxis: { name: params.yName, type: 'value' },
          series: params.series,
        }

        return { chart, option }
      },
    },

    mounted() {
      this.initAlarmProcessedContainer()
    },
  }
</script>
