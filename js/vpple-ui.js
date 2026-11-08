/**
 * Vpple UI Kit - v1.0.0
 * 1:1 Clean-Room JavaScript Controller for Apple macOS & iOS Components.
 * Licensed under MIT.
 * https://github.com/jabirking-ux/Vpple
 */

(function () {
  'use strict';

  // 1. Live Menubar Clock
  function initClock() {
    const clockEls = document.querySelectorAll('.vui-live-clock');
    if (!clockEls.length) return;

    function update() {
      const now = new Date();
      const options = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      };
      const text = now.toLocaleDateString('en-US', options).replace(/,/g, '');
      clockEls.forEach(el => el.textContent = text);
    }
    update();
    setInterval(update, 1000);
  }

  // 2. Parabolic Dock Physics & App Bounce
  function initDock() {
    const dock = document.querySelector('.vui-dock');
    if (!dock) return;

    const items = dock.querySelectorAll('.vui-dock-item');
    const maxScale = 1.45;
    const range = 130; // Pixel radius of influence

    dock.addEventListener('mousemove', (e) => {
      const mouseX = e.clientX;

      items.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const itemCenterX = rect.left + rect.width / 2;
        const dist = Math.abs(mouseX - itemCenterX);

        if (dist < range) {
          // Continuous Cosine Interpolation
          const factor = Math.cos((dist / range) * (Math.PI / 2));
          const scale = 1 + (maxScale - 1) * factor;
          const translateY = -14 * factor;
          item.style.transform = `scale(${scale}) translateY(${translateY}px)`;
          item.style.margin = `0 ${7 * factor}px`;
        } else {
          item.style.transform = 'scale(1) translateY(0)';
          item.style.margin = '0 0';
        }
      });
    });

    dock.addEventListener('mouseleave', () => {
      items.forEach((item) => {
        item.style.transform = 'scale(1) translateY(0)';
        item.style.margin = '0 0';
      });
    });

    // App launch bounce simulation on click
    items.forEach((item) => {
      item.addEventListener('click', () => {
        item.classList.remove('vui-animate-bounce');
        void item.offsetWidth; // Trigger reflow
        item.classList.add('vui-animate-bounce');

        // Toggle dot
        let dot = item.querySelector('.vui-dock-dot');
        if (!dot) {
          dot = document.createElement('div');
          dot.className = 'vui-dock-dot';
          item.appendChild(dot);
        }

        // If it's the settings or finder app, restore/focus window
        const appName = item.dataset.app;
        if (appName === 'finder' || appName === 'settings' || appName === 'vpple') {
          const win = document.querySelector('.vui-window');
          if (win) {
            win.classList.remove('is-minimized');
            win.style.display = 'flex';
          }
        }
      });
    });
  }

  // 3. Draggable macOS Window & Traffic Light Actions
  function initWindowChrome() {
    const win = document.querySelector('.vui-window');
    if (!win) return;

    const titlebar = win.querySelector('.vui-window-titlebar');
    const closeBtn = win.querySelector('.vui-traffic-close');
    const minBtn = win.querySelector('.vui-traffic-min');
    const maxBtn = win.querySelector('.vui-traffic-max');

    // Traffic Lights Actions
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        win.style.display = 'none';
      });
    }

    if (minBtn) {
      minBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        win.classList.toggle('is-minimized');
      });
    }

    if (maxBtn) {
      maxBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        win.classList.toggle('is-fullscreen');
      });
    }

    // Draggable window physics
    if (titlebar) {
      let isDragging = false;
      let startX, startY, initialLeft, initialTop;

      titlebar.addEventListener('mousedown', (e) => {
        if (e.target.closest('.vui-traffic-lights') || win.classList.contains('is-fullscreen')) return;
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;

        const rect = win.getBoundingClientRect();
        initialLeft = rect.left;
        initialTop = rect.top;

        document.body.style.userSelect = 'none';
      });

      window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        win.style.position = 'fixed';
        win.style.margin = '0';
        win.style.left = `${Math.max(10, initialLeft + dx)}px`;
        win.style.top = `${Math.max(38, initialTop + dy)}px`;
      });

      window.addEventListener('mouseup', () => {
        isDragging = false;
        document.body.style.userSelect = '';
      });
    }
  }

  // 4. Menubar Dropdowns
  function initMenubar() {
    const menuItems = document.querySelectorAll('.vui-menu-item');
    let isMenuOpen = false;

    menuItems.forEach((item) => {
      const dropdown = item.querySelector('.vui-dropdown');
      if (!dropdown) return;

      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const wasActive = item.classList.contains('active');
        menuItems.forEach(i => i.classList.remove('active'));
        if (!wasActive) {
          item.classList.add('active');
          isMenuOpen = true;
        } else {
          isMenuOpen = false;
        }
      });

      item.addEventListener('mouseenter', () => {
        if (isMenuOpen) {
          menuItems.forEach(i => i.classList.remove('active'));
          item.classList.add('active');
        }
      });
    });

    document.addEventListener('click', () => {
      menuItems.forEach(i => i.classList.remove('active'));
      isMenuOpen = false;
    });
  }

  // 5. Control Center Flyout
  function initControlCenter() {
    const trigger = document.getElementById('vui-cc-trigger');
    const panel = document.getElementById('vui-cc-panel');
    if (!trigger || !panel) return;

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      panel.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (panel.classList.contains('active') && !panel.contains(e.target) && e.target !== trigger) {
        panel.classList.remove('active');
      }
    });

    // Toggle Tiles inside Control Center
    const toggleTiles = panel.querySelectorAll('.vui-cc-toggle-item');
    toggleTiles.forEach((tile) => {
      tile.addEventListener('click', () => {
        tile.classList.toggle('active');
      });
    });
  }

  // 6. Spotlight Search (`⌘ + Space` or `Ctrl + Space`)
  function initSpotlight() {
    const trigger = document.getElementById('vui-spotlight-trigger');
    const backdrop = document.getElementById('vui-spotlight-modal');
    const input = document.getElementById('vui-spotlight-input');
    const list = document.getElementById('vui-spotlight-list');
    if (!backdrop || !input) return;

    function openSpotlight() {
      backdrop.classList.add('active');
      input.value = '';
      input.focus();
      filterResults('');
    }

    function closeSpotlight() {
      backdrop.classList.remove('active');
    }

    if (trigger) {
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        openSpotlight();
      });
    }

    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeSpotlight();
    });

    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.code === 'Space') {
        e.preventDefault();
        if (backdrop.classList.contains('active')) closeSpotlight();
        else openSpotlight();
      } else if (e.key === 'Escape' && backdrop.classList.contains('active')) {
        closeSpotlight();
      }
    });

    function filterResults(q) {
      if (!list) return;
      const items = list.querySelectorAll('.vui-spotlight-item');
      const query = q.toLowerCase().trim();

      items.forEach((item) => {
        const text = item.textContent.toLowerCase();
        if (!query || text.includes(query)) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    }

    input.addEventListener('input', (e) => {
      filterResults(e.target.value);
    });
  }

  // 7. Dynamic Segmented Controls
  function initSegmented() {
    const segmentedGroups = document.querySelectorAll('.vui-segmented');

    segmentedGroups.forEach((group) => {
      let indicator = group.querySelector('.vui-segmented-indicator');
      if (!indicator) {
        indicator = document.createElement('div');
        indicator.className = 'vui-segmented-indicator';
        group.appendChild(indicator);
      }

      const items = group.querySelectorAll('.vui-segmented-item');

      function updateIndicator(activeItem) {
        if (!activeItem) return;
        indicator.style.width = `${activeItem.offsetWidth}px`;
        indicator.style.left = `${activeItem.offsetLeft}px`;
      }

      const activeItem = group.querySelector('.vui-segmented-item.active') || items[0];
      if (activeItem) {
        activeItem.classList.add('active');
        setTimeout(() => updateIndicator(activeItem), 50);
      }

      items.forEach((item) => {
        item.addEventListener('click', () => {
          items.forEach(i => i.classList.remove('active'));
          item.classList.add('active');
          updateIndicator(item);

          // Custom event
          const val = item.dataset.target || item.textContent.trim();
          group.dispatchEvent(new CustomEvent('vui-change', { detail: { value: val } }));
        });
      });
    });
  }

  // 8. Steppers
  function initSteppers() {
    const steppers = document.querySelectorAll('.vui-stepper');
    steppers.forEach((stepper) => {
      const minus = stepper.querySelector('[data-step="minus"]');
      const plus = stepper.querySelector('[data-step="plus"]');
      const targetId = stepper.dataset.target;
      const targetEl = targetId ? document.getElementById(targetId) : null;

      if (!minus || !plus || !targetEl) return;

      minus.addEventListener('click', () => {
        let val = parseInt(targetEl.textContent || '0', 10);
        targetEl.textContent = Math.max(0, val - 1);
      });

      plus.addEventListener('click', () => {
        let val = parseInt(targetEl.textContent || '0', 10);
        targetEl.textContent = val + 1;
      });
    });
  }

  // 9. Theme Switcher (Dark / Light)
  function initTheme() {
    const toggles = document.querySelectorAll('[data-vui-theme-toggle]');
    toggles.forEach((btn) => {
      btn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('vui-theme', next);
      });
    });

    const saved = localStorage.getItem('vui-theme');
    if (saved) {
      document.documentElement.setAttribute('data-theme', saved);
    }
  }

  // 10. Copy Code Snippet Buttons
  function initCopyButtons() {
    const copyBtns = document.querySelectorAll('[data-copy-target]');
    copyBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.copyTarget;
        const targetEl = document.getElementById(targetId);
        if (!targetEl) return;

        const text = targetEl.innerText || targetEl.textContent;
        navigator.clipboard.writeText(text).then(() => {
          const originalHTML = btn.innerHTML;
          btn.innerHTML = '<span>&#10003; Copied!</span>';
          btn.style.color = '#30d158';
          setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.color = '';
          }, 1800);
        });
      });
    });
  }

  // 11. Tab Switchers
  function initTabs() {
    const tabs = document.querySelectorAll('.vui-sidebar-item[data-tab]');
    tabs.forEach((tab) => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        const targetTab = tab.dataset.tab;
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const panes = document.querySelectorAll('.vui-tab-pane');
        panes.forEach((pane) => {
          if (pane.id === targetTab) {
            pane.style.display = 'block';
          } else {
            pane.style.display = 'none';
          }
        });
      });
    });
  }

  // 12. iOS 26 Dynamic Island Toggle
  function initDynamicIsland() {
    const islands = document.querySelectorAll('.vui-dynamic-island');
    islands.forEach((island) => {
      island.addEventListener('click', () => {
        island.classList.toggle('expanded');
      });
    });
  }

  // 13. Real Volumetric Liquid Glass Light Vector & Inertial Tilt Physics
  function initLiquidPhysics() {
    const liquidElements = document.querySelectorAll('.vui-liquid-glass, .vui-window, .vui-dock, .vui-control-center');

    window.addEventListener('mousemove', (e) => {
      const screenX = (e.clientX / window.innerWidth) * 100;
      const screenY = (e.clientY / window.innerHeight) * 100;
      document.documentElement.style.setProperty('--liquid-mx', `${screenX.toFixed(1)}%`);
      document.documentElement.style.setProperty('--liquid-my', `${screenY.toFixed(1)}%`);

      // Element-specific caustics and angle
      liquidElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (e.clientX >= rect.left - 50 && e.clientX <= rect.right + 50 &&
            e.clientY >= rect.top - 50 && e.clientY <= rect.bottom + 50) {
          const elX = ((e.clientX - rect.left) / rect.width) * 100;
          const elY = ((e.clientY - rect.top) / rect.height) * 100;
          el.style.setProperty('--liquid-mx', `${elX.toFixed(1)}%`);
          el.style.setProperty('--liquid-my', `${elY.toFixed(1)}%`);

          // Calculate specular reflection angle in degrees
          const angle = Math.atan2(e.clientY - (rect.top + rect.height / 2), e.clientX - (rect.left + rect.width / 2)) * (180 / Math.PI);
          el.style.setProperty('--liquid-angle', `${(angle + 90).toFixed(1)}deg`);
        }
      });
    });
  }

  // 14. Real Fluid Ripple on Click for Liquid Glass
  function initLiquidRipples() {
    document.addEventListener('click', (e) => {
      const target = e.target.closest('.vui-liquid-glass, .vui-btn-liquid, .vui-liquid-lens, .vui-window');
      if (!target) return;

      const rect = target.getBoundingClientRect();
      const ripple = document.createElement('div');
      ripple.className = 'vui-liquid-ripple';
      ripple.style.left = `${e.clientX - rect.left}px`;
      ripple.style.top = `${e.clientY - rect.top}px`;

      target.appendChild(ripple);
      setTimeout(() => ripple.remove(), 800);
    });
  }

  // 15. Draggable Real Liquid Optical Lens
  function initLiquidLens() {
    const lens = document.querySelector('.vui-liquid-lens');
    if (!lens) return;

    let isDragging = false;
    let startX, startY, origX, origY;

    lens.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const rect = lens.getBoundingClientRect();
      origX = rect.left;
      origY = rect.top;
      lens.style.position = 'fixed';
      lens.style.margin = '0';
      lens.style.zIndex = '99999';
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      lens.style.left = `${origX + dx}px`;
      lens.style.top = `${origY + dy}px`;
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });
  }

  // Auto-init on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    initClock();
    initDock();
    initWindowChrome();
    initMenubar();
    initControlCenter();
    initSpotlight();
    initSegmented();
    initSteppers();
    initTheme();
    initCopyButtons();
    initTabs();
    initDynamicIsland();
    initLiquidPhysics();
    initLiquidRipples();
    initLiquidLens();
  });

})();
