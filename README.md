# DorkMyShit

A Chrome extension that allows you to restrict Google searches to your favorite bookmarks. The idea comes from the need to limit Google searches on specific topics to blogs of people/companies that have published articles of interest on the topic being searched for, thereby avoiding falling into useless links from companies that only sell fluff but pay a lot of money to have their pages appear first.

The more good people you follow, the more helpful the extension will be.

The extension is now functional, but extra features may be added in the future.

## How to install it?

Clone the repo or download it as a zip file:
```
git clone https://github.com/serrapa/DorkMyShit.git
```

Then:
1. open [Extension page](chrome://extensions/)
2. click on **load unpackaged extension**


## How does it work?
First, you must have a directory named Blog on your bookmarks, because the extension will use it and everything inside to generate the Google dorks that will limit your searches.

<img width="468" alt="image" src="images/bookmarks.png"> <img width="506" alt="image" src="images/extension.png">

Inside the blog directory, you can have as many subdirectories as you want, for example, you can divide people from companies, or among different topics.

At the moment, the extension shows some icons for certain bookmarks based on their name:
- if the bookmark name is something like "Android - User 1", the extension replaces the "Android - " part with the Android icon. 
- if the bookmark name is something like "Web / Mobile - User 1", the extension replaces the "Web / Mobile - " part with the web and mobile icons. 

### Supported Icons
- Android
- iOS
- Mobile
- Web
- API