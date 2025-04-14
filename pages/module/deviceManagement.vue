<template>
	<!--设备管理页面-->
	<view class="page">
		<deviceItem name="启动自动灌溉" description="当土壤湿度低于一定的阈值启动灌溉模块，在土壤湿度达到适宜值后关闭灌溉。"
			icon="../../common/icons/guangai.png" :isSwitchOpen="isIrrAuto" :switchChange="switchIrrAutoChange">
		</deviceItem>
		<deviceItem name="启动自动补光" description="当光照强度低于一定阈值时启动补光模块，在土壤湿度达到适宜值后关闭补光。"
			icon="../../common/icons/buguang.png" :isSwitchOpen="isLightAuto" :switchChange="switchLightAutoChange">
		</deviceItem>
		<deviceItem name="启动自动通风" description="当二氧化碳浓度高于一定阈值时时启动通风模块，在二氧化碳浓度达到适宜值后关闭通风。"
			icon="../../common/icons/tongfeng.png" :isSwitchOpen="isVentAuto" :switchChange="switchVentAutoChange">
		</deviceItem>
		<deviceItem name="灌溉模块" description="通过该开关可以手动控制灌溉模块状态。若要使用该功能，请确保自动灌溉已关闭。"
			icon="../../common/icons/guangaiM.png" :isSwitchOpen="isIrrSwitchOpen" :switchChange="switchIrrChange"
			:isDisabled="isIrrAuto">
		</deviceItem>
		<deviceItem name="补光模块" description="通过该开关可以手动控制补光模块状态。若要使用该功能，请确保自动补光已关闭。"
			icon="../../common/icons/buguangM.png" :isSwitchOpen="isLightSwitchOpen" :switchChange="switchLightChange"
			:isDisabled="isLightAuto">
		</deviceItem>
		<deviceItem name="通风模块" description="通过该开关可以手动控制通风模块状态。若要使用该功能，请确保自动通风已关闭。"
			icon="../../common/icons/tongfengM.png" :isSwitchOpen="isVentSwitchOpen" :switchChange="switchVentChange"
			:isDisabled="isVentAuto">
		</deviceItem>
	</view>
</template>

<script setup>
	import {
		onMounted,
		ref
	} from "vue";
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

	// 封装开关状态改变的处理逻辑
	const handleSwitchChange = async (switchRef, switchKey) => {
		const originalStatus = switchRef.value;
		switchRef.value = !originalStatus;
		const relativeUrl = switchRef.value ? relativeUrlList[switchKey].on : relativeUrlList[switchKey].off;
		try {
			const data = await sendGetRequest(relativeUrl);
			uni.showToast({
				title: '操作成功',
				icon: "none",
				duration: 2000
			});
		} catch (error) {
			switchRef.value = originalStatus;
			uni.showToast({
				title: '操作失败，请重试',
				icon: "none",
				duration: 2000
			});
		}
	};

	const switchIrrAutoChange = () => handleSwitchChange(isIrrAuto, 'switch1');
	const switchLightAutoChange = () => handleSwitchChange(isLightAuto, 'switch2');
	const switchVentAutoChange = () => handleSwitchChange(isVentAuto, 'switch3');
	const switchIrrChange = () => handleSwitchChange(isIrrSwitchOpen, 'switch4');
	const switchLightChange = () => handleSwitchChange(isLightSwitchOpen, 'switch5');
	const switchVentChange = () => handleSwitchChange(isVentSwitchOpen, 'switch6');

	// 页面挂载后调用初始化
	onMounted(() => {
		initStatus();
	});
</script>

<style lang="scss" scoped>
	.page {
		height: 100%;
		display: flex;
		background: #EBF9FF;
		padding-bottom: 50rpx;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		padding: 10px;
	}
</style>