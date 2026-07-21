<template>
	<view class="t-login">
		<!--个人信息栏-->
		<view class="topInfo">
			<image v-if="userInfo.userTrueName" src="../../static/img/logo.png"></image>
			<image v-else src="../../static/img/logo.png"></image>
			<view v-if="userInfo.userTrueName">
				<text v-if="userInfo.userName">{{userInfo.userTrueName}}-{{userInfo.userName}}</text>
				<text v-else>iMES工厂管家</text>
				<text>{{userInfo.roleName}}</text>
			</view>
			<view v-else @click="gotoLoginFun">
				<text>暂未登录</text>
				<text>请先登录</text>
			</view>
		</view>
		<view class="gray32"></view>
		<!--列表-->
		<view class="cardList">
			<navigator v-if="!userInfo.userTrueName" class="row" url="../regLogin/login">
				<view class="rowLeft">
					<u-icon name="account-fill" class="leftIcon" size="20" color="#11AAED"></u-icon>
					<text class="color000">账号登录</text>
				</view>
				<image class="enterImg" src="../../static/img/enter.png" mode="aspectFill"></image>
			</navigator>
			<view class="row" @click="gotoAboutFun">
				<view class="rowLeft">
					<u-icon name="info-circle-fill" color="#11AAED" size="20"></u-icon>
					<text class="color000" style="margin-left: 10rpx;">关于iMES</text>
				</view>
				<u-icon name="arrow-right" color="#A4A4A4" size="15"></u-icon>
			</view>
			<view class="row" @click="gotoSwhzFun">
				<view class="rowLeft">
					<u-icon name="email-fill" color="#11AAED" size="20"></u-icon>
					<text class="color000" style="margin-left: 10rpx;">商务合作</text>
				</view>
				<u-icon name="arrow-right" color="#A4A4A4" size="15"></u-icon>
			</view>
			<view class="row" @click="helpCenterFun">
				<view class="rowLeft">
					<u-icon name="question-circle-fill" color="#11AAED" size="20"></u-icon>
					<text class="color000" style="margin-left: 10rpx;">帮助中心</text>
				</view>
				<u-icon name="arrow-right" color="#A4A4A4" size="15"></u-icon>
			</view>
			<view class="row" @click="aboutCenterFun">
				<view class="rowLeft">
					<u-icon name="info-circle-fill" color="#11AAED" size="20"></u-icon>
					<text class="color000" style="margin-left: 10rpx;">关于我们</text>
				</view>
				<u-icon name="arrow-right" color="#A4A4A4" size="15"></u-icon>
			</view>
			<view class="row" @click="gotoModifyPwdFun">
				<view class="rowLeft">
					<u-icon name="setting-fill" color="#11AAED" size="20"></u-icon>
					<text class="color000" style="margin-left: 10rpx;">修改密码</text>
				</view>
				<u-icon name="arrow-right" color="#A4A4A4" size="15"></u-icon>
			</view>
			<view class="row" style="border-bottom: 0rpx solid #EEEEEE;">
				<u-button class="loginBtn" type="primary" color="#11AAED" @click="logout">切换登录</u-button>
			</view>
			<view class="row" style="border-bottom: 0rpx solid #EEEEEE;margin-top:-30rpx;">
				<u-button class="loginBtn" type="primary" color="#11AAED" @click="logoutApp">退出系统</u-button>
			</view>
			<!-- 	<navigator @click="logout" class="row">
				<view class="rowLeft">
					<u-icon name="tags-fill" color="#11AAED" size="35"></u-icon>
					<text class="color000" style="margin-left: 10rpx;">切换登录</text>
				</view>
				<u-icon name="arrow-right" color="#A4A4A4" size="30"></u-icon>
			</navigator> -->
		</view>
	<!-- 	<view>
			<u-button class="loginBtn" type="primary" ripple-bg-color="#909399" @click="logoutApp">退出系统</u-button>
		</view> -->
		<u-no-network></u-no-network>
	</view>
</template>

