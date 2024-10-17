(function (window, document) {
    function getElements() {
        return {
            layout: document.getElementById('layout'),
            menu: document.getElementById('menu'),
            menuLink: document.getElementById('menuLink'),
            searchResultContainer: document.getElementById('search-result-container')
        };
    }
    const elements = getElements();

    function toggleAll() {
        const active = 'active';

        elements.layout.classList.toggle(active);
        elements.menu.classList.toggle(active);
        elements.menuLink.classList.toggle(active);
    }
    /**
     * @param {MouseEvent} e 
     */
    function handleEvent(e) {        
        if (e.target.id === elements.menuLink.id) {
            toggleAll();
            e.preventDefault();
        } else if (elements.menu.classList.contains('active') && !elements.menu.contains(e.target)) {
            toggleAll();
        }

        if(e.target.id !== 'search-bar' && !elements.searchResultContainer.contains(e.target)){
            elements.searchResultContainer.classList.add('hide');
        }
    }
    document.addEventListener('click', handleEvent);
    const searchBar = document.getElementById("search-bar");
    searchBar.addEventListener("focus", () => {
        getElements().searchResultContainer.classList.remove("hide");
    });
    searchBar.addEventListener("blur", (e) => {
        if(e.relatedTarget.id !== 'search-bar' && !elements.searchResultContainer.contains(e.relatedTarget)){
            elements.searchResultContainer.classList.add('hide');
        }
    });
    
    const expandButtons = document.querySelectorAll('.expand-button');
    expandButtons.forEach(button => {
        button.addEventListener('change', function(){
            const parentList = this.parentElement.parentElement.parentElement;
            parentList.classList.toggle('expanded');
        });
    });

    document.querySelectorAll('nav a').forEach(a => {
        if(a.href === location.href){
            expandAllParentLists(a);
        }
    });

    /**
     * @param {HTMLElement} node 
     */
    function expandAllParentLists(node){
        if (node == undefined) return;
        if (node.tagName === 'LI'){
            node.classList.add('expanded');
        }
        return expandAllParentLists(node.parentElement);
    }


}(this, this.document));
