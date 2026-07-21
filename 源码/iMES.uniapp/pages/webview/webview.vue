<template>
	<view>
		<web-view :src="url"></web-view>
	</view>
</template>

<script> 
	export default {
		data() {
			return {
				url: ''
			}
		},
		onLoad(e) {
			if(e.type == '商务合作') {
				this.url = 'https://www.625sc.com/'
				uni.setNavigationBarTitle({
					title: '商务合作'
				})
			} else if(e.type == '帮助中心') {
				this.url = 'https://www.625sc.com/imes/303.html'
				uni.setNavigationBarTitle({
					title: '帮助中心'
				})
			} else if(e.type == '关于我们'){
				this.url = 'https://www.625sc.com/about/137.html'
				uni.setNavigationBarTitle({
					title: '关于我们'
				})
			}
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
