<template>
  <div class="flex flex-col lg:flex-row">
    <toolbar />
    <div
      class="
        pt-16 blurb bg-primary-800 w-fill flex
        flex-col justify-center pl-10
        text-secondary-200"
    >
      <div class="profile mb-2">
        <img src="~/assets/img/li.jpeg">
      </div>
      <h1 class="text-4xl font-bold -mb-3">
        Brandon Davis
      </h1>
      <h2 class="text-xl font-bold text-secondary-500 mb-2">
        brandon@subdavis.com
      </h2>
      <h3
        class="blurb-paragraph text-base"
        role="complementary"
      >
        I'm just a UNC alum transplanted to D.C. and masquerading as a
        software developer. I ❤ good journalism, experimenting with code,
        discovering new places, and reading about space exploration.
        I find joy in creation and simple design.
      </h3>
      <links />
    </div>
    <div class="slice">&nbsp;</div>
    <div class="main lg:h-screen lg:overflow-auto w-full">
      <div class="container flex flex-col items-center py-12 xl:p-12">

        <project-template
          img="site.png"
          title="This Website!"
          href="https://github.com/subdavis/subdavis.github.io"
          text="This website was built with Vue.js, Tailwind CSS, and Nuxt.
            I created it as a way to get familiar with the capabilities of Tailwind
            and Nuxt.  My last personal site was a table-layout throwback
            intended to render well in text-based browsers like lynx and links."
        />

        <project-template
          img="uptime.png"
          title="Self-Host Anything"
          href="https://github.com/subdavis/selfhosted"
          text="This is a git repository where I keep systemd configurations for all
            the services I self-host.  It's also a tutorial for how to set these services
            up, and represents a lot of time and research about how to best
            configure docker and systemd to work together.  /r/selfhosted
            provided a lot of inspiration."
        />

        <project-template
          img="girder.png"
          title="Girder Web Components"
          href="https://gwc.girder.org"
          text="GWC is a library of Vuetify + Vue.js components that provide
            interactivity with Kitware's Girder DMS.  They violate traditional
            Vue.js design patterns for the sake of downstream developer ease-of-use
            and feature modularity."
        />

        <project-template
          img="tdm.png"
          title="Videothing and TDM"
          href="https://girder.github.io/tdm/"
          text="I am currently engaged in several projects that involve displaying
            and editing track annotations over video in the browser.  Challenges
            include rendering performance and managing code complexity, as traditional
            MVC patterns often lead to performance bottlenecks."
        />

        <project-template
          img="tusk.png"
          title="Keepass Tusk"
          href="https://subdavis.com/tusk"
          text="Tusk is a browser extension for filling passwords from a
            KeePass database stored in the cloud. I didn't start this project
            (it began as CKP) but I created a fork with a new UI since the
            original project lost steam. You can install Tusk for Chrome or
            Firefox.  I've since abandoned the project due to difficulties
            with cloud storage APIs, particularly Google Drive."
        />

        <project-template
          img="hacknc.png"
          title="HackNC"
          href="https://fall2016.hacknc.com/"
          text="In the summer and fall of 2016, I lead the development team to
            build the website for HackNC, the annual undergraduate-run
            hackathon at UNC Chapel Hill.  This is the first decent bit of web
            design I was involved in, and my first time working alongside a
            talented dsgraphic designer."
        />

        <project-template
          img="spinbetter.gif"
          title="Ray Tracer"
          href="https://github.com/suBDavis/raytracer"
          text="I implemented a basic ray tracer in C++ to render spheres
            and planes with reflective surfaces and colors.  Because ray
            tracing is computationally expensive, I also created a low-resolution
            ASCII renderer to do scene setup from the command line."
        />

        <project-template
          img="life.png"
          title="Conway's Game of Life"
          href="https://subdavis.com/life"
          text="I implemented an infinite version of the classic Conway's Game
            in native javascript. This is one of the first pieces of code
            I was ever proud of, and the project was my first foray into browser
            animation with canvases."
        />

        <project-template
          img="jank.png"
          title="OpenCV Flight Simulator"
          href="https://www.youtube.com/watch?v=CkQPBO49I04&feature=youtu.be"
          text="Hardly worth mentioning, except that it was so much fun.  My friend
            and I hacked a joystick out of pipe cleaners and puff balls and used
            OpenCV tracking to use it to steer a flight simulator.  The project was
            thrown together at Bitcamp where judges didn't even bother to look at us
            because we weren't competing for any sponsored prizes.  But I'm not bitter."
        />

        <project-template
          img="hacknotify.png"
          title="HackNotify"
          href="https://github.com/HackNC/hacknotify"
          text="This is a command-line tool for sending SMS notifications to
            hackathon participants based on live-updating Google sheets.  At the
            time, I was interested in 'serverless' apps that used Google sheets
            as a persistence layer to avoid configuring more comptdlex document stores.
            I used this tool during HackNC 2016."
        />

      </div>
    </div>
  </div>
</template>

<script>
import Links from '@/components/Links.vue'
import ProjectTemplate from '@/components/ProjectTemplate.vue'
import Toolbar from '@/components/Toolbar.vue'

export default {
  components: {
    Links,
    ProjectTemplate,
    Toolbar
  }
}
</script>

<style scoped>
.profile img {
  width: 180px;
  height: 180px;
  border-radius: 50%;
}

.slice {
  min-height: 45px;
  background: linear-gradient(177deg,
      theme('colors.primary.800') 0%,
      theme('colors.primary.800') 50%,
      rgba(255,255,255,0) 50%);
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
      rgba(255,255,255,1) 50%);
  }
}
</style>
