<template>
  <div class="dashboard-link-page">
    <h2>车间生产管控</h2>
    <p>此看板由独立的大屏服务提供。点击下方按钮后将在新标签页打开。</p>
    <a :href="boardUrl" target="_blank" rel="noopener noreferrer">打开车间生产管控看板</a>
  </div>
</template>

<script>
const boardUrl = 'http://board.625sc.com:9095/index.html#/aj/bP3fTAG8'

export default {
  name: 'WorkShopBoard',
  setup() {
    return { boardUrl }
  }
}
</script>

<style scoped>
.dashboard-link-page {
  padding: 50px;
}

.dashboard-link-page a {
  color: #409eff;
}
</style>
