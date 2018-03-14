<template>
  <div>
    <!-- 搜索区域 -->
    <div class="ne-search">
      <Input style="width:250px;display:inline-table" placeholder="请输入关键字" v-model="queryParams.keyword">
        <Select slot="prepend" style="width:100px" v-model="queryParams.type">
          <Option value="vin">VIN</Option>
          <Option value="licencePlate">车牌号</Option>
        </Select>
      </Input>

      <Label>时间：</Label>
      <DatePicker type="date" placeholder="请选择时间" style="width:200px" v-model="queryParams.dateRange" />
      <Button type="primary" @click="queryDataList">搜索</Button>
    </div>

    <div class="ne-search vehicle-info" style="font-size:13px;border-bottom:1px solid #dddee1">
      <span>vin：12345678927718817</span><span>车牌号：沪A 88888</span><span>车型：电动车</span><span>车主姓名：张飞</span>
    </div>

    <!-- 中间区域 -->
    <div class="container">
      <Row style="margin-bottom:12px;">
        <Col span="12">
          <div id="socContainer" style="width:600px;height:400px;"></div>
        </Col>
        <Col span="12">
          <div id="koContainer" style="width:600px;height:400px;"></div>
        </Col>
      </Row>
      <Row style="margin-top:30px;margin-bottom:12px;">
        <Col span="12">
          <div id="AContainer" style="width:600px;height:400px;"></div>
        </Col>
        <Col span="12">
          <div id="VContainer" style="width:600px;height:400px;"></div>
        </Col>
      </Row>
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
        queryParams: {
          type: 'vin',
          keyword: '',
          statusCodes: '1001008, 1001011, 1001007, 1001006, 1006003, 1006006',
          scale: '',
          dateRange: '',
          startTime: '',
          endTime: '',
        },
        // 放置全局的charts对象，用来动态改变数据
        SOCChart: null,
        KoChart: null,
        AChart: null,
        VChart: null,
      }
    },

    methods: {
      async queryDataList() {
        if (this.queryParams.dateRange !== '') {
          const date = Utils.activeDateFilter(this.queryParams.dateRange.getTime())
          this.queryParams.endTime = new Date(`${date.substring(0, 10)} 23:59:59`).getTime()
          this.queryParams.startTime = new Date(date).getTime()
        }

        const copyQueryParams = JSON.parse(JSON.stringify(this.queryParams))
        delete copyQueryParams.dateRange
        const result = await Http.getSingleReport(copyQueryParams)

        if (result.data.status === 'SUCCEED') {
          const datas = result.data.data
          this.dataDistribution(datas)
        }
      },

      // 数据分配，写了很多if else 用来做实例缓存
      dataDistribution(datas) {
        let i
        const VData = []

        for (i = 0; i < datas.length; i += 1) {
          const result = Object.entries(datas[i].datas)

          if (datas[i].code === '1001008') {
            this.SOCChart.setOption({
              series: [{ data: result }],
            })
          } else if (datas[i].code === '1001011') {
            this.KoChart.setOption({
              series: [{ data: result }],
            })
          } else if (datas[i].code === '1001007') {
            this.AChart.setOption({
              series: [{ data: result }],
            })
          } else {
            VData.push({
              name: datas[i].name,
              type: 'line',
              data: result,
            })
          }
        }

        this.VChart.setOption({ series: VData })
      },

      initSocContainer(datas) {
        const series = { data: datas, type: 'line' }
        const params = {
          container: 'socContainer',
          series,
          xName: '时间',
          yName: 'SOC %',
        }
        const { chart, option } = this.initContainer(params)
        chart.setOption(option)
        this.SOCChart = chart
      },

      initKoContainer(datas) {
        const series = { data: datas, type: 'line' }
        const params = {
          container: 'koContainer',
          series,
          xName: '时间',
          yName: '绝缘电阻 KΩ',
        }
        const { chart, option } = this.initContainer(params)
        chart.setOption(option)
        this.KoChart = chart
      },

      initAContainer(datas) {
        const series = { data: datas, type: 'line' }
        const params = {
          container: 'AContainer',
          series,
          xName: '时间',
          yName: '电流 A',
        }
        const { chart, option } = this.initContainer(params)
        chart.setOption(option)
        this.AChart = chart
      },

      initVContainer(datas) {
        const opts = {
          legend: {
            right: 0,
            top: 10,
            data: ['总电压', '电池单体电压最高值', '电池单体电压最低值'],
          },
        }
        const series = datas
        const params = {
          container: 'VContainer',
          series,
          option: opts,
          xName: '时间',
          yName: '电压 V',
        }
        const { chart, option } = this.initContainer(params)
        chart.setOption(option)
        this.VChart = chart
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
                const minutes = (date.getMinutes() > 10 ? date.getMinutes() : `0${date.getMinutes()}`)
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
    },

    mounted() {
      // 初始化所有容器
      this.initSocContainer()
      this.initKoContainer()
      this.initAContainer()
      this.initVContainer()
    },
  }

</script>

<style scoped>
  .vehicle-info span {
    margin-left: 30px;
  }
</style>
