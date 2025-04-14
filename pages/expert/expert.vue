<template>
	<view class="expertPage">
		<view class="box">
			<image src="../../common/icons/function.png" class="icon2"></image>
			<view class="in_center">专家模式</view>
		</view>
		<hr class="solidLine">
		<view class="function-modules">
			<view class="module" @click="openPopup">详细数据显示</view>
			<view class="module">待开发功能二</view>
		</view>
		<detailDataCom ref="popupRef" title="自定义标题" content="自定义内容" />
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	// 引用弹窗组件
	const popupRef = ref(null);

	// 打开弹窗的方法
	const openPopup = () => {
		popupRef.value.openPopup();
	};
</script>

<style lang="scss" scoped>
	.expertPage {
		height: 100vh;
		padding-top: 500rpx;
		position: fixed;
		background: $back_blue;
	}

	.in_center {
		padding-top: 20rpx;
		text-align: center;
		margin-bottom: 10rpx;
		font-size: 40rpx;
	}

	.solidLine {
		border: none;
		border-top: 3px solid #bd9375;
		/* 虚线 */
		margin-left: 100rpx;
		margin-right: 100rpx;
	}

	.function-modules {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		padding: 10px;
	}

	.module {
		width: 80vw;
		height: 100rpx;
		display: flex;
		margin-top: 10px;
		justify-content: center;
		padding: 10px;
		border: 1px solid #cad1c3;
		background: rgba(255, 255, 255, 0.6);
		box-sizing: border-box;
		border-radius: 10px;

	}

	.icon2 {
		width: 55rpx;
		height: 55rpx;
		position: absolute;
		margin-top: 10rpx;
		margin-left: 243rpx;

	}
</style>