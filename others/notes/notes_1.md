## 1. Exemplo com EJS:

const ejs = require('ejs');
const html = `
<!DOCTYPE html>
<html>
<body>
  <h1>Olá, {{NOME}}!</h1>
  <p>© {{ANO}} - Todos os direitos reservados</p>
  <p>Email: {{EMAIL}}</p>
</body>
</html>
`;

// Renderiza substituindo os placeholders
const resultado = ejs.render(html, {
  NOME: "João Silva",
  ANO: new Date().getFullYear(),
  EMAIL: "joao@exemplo.com"
});

console.log(resultado);

---

## 2. Replace Simples (Para casos simples)

function renderTemplate(template, data) {
  let result = template;
  Object.keys(data).forEach(key => {
    const placeholder = `{{${key}}}`;
    result = result.replace(new RegExp(placeholder, 'g'), data[key]);
  });
  return result;
}

// Uso:
const template = "© {{ANO}} - {{NOME}}";
const htmlFinal = renderTemplate(template, {
  ANO: 2026,
  NOME: "Meu Site"
});

---

## 3. Template Literals (ES6):

const ANO = 2026;
const NOME = "João";
const EMAIL = "joao@exemplo.com";

const html = `
<!DOCTYPE html>
<html>
<body>
  <h1>Olá, ${NOME}!</h1>
  <p>© ${ANO} - Todos os direitos reservados</p>
</body>
</html>
`;