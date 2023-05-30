# DorkMyShit

A Chrome extension to limit your Google searches to your favorite bookmarks. The idea stems from the need to restrict your Google searches on specific topics only to the blogs of people and/or companies that have published articles of interest on the topic being searched for, thus avoiding falling onto useless links from companies that only sell crap but pay a lot of money to show their pages first.

The more good people you follow, the more helpful the extension will be.

The extension is now functional, but extra features may be added in the future.

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