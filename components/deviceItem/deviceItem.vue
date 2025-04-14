<template>
	<view class="module">
		<view class="linearLayout">
			<view class="horizontalLayout">
				<image class="icon" :src="icon"></image>
				<view class="text_block1">
					{{name}}
				</view>
				<switch class="switch" :modelValue="isSwitchOpen" @change="switchChange" :checked="isSwitchOpen" :disabled="isDisabled"/>
			</view>
			<!--文本部分-->
			<view class="text_block2">
				{{description}}
			</view>
		</view>
	</view>
</template>

<script setup>
	const {
		name,
		icon,
		description,
		isSwitchOpen,
		switchChange,
		isDisabled=false
	} = defineProps(['name', 'icon', 'description', 'isSwitchOpen', 'switchChange', 'isDisabled']);
</script>

<style scoped>
	.module {
		display: flex;
		width: 86vw;
		height: 260rpx;
		margin-top: 50rpx;
		padding: 10px;
		border: 2px solid #9c9c9c;
		background: $light_blue;
		box-sizing: border-box;
		border-radius: 10px;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;

	}

	.icon {
		padding-left: 10rpx;
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

	.linearLayout {
		width: 100%;
		display: flex;
		flex-direction: column;
	}

	.horizontalLayout {
		display: flex;
		flex-direction: row;
		background: $light_blue;
	}
</style>