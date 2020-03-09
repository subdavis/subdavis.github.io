<template functional>
  <div class="flex flex-row ml-2 m-4 text-white">
    <a
      class="mx-4 ml-0 external-link bg-primary-500
        hover:bg-primary-600 cursor-pointer
        flex items-center justify-center border-2 border-primary-600"
      href="http://forrestli.com"
    >
      forrestli.com
    </a>
    <a
      class="mx-4 ml-0 external-link bg-accent-500
        hover:bg-accent-600 cursor-pointer
        flex items-center justify-center border-2 border-accent-600"
      href="http://hgreer.com"
    >
      hgreer.com
    </a>
    <a
      class="mx-4 ml-0 external-link bg-secondary-600
        hover:bg-secondary-700 cursor-pointer
        flex items-center justify-center border-2 border-secondary-700"
      href="https://apod.nasa.gov/apod/astropix.html"
    >
      apod.nasa.gov
    </a>
  </div>
</template>

<style scoped>
.external-link {
  width: 140px;
  height: 50px;
  border-radius: 0.4rem;
}
</style>
