# DorkMyShit
*(latest update: v1.1.0)*

A Chrome extension that allows you to restrict Google searches to your favorite bookmarks. The idea comes from the need to limit Google searches on specific topics to blogs of people/companies that have published articles of interest on the topic being searched for, thereby avoiding falling into useless links from companies that only sell fluff but pay a lot of money to have their pages appear first.

## How to install it?

Clone the repo or download it as a zip file:
```
git clone https://github.com/serrapa/DorkMyShit.git
```

Then:
1. open [chrome://extensions/](chrome://extensions/)
2. enable the developer mode 
3. click on **load unpackaged extension**
4. choose the folder you have just downloaded (should be unzipped)


## How does it work?
First, you need to set a default bookmark directory from the settings (the default is ***Blog***) since the extension will rely on it to obtain the domains you want to limit the searches for. Then, the extension will build the google dorks based on the selected bookmarks.

<img width="47%"  src="images/bookmarks.png"> <img  width="50%" src="images/extension.png">

The extension will create the following google dork while searching for `certificate pinning`:
<img alt="image" src="images/example.png"> 

Inside the default directory, you can have as many subdirectories as you want, for example, you can divide people from companies, or among different topics.

At the moment, the extension shows some icons for certain bookmarks based on their name:
- if the bookmark name is something like "Android - User 1", the extension replaces the "Android - " part with the Android icon. 
- if the bookmark name is something like "Web / Mobile - User 1", the extension replaces the "Web / Mobile - " part with the web and mobile icons. 

### Supported Icons
- Android
- iOS
- Mobile
- Web
- API