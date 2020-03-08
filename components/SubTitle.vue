<template>
  <div class="m-4 ml-0 flex items-center">
    <div class="w-8 text-secondary-700">
      <pfund />
    </div>
    <span class="ml-2 text-lg font-bold text-secondary-700 italic">{{ text }}</span>
    <span class="grad rounded flex-grow ml-4" style="height: 4px"></span>
  </div>
</template>

<script>
import Pfund from '@/components/svgs/Pfund.vue'
export default {
  components: { Pfund },
  props: ['text']
}
</script>

<style scoped>
.grad {
  background: linear-gradient(81deg,
    theme('colors.primary.800') 0%,
    rgba(255,88,133,1) 100%);
}
</style>
