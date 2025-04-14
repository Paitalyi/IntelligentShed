<template>
	<!--设备管理页面-->
	<view class="page">
		<deviceItem name="启动自动灌溉" description="当土壤湿度低于一定的阈值启动灌溉模块，在土壤湿度达到适宜值后关闭灌溉。"
			icon="../../common/icons/guangai.png" :isSwitchOpen="isIrrAuto" :switchChange="switch1Change">
		</deviceItem>
		<deviceItem name="启动自动补光" description="当光照强度低于一定阈值时启动补光模块，在土壤湿度达到适宜值后关闭补光。"
			icon="../../common/icons/buguang.png" :isSwitchOpen="isLightAuto" :switchChange="switch2Change">
		</deviceItem>
		<deviceItem name="启动自动通风" description="当二氧化碳浓度高于一定阈值时时启动通风模块，在二氧化碳浓度达到适宜值后关闭通风。"
			icon="../../common/icons/tongfeng.png" :isSwitchOpen="isVentAuto" :switchChange="switch3Change">
		</deviceItem>
		<deviceItem name="灌溉模块" description="通过该开关可以手动控制灌溉模块状态。若要使用该功能，请确保自动灌溉已关闭。"
			icon="../../common/icons/guangaiM.png" :isSwitchOpen="isIrrSwitchOpen" :switchChange="switch4Change" :isDisabled="isIrrAuto">
		</deviceItem>
		<deviceItem name="补光模块" description="通过该开关可以手动控制补光模块状态。若要使用该功能，请确保自动补光已关闭。"
			icon="../../common/icons/buguangM.png" :isSwitchOpen="isLightSwitchOpen" :switchChange="switch5Change" :isDisabled="isLightAuto">
		</deviceItem>
		<deviceItem name="通风模块" description="通过该开关可以手动控制通风模块状态。若要使用该功能，请确保自动通风已关闭。"
			icon="../../common/icons/tongfengM.png" :isSwitchOpen="isVentSwitchOpen" :switchChange="switch6Change" :isDisabled="isVentAuto">
		</deviceItem>
	</view>
</template>

<script setup>
	import {
		onMounted,
		ref
	} from "vue";
	import axios from 'axios';

	//自动模块
	//自动灌溉、自动补光、自动通风
	const isIrrAuto = ref(false);
	const isLightAuto = ref(false);
	const isVentAuto = ref(false);
	//手动模块
	//灌溉、补光、通风
	const isIrrSwitchOpen = ref(false);
	const isLightSwitchOpen = ref(false);
	const isVentSwitchOpen = ref(false);

	//基础URL
	const baseUrl = 'http://192.168.20.237:8080';
	const relativeUrlList = {
		//自动灌溉
		switch1: {
			on: '/irrigationControl',
			off: '/irrigationControl',
			status: '/judgeIrrAuto',
		},
		switch2: {
			on: '/lightControl',
			off: '/lightControl',
			status: '/judgeLightAuto'
		},
		switch3: {
			on: '/ventilationControl',
			off: '/ventilationControl',
			status: '/judgeVentAuto'
		},
		switch4: {
			on: '/openIrrigationModule',
			off: '/shutIrrigationModule',
			status: '/judgeIrrActive'
		},
		switch5: {
			on: '/openLightSupplementModule',
			off: '/shutLightSupplementModule',
			status: '/judgeLightActive'
		},
		switch6: {
			on: '/openVentilationModule',
			off: '/shutVentilationModule',
			status: '/judgeVentActive',
		}
	};

	// 封装通用的发送 GET 请求的方法
	const sendGetRequest = async (relativeUrl) => {
		const fullUrl = `${baseUrl}${relativeUrl}`;
		console.log(fullUrl);
		try {
			const response = await axios.get(fullUrl);
			console.log(response.data);
			return response.data;
		} catch (error) {
			console.error('网络请求失败:', error);
			throw error;
		}
	};

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

	const fetchAutoIrrigationStatus = async () => {
		console.log(relativeUrlList.switch1.status);
		return sendGetRequest(relativeUrlList.switch1.status);
	};

	const fetchAutoLightStatus = async () => {
		return sendGetRequest(relativeUrlList.switch2.status);
	};

	const fetchAutoVentilationStatus = async () => {
		return sendGetRequest(relativeUrlList.switch3.status);
	};

	const fetchManualIrrigationStatus = async () => {
		return sendGetRequest(relativeUrlList.switch4.status);
	};

	const fetchManualLightStatus = async () => {
		return sendGetRequest(relativeUrlList.switch5.status);
	};

	const fetchManualVentilationStatus = async () => {
		return sendGetRequest(relativeUrlList.switch6.status);
	};

	const initStatus = async () => {
		try {
			// 并发获取所有状态（优化性能）
			const [autoIrrigation, autoLight, autoVentilation,
				manualIrrigation, manualLight, manualVentilation
			] = await Promise.all([
				fetchAutoIrrigationStatus(),
				fetchAutoLightStatus(),
				fetchAutoVentilationStatus(),
				fetchManualIrrigationStatus(),
				fetchManualLightStatus(),
				fetchManualVentilationStatus()
			]);

			// 赋值状态
			isIrrAuto.value = autoIrrigation;
			isLightAuto.value = autoLight;
			isVentAuto.value = autoVentilation;
			isIrrSwitchOpen.value = manualIrrigation;
			isLightSwitchOpen.value = manualLight;
			isVentSwitchOpen.value = manualVentilation;

			console.log("初始化成功");
		} catch (error) {
			console.error("初始化失败", error);
			// 使用 uni-app 提示（支持小程序/H5/APP）
			uni.showToast({
				title: "初始化状态获取失败，请重试",
				icon: "none", // 不显示图标
				duration: 2000 // 显示 2 秒
			});
			// 可选：初始化失败时恢复默认状态（根据需求）
			// isIrrAuto.value = false; // 按需恢复
		}
	};

	// 开关 1 事件监听
	const switch1Change = () => handleSwitchChange(isIrrAuto, 'switch1');
	// 开关 2 事件监听
	const switch2Change = () => handleSwitchChange(isLightAuto, 'switch2');
	// 开关 3 事件监听
	const switch3Change = () => handleSwitchChange(isVentAuto, 'switch3');
	// 开关 4 事件监听
	const switch4Change = () => handleSwitchChange(isIrrSwitchOpen, 'switch4');
	// 开关 5 事件监听
	const switch5Change = () => handleSwitchChange(isLightSwitchOpen, 'switch5');
	// 开关 6 事件监听
	const switch6Change = () => handleSwitchChange(isVentSwitchOpen, 'switch6');

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