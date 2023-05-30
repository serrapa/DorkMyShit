var bookmarksChoices = null;

// Funzione per ottenere i bookmarks dal LocalStorage
async function _getBookmarksSelectedFromLocalStorage() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['bookmarksSelected'], function(result) {
      resolve(result.bookmarksSelected ?? null);
    });
  });
}

function initializeUI(allBookmarks,bookmarksSelected){

  // Aggiungo <option> all'elemento <select>
  let select = document.getElementById('bookmarks');
  allBookmarks.forEach((bookmark) => {
    let option = document.createElement('option');
    option.text = bookmark.title;
    option.value = bookmark.id;
    let isSelected = bookmarksSelected.filter((bmSelected) => {
      return bmSelected.id === bookmark.id
    })
    if(isSelected.length > 0){ option.setAttribute("selected", true)}
    select.add(option);
  });
  // Inizializzo l'elemento Choices
  bookmarksChoices = new Choices('#bookmarks', {
    removeItemButton: true,
    callbackOnCreateTemplates: function (template) {
      const classNames = this.config.classNames;
  
      return {
        item: ({ _classNames }, data) => {
          let icon = '';
          console.log(classNames, data)
          if (data.label && data.label.includes('Web') && data.label.includes('Mobile')) {
            icon = '<img src="../../images/web_16_icon.png" style="width:0.8rem; height:0.8rem; vertical-align: top;"/><img src="../../images/mobile_16_icon.png" style="width:0.8rem; height:0.8rem; vertical-align: top;" class="option-icon">';
          } else if (data.label && ((data.label.includes('iOS') && data.label.includes('Android')) || data.label.includes('Mobile'))) {
            icon = '<img src="../../images/mobile_16_icon.png" style="width: 1rem; height: 1rem; vertical-align: bottom;" class="option-icon">';
          } else if (data.label && data.label.includes('Web')) {
            icon = '<img src="../../images/web_16_icon.png" style="width:0.8rem; height:0.8rem; vertical-align: top;" class="option-icon">';
          }else if (data.label && data.label.includes('API')) {
            icon = '<img src="../../images/api_16_icon.png" style="width:0.8rem; height:0.8rem; vertical-align: top;" class="option-icon">';
          } else if (data.label && data.label.includes('Android')) {
            icon = '<img src="../../images/android_16_icon.png" style="width: 1rem; height: 1rem; vertical-align: top;" class="option-icon">';
          } else if (data.label && data.label.includes('iOS')) {
            icon = '<img src="../../images/ios_16_icon.png" style="width:0.8rem; height:0.8rem; vertical-align: top;" class="option-icon">';
          }
  
          return template(`
            <div class="${classNames.item} ${
              data.highlighted ? classNames.highlightedState : classNames.itemSelectable
            }" data-item data-id="${data.id}" data-value="${data.value}" ${
            data.active ? 'aria-selected="true"' : ''
          } ${data.disabled ? 'aria-disabled="true"' : ''}>
              ${icon} ${data.label.slice(data.label.indexOf("-")+1).trim()} <button type="button" class="${classNames.button}" data-button="" aria-label="Remove item: '${data.value}'">
              Remove item
            </button>
            </div>
          `);
        },
      };
    },
  });


  // Aggiungo i listener per gestire l'aggiunta e la rimozione di un elemento dalla lista
  bookmarksChoices.passedElement.element.addEventListener(
    'addItem',
    function(event) {
      chrome.runtime.sendMessage({addItem: true, bookmarkId: event.detail.value});
    },
    false,
  );
  bookmarksChoices.passedElement.element.addEventListener(
    'removeItem',
    function(event) {
      chrome.runtime.sendMessage({removeItem: true, bookmarkId: event.detail.value});
    },
    false,
  );
}

// Aggiorna il valore salvato nel LocalStorage quando l'utente cambia lo stato del checkbox
$(async function() {
  // Verifica lo stato attuale dell'estensione e imposta il valore dello switch in base allo stato trovato
  await chrome.storage.local.get(['extensionEnabled'], async function(result) {
    const enabled = result.extensionEnabled ?? true;
    if(enabled){
      $('#extensionEnabled').attr('checked', true)
    }else{
      $('#extensionEnabled').attr('checked', false)  
    }

    // Add Listeners to Toggles
    $('#extensionEnabled').change(
      async function() {
        const enabled = $(this).prop('checked');
        if(enabled){
          chrome.action.setIcon({ path: "../../images/icon_16_active.png" })  
        }else{
          chrome.action.setIcon({ path: "../../images/icon_16_stopped.png" })  
        }
        await chrome.storage.local.set({extensionEnabled: enabled});
      }
    )
  });

  const bookmarks = await chrome.runtime.sendMessage({getAllBookmarks: true});
  const bookmarksSelected = await chrome.runtime.sendMessage({getSelectedBookmarks: true});
  if(bookmarks){
    initializeUI(bookmarks,bookmarksSelected);
  }else{
    let bookmarksContainer = document.getElementById('bookmarksContainer');
    bookmarksContainer.innerHTML = "<p> Dir <b>Blog</b> not found in bookmarks. Add it and refresh the extension.</p>"
    $('#extensionEnabled').attr('disabled', true)
  }

})




