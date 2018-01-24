<template>
  <div class="ne-search">
    查询条件：
    <Select v-model="searchParams.selected" style="width: 160px">
      <Option value="vin">VIN</Option>
      <Option value="ssin">SSID</Option>
      <Option value="sn">设备序列号</Option>
      <Option value="iccid">ICCID</Option>
    </Select>
    <Input v-model="searchParams.keywords" placeholder="请输入关键字" style="width: 160px" />
    <Button type="primary" @click="queryWifi">查询</Button>
    <Button type="primary" @click="isActiveModalShow = true" v-show="activeStatus">激活</Button>

    <div style="margin-top: 12px">
      <Table border :columns="columns" :data="data" />
    </div>

    <Modal
        v-model="isActiveModalShow"
        title="确认"
        width="300">
        <p style="margin-bottom: 10px;font-size: 14px">请确认当前车辆VIN码为：</p>
        <p style="margin-bottom: 10px;font-size: 18px;color: red">GBTESTVIN12345END</p>
        <div slot="footer">
          <Button @click="isActiveModalShow = false">取消</Button>
          <Button type="primary" @click="activate">激活</Button>
        </div>
    </Modal>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        searchParams: {
          selected: 'vin',
          keywords: '',
        },
        columns: [{
          title: '名称',
          key: 'name',
        }, {
          title: '内容',
          key: 'content',
        }],
        data: [],
        activeStatus: false,
        isActiveModalShow: false,
      }
    },
    watch: {
      searchParams() {
        this.data = []
        this.activeStatus = false
      },
    },
    methods: {
      queryWifi() {
        if (this.searchParams.keywords.trim() === '') {
          return
        }
        const params = {}
        params[this.searchParams.selected] = this.searchParams.keywords
        this.$http.get('api/queryWifi', {
          params,
        }).then(res => {
          if (res.data.status === 'SUCCEED') {
            const active = res.data.data.vehicleWifiStickActiveStatus
            if (active === 'ACTIVE') {
              this.activeStatus = false
            } else {
              this.activeStatus = true
            }
            this.data = this.handlerData(res.data.data)
          } else {
            this.$Message.error({
              content: '查询失败！',
              duration: 5,
            })
          }
        })
      },

      handlerData(data) {
        const keys = Object.keys(data)
        const values = Object.values(data)
        const tableData = []
        for (let i = 0; i < keys.length; i += 1) {
          const obj = {}
          obj.name = keys[i]
          obj.content = values[i]
          tableData.push(obj)
        }
        return tableData
      },

      activate() {
        console.log('ok') //eslint-disable-line
      },
    },
  }
</script>
