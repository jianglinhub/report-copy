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

    <div style="margin-top: 12px">
      <Table border :columns="columns" :data="data" />
    </div>
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
      }
    },
    watch: {
      searchParams() {
        this.data = []
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
    },
  }
</script>
