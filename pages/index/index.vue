<template>
	<view class="page">
		<view class="linearLayout">
			<!--天气与大棚信息-->
			<!--文字部分-->
			<view class="box">
				<image src="../../common/icons/weather.png" class="icon1"></image>
				<view class="in_center top">
					大棚实时信息
				</view>
			</view>
			<view class="info_module">
				<!--信息板块-->
				<infoItem name="温度" unit="℃" :obj="dataList.temperature"></infoItem>
				<infoItem name="光照强度" unit="lux" :obj="dataList.light"></infoItem>
				<infoItem name="土壤湿度" unit="%" :obj="dataList.soil"></infoItem>
				<infoItem name="二氧化碳浓度" unit="ppm" :obj="dataList.co2"></infoItem>
			</view>
		</view>
		<!-- 轮播器 -->
		<view class="swiper_container">
			<swiper :indicator-dots="true" :autoplay="true" :interval="8000" :duration="1000">
				<swiper-item>
					<view class="announcement-item">
						<text :style="{color: a1Color?'green':'red'}" class="anoun1">{{ announcement.content }}</text>
					</view>
				</swiper-item>
				<!-- 第二个 swiper-item-->
				<swiper-item @click="goToModule('deviceManagement')">
					<view class="split-item">
						<!-- 上半部分 -->
						<view class="upper-half">
							<view class="left-upper">
								<image src="../../common/icons/guangai.png" class="upperIcon"></image>
								<view class="upper_text">灌溉</view>
								<view class="upper_Rtext" :style="{color:isIrrAuto?'#398223':'black'}">auto</view>
								<view class="upper_Dtext" :style="{color:isIrrSwitchOpen?'#398223':'black'}">
									{{isIrrSwitchOpen?'运行中':'已关闭'}}
								</view>
							</view>
							<view class="right-upper">
								<image src="../../common/icons/buguang.png" class="upperIcon"></image>
								<view class="upper_text">补光</view>
								<view class="upper_Rtext" :style="{color:isLightAuto?'#398223':'black'}">auto</view>
								<view class="upper_Dtext" :style="{color:isLightSwitchOpen?'#398223':'black'}">
									{{isLightSwitchOpen?'运行中':'已关闭'}}
								</view>
							</view>
						</view>
						<!-- 下半部分 -->
						<view class="lower-half">
							<image src="../../common/icons/tongfeng.png" class="lowerIcon"></image>
							<view class="lower_text">通风</view>
							<view class="lower_Rtext" :style="{color:isVentAuto?'#398223':'black'}">auto</view>
							<view class="lower_Dtext" :style="{color:isVentSwitchOpen?'#398223':'black'}">
								{{isVentSwitchOpen?'运行中':'已关闭'}}
							</view>
						</view>
					</view>
				</swiper-item>
			</swiper>
		</view>

		<image class="icon2" src="../../common/icons/function.png"></image>
		<view class="in_center" style="font-family: 'shuhei';">常用功能</view>
		<hr class="dashed_line">
		<view class="linearLayout">
			<!-- 功能模块 -->
			<view class="function-modules">
				<view class="module" @click="goToModule('dataMonitor')">数据监控</view>
				<view class="module" @click="goToModule('deviceManagement')">设备管理</view>
				<view class="module" @click="goToModule('intelligentAssistant')">智慧助手</view>
			</view>
		</view>
		<view class="endLine">
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted,
		onBeforeUnmount
	} from 'vue';
	import axios from 'axios';
	import {
		useFetch
	} from '@/composables/useFetch.js';

	const {
		isIrrAuto,
		isLightAuto,
		isVentAuto,
		isIrrSwitchOpen,
		isLightSwitchOpen,
		isVentSwitchOpen,
		relativeUrlList,
		sendGetRequest,
		initStatus
	} = useFetch();

	// 假设这是在 uni-app 环境中，uni 是全局对象，一般不需要显式引入
	// 如果是普通 Vue 项目，需要额外处理

	// 获取数据的 url
	const url = 'http://192.168.20.237:8080/getAlarm';
	// 定义响应式数据
	const dataList = ref({
		temperature: {
			currentValue: 20,
			status: 'NORMAL'
		},
		light: {
			currentValue: 20,
			status: 'NORMAL'
		},
		soil: {
			currentValue: 20,
			status: 'NORMAL'
		},
		co2: {
			currentValue: 20,
			status: 'NORMAL'
		}
	});
	const intervalId = ref(null);
	const lastDataList = ref({});
	const a1Color = ref(false);
	const announcement = ref({
		title: '公告',
		content: '当前大棚温度与光照强度异常。'
	});

	const goToModule = (moduleName) => {
		uni.navigateTo({
			url: `/pages/module/${moduleName}`
		});
	};

	// 定义获取数据的函数
	const fetchData = async () => {
		try {
			const response = await axios.get(url);
			lastDataList.value = {
				...dataList.value
			};
			const newData = response.data;
			dataList.value = {
				temperature: newData[Object.keys(newData).find(key => newData[key].type === 'temperature')] ||
					dataList.value.temperature,
				light: newData[Object.keys(newData).find(key => newData[key].type === 'light')] || dataList
					.value.light,
				soil: newData[Object.keys(newData).find(key => newData[key].type === 'soil')] || dataList.value
					.soil,
				co2: newData[Object.keys(newData).find(key => newData[key].type === 'co2')] || dataList.value
					.co2
			};
			const messages = [];

			// 用 showtoast 打印 status 不为 NORMAL 的 message
			Object.values(dataList.value).forEach(item => {
				if (item.status !== 'NORMAL') {
					messages.push(item.message);
				}
			});

			if (messages.length > 0) {
				uni.showToast({
					title: messages.join('\n'),
					icon: 'none',
					duration: 5000
				});
			}
			const hasAbnormal = Object.values(dataList.value).some(item => item.status !== 'NORMAL');
			if (hasAbnormal) {
				a1Color.value = false;
				let abnormalItems = [];
				if (dataList.value.temperature.status !== 'NORMAL') {
					abnormalItems.push('温度');
				}
				if (dataList.value.light.status !== 'NORMAL') {
					abnormalItems.push('光照强度');
				}
				if (dataList.value.soil.status !== 'NORMAL') {
					abnormalItems.push('土壤湿度');
				}
				if (dataList.value.co2.status !== 'NORMAL') {
					abnormalItems.push('二氧化碳浓度');
				}
				announcement.content = `当前大棚${abnormalItems.join('和')}数据异常，请尽快处理。`;
			} else {
				a1Color.value = true;
				announcement.content = '当前大棚数据正常，请放心。';
			}
		} catch (error) {
			// 抓到异常后如果，上次加载的数据不为空则使用上次的数据
			if (Object.keys(lastDataList.value).length > 0) {
				dataList.value = {
					...lastDataList.value
				};
			} else {
				setDefaultValues();
				uni.showToast({
					title: '数据更新失败，请稍后重试',
					icon: 'none',
					duration: 2000
				});
			}
		}
	};

	// 定义设置默认值的函数
	const setDefaultValues = () => {
		dataList.value = {
			temperature: {
				currentValue: 20,
				status: 'NORMAL'
			},
			light: {
				currentValue: 5000,
				status: 'NORMAL'
			},
			soil: {
				currentValue: 50,
				status: 'NORMAL'
			},
			co2: {
				currentValue: 400,
				status: 'NORMAL'
			}
		};
	};

	// 定义根据状态获取颜色的函数
	const getColor = (status) => {
		switch (status) {
			case 'NORMAL':
				return '#398223';
			case 'DANGER':
				return '#a71515';
			case 'WARNING':
				return '#a78809';
			default:
				return 'black';
		}
	};

	const timePeriod = 3 * 60 * 1000; // 自动更新间隔 ms
	// 组件挂载时执行的逻辑
	onMounted(() => {
		fetchData();
		initStatus();
		intervalId.value = setInterval(() => {
			initStatus();
			fetchData();
		}, timePeriod);
	});

	// 组件卸载前执行的逻辑
	onBeforeUnmount(() => {
		clearInterval(intervalId.value);
	});
