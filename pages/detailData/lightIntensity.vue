<template>
  <div ref="myChart"></div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts';
import axios from 'axios';

const myChart = ref(null);
// 请替换为实际的光照强度数据接口地址
const apiUrl = 'http://192.168.20.237:8080/getLightTop10';

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
        lightIntensity: item.lightIntensity
      };
    });

    const xAxisData = processedData.map(item => item.monthDayHour);
    const seriesData = processedData.map(item => item.lightIntensity);
	xAxisData.reverse();
	seriesData.reverse();
    const option = {
      title: { text: '详细光照强度信息' },
      tooltip: {
        trigger: 'axis',
        triggerOn: 'touchstart',
        formatter: (params) => `${params.name}<br>光照强度: ${params.value}`
      },
      legend: { data: ['光照强度'] },
      grid: {
        left: '3%',
        right: '8%',
        bottom: '3%',
        containLabel: true
      },
      toolbox: { feature: { saveAsImage: {} } },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xAxisData,
        axisLabel: {
          textStyle: {
            fontSize: 10
          },
          rotate: 45
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: { formatter: '{value}' }
      },
      series: [
        {
          name: '光照强度',
          type: 'line',
          symbol: 'circle',
          symbolSize: 12,
          emphasis: { symbolSize: 16 },
          data: seriesData
        }
      ]
    };

    option && echartInstance.setOption(option);

    echartInstance.on('click', (params) => {
      console.log('点击时间:', params.name, '光照强度:', params.value);
    });

    echartInstance.on('longpress', (params) => {
      console.log('长按时间:', params.name, '光照强度:', params.value);
    });
  } catch (error) {
    console.error('数据获取失败:', error);
  }
});
</script>

<style scoped>
div {
  width: 100%;
  height: 400px;
  touch-action: none;
}
</style>    