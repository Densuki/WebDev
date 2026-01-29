## 1. Para arquivos .html separados:

```js
// 1. Instale
npm install ejs

// 2. Crie seu template (template.html)
<!DOCTYPE html>
<html>
<body>
  <h1>Olá, <%= NOME %>!</h1>
  <p>© <%= ANO %> - Meu Site</p>
</body>
</html>

// 3. Renderize no Node.js
const ejs = require('ejs');
const fs = require('fs');

const template = fs.readFileSync('template.html', 'utf8');
const html = ejs.render(template, {
  NOME: "Maria",
  ANO: new Date().getFullYear()
});

// Salve ou envie como resposta
fs.writeFileSync('site.html', html);
```

---

## 2. Se quiser manter seus ``{{ }}``:

```js
const handlebars = require('handlebars');

const template = handlebars.compile(`
  <p>© {{ANO}} - {{NOME}}</p>
`);

const html = template({
  ANO: 2026,
  NOME: "Meu Site"
});
```