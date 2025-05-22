function trimBy(str, char) {
  while (str.startsWith(char)) {
    str = str.slice(1);
  }
  while (str.endsWith(char)) {
    str = str.slice(0, -1);
  }
  return str;
}

(function (window, document) {
  function getElements() {
    return {
      layout: document.getElementById('layout'),
      sidebar: document.getElementById('sidebar'),
      menuLink: document.getElementById('menuLink'),
      searchResultContainer: document.getElementById('search-result-container'),
    };
  }
  const elements = getElements();

  function toggleAll() {
    const active = 'active';

    elements.layout.classList.toggle(active);
    elements.sidebar.classList.toggle(active);
    elements.menuLink.classList.toggle(active);
  }
  /**
   * @param {MouseEvent} e
   */
  function handleEvent(e) {
    if (e.target.id === elements.menuLink.id) {
      toggleAll();
      e.preventDefault();
    } else if (elements.sidebar.classList.contains('active') && !elements.sidebar.contains(e.target)) {
      toggleAll();
    }

    if (e.target.id !== 'search-bar' && !elements.searchResultContainer.contains(e.target)) {
      elements.searchResultContainer.classList.add('hide');
    }
  }
  document.addEventListener('click', handleEvent);
  const searchBar = document.getElementById('search-bar');
  searchBar.addEventListener('focus', () => {
    getElements().searchResultContainer.classList.remove('hide');
  });
  searchBar.addEventListener('blur', (e) => {
    if (e.relatedTarget.id !== 'search-bar' && !elements.searchResultContainer.contains(e.relatedTarget)) {
      elements.searchResultContainer.classList.add('hide');
    }
  });

  const expandButtons = document.querySelectorAll('.expand-button');
  expandButtons.forEach((button) => {
    button.addEventListener('change', function () {
      const parentList = this.parentElement.parentElement.parentElement;
      parentList.classList.toggle('expanded');
    });
  });

  document.querySelectorAll('nav a').forEach((a) => {
    const trimmedLocation = trimBy(location.href, '/');
    const trimmedHref = trimBy(a.href, '/');
    if (trimmedLocation === trimmedHref) {
      expandAllParentLists(a);
    }
  });

  /**
   * @param {HTMLElement} node
   */
  function expandAllParentLists(node) {
    if (node == undefined) return;
    if (node.tagName === 'LI') {
      node.classList.add('expanded');
    }
    return expandAllParentLists(node.parentElement);
  }

  document.getElementById('version-options').addEventListener('change', (e) => {
    window.location.assign(`/${e.target.value}`);
  });
})(this, this.document);
