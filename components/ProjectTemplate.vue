<template>
  <div class="flex flex-row my-4">
    <NuxtImg
      class="card-image z-10 my-4"
      :src="`/img/${img}`"
      :style="{ objectFit: objectFit || 'cover' }"
    />
    <div
      class="
        z-0 flex flex-col rounded bg-secondary-800
        border-secondary-900 p-3 pl-16 -ml-12"
    >
      <div class="text-secondary-100 text-lg font-bold items-center">
        <a
          v-if="href"
          :href="href"
          class="underline inline"
        >{{ title }}</a>
        <span v-else>{{ title }}</span>
        <div class="text-sm text-primary-400 block sm:inline sm:ml-2">
          [{{ subtitle }}]
        </div>
      </div>
      <div class="text-secondary-100 text-sm md:text-base">
        {{ text }}
      </div>
      <div class="mt-2 flex flex-row">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  img: String,
  title: String,
  subtitle: String,
  text: String,
  href: String,
  objectFit: String,
})
</script>

<style scoped>
.card-image {
  min-width: 100px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  padding: 2px;
  background-color: theme('colors.secondary');
  border: 3px solid theme('colors.primary');
}
</style>
