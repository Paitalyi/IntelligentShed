<template>
  <view class="detail-page">
    <text>公告详情页，公告 ID: {{ id }}</text>
  </view>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { getCurrentInstance } from 'vue';

const { proxy } = getCurrentInstance();
const id = ref('111');

onMounted(() => {
  id.value = proxy.$route.query.id;
});
</script>

<style scoped>
.detail-page {
  padding: 20px;
  font-size: 16px;
}
</style>    