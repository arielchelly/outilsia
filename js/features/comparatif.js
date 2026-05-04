/**
 * comparatif.js — tableau comparatif interactif
 * Usage : <div data-comparatif data-category="image-ia"></div>
 */
(function () {
  'use strict';
  const T = window.TopOutils;
  if (!T || !T.utils) return;

  function badgeHTML(badge_type) {
    const map = { gold: 'badge-gold', electric: 'badge-electric', new: 'badge-new', free: 'badge-free' };
    return map[badge_type] || 'badge-soft';
  }

  function logoHTML(tool) {
    if (tool.logo) return `<span class="tool-cell-logo"><img src="${tool.logo}" alt="" loading="lazy" onerror="this.style.display='none';this.parentElement.textContent='${tool.name.charAt(0)}'"></span>`;
    return `<span class="tool-cell-logo">${tool.name.charAt(0)}</span>`;
  }

  function priceLabel(tool) {
    if (tool.pricing.model === 'gratuit') return 'Gratuit';
    const minPlan = tool.pricing.plans.find(p => p.price_eur > 0);
    if (!minPlan) return 'Gratuit';
    return `${minPlan.price_eur}€/${minPlan.period}`;
  }

  class ComparatifTable {
    constructor(container) {
      this.container = container;
      this.category = container.dataset.category;
      this.sortKey = 'rank_in_category';
      this.sortDir = 'asc';
      this.searchTerm = '';
      this.filterFree = false;
      this.filterApi = false;
      this.tools = [];
      this.init();
    }
    async init() {
      this.tools = await T.store.getToolsByCategory(this.category);
      if (!this.tools.length) {
        this.container.innerHTML = '<p class="text-muted text-center">Données indisponibles. Lancez le générateur.</p>';
        return;
      }
      this.render();
    }
    sortedFiltered() {
      let arr = this.tools.slice();
      if (this.searchTerm) {
        const t = this.searchTerm.toLowerCase();
        arr = arr.filter(x => x.name.toLowerCase().includes(t) || (x.tagline || '').toLowerCase().includes(t));
      }
      if (this.filterFree) arr = arr.filter(x => x.pricing.model === 'gratuit' || x.pricing.model === 'freemium');
      if (this.filterApi) arr = arr.filter(x => x.features && x.features.api_available);
      arr.sort((a, b) => {
        let av, bv;
        switch (this.sortKey) {
          case 'name': av = a.name.toLowerCase(); bv = b.name.toLowerCase(); break;
          case 'overall': av = a.scores.overall; bv = b.scores.overall; break;
          case 'price': av = (a.pricing.plans[0] && a.pricing.plans[0].price_eur) || 0; bv = (b.pricing.plans[0] && b.pricing.plans[0].price_eur) || 0; break;
          case 'commission':
            av = parseFloat((a.commission_rate || '0').toString().replace('%', '')) || 0;
            bv = parseFloat((b.commission_rate || '0').toString().replace('%', '')) || 0;
            break;
          default: av = a.rank_in_category; bv = b.rank_in_category;
        }
        if (av < bv) return this.sortDir === 'asc' ? -1 : 1;
        if (av > bv) return this.sortDir === 'asc' ? 1 : -1;
        return 0;
      });
      return arr;
    }
    render() {
      const cols = [
        { key: 'name', label: 'Outil' },
        { key: 'overall', label: 'Note' },
        { key: 'price', label: 'Prix' },
        { key: 'free', label: 'Gratuit' },
        { key: 'api', label: 'API' },
        { key: 'commission', label: 'Com.' },
        { key: 'cta', label: '' }
      ];
      const ind = (k) => this.sortKey === k ? (this.sortDir === 'asc' ? '↑' : '↓') : '↕';
      const headers = cols.map(c => {
        const sortable = ['name', 'overall', 'price', 'commission'].includes(c.key);
        const cls = this.sortKey === c.key ? `sorted-${this.sortDir}` : '';
        return `<th data-sort="${c.key}" class="${cls}" ${sortable ? '' : 'style="cursor:default"'}>${c.label}${sortable ? ` <span class="sort-indicator">${ind(c.key)}</span>` : ''}</th>`;
      }).join('');
      const rows = this.sortedFiltered().map(tool => {
        const isRec = tool.is_recommended;
        const checkApi = tool.features && tool.features.api_available;
        const hasFree = tool.pricing.model === 'gratuit' || tool.pricing.model === 'freemium';
        return `<tr class="${isRec ? 'is-recommended' : ''}" data-tool-id="${tool.id}">
          <td><span class="tool-cell">${logoHTML(tool)}<span class="tool-cell-name">${tool.is_recommended ? '★ ' : ''}${tool.name}</span></span></td>
          <td><span class="score">${tool.scores.overall.toFixed(1)}</span></td>
          <td><span class="price">${priceLabel(tool)}</span></td>
          <td>${hasFree ? '<span class="check">✓</span>' : '<span class="cross">✕</span>'}</td>
          <td>${checkApi ? '<span class="check">✓</span>' : '<span class="cross">✕</span>'}</td>
          <td><span class="commission">${tool.commission_rate || '—'}</span></td>
          <td><a href="${tool.affiliate_link}" rel="sponsored noopener" target="_blank" class="btn btn-sm btn-affiliate" data-track-affiliate data-tool-id="${tool.id}" data-tool-name="${tool.name}">Essayer</a></td>
        </tr>`;
      }).join('');

      this.container.innerHTML = `
        <div class="table-wrapper">
          <div class="table-toolbar">
            <div class="table-search">
              <span class="table-search-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>
              <input type="search" placeholder="Rechercher un outil…" value="${this.searchTerm}">
            </div>
            <div class="table-filters">
              <button class="filter-chip ${this.filterFree ? 'active' : ''}" data-filter="free">Gratuit / Freemium</button>
              <button class="filter-chip ${this.filterApi ? 'active' : ''}" data-filter="api">Avec API</button>
            </div>
          </div>
          <div class="compare-table-wrapper">
            <table class="compare-table">
              <thead><tr>${headers}</tr></thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
        </div>
      `;
      this.bindEvents();
    }
    bindEvents() {
      this.container.querySelectorAll('th[data-sort]').forEach(th => {
        th.addEventListener('click', () => {
          const k = th.dataset.sort;
          if (!['name', 'overall', 'price', 'commission'].includes(k)) return;
          if (this.sortKey === k) this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
          else { this.sortKey = k; this.sortDir = 'asc'; }
          this.render();
        });
      });
      const inp = this.container.querySelector('.table-search input');
      if (inp) {
        inp.addEventListener('input', T.utils.debounce(e => {
          this.searchTerm = e.target.value;
          this.render();
        }, 200));
      }
      this.container.querySelectorAll('[data-filter]').forEach(b => {
        b.addEventListener('click', () => {
          if (b.dataset.filter === 'free') this.filterFree = !this.filterFree;
          if (b.dataset.filter === 'api') this.filterApi = !this.filterApi;
          this.render();
        });
      });
    }
  }

  T.utils.onReady(() => {
    T.utils.qsa('[data-comparatif]').forEach(el => new ComparatifTable(el));
  });
})();
