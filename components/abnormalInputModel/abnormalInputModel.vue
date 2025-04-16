<template>
	<view class="modal-mask" @click="closeModal" v-if="isShow">
		<view class="modal-content">
			<view class="modal-title">{{ title }}</view>
			<view class="horizontalLayout">
				<view class="text_script">温度:</view>
				<input class="modal-input" v-model="tempWarningMin" placeholder="请输入内容" @click.stop />
				<view class="interrupt">--</view>
				<input class="modal-input" v-model="tempWarningMax" placeholder="请输入内容" @click.stop>
				<view class="interrupt" style="color: #ad1313;font-weight: bold;">℃</view>
			</view>
			<view class="horizontalLayout">
				<view class="text_script">土壤湿度:</view>
				<input class="modal-input" v-model="soilWarningMin" placeholder="请输入内容" @click.stop />
				<view class="interrupt">--</view>
				<input class="modal-input" v-model="soilWarningMax" placeholder="请输入内容" @click.stop>
				<view class="interrupt" style="color: #ad1313; font-weight: bold;">%</view>
			</view>
			<view class="horizontalLayout">
				<view class="text_script">二氧化碳浓度:</view>
				<input class="modal-input" v-model="ratioWarningMin" placeholder="请输入内容" @click.stop />
				<view class="interrupt">--</view>
				<input class="modal-input" v-model="ratioWarningMax" placeholder="请输入内容" @click.stop>
				<view class="interrupt" style="color: #ad1313;font-weight: bold;">ppm</view>
			</view>
			<view v-if="errorMessage" class="error-message">{{ errorMessage }}</view>
			<view class="modal-buttons">
				<button @click="confirm">确定</button>
				<button @click="closeModal">取消</button>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';

	const props = defineProps({
		isShow: {
			type: Boolean,
			default: false
		},
		title: {
			type: String,
			default: '适宜数值输入'
		}
	});

	const emits = defineEmits(['close', 'confirm']);

	const tempWarningMin = ref('');
	const tempWarningMax = ref('');
	const soilWarningMin = ref('');
	const soilWarningMax = ref('');
	const ratioWarningMin = ref('');
	const ratioWarningMax = ref('');

	const errorMessage = ref('');

	const closeModal = () => {
		emits('close');
	};

	const confirm = () => {
		const data = {
			tempWarningMin: tempWarningMin.value,
			tempWarningMax: tempWarningMax.value,
			soilWarningMin: soilWarningMin.value,
			soilWarningMax: soilWarningMax.value,
			ratioWarningMin: ratioWarningMin.value,
			ratioWarningMax: ratioWarningMax.value
		};
		const minValues = {
			temp: parseFloat(tempWarningMin.value),
			soil: parseFloat(soilWarningMin.value),
			ratio: parseFloat(ratioWarningMin.value)
		};

		const maxValues = {
			temp: parseFloat(tempWarningMax.value),
			soil: parseFloat(soilWarningMax.value),
			ratio: parseFloat(ratioWarningMax.value)
		};

		if (
			(tempWarningMin.value && maxValues.temp <= minValues.temp) ||
			(soilWarningMin.value && maxValues.soil <= minValues.soil) ||
			(ratioWarningMin.value && maxValues.ratio <= minValues.ratio)
		) {
			errorMessage.value = '最大值必须大于最小值，请重新输入';
			return;
		};
		errorMessage.value = '';
		emits('confirm', data);
		closeModal();
	};
</script>

<style scoped>
	.modal-mask {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.modal-content {
		background-color: #fff;
		padding: 20px;
		border-radius: 10px;
		width: 80%;
	}

	.modal-title {
		font-size: 18px;
		font-weight: bold;
		margin-bottom: 10px;
		padding-bottom: 5rpx;
		border-bottom: 2px solid #ccc;
	}

	.modal-input {
		border: 1px solid #ccc;
		padding: 10rpx;
		border-radius: 5px;
		width: 15%;
	}

	.modal-buttons {
		display: flex;
		justify-content: space-around;
		border-top: 2px solid #ccc;
		padding-top: 10rpx;
	}

	.horizontalLayout {
		display: flex;
		flex-direction: row;
	}

	.modal-buttons button {
		padding: 10rpx 15rpx;
		border: none;
		border-radius: 10px;
		background-color: #353535;
		color: whitesmoke;
	}

	.text_script {
		font-size: 16px;
		font-weight: bold;
		text-align: right;
		padding: 12rpx;
		width: 35%;
		margin-bottom: 12rpx;
	}

	.interrupt {
		padding-top: 10rpx;
	}

	.error-message {
		color: red;
		margin-bottom: 10px;
		text-align: center;
	}
</style>