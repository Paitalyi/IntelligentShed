import {
	ref
} from 'vue';
import axios from 'axios';

//提供initStatus获取六个状态：
//isIrrAuto
//isLightAuto
//isVentAuto
//isIrrSwitchOpen
//isLightSwitchOpen
//isVentSwitchOpen
//提供sendGetRequest对relativeUrl发送get请求
export function useFetch() {
	// 灌溉、补光、通风
	const isIrrAuto = ref(false);
	const isLightAuto = ref(false);
	const isVentAuto = ref(false);
	// 灌溉、补光、通风运行状态
	const isIrrSwitchOpen = ref(false);
	const isLightSwitchOpen = ref(false);
	const isVentSwitchOpen = ref(false);

	// 基础 URL
	const baseUrl = 'http://192.168.20.237:8080';
	const relativeUrlList = {
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
		try {
			const response = await axios.get(fullUrl);
			return response.data;
		} catch (error) {
			console.error('网络请求失败:', error);
			// 根据实际需求决定是否重新抛出错误
			throw error;
			return false; // 可以返回 null 或其他默认值，以避免调用处的错误处理过于复杂
		}
	};

	// 封装开关状态改变的处理逻辑
	const fetchAutoIrrigationStatus = async () => {
		return await sendGetRequest(relativeUrlList.switch1.status);
	};

	const fetchAutoLightStatus = async () => {
		return await sendGetRequest(relativeUrlList.switch2.status);
	};

	const fetchAutoVentilationStatus = async () => {
		return await sendGetRequest(relativeUrlList.switch3.status);
	};

	const fetchManualIrrigationStatus = async () => {
		return await sendGetRequest(relativeUrlList.switch4.status);
	};

	const fetchManualLightStatus = async () => {
		return await sendGetRequest(relativeUrlList.switch5.status);
	};

	const fetchManualVentilationStatus = async () => {
		return await sendGetRequest(relativeUrlList.switch6.status);
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

	return {
		isIrrAuto,
		isLightAuto,
		isVentAuto,
		isIrrSwitchOpen,
		isLightSwitchOpen,
		isVentSwitchOpen,
		relativeUrlList,
		sendGetRequest,
		initStatus
	};
}