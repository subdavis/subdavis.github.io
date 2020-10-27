<template functional>
  <div class="flex flex-row my-4">
    <img
      class="card-image z-10 my-4"
      :src="require(`~/assets/img/${props.img}`)"
    >
    <div
      class="
        z-0 flex flex-col rounded bg-secondary-400
        border-secondary-900 p-3 pl-16 -ml-12"
    >
      <div class="text-secondary-900 text-lg font-bold items-center">
        <a
          v-if="props.href"
          :href="props.href"
          class="underline inline"
        >{{ props.title }}</a>
        <span v-else>{{ props.title }}</span>
        <div class="text-sm text-primary-800 block sm:inline sm:ml-2">
          [{{ props.subtitle }}]
        </div>
      </div>
      <div class="text-secondary-800 text-sm md:text-base">
        {{ props.text }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-image {
  min-width: 100px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  background-color: theme('colors.secondary.100');
  border: 3px solid theme('colors.primary.800');
}
.card-title-slot {
  display: inline-flex;
}
</style>
