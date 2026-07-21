<!-- 蓝色简洁登录页面 -->
<template>
	<view class="t-login">
		
			<view class="logo" style="text-align: center;margin-top: 40rpx; ">
				<image style="width:150px;height:150px;text-align:center" src="/static/img/logo.png"></image>
			</view>
		<!-- 页面装饰图片 -->
		<!-- <image class="img-a" src="@/static/img/login/2.png"></image>
		<image class="img-b" src="@/static/img/login/3.png"></image>
		<view class="t-b">{{ title }}</view> -->
		<view class="cl" style="margin-top: 40rpx;">
			<view class="t-a">
				<image src="@/static/img/login/sj.png"></image>
				<input name="username" placeholder="请输入账号" maxlength="11" v-model="userInfo.userName" />
				<!-- <u-icon v-if="userInfo.userName" @click="userInfo.userName = ''" class="uIconR" name="close-circle-fill"
					color="#8a8a8a" size="20"></u-icon> -->
			</view>
			<view class="t-a">
				<image src="@/static/img/login/mm.png"></image>
				<input name="password" :password="isShowP" placeholder="请输入密码" v-model="userInfo.password" />
			<!-- 	<view v-if="userInfo.password">
					<u-icon v-if="isShowP" @click="isShowP = false" class="uIconR" name="eye-fill" color="#8a8a8a"
						size="20"></u-icon>
					<u-icon v-else class="uIconR" @click="isShowP = true" name="eye-off" color="#8a8a8a" size="20">
					</u-icon>
				</view> -->
			</view>
			<view class="t-a">
				<image src="@/static/img/login/yz.png"></image>
				<input name="yzm" maxlength="4" placeholder="请输入验证码" v-model="userInfo.verificationCode" />
				<!-- <view >发送短信</view> -->

				<view class="t-c">
					<image style="width: 140rpx;height: 74rpx;" @click="getVierificationCode" :src="codeSrc"></image>
				</view>
			</view>
			<u-button icon="checkmark" color="#11AAED"  class="loginBtn" type="primary" ripple-bg-color="#909399" @click="login">登 录</u-button>
		</view>
		<view style="margin-top: 40rpx;">
			<imes-alert type="primary">
				<view>演示帐号：admin &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;密码：123456</view>
			</imes-alert>
		</view>
	</view>
</template>
<script>
	let that = ''
	export default {
		data() {
			return {
				title: 'iMES工厂管家', //填写logo或者app名称，也可以用：欢迎回来，看您需求
				loading: false,
				codeSrc: "",
				userInfo: {
					userName: "admin",
					password: "123456",
					UUID: "",
					verificationCode: ""
				},
				icons: [],
				isShowP: true
			};
		},
		onLoad() {
			this.getVierificationCode();
		},
		methods: {
			getVierificationCode() {
				this.http.get("api/User/getVierificationCode").then(x => {
					this.codeSrc = "data:image/png;base64," + x.img;
					this.userInfo.UUID = x.uuid;
				});
			},
			login() {
				if (this.base.isEmpty(this.userInfo.userName))
					return this.$toast("请输入用户名");
				if (this.base.isEmpty(this.userInfo.password))
					return this.$toast("请输入密码");
				if (this.base.isEmpty(this.userInfo.verificationCode))
					return this.$toast("请输入验证码");
				this.userInfo.userName = this.userInfo.userName.trim();
				this.userInfo.password = this.userInfo.password.trim();
				this.userInfo.verificationCode = this.userInfo.verificationCode.trim();
				this.loading = true;
				this.http
					.post("api/user/login", this.userInfo, "正在登录....")
					.then((result) => {
						if (!result.status) {
							this.loading = false;
							this.getVierificationCode();
							return this.$toast(result.message);
						}
						this.$toast("登录成功,正在跳转!");
						uni.setStorageSync('user_info', result.data);
						this.$store.commit("setUserInfo", result.data);
						uni.switchTab({
							url: "/pages/imes/workorder/workorder"
						})
					});
			}
		}
	};
</script>
<style>
	.img-a {
		position: absolute;
		width: 100%;
		top: -280rpx;
		right: -100rpx;
	}

	.img-b {
		position: absolute;
		width: 50%;
		bottom: 0;
		left: -50rpx;
		margin-bottom: -200rpx;
	}

	.t-login {
		width: 600rpx;
		margin: 0 auto;
		font-size: 28rpx;
		color: #000;
	}

	.t-login .loginBtn {
		font-size: 30rpx;
		font-weight: bold;
		background-image: linear-gradient(45deg, #11AAED, #019eff);
		color: #fff;
		height: 90rpx;
		line-height: 90rpx;
		/* border-radius: 50rpx; */
		box-shadow: 0 5px 7px 0 rgba(86, 119, 252, 0.2);
	}

	.t-login input {
		padding: 0 120rpx 0 120rpx;
		height: 90rpx;
		line-height: 90rpx;
		margin-bottom: 50rpx;
		background: #f8f7fc;
		border: 1px solid #e9e9e9;
		font-size: 32rpx;
		border-radius: 10rpx;
	}

	.t-login .t-a {
		position: relative;
	}

	.t-login .t-a image {
		width: 40rpx;
		height: 40rpx;
		position: absolute;
		left: 40rpx;
		top: 28rpx;
		border-right: 2rpx solid #dedede;
		padding-right: 20rpx;
	}

	.t-login .t-b {
		text-align: left;
		font-size: 46rpx;
		color: #000;
		padding: 200rpx 0 60rpx 0;
		font-weight: bold;
	}

	.t-login .t-c {
		position: absolute;
		right: 80rpx;
		top: -18rpx;
		width: 120rpx;
		height: 54rpx;
		color: #fff;
		font-size: 24rpx;
		height: 50rpx;
		line-height: 50rpx;
	}

	.t-login .t-d {
		text-align: center;
		color: #999;
		margin: 80rpx 0;
	}

	.t-login .t-e {
		text-align: center;
		width: 250rpx;
		margin: 80rpx auto 0;
	}

	.t-login .t-g {
		float: left;
		width: 50%;
	}

	.t-login .t-e image {
		width: 50rpx;
		height: 50rpx;
	}

	.t-login .t-f {
		text-align: center;
		margin: 200rpx 0 0 0;
		color: #666;
	}

	.t-login .t-f text {
		margin-left: 20rpx;
		color: #aaaaaa;
		font-size: 27rpx;
	}

	.t-login .uni-input-placeholder {
		color: #000;
	}

	.cl {
		zoom: 1;
	}

	.cl:after {
		clear: both;
		display: block;
		visibility: hidden;
		height: 0;
		content: '\20';
	}

	.uTabs {
		/* margin-bottom: 50rpx; */
		width: 260rpx;
	}

	.spaceRow {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 36rpx;
	}

	.uIconR {
		position: absolute;
		right: 16rpx;
		top: 10rpx;
		padding: 20rpx;
	}
</style>
