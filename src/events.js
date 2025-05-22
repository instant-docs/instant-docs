import EventEmitter from 'events';
import config from '../config.js';
import { prepareSearchIndexes } from './get-full-text-search-index.js';
import { versions } from '../index.js';

export const emitter = new EventEmitter();
const originalEmit = emitter.emit.bind(emitter);
const emit = (...args) => {
  originalEmit(...args);
  const eventName = args[0];
  console.log(`Event: ${eventName}`);
  completedEvents.push(eventName);
  checkIsAllReady();
};
emitter.emit = emit;

const completedEvents = [];
let pluginsReady = false;
let allReady = false;

function checkIsAllReady() {
  if (allReady) return;
  const pluginsEvents = ['be-plugins-ready', 'fe-plugins-ready'];
  if (!pluginsReady && pluginsEvents.every((e) => completedEvents.includes(e))) {
    pluginsReady = true;
    emitter.emit('create-search-index');
  }
  const mandatoryEvents = [...pluginsEvents, 'search-index-ready'];
  const isAllReady = mandatoryEvents.every((e) => completedEvents.includes(e));
  if (isAllReady) {
    allReady = true;
    emitter.emit('all-ready');
  }
}

emitter.on('create-search-index', async () => {
  const supportedLanguages = config.CONTENT_LANGUAGES.split(',');
  const langVerCombination = supportedLanguages.map(lang => versions.map(v => [lang, v])).flat();
  await Promise.all(langVerCombination.map(([lang, version]) => prepareSearchIndexes({ lang, version })));
  emitter.emit('search-index-ready');
});
