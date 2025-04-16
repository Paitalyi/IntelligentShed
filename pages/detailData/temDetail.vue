<template>
	<div ref="myChart"></div>
</template>

<script setup>
	import {
		onMounted,
		ref
	} from 'vue';
	import * as echarts from 'echarts';
	import axios from 'axios';
	import { useFetch } from '../../composables/useFetch';

	const myChart = ref(null);
	// 请将此替换为实际的后端接口地址
	const { baseUrl } = useFetch();
	const relativeUrl = '/getTempTop10';
	const apiUrl = `${baseUrl}${relativeUrl}`;

	onMounted(async () => {
		const chartDom = myChart.value;
		const echartInstance = echarts.init(chartDom);

		try {
			const response = await axios.get(apiUrl);
			const rawData = response.data;

			const processedData = rawData.map(item => {
				const [datePart, timePart] = item.createdAt.split(' ');
				const [, month, day] = datePart.split('-');
				const hour = timePart.split(':')[0];
				const monthDayHour = `${month}-${day} ${hour}时`;
				return {
					monthDayHour,
					temperature: item.temperature
				};
			});


			const xAxisData = processedData.map(item => item.monthDayHour);
			const seriesData = processedData.map(item => item.temperature);
			xAxisData.reverse();
			seriesData.reverse();
			const option = {
				title: {
					text: '详细温度信息'
				},
				tooltip: {
					trigger: 'axis',
					triggerOn: 'touchstart',
					formatter: (params) => `${params.name}<br>温度: ${params.value}°C`
				},
				legend: {
					data: ['Temperature']
				},
				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true
				},
				toolbox: {
					feature: {
						saveAsImage: {}
					}
				},
				xAxis: {
					type: 'category',
					boundaryGap: false,
					data: xAxisData,
					axisLabel: {
						textStyle: {
							fontSize: 12
						},
						rotate: 45
					},

				},
				yAxis: {
					type: 'value',
					axisLabel: {
						formatter: '{value}°C'
					}
				},
				series: [{
					name: 'Temperature',
					type: 'line',
					symbol: 'circle',
					symbolSize: 12,
					emphasis: {
						symbolSize: 16
					},
					data: seriesData
				}],
				grid: {
					left: '3%',
					right: '8%', // 增大右侧边距，可根据实际情况调整
					bottom: '3%',
					containLabel: true
				}
			};

			option && echartInstance.setOption(option);

			echartInstance.on('click', (params) => {
				console.log('点击时间:', params.name, '温度:', params.value);
			});

			echartInstance.on('longpress', (params) => {
				console.log('长按时间:', params.name, '温度:', params.value);
			});
		} catch (error) {
			console.error('数据获取失败:', error);
		}
	});
</script>

<style scoped>
	div {
		width: 95%;
		height: 400px;
		touch-action: none;

	}
</style>