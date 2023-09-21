<template>
  <div class="flex flex-col lg:flex-row">
    <Toolbar />
    <div
      class="
        blurb bg-primary-800 w-fill flex
        flex-col justify-center items-center lg:items-start
        pl-10 pr-6 lg:pr-0
        pt-6 lg:pt-0
        text-secondary-200"
    >
      <div class="profile mb-2">
        <img src="https://avatars.githubusercontent.com/u/4214172">
      </div>
      <h1 class="text-4xl font-bold -mb-3">
        Brandon Davis
      </h1>
      <h2 class="text-xl font-bold text-secondary-500 mb-2">
        brandon@<span style="display: none;">&nbsp;</span>subdavis.com
      </h2>
      <h3
        class="blurb-paragraph text-sm md:text-base"
        role="complementary"
      >
        web developer, apparently.  he/him.  i love to get email from humans.
      </h3>
      <links />
    </div>
    <div class="main lg:h-screen lg:overflow-auto w-full bg-secondary-900">
      <div class="container flex flex-col mx-auto px-8 pb-4 lg:mt-4 xl:px-12">
        <sub-title text="Projects" />
        <project-template
          img="site.png"
          title="This Website!"
          subtitle="Vue.js, Nuxt, Tailwind"
          href="https://github.com/subdavis/subdavis.github.io"
          text="This website was built with Vue.js, Tailwind CSS, and Nuxt.
            I created it as a way to get familiar with the capabilities of Tailwind
            and Nuxt.  My last personal site was a table-layout throwback
            intended to render well in text-based browsers like lynx and links."
        />
        <project-template
          img="wio.png"
          title="WorkspacesIO"
          subtitle="Python, FastApi, Vue 3"
          href="https://github.com/subdavis/workspaces-io"
          text="WorkspacesIO is a data management tool built on MinIO, ElasticSearch,
          and Filestash.app that provides excellent browser and command line interfaces
          for managing data collections called workspaces.  It uses AWS STS tokens
          to provide coarse-grained access control that allows client tooling
          to interact directly with the storage backend."
        />
        <project-template
          img="kobodl.png"
          title="kobodl"
          subtitle="Python, Flask, Tailwind CSS"
          href="https://github.com/subdavis/kobo-book-downloader"
          text="kobodl is a command-line tool and web service to download and
            remove DRM from books purchased from kobo.com. I forked it from another project
            to add audiobook support, multi-user support, a web interface,
            and create proper distribution packages with pypi and docker."
        />
        <project-template
          img="selfhosted.png"
          title="Hosted Service Configurations"
          subtitle="Docker, Compose, Traefik"
          href="https://github.com/subdavis/selfhosted"
          text="This is a git repository where I keep compose configurations for all
            the services I host.  It's also a tutorial for how to set these services
            up, and represents a lot of time and research about how to best
            configure docker and traefik.  /r/selfhosted provided a lot of inspiration."
        />
        <project-template
          img="fish.png"
          title="VIAME Web"
          subtitle="Vue.js, Vuetify, Typescript"
          href="https://github.com/VIAME/VIAME-web"
          text="I am currently engaged in several projects that involve displaying
            and editing track annotations over video in the browser.  Challenges
            include rendering performance and managing code complexity, as traditional
            MVC patterns often lead to performance bottlenecks."
        />
        <project-template
          img="tusk.png"
          title="Keepass Tusk"
          subtitle="JavaScript, Webpack"
          href="https://subdavis.com/Tusk"
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
          subtitle="Pug, Grunt, CSS"
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
          subtitle="C++"
          href="https://github.com/suBDavis/raytracer"
          text="I implemented a basic ray tracer in C++ to render spheres
            and planes with reflective surfaces and colors.  Because ray
            tracing is computationally expensive, I also created a low-resolution
            ASCII renderer to do scene setup from the command line."
        />
        <project-template
          img="life.png"
          title="Conway's Game of Life"
          subtitle="JavaScript"
          href="https://subdavis.com/life"
          text="I implemented an infinite version of the classic Conway's Game
            in native javascript. This is one of the first pieces of code
            I was ever proud of, and the project was my first foray into browser
            animation with canvases."
        />
        <project-template
          img="jank.png"
          title="OpenCV Flight Simulator"
          subtitle="C++, Python"
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
          subtitle="Python, Google Sheets"
          href="https://github.com/HackNC/hacknotify"
          text="This is a command-line tool for sending SMS notifications to
            hackathon participants based on live-updating Google sheets.  At the
            time, I was interested in 'serverless' apps that used Google sheets
            as a persistence layer to avoid configuring more complex document stores.
            I used this tool during HackNC 2016."
        />
        <sub-title text="External Links" />
        <ExternalLinks />
      </div>
    </div>
  </div>
</template>

<script setup>
import Links from '@/components/Links.vue'
import ProjectTemplate from '@/components/ProjectTemplate.vue'
import Toolbar from '@/components/Toolbar.vue'
import ExternalLinks from '@/components/ExternalLinks.vue'
import SubTitle from '@/components/SubTitle.vue'
</script>

<style scoped>
.profile img {
  width: 180px;
  height: 180px;
  border-radius: 50%;
}

.blurb {
  background: linear-gradient(340deg,
    theme('colors.primary'),
    theme('colors.accent'));
}

@screen lg {
  .blurb {
    min-width: 400px;
    max-width: 400px;
  }
}
</style>
