There are dozens of blogging platforms.  Volumes have been written about Wordpress, Blogger, and the older crowd.  But there are some newbies which are growing quickly and account for a major chunk of the userbase.  Have a look at my top 4 picks.

[Postach.io](http://postach.io)
---
Perhaps you've heard of this Evernote-powered platform, but you probably haven't used it or seen an example of a postach.io blog.

The idea  is that my blog posts are safe on Evernote's (or DropBox's) servers.  Composing posts inside evernote is also quite nice compared to the usual minimal editors.

The overall feel, though, is somewhat lacking in smoothness.  The theme selection is limited and they all seem a little sub-standard.  On the plus side, themes are easy to customize with a built in theme editor.  They are also mostly built using Bootstrap, so changing ths whole structure is simple.

Editing CSS elements requires you to install the theme, view page source, pull up the live stylesheet, and re-implement styles in an "override" section.  

####Pros:
* Markdown support
* Free support for custom domains
* Evernote backup of posts
* Themes build on bootstrap
####Cons:
* Themes are underdeveloped
* No third-party themes

If you like the idea of hosting an Evernote notebook as a blog, go for it.  This is probably your current best free option for blogging.  See my example at http://subdavis.postach.io

[Compose](http://TryCompose.com)
---
Compose is perhaps the newest of the new contenders.  It is still in public beta, but with active development and steady improvment, Compose could rival Wordpress.com blogs.  They have an excellent feature comparison chart at the bottom of the homepage [here](http://trycompose.com).

If postach.io's themes are a little rough around the edges, Compose is still in the stone age of responsive design.  Their admin panel is lacking some basic features like themes.  The post composer has two columns like Ghost - one for writing and one for preview.

####Pros:
* Markdown Support
* Custom domains, and unlimited free subdomains
* Syntax highlighting for code!
####Cons:
* No way to switch themes (but the feature is being developed)
* Looks pretty average.
* Still buggy like a public beta should be.

While I don't recommend using Compose just yet, it is defilitely a platform to watch out for.  View my example blog at http://subdavis.trycompose.com

[Ghost](http://ghost.org)
---
You may have discovered that this blog runs on Ghost.  I am self-hosting, but hosting with Ghost begins at $5 a month.  This is the only paid service on my list, and is well worth the money.

Everything from the post composer to the actual blog is clean and minimal.  The admin panel is somewhat devoid of all the bells and whistles you would expect coming from wordpress, but I find that everything I want or need is here.

If you should choose to self-host, the install is not as simple as somethign like wordpress.  You need to first install Node.js and NPM.  I also recommend that you serve Ghost behind an Nginx proxy.  Setup can be a bit tricky, but everything is very well documented - don't let that deter you.

####Pros:
* Gorgeous themes and admin panel
* Markdown not only supported but executed beautifully
* Ability to self-host
* Link structure is simple, and permalinks won't break like Wordpress
####Cons:
* $5 a month for cloud hosting
* Self-hosted install is tricky
* No built-in google analytics support

I highly recommend Ghost, and encourage you to self-host with a cheap (I pay $15 per year) VPS.  An excellent list of cheap hosts can be found at [lowendbox.com](http://lowendbox.com)

[Anchor](http://anchorcms.com)
---
Anchor is only available to self-host.  I have not used it myself so my impression is only what can be gleaned from their website.  It seems fairly mature, dating back to at least 2011.  The project is entirely open source and can be found on [GitHub](https://github.com/anchorcms/anchor-cms).

There is a wealth of attractive themes at [anchorthemes.com](http://anchorthemes.com/), but the defaul leaves plenty to be desired.  An example blog can be seen at [blog.anchorcms.com](http://blog.anchorcms.com/)
####Pros:
* Very lightweight (>150kb)
* Supports Markdown
* Claims Simple 2-minute install
####Cons:
* No free hosting available
* Not the most attrictive option, comperable to postach.io

###Who didn't make the cut?
#####Tumblr
Tumblr is old.  It has evolved into a social network, imgur, reddit, and porn all rolled into one.  What's more, I couldn't find anything I needed in their dashboard without digging for it or googling it.  Markdown support was implemented rather badly (still in beta though).
#####Blogger
I used blogger longer than any other platform.  Looking back, I have absolutely no idea why.  I suppose I had a less minimalistic attitude then, and wanted to fit things like my twitter feed, recent posts, and tags all on the homepage.  As if anyone cared about those things...
#####Medium
You don't really have a blog with Medium. You just sort of have articles that float around with little ownership.  You also cannot costomize the look of the blog you don't have.  So there's that.  Perhaps their communist-style blogging will catch on in the future.  I cannot currently wrap my mind around it.
####Pen.io
It isn't for blogging at all.  I'm rather confused about what it is.
