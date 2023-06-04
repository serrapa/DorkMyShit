var bookmarksChoices = null;

// Funzione per ottenere i bookmarks dal LocalStorage
async function _getBookmarksSelectedFromLocalStorage() {
  return new Promise((resolve, reject) => {
	chrome.storage.local.get(['bookmarksSelected'], function(result) {
	  resolve(result.bookmarksSelected ?? null);
	});
  });
}

async function initializeUI(bookmarksFolderSelected){
	const allBookmarks = await chrome.runtime.sendMessage({getAllBookmarks: true});
	const bookmarksSelected = await chrome.runtime.sendMessage({getSelectedBookmarks: true});
	console.log(bookmarksFolderSelected, allBookmarks)
	if(!allBookmarks){
		let bookmarksContainer = document.getElementById('bookmarksContainer');
		bookmarksContainer.innerHTML = "<p><b>"+bookmarksFolderSelected[0].title+"</b> directory not found in bookmarks. Add it and refresh the extension.</p>"
		$('#extensionEnabled').attr('disabled', true)
		return
	}

	let bookmarksContainer = document.getElementById('bookmarksContainer');
	bookmarksContainer.innerHTML = `
	<p>Select which bookmark to use:</p> 
	<div class="row d-flex justify-content-center mt-100">
	<div class="col-md-6" >
		<select id="bookmarks" placeholder="Select bookmarks to use for dorking" multiple > </select>
	</div>
	</div>
	`;
	// Aggiungo <option> all'elemento <select>
	let select = document.getElementById('bookmarks');
	allBookmarks.forEach((bookmark) => {
	let option = document.createElement('option');
	option.text = bookmark.title;
	option.value = bookmark.id;
	if(bookmarksSelected){
		let isSelected = bookmarksSelected.filter((bmSelected) => {
		return bmSelected.id === bookmark.id
		})
		if(isSelected.length > 0){ option.setAttribute("selected", true)}
	}
	select.add(option);
	});
	// Inizializzo l'elemento Choices
	bookmarksChoices = new Choices('#bookmarks', {
	removeItemButton: true,
	callbackOnCreateTemplates: function (template) {
		const classNames = this.config.classNames;

		return {
			item: ({ _classNames }, data) => {
				return template(`
					<div class="${classNames.item} ${
						data.highlighted ? classNames.highlightedState : classNames.itemSelectable
					}" data-item data-id="${data.id}" data-value="${data.value}" ${
					data.active ? 'aria-selected="true"' : ''
					} ${data.disabled ? 'aria-disabled="true"' : ''}>
						${getIcon(data.label)} ${data.label.slice(data.label.indexOf("-")+1).trim()} 
						<button type="button" class="${classNames.button}" data-button="" aria-label="Remove item: '${data.value}'">
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

async function initializeSettingsUI(bookmarksFolderSelected){
  const allBookmarks = await chrome.runtime.sendMessage({getAllBookmarksFolders: true});

  let settingsContainer = document.getElementById('settingsContainer');
  settingsContainer.innerHTML = `
  <p>Set the bookmark folder to use as root:</p>
	<select id="bookmarkDefaultFolder" placeholder="Default folder to use" > </select>
  `;
  // Aggiungo <option> all'elemento <select>
  let select = document.getElementById('bookmarkDefaultFolder');
  allBookmarks.forEach((bookmark) => {
	let option = document.createElement('option');
	option.text = bookmark.title;
	option.value = bookmark.id;
	if(bookmarksFolderSelected){
	  let isSelected = bookmarksFolderSelected.filter((bmSelected) => {
		return bmSelected.id === bookmark.id
	  })
	  if(isSelected.length > 0){ option.setAttribute("selected", true)}
	}
	select.add(option);
  });
  // Inizializzo l'elemento Choices
  settingsChoices = new Choices('#bookmarkDefaultFolder', {
	removeItemButton: false,
  });


  // Aggiungo i listener per gestire l'aggiunta e la rimozione di un elemento dalla lista
  settingsChoices.passedElement.element.addEventListener(
	'addItem',
	function(event) {
	  chrome.runtime.sendMessage({setFolder: true, bookmarkId: event.detail.value});
	},
	false,
  );
}

// Aggiorna il valore salvato nel LocalStorage quando l'utente cambia lo stato del checkbox
$(async function() {	
	// Verifica lo stato attuale dell'estensione e imposta il valore dello switch in base allo stato trovato
		await chrome.storage.local.get(['extensionEnabled'], async function(result) {
			const enabled = result.extensionEnabled;
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
					chrome.action.setIcon({ path: "../../images/icon_48_active.png" })  
					}else{
					chrome.action.setIcon({ path: "../../images/icon_48_stopped.png" })  
					}
					await chrome.storage.local.set({extensionEnabled: enabled});
				}
			)

		
	
			const bookmarksFolderSelected = await chrome.runtime.sendMessage({getSelectedBookmarksFolder: true});
			initializeSettingsUI(bookmarksFolderSelected);
			initializeUI(bookmarksFolderSelected);
				

			// Add Listeners to Toggles
			$('#settingsEnabled').change(
				async function() {
					let c1 = document.getElementById('bookmarksContainer');
					let c2 = document.getElementById('settingsContainer');
					const enabled = $(this).prop('checked');
					if(enabled){
						c1.style.display = "none"
						c2.style.display = "unset" 
					}else{
						c2.style.display = "none"
						c1.style.display = "unset" 
						initializeUI(bookmarksFolderSelected);
					}
				}
			)
  		});
	}
)