<script>
	let that = '';
	export default {
		components: {},
		data() {
			return {
				background: {
					'background-image': 'linear-gradient(45deg, #007aff, #10a5e3)'
				},
				userInfo: {},
				cardInfo: {}
			}
		},
		onLoad() {
			that = this;
			that.userInfo = uni.getStorageSync('user_info');
		},
		methods: {
			gotoModifyPwdFun: function() {
				uni.navigateTo({
					url: '../regLogin/modifyPwd'
				})
			},
			gotoLoginFun: function() {
				uni.navigateTo({
					url: '../regLogin/login'
				})
			},
			gotoAboutFun: function() {
				uni.navigateTo({
					url: './about/about'
				})
			},
			//切换登录
			logout() {
				uni.removeStorageSync('user_info');
				let self = this;
				setTimeout(() => {
					uni.reLaunch({
						url: '/pages/regLogin/login'
					});
				}, 500);
			},
			logoutApp() {
				// #ifdef APP-PLUS
				if (plus.os.name.toLowerCase() === 'android') {
					plus.runtime.quit();
				} else {
					const threadClass = plus.ios.importClass("NSThread");
					const mainThread = plus.ios.invoke(threadClass, "mainThread");
					plus.ios.invoke(mainThread, "exit");
					// 或者如下
					// plus.ios.import('UIApplication').sharedApplication().performSelector('exit');
				}
				// #endif
			},
			gotoSwhzFun: function() {
				uni.showModal({
					title: '提示',
					content: '商务合作请联系微信QQ：514224717',
					showCancel: false
				})
				return
				uni.navigateTo({
					url: '../webview/webview?type=商务合作'
				})
			},
			helpCenterFun: function() {
				uni.navigateTo({
					url: '../webview/webview?type=帮助中心'
				})
			},
			aboutCenterFun: function() {
				uni.navigateTo({
					url: '../webview/webview?type=关于我们'
				})
			},
		}
	}
</script>

<style>
	.infoContent {
		box-sizing: border-box;
		border-radius: 16rpx;
		width: 686rpx;
		margin: 32rpx;
		padding: 26rpx;
		box-shadow: #dddddd 0px 0px 26rpx;
		background-image: linear-gradient(to right, #13b8ff, #007AFF);
	}

	.dfc {
		display: flex;
		align-items: center;
	}

	.dfc>image {
		box-sizing: border-box;
		width: 116rpx;
		height: 116rpx;
		border-radius: 50%;
		margin-right: 16rpx;
		border: 4rpx solid #FFFFFF;
	}

	.nameZhiwei {
		color: #FFFFFF;
		font-size: 28rpx;
	}
	
	.t-login {
		margin: 0 auto;
		font-size: 28rpx;
		color: #000;
	}

	.loginBtn {
		display:inline-block;
		font-size: 30rpx;
		font-weight: bold;
		background-image: linear-gradient(45deg, #11AAED, #019eff);
		color: #fff;
		height: 90rpx;
		line-height: 90rpx;
		/* border-radius: 50rpx; */
		box-shadow: 0 0px 0px 0 rgba(86, 119, 252, 0.2);
	}

	.nameZhiwei>view:first-child {
		font-size: 32rpx;
		font-weight: bold;
		margin-bottom: 8rpx;
	}

	.bottomInfo {
		border-top: 1rpx solid #d5d5d5;
		margin-top: 26rpx;
	}

	.row {
		display: flex;
		justify-content: space-between;
		border-bottom: 1rpx solid #EEEEEE;
		padding: 26rpx 0;
	}

	.rowLeft {
		display: flex;
		align-items: center;
		font-size: 27rpx;
		font-weight: bold;
		color: #FFFFFF;
	}

	.rowLeft>image {
		width: 50rpx;
		height: 50rpx;
		margin-right: 8rpx;
	}

	.leftIcon {
		margin-right: 8rpx;
	}

	.rowRight {
		font-size: 30rpx;
		color: #FFFFFF;
		width: 460rpx;
		text-align: right;
	}

	.cardList {
		box-sizing: border-box;
		/* border-radius: 16rpx; */
		padding: 26rpx;
		/* box-shadow: #dddddd 0px 0px 32rpx; */
	}

	.color000 {
		color: #000000;
	}

	.enterImg {
		width: 30rpx;
		height: 30rpx;
	}

	.mt36 {
		margin-top: 36rpx;
	}

	.flexC {
		display: flex;
		align-items: center;
		flex-direction: column;
		font-size: 28rpx;
	}

	.flexC>image {
		width: 60rpx;
		height: 60rpx;
	}

	.rowAroud {
		display: flex;
		align-items: center;
		justify-content: space-around;
	}

	.cardContent {
		width: 686rpx;
		margin: 32rpx;
		height: 390rpx;
		margin-bottom: 32rpx;
		border-radius: 16rpx;
		position: relative;
		overflow: hidden;
	}

	.btnRow {
		background-color: #FFFFFF !important;
	}

	button::after {
		border: none
	}

	.topInfo {
		width: 686rpx;
		display: flex;
		margin: 26rpx 32rpx;
	}

	.topInfo>image {
		width: 120rpx;
		height: 120rpx;
	}

	.topInfo>view {
		display: flex;
		flex-direction: column;
		font-size: 16px;
		padding: 16rpx 0 16rpx 16rpx;
		justify-content: space-between;
	}

	.topInfo>view>text:first-child {
		font-weight: bold;
	}

	.topInfo>view>text:last-child {
		color: #666666;
	}
</style>
