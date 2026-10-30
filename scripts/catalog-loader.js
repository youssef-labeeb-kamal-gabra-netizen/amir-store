const fs = require('fs');
const path = require('path');

function loadCatalog() {
  const filePath = path.join(process.cwd(), 'src/data/catalog.ts');
  let code = fs.readFileSync(filePath, 'utf8');
  // Strip import statements
  code = code.replace(/import\s+[^;]+;/g, '');
  // Strip TypeScript type annotations on variables
  code = code.replace(/:\s*Category\[\]/g, '');
  code = code.replace(/:\s*Product\[\]/g, '');
  // Replace export const with const
  code = code.replace(/export\s+const\s+/g, 'const ');

  const sandbox = {};
  const fn = new Function('exports', `${code}\nexports.CATEGORIES = CATEGORIES;\nexports.INITIAL_PRODUCTS = INITIAL_PRODUCTS;`);
  fn(sandbox);

  return {
    CATEGORIES: sandbox.CATEGORIES,
    INITIAL_PRODUCTS: sandbox.INITIAL_PRODUCTS
  };
}

module.exports = { loadCatalog };
