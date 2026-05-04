/**
 * store.js — état partagé minimal
 */
window.TopOutils = window.TopOutils || {};
(function (T) {
  'use strict';
  let toolsCache = null;
  T.store = {
    async getTools() {
      if (toolsCache) return toolsCache;
      try {
        const data = await T.utils.fetchJSON('/data/tools.json');
        toolsCache = data;
        return data;
      } catch (e) {
        console.warn('[store] tools.json indisponible', e);
        return { tools: [], meta: {} };
      }
    },
    async getToolsByCategory(category) {
      const data = await this.getTools();
      return (data.tools || []).filter(t => t.category === category);
    }
  };
})(window.TopOutils);
