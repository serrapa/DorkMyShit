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
1. open [chrome://extensions/](chrome://extensions/)
2. click on **load unpackaged extension**


## How does it work?
First, you must have a bookmarks directory named ***Blog***, since the extension will rely on it to obtain the website domain and construct the Google dorks based on it, confining your searches.

<img width="468" height="300" alt="image" src="images/bookmarks.png"> <img width="468" height="300" alt="image" src="images/extension.png">

The extension will create the following google dork while searching for `certificate pinning`:
<img alt="image" src="images/example.png"> 

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