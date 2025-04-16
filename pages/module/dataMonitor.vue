<template>
	<!--数据监控页面-->
	<view class="page">
		<view class="function-modules">
			<view class="module">
				<view class="linearLayout">
					<view class="horizontalLayout">
						<image class="icon" src="../../common/icons/notice.png"></image>
						<view class="text_block1">
							打开数据异常提醒
						</view>
						<switch class="switch" checked />
					</view>
					<!--文本部分-->
					<view class="text_block2">
						打开数据异常提醒后，若大棚内某项数据超出推荐范围后，app首页会有弹窗提醒。
					</view>
				</view>
			</view>
			<view class="module">
				<view class="linearLayout">
					<view class="horizontalLayout">
						<image class="icon" src="../../common/icons/set0.png"></image>
						<view class="text_block1">
							设定大棚适宜数据值
						</view>
						<image class="icon2" src="../../common/icons/goTo.png" @click="showInputA=true"></image>
					</view>
					<!--文本部分-->
					<view class="text_block2">
						设定大棚内温度、土壤湿度、二氧化碳浓度适宜值范围。
					</view>
				</view>
			</view>
			<view class="module">
				<view class="linearLayout">
					<view class="horizontalLayout">
						<image class="icon" src="../../common/icons/set1.png"></image>
						<view class="text_block1">
							设定大棚警报数值
						</view>
						<image class="icon2" src="../../common/icons/goTo.png" @click="showInputB=true"></image>
					</view>
					<!--文本部分-->
					<view class="text_block2">
						设定大棚内温度、土壤湿度、二氧化碳相对浓度阈值范围。
					</view>
				</view>
			</view>
		</view>
		<customInputModel :isShow="showInputA" title="设定大棚适宜数据值" @close="showInputA = false" @confirm="handleConfirmA">
		</customInputModel>
		<abnormalInputModel :isShow="showInputB" title="设定大棚警报数值" @close="showInputB = false" @confirm="handleConfirmB">
		</abnormalInputModel>
	</view>
</template>

<script setup>
	import {
		ref
	} from "vue";
	import axios from 'axios'; // 需先安装 axios：npm install axios
	import { useFetch } from '../../composables/useFetch';

	const showInputA = ref(false);
	const showInputB = ref(false);

	const { baseUrl } = useFetch();
	const relativeUrl = '/updateThresholds';
	const url = `${baseUrl}${relativeUrl}`;


	const handleConfirmA = async (data) => {
		try {
			const result = await axios.post(
				url, // API 地址
				data, // 直接传递请求体（axios 会自动序列化为 JSON）
				{
					headers: {
						'Content-Type': 'application/json' // 可选：axios 默认会设置，除非需要覆盖
					}
				}
			);
			console.log('适宜数据提交成功:', result.data); // axios 响应数据在 result.data 中
		} catch (error) {
			// axios 会将 HTTP 错误封装在 error.response 中
			if (error.response) {
				console.error('服务器响应错误:', error.response.data);
				console.error('状态码:', error.response.status);
			} else if (error.request) {
				console.error('请求发送失败（未收到响应）:', error.request);
			} else {
				console.error('请求配置错误:', error.message);
			}
		}
	};

	const handleConfirmB = async (data) => {
		try {
			const result = await axios.post(
				url, // 替换为实际 API 地址
				data, // 请求体
				{
					headers: {
						'Content-Type': 'application/json' // 同上，可选
					}
				}
			);
			console.log('警报数据提交成功:', result.data);
		} catch (error) {
			// 统一错误处理（与 handleConfirmA 一致）
			if (error.response) {
				console.error('服务器响应错误:', error.response.data);
			} else if (error.request) {
				console.error('请求发送失败:', error.request);
			} else {
				console.error('请求错误:', error.message);
			}
		}
	};
</script>

<style lang="scss" scoped>
	.page {
		height: 100vh;
		position: fixed;
		background: #EBF9FF;
	}

	.function-modules {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		padding: 10px;
	}

	.module {
		width: 86vw;
		height: 260rpx;
		display: flex;
		margin-top: 50rpx;
		padding: 10px;
		border: 2px solid #9c9c9c;
		background: $light_blue;
		box-sizing: border-box;
		border-radius: 10px;

		.icon {
			padding-left: 10rpx;
			margin-top: 5rpx;
			width: 50rpx;
			height: 50rpx;
			background: $light_blue;
		}

		.icon2 {
			padding-left: 40rpx;
			margin-top: 5rpx;
			width: 50rpx;
			height: 50rpx;
			background: $light_blue;
		}

		.text_block1 {
			background: $light_blue;
			margin-left: 12rpx;
			padding-top: 4rpx;
			width: 70%;
			border-bottom: 1px solid #9c9c9c;
			font-size: 40rpx;
			height: 60rpx;
			box-sizing: border-box;
		}

		.text_block2 {
			background: $light_blue;
			padding-left: 12rpx;
			padding-top: 4rpx;
			width: 95%;
			height: 100%;
			font-size: 36rpx;
		}
	}

	.horizontalLayout {
		display: flex;
		flex-direction: row;
		background: $light_blue;
	}

	.linearLayout {
		width: 100%;
		display: flex;
		flex-direction: column;
	}

	.switch {
		transform: scale(1);
	}
</style>