<template>
  <div class="page flex flex-col lg:flex-row">
    <toolbar />
    <div
      class="
        py-12
        blurb bg-primary-800
        w-fill flex flex-col justify-center
        pl-10"
    >
      <div class="profile mb-3">
        <img src="~/assets/img/li.jpeg">
      </div>
      <h1 class="text-4xl text-secondary-200 font-bold">Brandon Davis</h1>
      <h2
        class="blurb-paragraph text-lg text-secondary-200"
        role="complementary"
      >
        I'm just a UNC alum transplanted to D.C. and masquerading as a
        software developer. I ❤ good journalism, experimenting with code,
        discovering new places, and reading about space exploration.
        I find joy in creation and simple design.
      </h2>
    </div>
    <div class="slice">&nbsp;</div>
    <div class="main overflow-auto w-full">
      <div class="container py-12 flex flex-col justify-left">

        <div
          v-for="i in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
          :key="i"
          class="flex flex-row m-4 mr-10"
        >
          <img class="card-image z-10 my-4" src="~/assets/img/hacknc.png">
          <div class="z-0 flex flex-col rounded bg-secondary-400  border-secondary-900 p-3 pl-16 -ml-12">
            <div class="text-secondary-900 text-xl font-bold">Welcome to new York</div>
            <div class="text-secondary-800">
              Lorem ipsum dolor sit amet, consectetur adipiscing
              elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis
              nostrud</div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import Toolbar from '@/components/Toolbar.vue'
export default {
  components: { Toolbar }
}
</script>

<style>
.profile img {
  width: 180px;
  height: 180px;
  background-color: white;
  border-radius: 50%;
}
.page {
  height: 100vh;
}

.slice {
  min-height: 45px;
  background: linear-gradient(177deg,
      theme('colors.primary.800') 0%,
      theme('colors.primary.800') 50%,
      rgba(255,255,255,0) 50%);
}

.card-image {
  min-width: 100px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  background-color: theme('colors.primary.800');
  border: 3px solid theme('colors.primary.800');
}

@screen lg {
  .blurb {
    min-width: 400px;
    max-width: 400px;
  }

  .slice {
    width: 80px;
    min-height: 100vh;
    max-height: 100vh;
    background: rgb(2,0,36);
    background: linear-gradient(87deg,
      theme('colors.primary.800') 0%,
      theme('colors.primary.800') 50%,
      rgba(255,255,255,0) 50%);
  }
}
</style>
