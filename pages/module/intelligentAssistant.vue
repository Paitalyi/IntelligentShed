<template>
	<view>
		<!-- 这里可以放置组件的其他内容 -->

		<web-view :src="webViewSrc"></web-view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';

	// 定义 web-view 要加载的 URL
	const webViewSrc = ref('http://192.168.20.25:8080/ui/chat/f5a9c66c6cd74352');
</script>

<style scoped>
	/* 这里可以添加组件的样式 */
	web-view {
		width: 100%;
		height: 100vh;
		/* 设置 web-view 的高度为视口高度 */
	}
</style>