import { StyleModule } from '/home/mahmoud/WebstormProjects/muhaqqiq-editor/node_modules/.pnpm/style-mod@4.1.3/node_modules/style-mod/src/style-mod.js';

function buildTheme(main, spec) {
  return new StyleModule(spec, {
    finish(sel) {
      return /&/.test(sel)
        ? sel.replace(/&\w*/, m => {
            if (m == '&') return main;
            throw new RangeError('Unsupported: ' + m);
          })
        : main + ' ' + sel;
    },
  });
}

const prefix = 'test-scope';
const themeStyles = {
  '.edition-symbol': {
    color: 'var(--muhaqqiq-edition-symbol-color, #0550ae)',
    opacity: 'var(--muhaqqiq-edition-symbol-opacity, 0.85)',
    fontWeight: '700',
  },
  '&': {
    color: '#0a0f13',
  },
};

const mod = buildTheme('.' + prefix, themeStyles);
console.log('Generated CSS rules:');
console.log(mod.getRules());
