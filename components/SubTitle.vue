<template>
  <div class="my-4 ml-0 flex items-center">
    <div class="w-8 text-secondary-300">
      <pfund />
    </div>
    <span class="ml-2 text-lg font-bold text-secondary-300 italic">{{ text }}</span>
    <span class="grad rounded flex-grow ml-4" style="height: 4px" />
  </div>
</template>

<script>
import Pfund from '@/components/svgs/Pfund.vue'
export default {
  components: { Pfund },
  props: {
    text: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.grad {
  background: linear-gradient(81deg,
    theme('colors.primary') 0%,
    rgba(255,88,133,1) 100%);
}
</style>
