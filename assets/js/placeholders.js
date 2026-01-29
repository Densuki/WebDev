const fs = require('fs');
const handlebars = require('handlebars');

const path_file = '/index.html';

// 1. Carrega o template
const templateHtml = fs.readFileSync(path_file, 'utf8');

// 2. Compila o template
const template = handlebars.compile(templateHtml);

```

```

// 3. Dados para substituir
const dados = {
    // Init
    TITLE: "Sites para Testes e Estudos",
    DESCRIPTION: "Repositório de um site para estudos e testes",
    KEYWORDS: ["Estudos", "Web", "Developer", "Site", "Testes"],
    AUTHOR: ["Densuki", "YukiriDensuki"],
    THEME_COLOR: "#0d6efd",
    // SEO
    CANONICAL_URL: "https://densuki.github.io/WebDev/",
    //🌍 OPEN GRAPH (WhatsApp, Discord, Telegram, Slack, iMessage, Signal, Pinterest)
    SOCIAL_TITLE: "",
    SOCIAL_DESCRIPTION: "",
    SOCIAL_IMAGE: "",
    SOCIAL_IMAGE_ALT: "",
    PAGE_URL: "",
    ISO_DATE: "",
    SLACK_APP_ID: "",
    // Twitter
    TWITTER_SITE: "",
    TWITTER_CREATOR: "",
    SOCIAL_TITLE: "",
    SOCIAL_DESCRIPTION: "",
    SOCIAL_IMAGE: "",
    SOCIAL_IMAGE_ALT: "",
    DOMAIN: "",
    // Facebook
    FACEBOOK_APP_ID: "",
    FACEBOOK_AUTHOR: "",
    FACEBOOK_PUBLISHER: "",
    ARTICLE_SECTION: "",
    ARTICLE_TAGS: "",
    PUBLISHED_TIME: "",
    MODIFIED_TIME: "",
    // Linkedin
    LINKEDIN_OWNER: "Densuki",
    // Apple
    APP_NAME: "",
    // Profile
    NAME: "YukiriDensuki",
    YEAR: new Date().getFullYear(),
    EMAIL: "yukiridensuki@gmail.com",
    DATE: new Date().toLocaleDateString('pt-BR'),
    SHOW_EXTRA: true,
    SKILLS: ["JavaScript", "Node.js", "HTML/CSS", "Python"],
    // Site Component
    SITE_NAME: "Densuki Site",
    TITLE_PAGE: "Site",
    CONTENT: "Conteúdo"
};

// 4. Renderiza o HTML final
const htmlFinal = template(dados);

// 5. Salva em um novo arquivo (ou envia por email, etc.)
fs.writeFileSync('/index.html', htmlFinal);

console.log(`✅ Arquivo atualizado: "index.html"!`);