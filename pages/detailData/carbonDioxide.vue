<template>
  <div ref="myChart"></div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts';
import axios from 'axios';

const myChart = ref(null);
// 请替换为实际的 CO₂ 数据接口地址
const apiUrl = 'http://192.168.20.237:8080/getCo2Top10';

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
        co2: item.co2
      };
    });

    // 按时间排序数据
    processedData.sort((a, b) => {
      const timeA = new Date(`2025-${a.monthDayHour.replace('时', '')}`).getTime();
      const timeB = new Date(`2025-${b.monthDayHour.replace('时', '')}`).getTime();
      return timeA - timeB;
    });

    const xAxisData = processedData.map(item => item.monthDayHour);
    const seriesData = processedData.map(item => item.co2);

    const option = {
      title: { text: '详细 CO₂ 信息' },
      tooltip: {
        trigger: 'axis',
        triggerOn: 'touchstart',
        formatter: (params) => `${params.name}<br>CO₂ 含量: ${params.value}`
      },
      legend: { data: ['CO₂ 含量'] },
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
          name: 'CO₂ 含量',
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
      console.log('点击时间:', params.name, 'CO₂ 含量:', params.value);
    });

    echartInstance.on('longpress', (params) => {
      console.log('长按时间:', params.name, 'CO₂ 含量:', params.value);
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