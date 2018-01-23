<template>
  <router-view :permission="permission"></router-view>
</template>

<script>
  export default {
    data() {
      return {
        permission: {},
      }
    },
    created() {
      // this.$http.get('api/findFunctionsByResource')
      //   .then((res) => {
      //     if (res.body.status && res.body.admin) {
      //       this.permission = res.body.admin.permission
      //     }
      //   })
    },
  }
</script>
