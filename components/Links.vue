<template>
  <div id="links" class="my-4 inline-flex flex-row items-center text-xl">
    <a class="mr-3" href="https://github.com/subdavis">
      <fa :icon="['fab', 'github']" />
    </a>
    <a class="mr-3" href="https://www.linkedin.com/in/subdavis/">
      <fa :icon="['fab', 'linkedin']" />
    </a>
    <a class="mr-3" href="https://www.goodreads.com/user/show/103087534-brandon">
      <fa :icon="['fab', 'goodreads']" />
    </a>
    <a
      href="/history/key.txt"
      class="gpg inline-flex flex-row items-center"
    >
      <span class="ml-2 mt-1 text-sm font-mono">
        <span>44DD</span>
        <span>0B07</span>
        <span>4C0F</span>
        <span>6F91</span>
      </span>
    </a>
  </div>
</template>

<script></script>

<style scoped>
.gpg:hover > span > span {
  text-decoration: underline;
}
</style>
