import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('Make Art has no custom top bar and occupies the full viewport', () => {
  for (const file of ['src/art/index.html', 'public/art/index.html']) {
    assert.doesNotMatch(readFileSync(file, 'utf8'), /class="topbar"|Your art saves in this browser/);
  }
  for (const file of ['src/art/style.css', 'public/art/titlebar.css']) {
    const css = readFileSync(file, 'utf8');
    assert.doesNotMatch(css, /\.topbar|height: calc\(100% -/);
    assert.match(css, /#make-art-app \{ height: 100%;/);
  }
});

test('The original Make Art close control returns to the dashboard in every locale', () => {
  for (const base of ['src/art/public/www', 'public/art/www']) {
    for (const locale of ['', 'locales/en/', 'locales/ja/', 'locales/es-AR/']) {
      const html = readFileSync(`${base}/${locale}partial/header.html`, 'utf8');
      assert.match(html, /<a href="\/" target="_top" ng-if="offline" class="close"/);
      assert.doesNotMatch(html, /ng-click="shutdown\(\)"/);
    }
  }
});
