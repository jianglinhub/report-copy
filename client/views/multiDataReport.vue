<template>
  <div>
    <!-- 搜索区域 -->
    <div class="ne-search" style="border-bottom:1px solid #dddee1;padding:20px;">
      <Button type="primary" shape="circle" icon="ios-search" style="margin-right:100px" @click="vinSearchModalShow = true">点击选择VIN码</Button>

      <Label>时间：</Label>
      <DatePicker type="date" placeholder="请选择时间" style="width:200px" v-model="queryParams.dateRange" />
      <Button type="primary" @click="">搜索</Button>
      <Button type="primary" @click="">导出</Button>
    </div>

    <!-- 中间区域 -->
    <div class="container">
      <Row>
        <Col span="12" style="padding:20px;font-size:18px;">显示排名前五名报警统计</Col>
      </Row>
      <Row style="margin-bottom:12px;">
        <Col span="12">
          <div id="alarmContainer" style="width:600px;height:400px;"></div>
        </Col>
        <Col span="12">
          <div id="tableContainer" style="width:600px;height:400px;">
            <Table :columns="alarmCountColumns" :data="alarmCountData" border>
              <div slot="footer" style="display:flex;align-items:center;justify-content:space-between;">
                <span style="display:inline-block;width:400px;text-align:center;text-indent:-20px">合计</span>
                <span style="display:inline-block;width:200px;text-align:center;text-indent:-80px">578</span>
              </div>
            </Table>
          </div>
        </Col>
      </Row>
    </div>

    <!-- 模态框区域 -->
    <div class="modals">
      <Modal
          v-model="vinSearchModalShow"
          width="800px"
          title="VIN查询">
          <div class="ne-search" style="padding-bottom:20px;margin-bottom:20px;border-bottom:1px solid #dddee1;">
            <Select v-model="queryParams.type" style="width:120px">
              <Option value="vin">VIN</Option>
              <Option value="licensePlate">车牌号</Option>
            </Select>
            <Input v-model="queryParams.keywords" placeholder="请输入关键字" style="width: 200px"></Input>
            <Button type="primary" @click="">搜索</Button>
          </div>
          <div class="container">
            <Row>
              <Col span="12">
                <Table :columns="alarmSearchColumns" @on-select="onAlarmTableSelectOne" size="small" width="350" :data="alarmSearchData"></Table>
                <Page :total="40" size="small" show-total></Page>
              </Col>
              <Col span="12">
                <Card style="width:380px;max-height:392px;overflow:scroll;">
                  <ul>
                    <transition-group name="fade" style="display:flex;flex-direction:row;flex-wrap:wrap;align-items:center;justify-content:space-between;">
                      <li
                        :key="item.sortId"
                        v-for="(item, index) in alarmCheckedData"
                        style="display:flex;width:150px;height:22px;line-height:22px;margin:3px 4px 2px 0;
                              justify-content:space-around;font-size:12px;border:1px solid #e9eaec;background:#f7f7f7;
                              border-radius:3px;color:#495060;">
                          <span>{{ item.vin }}</span>
                          <span @click="deleteOneChecked(index)"><Icon type="ios-close-empty" style="font-size:18px;cursor:pointer;"></Icon></span>
                      </li>
                    </transition-group>
                  </ul>
                </Card>
                <ul class="ivu-page mini">
                  <span class="ivu-page-total">已选 40 条</span>
                </ul>
              </Col>
            </Row>
          </div>
          <div slot="footer">
            <Button @click="vinSearchModalShow = false">取消</Button>
            <Button type="primary" @click="">确定</Button>
          </div>
      </Modal>
    </div>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import Utils from '../common/js/utils'
  import Http from '../common/js/http'

  export default {
    data() {
      return {
        vinSearchModalShow: false,
        alarmChart: null,
        alarmCountColumns: [
          { type: 'selection', width: 60, align: 'center' },
          { title: '报警类型', key: '' },
          { title: '报警次数', key: '' },
        ],
        alarmCountData: [],
        alarmSearchColumns: [
          { type: 'selection', width: 60, align: 'center' },
          { title: 'VIN', key: 'vin', align: 'center' },
        ],
        alarmSearchData: [
          { vin: '111FASD1234512345', sortId: '6' },
          { vin: '111FASD1234512345', sortId: '7' },
          { vin: '111FASD1234512345', sortId: '8' },
        ],
        alarmCheckedData: [
          { vin: '111FASD1234512345', sortId: '0' },
          { vin: '111FASD1234512345', sortId: '1' },
          { vin: '111FASD1234512345', sortId: '2' },
          { vin: '111FASD1234512345', sortId: '3' },
          { vin: '111FASD1234512345', sortId: '4' },
          { vin: '111FASD1234512345', sortId: '5' },
        ],
        queryParams: {
          type: 'vin',
          keywords: '',
          lineNum: '',
          dateRange: '',
          startTime: '',
          endTime: '',
        },
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
        const result = await Http.getMultiReport(copyQueryParams)

        if (result.data.status === 'SUCCEED') {
          const datas = result.data.data
          this.dataDistribution(datas)
        }
      },

      // 数据分配，写了很多if else 用来做实例缓存
      dataDistribution(datas) {
        let i
        const alarmData = []

        for (i = 0; i < datas.length; i += 1) {
          const result = Object.entries(datas[i].datas)
          alarmData.push({
            name: datas[i].name,
            type: 'line',
            data: result,
          })
        }
        this.alarmChart.setOption({ series: alarmData })
      },

      initAlarmContainer(datas) {
        const series = datas
        const params = {
          container: 'alarmContainer',
          series,
          xName: '时间',
          yName: '报警次数',
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
        return { chart, option }
      },

      onAlarmTableSelectOne(selection, row) {
        this.alarmCheckedData.push(row)
      },

      deleteOneChecked(index) {
        this.alarmCheckedData.splice(index, 1)
      },
    },

    mounted() {
      this.initAlarmContainer()
      this.queryDataList()
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
