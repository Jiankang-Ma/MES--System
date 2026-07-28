<template>
  <div class="dashboard-link-page">
    <h2>工单执行进度</h2>
    <p>此看板由独立的大屏服务提供。点击下方按钮后将在新标签页打开。</p>
    <a :href="boardUrl" target="_blank" rel="noopener noreferrer">打开工单执行进度看板</a>
  </div>
</template>

<script>
const boardUrl = 'http://board.625sc.com:9095/index.html#/aj/2kEYF9UY'

export default {
  name: 'WorkOrderSchedule',
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
