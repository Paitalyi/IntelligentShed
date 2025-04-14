<template>
	<!-- 遮罩层 -->
	<view v-if="isVisible" class="popup-overlay">
		<!-- 弹窗内容 -->
		<view class="popup-content">
			<view>
				<view v-for="(item,index) in items" :key="index" class="modules">
					<view @click="goToModule(item.link)" class="module">{{item.content}}</view>
				</view>
			</view>
			<button @click="closePopup">关闭</button>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		defineProps
	} from 'vue';
	import {
		useRouter
	} from 'vue-router';
	const router = useRouter();
	const items = ref([{
			content: "详细温度信息",
			link: '/pages/detailData/temDetail'
		},
		{
			content: "详细光照强度信息",
			link: '/pages/detailData/lightIntensity'
		},
		{
			content: "详细土壤湿度信息",
			link: '/pages/detailData/moisDeatail'
		},
		{
			content: "详细二氧化碳浓度信息",
			link: '/pages/detailData/carbonDioxide'
		}
	]);
	const goToModule = (link) => {
		uni.navigateTo({
			url: link
		});
	};
	// 接收父组件传递的属性
	const props = defineProps({
		title: {
			type: String,
			default: '提示'
		},
		content: {
			type: String,
			default: '这是弹窗内容'
		}
	});

	// 触发关闭弹窗的事件
	const emits = defineEmits(['close']);

	// 控制弹窗显示与隐藏
	const isVisible = ref(false);

	// 打开弹窗的方法
	const openPopup = () => {
		isVisible.value = true;
	};

	// 关闭弹窗的方法
	const closePopup = () => {
		isVisible.value = false;
		emits('close');
	};

	// 导出打开弹窗的方法，方便父组件调用
	defineExpose({
		openPopup
	});
</script>

<style scoped>
	.popup-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: linear-gradient(220.55deg, #cde7ff 0%, #ffb4f9 100%);
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.popup-content {
		background-color: white;
		padding: 20px;
		border-radius: 10px;
		width: 300px;
	}

	.modules {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;

	}

	.module {
		width: 80%;
		height: 50rpx;
		text-align: center;
		background-color: #DDD6FD;
		padding: 15rpx;
		margin: 10rpx;
		border-radius: 10px;
	}

	button {
		width: 80%;
		font-size: 30rpx;
		border-radius: 10px;
	}
</style>