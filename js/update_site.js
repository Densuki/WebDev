const fs = require('fs');
const path = require('path');

class SiteUpdater {
  constructor() {
    // ⚠️ CORREÇÃO AQUI:
    this.baseDir = __dirname; // Isso é ./js/
    
    // O index.html está NA RAIZ, não em ./js/
    // Suba 2 níveis: /workspaces/WebDev/
    // this.projectRoot = path.join(this.baseDir, '..', '..');
    this.projectRoot = path.join(this.baseDir, '..');
    
    this.htmlFile = path.join(this.projectRoot, 'index.html'); // Agora na raiz!
    this.configFile = path.join(this.projectRoot, 'assets', 'json', 'placeholders.json');
  }

  // 1. Carrega configurações
  loadConfig() {
    const config = JSON.parse(fs.readFileSync(this.configFile, 'utf8'));
    
    // Processa valores 'auto'
    const processValue = (value) => {
      if (value === 'auto') {
        return this.getAutoValue();
      }
      return value;
    };

    // Função recursiva para processar todo o objeto
    const processObject = (obj) => {
      const result = {};
      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          result[key] = processObject(value);
        } else if (Array.isArray(value)) {
          result[key] = value.map(processValue);
        } else {
          result[key] = processValue(value);
        }
      }
      return result;
    };

    return processObject(config);
  }

  // 2. Valores automáticos
  getAutoValue() {
    const now = new Date();
    return {
      'ISO_DATE': now.toISOString(),
      'PUBLISHED_TIME': now.toISOString(),
      'MODIFIED_TIME': now.toISOString(),
      'YEARS': `2025-${now.getFullYear()}`
    };
  }

  // 3. Achata o objeto
  flattenConfig(config, prefix = '') {
    let result = {};
    
    for (const [key, value] of Object.entries(config)) {
      const fullKey = prefix ? `${prefix}_${key}` : key;
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        result = { ...result, ...this.flattenConfig(value, fullKey) };
      } else if (Array.isArray(value)) {
        result[`{{${fullKey}}}`] = value.join(', ');
      } else {
        result[`{{${fullKey}}}`] = value;
      }
    }
    
    return result;
  }

  // 4. Cria backup
  createBackup() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    // ⚠️ CORREÇÃO AQUI: backups na raiz do projeto
    const backupDir = path.join(this.projectRoot, 'backups');
    const backupFile = path.join(backupDir, `backup-${timestamp}.html`);
    
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    fs.copyFileSync(this.htmlFile, backupFile);
    console.log(`📦 Backup criado: ${path.relative(this.projectRoot, backupFile)}`);
    return backupFile;
  }

  // 5. Atualiza HTML
  updateHTML() {
    try {
      console.log('🔄 Iniciando atualização do site...');
      console.log(`📄 HTML: ${path.relative(this.projectRoot, this.htmlFile)}`);
      console.log(`⚙️  Config: ${path.relative(this.projectRoot, this.configFile)}`);
      
      // Verifica se arquivos existem
      if (!fs.existsSync(this.htmlFile)) {
        throw new Error(`Arquivo HTML não encontrado: ${this.htmlFile}`);
      }
      if (!fs.existsSync(this.configFile)) {
        throw new Error(`Arquivo de configuração não encontrado: ${this.configFile}`);
      }
      
      // Cria backup
      this.createBackup();
      
      // Carrega HTML original
      let html = fs.readFileSync(this.htmlFile, 'utf8');
      
      // Carrega e processa configurações
      const config = this.loadConfig();
      const placeholders = this.flattenConfig(config);
      
      console.log(`📊 ${Object.keys(placeholders).length} placeholders encontrados`);
      
      // Substitui todos os placeholders
      let replacements = 0;
      Object.entries(placeholders).forEach(([placeholder, value]) => {
        const regex = new RegExp(placeholder, 'g');
        const matches = html.match(regex);
        
        if (matches) {
          html = html.replace(regex, value);
          replacements += matches.length;
          console.log(`  ✓ ${placeholder} → ${String(value).substring(0, 50)}${String(value).length > 50 ? '...' : ''}`);
        }
      });
      
      // Salva HTML atualizado
      fs.writeFileSync(this.htmlFile, html, 'utf8');
      
      console.log('\n✅ Atualização concluída!');
      console.log(`📝 ${replacements} substituições realizadas`);
      console.log(`📁 Backup salvo em: /backups/`);
      
    } catch (error) {
      console.error('❌ Erro:', error.message);
      console.error('📍 Caminho completo:', error.path || 'Não especificado');
      process.exit(1);
    }
  }

  // 6. Visualiza diferenças
  showDiff() {
    try {
      const original = fs.readFileSync(this.htmlFile, 'utf8');
      const config = this.loadConfig();
      const placeholders = this.flattenConfig(config);
      
      console.log('🔍 Placeholders encontrados no HTML:');
      let found = 0;
      Object.keys(placeholders).forEach(placeholder => {
        const regex = new RegExp(placeholder, 'g');
        const matches = original.match(regex);
        if (matches) {
          console.log(`  ${placeholder} (${matches.length}x)`);
          found++;
        }
      });
      
      if (found === 0) {
        console.log('⚠️  Nenhum placeholder encontrado!');
        console.log('   Verifique se seu HTML contém {{VARIAVEL}}');
      }
    } catch (error) {
      console.error('❌ Erro ao verificar:', error.message);
    }
  }
}

// 7. Executa
const updater = new SiteUpdater();

// Modo de uso
if (process.argv.includes('--check')) {
  updater.showDiff();
} else if (process.argv.includes('--update')) {
  updater.updateHTML();
} else {
  // Modo interativo
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('🎛️  EDITOR DE SITE DENSUKI');
  console.log('==========================');
  console.log('1. Ver placeholders');
  console.log('2. Atualizar site');
  console.log('3. Sair');
  
  rl.question('\nEscolha uma opção (1-3): ', (answer) => {
    switch(answer.trim()) {
      case '1':
        updater.showDiff();
        break;
      case '2':
        updater.updateHTML();
        break;
      default:
        console.log('👋 Até mais!');
    }
    rl.close();
  });
}