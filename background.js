// Dichiarazione della variabile booleana
let tabUrlUpdated = null;

// Funzione per ottenere i bookmarks dal LocalStorage
async function _getBookmarksSelectedFromLocalStorage() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['bookmarksSelected'], function(result) {
      resolve(result.bookmarksSelected ?? null);
    });
  });
}
// Funzione ricorsiva per cercare la cartella Blog
async function _findBlogFolder(bookmarkNodes) {
  for (let i = 0; i < bookmarkNodes.length; i++) {
    let bookmarkNode = bookmarkNodes[i];
    if (bookmarkNode.title === 'Blog' && bookmarkNode.url === undefined) {
      return bookmarkNode;
    } else if (bookmarkNode.children) {
      let result = await _findBlogFolder(bookmarkNode.children);
      if (result) {
        return result;
      }
    }
  }
  return null;
}
// Funzione per ottenere una lista piatta di tutti i bookmarks all'interno di una cartella
function _getFlatBookmarksList(folder) {
  let bookmarks = folder.children.filter(child => child.url);
  folder.children.filter(child => child.children).forEach(child => {
    bookmarks = bookmarks.concat(_getFlatBookmarksList(child));
  });
  return bookmarks;
}
async function _getAllBokkmarks(){
  // Recupera la cartella Blog
  let blogFolder = await _findBlogFolder(await chrome.bookmarks.getTree());
  if (blogFolder) {
    // Recupera tutti i bookmarks all'interno della cartella Blog e delle sue sottocartelle
    let blogBookmarksTree = await chrome.bookmarks.getSubTree(blogFolder.id);
    let blogBookmarks = _getFlatBookmarksList(blogBookmarksTree[0]);
    return blogBookmarks
  }
  return null
}

// Funzione per ottenere la Google Dork dai bookmarks selezionati
async function createGoogleDork() {
  let googleDork = '';
  // Recupera i bookmark selezionati dall'utente
  let blogBookmarks = await _getBookmarksSelectedFromLocalStorage();
  if(blogBookmarks){
    // Creo le google dork dai bookmarks
    googleDork = blogBookmarks.reduce((dork, bookmark) => {
      return dork + ' site:' + bookmark.url.replace("https://","").replace("http://","") + " | ";
    }, '');
  }
  return googleDork;
}
// Funzione per verificare se l'estensione è attiva
async function isExtensionEnabled() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['extensionEnabled'], function(result) {
      resolve(result.extensionEnabled ?? true);
    });
  });
}
// Funzione per l'initialization
async function init(){
  // Disattivo l'estensione
  await chrome.storage.local.set({extensionEnabled: false});

  // Inserisco tutti i bookmarks nel LocalStorage
  await chrome.storage.local.set({bookmarksSelected: await _getAllBokkmarks()});


  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    (async () => {
      let bookmarks = await _getBookmarksSelectedFromLocalStorage();
      // 2. A page requested bookmarks, respond with a copy of `bookmarks`
      if (request.getAllBookmarks) {
        bookmarks = await _getAllBokkmarks()
        sendResponse( bookmarks);
      }else if(request.getSelectedBookmarks){
        bookmarks = await _getBookmarksSelectedFromLocalStorage()
        sendResponse( bookmarks);
      }else if(request.addItem){
        let bookmarkToAdd = await chrome.bookmarks.get(request.bookmarkId)
        bookmarks.push(bookmarkToAdd[0])
        // Memorizzo i bookmarks nel LocalStorage
        await chrome.storage.local.set({bookmarksSelected: bookmarks});
      }else if(request.removeItem){
        bookmarks = bookmarks.filter(function(bookmark) {
          return bookmark.id !== request.bookmarkId;
        });
        // Memorizzo i bookmarks nel LocalStorage
        await chrome.storage.local.set({bookmarksSelected: bookmarks});
      }else{
        console.error("Not able to store the new bookmarks selection change")
      }
    })();
    return true;
  });
  
}

init()

// Aggiunge l'event listener per intercettare gli aggiornamenti delle schede
chrome.tabs.onUpdated.addListener(
  async function(tabId, changeInfo, tab) {
    // Verifica che la scheda non sia già stata aggiornata e che l'estensione sia attiva e che la URL della scheda sia una ricerca Google
    if (await isExtensionEnabled() && tabUrlUpdated != changeInfo.url && changeInfo.url && changeInfo.url.includes('https://www.google.com/search?')) {

      // Recupera la Google Dork
      let googleDork = await createGoogleDork();

      // Aggiungi la Google Dork alla query di ricerca
      let url = new URL(changeInfo.url);
      let searchParams = new URLSearchParams(url.search);
      
      // Ripulisco dalle google dork precedentemente impostate
      const regex = /\ssite:.*\|/
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