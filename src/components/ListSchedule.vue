<script setup lang="ts">
import { computed } from 'vue';
import { Schedule } from '../models/schedule';
import ListTaskBean from './ListTaskBean.vue';

const props = defineProps<{
    schedule: Schedule;
}>()

const beanTexts = () => {
  let texts = []
  let {schedule} = props
  // print(schedule.rules)
  schedule.rules.forEach(rule => {
    texts.push(String(rule.type))
  })

  return texts
}

</script>

<template>
<div class="list-schedule">
  <div class="list-schedule-top">
    <p class="list-schedule-title">{{ schedule.title }}</p>
  </div>
  <div class="list-schedule-bottom">
    <ListTaskBean v-for="beanText in beanTexts()" :text="beanText"></ListTaskBean>
  </div>
</div>
</template>

<style scoped>
.list-schedule {
  display: flex;
  flex-direction: column;
  background: var(--theme-back-2);
  border-radius: 15px;
  width: calc(100% - 30px);
  min-height: 100px;
  max-height: 100px;
  padding: 15px;
  gap: 15px;
}

.list-schedule-title {
  font-size: 35px;
  font-weight: bold;
  color: var(--theme-text-1);
}

.list-schedule-bottom {
  display: flex;
  gap: 8px;
}
</style>
