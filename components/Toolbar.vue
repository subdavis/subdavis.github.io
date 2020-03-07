<template>
  <header class="z-50 fixed w-full flex flex-row justify-between">
    <div>
      <a
        href="https://keybase.io/bdavis"
        class="text-secondary-200 text-base hover:underline font-mono mx-12 my-4 hidden lg:block"
      >
        <fa
          class="mx-1 text-2xl"
          :icon="['fab', 'keybase']"
        />
        <span>098A</span>
        <span>BBEB</span>
        <span>CF1F</span>
        <span>B633</span>
      </a>
    </div>
    <div class="text-secondary-200 lg:text-primary-800 text-2xl mx-12 my-4 p-1 lg:bg-white rounded">
      <fa
        class="mx-1"
        :icon="['fab', 'github']"
      />
      <fa
        class="mx-1"
        :icon="['fab', 'twitter']"
      />
      <fa
        class="mx-1"
        :icon="['fab', 'linkedin']"
      />
    </div>
  </header>
</template>
