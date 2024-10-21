import Fuse from './fuse_7_0_0.js';

const searchContext = {
  loading: false,
  input: '',
  results: [],
}
window.lang = document.getElementsByTagName("html")[0].lang;
const debounceTimers = {};
let searchIndex;
let fetching = false;
function debounceByKey(key, ms = 750) {
  return (f) => (...args) => {
    clearTimeout(debounceTimers[key]);
    debounceTimers[key] = setTimeout(() => f(...args), ms);
  }
}

const search = debounceByKey("searchInput")(e => {
  const input = e.target.value;
  if(input === ''){
    document.getElementById('search-result-container').classList.add('hide');
    return;
  }
  document.getElementById('search-result-container').classList.remove('hide');
  if(!searchIndex && !fetching){
    fetching = true;
    fetch(`/search_index_${window.lang}.json`, { cache: 'force-cache' })
    .then(response => response.blob())
    .then(blob => blob.text())
    .then(text => {
      const data = JSON.parse(text);
      searchIndex = data;
      fetching = false;
      fullTextSearch(input, searchIndex);
    });
  } else {
    fullTextSearch(input, searchIndex);
  }
});

const searchOptions = {
  // includeScore: true,
  isCaseSensitive: false,
  shouldSort: true,
  includeMatches: true,
  keys: ['cleanText']
}
function fullTextSearch(input, index){
  const f = new Fuse(index, searchOptions);
  const matches = f.search(input);
  renderSearchResults(matches);
  searchContext.loading = false;
}

/**
 * @param {Array<{
 * item: { title:string, cleanText:string, url:string },
 * refIndex: number,
 * score: number
 * }>} matches 
 */
function renderSearchResults(matches){
  if(matches.length === 0){
    const noResult = document.createElement('div');
    noResult.innerText = 'No result found';
    replaceResult(noResult);
    return;
  }

  const resultElements = matches.map(match => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = match.item.url;
    const h4 = document.createElement("h4");
    h4.innerText = match.item.title || match.item.url;
    const p = document.createElement("p");
    p.innerText = match.item.cleanText.slice(Math.max(match.refIndex - 40, 0), match.refIndex + 80);
    if(match.refIndex > 40){
      p.innerText = "..." + p.innerText;
    }
    if(match.item.cleanText.length > match.refIndex + 80){
      p.innerText += "...";
    }
    a.appendChild(h4);
    a.appendChild(p);
    li.appendChild(a);
    return li;
  });
  const ol = document.createElement("ol");
  ol.classList.add("search-result-list");
  resultElements.forEach(e => ol.appendChild(e));
  replaceResult(ol);
}

function replaceResult(node){
  const container = document.getElementById('search-result-container');
  if(container.children.length === 1){
    container.replaceChild(node, container.children[0]);
  } else {
    container.innerHTML = '';
    container.appendChild(node);
  }
}

document.getElementById("search-bar").addEventListener("input", e => {
  searchContext.loading = true;
  searchContext.input = e.target.value;
  search(e);
});


document.getElementById("search-bar");
