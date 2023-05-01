// Dichiarazione della variabile booleana
let tabUrlUpdated = null;

// Funzione ricorsiva per cercare la cartella Blog
async function findBlogFolder(bookmarkNodes) {
  for (let i = 0; i < bookmarkNodes.length; i++) {
    let bookmarkNode = bookmarkNodes[i];
    if (bookmarkNode.title === 'Blog' && bookmarkNode.url === undefined) {
      return bookmarkNode;
    } else if (bookmarkNode.children) {
      let result = await findBlogFolder(bookmarkNode.children);
      if (result) {
        return result;
      }
    }
  }
  return null;
}

// Funzione per ottenere la Google Dork dalla cartella dei bookmarks
async function getGoogleDorkFromBookmarks() {
  let googleDork = '';
  
  // Recupera la cartella Blog
  let blogFolder = await findBlogFolder(await chrome.bookmarks.getTree());

  if (blogFolder) {
    // Recupera tutti i bookmarks all'interno della cartella Blog e delle sue sottocartelle
    let blogBookmarksTree = await chrome.bookmarks.getSubTree(blogFolder.id);
    let blogBookmarks = getFlatBookmarksList(blogBookmarksTree[0]);
    
    // Genera la Google Dork
    googleDork = blogBookmarks.reduce((dork, bookmark) => {
      return dork + ' site:' + bookmark.url.replace("https://","").replace("http://","") + " | ";
    }, '');
  }
  
  return googleDork;
}

// Funzione per ottenere una lista piatta di tutti i bookmarks all'interno di una cartella
function getFlatBookmarksList(folder) {
  let bookmarks = folder.children.filter(child => child.url);
  
  folder.children.filter(child => child.children).forEach(child => {
    bookmarks = bookmarks.concat(getFlatBookmarksList(child));
  });
  
  return bookmarks;
}

// Funzione per verificare se l'estensione è attiva
async function isExtensionEnabled() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['extensionEnabled'], function(result) {
      console.log("Estensione abilitata:",result.extensionEnabled)
      resolve(result.extensionEnabled ?? true);
    });
  });
}


// Aggiunge l'event listener per intercettare gli aggiornamenti delle schede
chrome.tabs.onUpdated.addListener(
  async function(tabId, changeInfo, tab) {
    // Verifica che la scheda non sia già stata aggiornata e che l'estensione sia attiva e che la URL della scheda sia una ricerca Google
    if (await isExtensionEnabled() && tabUrlUpdated != changeInfo.url && changeInfo.url && changeInfo.url.includes('https://www.google.com/search?')) {
      // Imposta la variabile booleana a true per evitare il loop infinito
      tabUpdated = true;

      // Recupera la Google Dork
      let googleDork = await getGoogleDorkFromBookmarks();

      // matches a number, some characters and another number
      const regex = /\ssite:.*\|/

      // Aggiungi la Google Dork alla query di ricerca
      let url = new URL(changeInfo.url);
      let searchParams = new URLSearchParams(url.search);
      
      // Ripulisco dalle google dork precedentemente impostate, se c'erano
      cleanParamQ = searchParams.get('q').replace(regex, "");
      searchParams.set('q', cleanParamQ + googleDork);
      url.search = searchParams.toString();
      
      // Imposta la variabile booleana a true per evitare il loop infinito
      tabUrlUpdated = url.toString()
      
      // Modifica l'URL della scheda
      await chrome.tabs.update(tabId, {url: url.toString()});
    }
  }
);