</script>

<style lang="scss" scoped>
	.page {
		height: 100vh;
		// position: fixed;
		background: linear-gradient(220.55deg, #cde7ff 0%, #ffb4f9 100%);
		opacity: 0.8;
	}

	.swiper_container {
		width: 80%;
		margin: 10px auto;
		border-radius: 10px;
		overflow: hidden;
		height: 300rpx;
		background-color: rgba(255, 255, 255, 0.6);

		swiper {
			width: 100%;
			height: 100%;
			/* 使用 RGBA 设置背景颜色和透明度 */
		}
	}

	.announcement-item {
		padding: 1px;
		display: flex;
		height: 100%;
		box-sizing: border-box;
		border-radius: 10px;
		border: 1px solid #cad1c3;
		width: 100%;

		.anoun1 {
			margin: 40rpx 20rpx;
			padding: 50rpx;
			border-radius: 10px;
			background-color: rgba(255, 255, 255, 1);
		}
	}

	.linearLayout {
		display: flex;
		flex-direction: column;
		align-items: center;

	}

	.function-modules {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		padding: 10px;

		.module {
			width: 80vw;
			height: 100rpx;
			display: flex;
			margin-top: 22rpx;
			justify-content: center;
			padding: 22rpx;
			border: 1px solid #cad1c3;
			background-color: rgba(255, 255, 255, 0.6);
			box-sizing: border-box;
			border-radius: 10px;
		}
	}

	.info_module {
		background-color: rgba(255, 255, 255, 0.6);
		width: 80vw;
		height: 300rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		border-radius: 10px;

	}

	.top {
		margin-top: 100rpx;
	}

	.in_center {
		padding-top: 30rpx;
		text-align: center;
		margin-bottom: 10rpx;
		font-size: 40rpx;
	}

	.dashed_line {
		border: none;
		border-top: 3px solid #bd9375;
		margin-left: 100rpx;
		margin-right: 100rpx;
	}

	.box {
		width: 100%;
		position: relative;
	}

	.icon1 {
		width: 55rpx;
		height: 55rpx;
		position: absolute;
		margin-top: 116rpx;
		margin-left: 200rpx;
	}

	.icon2 {
		width: 55rpx;
		height: 55rpx;
		position: absolute;
		margin-top: 25rpx;
		margin-left: 243rpx;
	}

	.split-item {
		display: flex;
		flex-direction: column;
		height: 100%;
		align-items: center;
		background-color: inherit;
	}

	.upper-half {
		display: flex;
		flex-direction: row;
		height: 45%;
		width: 100%;
		background-color: inherit;

		.upperIcon {
			position: absolute;
			width: 85rpx;
			height: 85rpx;
			margin-left: 10rpx;
		}

		.upper_text {
			position: absolute;
			margin-left: 100rpx;
			margin-top: 10rpx;
		}

		.upper_Rtext {
			position: absolute;
			margin-left: 180rpx;
			margin-top: 10rpx;
		}

		.upper_Dtext {
			position: absolute;
			margin-left: 100rpx;
			margin-top: 50rpx;
		}

		.left-upper {
			margin: 10rpx;
			// text-align: center;
			width: 45%;
			height: 110rpx;
			border-radius: 10px;
			background-color: rgba(255, 255, 255, 1);
			position: relative;
		}

		.right-upper {
			position: relative;
			margin: 10rpx;
			width: 45%;
			height: 110rpx;
			border-radius: 10px;
			background-color: rgba(255, 255, 255, 1);
		}

	}



	.lower-half {
		height: 40%;
		width: 92%;
		margin-top: 10rpx;
		margin-bottom: 20rpx;
		padding: 10rpx;
		border-radius: 10px;
		background-color: rgba(255, 255, 255, 1);

		.lowerIcon {
			position: absolute;
			width: 70rpx;
			height: 70rpx;
			margin-left: 100rpx;
			margin-top: 10rpx;
		}

		.lower_text {
			position: absolute;
			margin-left: 200rpx;
			margin-top: 10rpx;
		}

		.lower_Rtext {
			position: absolute;
			margin-left: 280rpx;
			margin-top: 10rpx;
		}

		.lower_Dtext {
			position: absolute;
			margin-left: 200rpx;
			margin-top: 50rpx;
		}
	}
</style>