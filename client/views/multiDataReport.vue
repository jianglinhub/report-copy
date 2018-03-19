<template>
  <div>
    <!-- 搜索区域 -->
    <div class="ne-search" style="border-bottom:1px solid #dddee1;padding:20px;">
      <Button type="primary" shape="circle" icon="ios-search" style="margin-right:100px" @click="showVinSearchModal">点击选择VIN码</Button>

      <Label>时间：</Label>
      <DatePicker type="date" placeholder="请选择时间" style="width:200px" v-model="queryAlarmParams.dateRange" />
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

    <!-- 模态框区域 -->
    <div class="modals">
      <Modal
          v-model="vinSearchModalShow"
          width="800px"
          title="VIN查询">
          <div class="ne-search" style="padding-bottom:20px;margin-bottom:20px;border-bottom:1px solid #dddee1;">
            VIN:
            <Input v-model="queryVinParams.keyword" placeholder="请输入关键字" style="width: 200px"></Input>
            <Button type="primary" @click="searchMultiVinInfos">搜索</Button>
          </div>
          <div class="container">
            <Row>
              <Col span="12">
                <Table :columns="vinSearchColumns" @on-select="onVinTableSelectOne" @on-select-all="onVinTableSelectAll" size="small" width="350" :data="vinSearchData"></Table>
                <Page :total="vinSearchPageParams.total" :current="vinSearchPageParams.pageIndex" size="small" show-total @on-change="vinSearchPageHandler"></Page>
              </Col>
              <Col span="12">
                <Card style="width:380px;max-height:392px;overflow:scroll;">
                  <ul>
                    <transition-group name="fade" style="display:flex;flex-direction:row;flex-wrap:wrap;align-items:center;justify-content:space-between;">
                      <li
                        :key="item.sortId"
                        v-for="(item, index) in vinCheckedData"
                        style="display:flex;width:150px;height:22px;line-height:22px;margin:3px 4px 2px 0;
                              justify-content:space-around;font-size:12px;border:1px solid #e9eaec;background:#f7f7f7;
                              border-radius:3px;color:#495060;">
                          <span>{{ item.keyword }}</span>
                          <span @click="deleteOneChecked(index)"><Icon type="ios-close-empty" style="font-size:18px;cursor:pointer;"></Icon></span>
                      </li>
                    </transition-group>
                  </ul>
                </Card>
                <ul class="ivu-page mini">
                  <span class="ivu-page-total">已选 {{vinCheckedData.length}} 条</span>
                </ul>
              </Col>
            </Row>
          </div>
          <div slot="footer">
            <Button @click="cancelVinSearchModal">取消</Button>
            <Button type="primary" @click="vinSearchModalShow = false">确定</Button>
          </div>
      </Modal>
    </div>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import _ from 'lodash'
  import Utils from '../common/js/utils'
  import Http from '../common/js/http'

  export default {
    data() {
      return {
        vinSearchPageParams: {
          total: 0,
          pageIndex: 1,
        },
        vinSearchModalShow: false,
        alarmChart: null,
        alarmCountColumns: [
          { title: '报警类型', key: 'name' },
          { title: '报警车次', key: 'value' },
        ],
        alarmCountData: { count: 0, list: [] },
        vinSearchColumns: [
          { type: 'selection', width: 60, align: 'center' },
          { title: 'VIN', key: 'keyword', align: 'center' },
        ],
        vinSearchData: [],
        vinCheckedData: [],
        queryAlarmParams: {
          type: 'vin',
          keywords: '',
          lineNum: '',
          dateRange: '',
          startTime: '',
          endTime: '',
          pageIndex: 1,
        },
        queryVinParams: {
          type: 'vin',
          keyword: '',
        },
        copyQueryVinParams: {},
        alarmDatas: [], // 已查询出的报警数据
      }
    },

    methods: {
      /* ------------------------------------ vin start ---------------------------------- */
      vinSearchPageHandler(page) {
        this.copyQueryVinParams.pageIndex = page
        this.queryMultiVinInfos(this.copyQueryVinParams)
      },

      showVinSearchModal() {
        this.vinSearchModalShow = true
        this.searchMultiVinInfos()
      },

      cancelVinSearchModal() {
        this.vinSearchModalShow = false
        this.vinCheckedData = []
        this.queryVinParams.keyword = ''
      },

      async searchMultiVinInfos() {
        this.queryVinParams.pageIndex = 1
        this.copyQueryVinParams = JSON.parse(JSON.stringify(this.queryVinParams))
        this.queryMultiVinInfos(this.copyQueryVinParams)
      },

      async queryMultiVinInfos(params) {
        const result = await Http.queryMultiVehInfos(params)
        if (result.data.status === 'SUCCEED') {
          this.vinSearchPageParams = {
            total: result.data.totalCount,
            pageIndex: result.data.pageIndex,
          }

          this.vinSearchData = [] // 清空原始数据
          result.data.datas.forEach((item) => {
            const obj = { keyword: '', sortId: '' }
            obj.keyword = item
            obj.sortId = item

            this.vinSearchData.push(obj)
          })
        }
      },

      onVinTableSelectOne(selection, row) {
        const vinCheckedData = JSON.parse(JSON.stringify(this.vinCheckedData))
        vinCheckedData.push(row)
        const arr = _.uniqBy(vinCheckedData, 'sortId') // 对象去重
        this.vinCheckedData = arr
      },

      onVinTableSelectAll(rows) {
        let vinCheckedData = JSON.parse(JSON.stringify(this.vinCheckedData))
        vinCheckedData = vinCheckedData.concat(rows)
        const arr = _.uniqBy(vinCheckedData, 'sortId') // 对象去重
        this.vinCheckedData = arr
      },

      deleteOneChecked(index) {
        this.vinCheckedData.splice(index, 1)
      },

      /* ------------------------------------ vin end ---------------------------------- */

      /* ------------------------------------ alarm start ---------------------------------- */
      async queryDataList() {
        if (this.queryAlarmParams.dateRange !== '') {
          const date = Utils.activeDateFilter(this.queryAlarmParams.dateRange.getTime())
          this.queryAlarmParams.endTime = new Date(`${date.substring(0, 10)} 23:59:59`).getTime()
          this.queryAlarmParams.startTime = new Date(date).getTime()
        }

        const copyQueryAlarmParams = JSON.parse(JSON.stringify(this.queryAlarmParams))
        copyQueryAlarmParams.keywords = this.assignValue(this.vinCheckedData, 'keyword').join(',')
        delete copyQueryAlarmParams.dateRange
        const result = await Http.getMultiReport(copyQueryAlarmParams)

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

      initAlarmContainer() {
        const params = {
          container: 'alarmContainer',
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
