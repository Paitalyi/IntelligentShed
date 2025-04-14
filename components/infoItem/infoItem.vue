<template>
	<view class="info_show">
		{{name}}:
		<view class="show_number" :style="{ color: getColor(obj.status) }">
			{{obj.currentValue}}
		</view>
		<view class="unit_symbol">
			{{unit}}
		</view>
	</view>
</template>

<script setup>
	const {
		name,
		unit,
		obj
	} = defineProps(['name', 'unit', 'obj'])
	
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
</script>

<style scoped>
	.info_show {
		width: 90%;
		height: 150rpx;
		padding-left: 22rpx;
		padding-top: 12rpx;
		border-radius: 10px;
		display: flex;
		flex-direction: row;
		position: relative;
		background-color: transparent;
	}

	.unit_symbol {
		position: absolute;
		left: 400rpx;
	}

	.show_number {
		position: absolute;
		left: 290rpx;
	}
</style>