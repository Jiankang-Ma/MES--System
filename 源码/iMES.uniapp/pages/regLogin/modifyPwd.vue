<template>
	<view class="md-form">
		<view class="flex-white-plr26 ptb10 bdb_f5" @click="selectProductUserFun()">
			<text class="mr26">旧密码
				<text class="redXingh">*</text>
			</text>
			<view>
				<u-input v-model="oldPwd" type="password" placeholder="请输入旧密码" />
			</view>
		</view>
		<view class="flex-white-plr26 ptb10 bdb_f5">
			<text class="mr26">新密码
				<text class="redXingh">*</text>
			</text>
			<view>
				<u-input v-model="newPwd" type="password" placeholder="请输入新密码" />
			</view>
		</view>
		<view style="margin: 60rpx 0rpx">
			<u-button icon="edit-pen-fill" class="loginBtn" type="primary" ripple-bg-color="#11AAED" @click="submit">修改密码</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				oldPwd: "",
				newPwd: ""
			}
		},
		//注意函数和data同级,不要写在methods内
		onNavigationBarButtonTap(e) {
			uni.switchTab({
				url: '../imes/workorder/workorder'
			});
		},
		methods: {
			submit() {
				if(this.oldPwd==""||this.newPwd=="")
				{
					this.$toast("请先输入密码！");
					return;
				}
				else
				{
					let url = "api/user/modifyPwd?oldPwd=" +
						this.oldPwd +
						"&newPwd=" +
						this.newPwd;
					this.http.post(url, {}, true).then(x => {
						this.$toast(x.message);
						if (!x.status) {
							return;
						}
						else
						{
							uni.navigateTo({
								url: './login'
							})
						};
					});
				}
				
			}
		}
	}
</script>

<style lang="less" scoped>
	.md-form {
		padding: 60rpx 20rpx 0 20rpx;
	}
	.loginBtn {
		background: #11AAED;
		box-shadow: 0px 0px 7px 0px rgba(15, 168, 250, 0.4);
		margin: 20rpx 15rpx 20rpx 0rpx;
		border-radius: 10px;
	}
	
</style>
