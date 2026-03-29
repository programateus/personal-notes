# Personal Notes

Editor de arquivos Markdown criado por puro objetivo de estudos para praticar algumas ferramentas que descobri.

## Funcionalidades

- **Árvore de arquivos** — navegue, crie, renomeie e exclua arquivos e pastas diretamente na barra lateral
- **Editor Markdown rico** — feito com TipTap com suporte a títulos, listas, tabelas, blocos de código com syntax highlighting, listas de tarefas e citações
- **Menu de barra (`/`)** — insira elementos rapidamente digitando `/` no editor
- **Múltiplas abas** — abra vários arquivos simultaneamente com indicador de alterações não salvas
- **Watch de diretório** — detecta automaticamente mudanças externas nos arquivos
- **Menu de contexto** — clique direito na árvore para criar, renomear ou excluir itens
- **Links externos** — URLs são abertas no navegador padrão do sistema
- **Tema escuro** — interface com tema escuro customizado via DaisyUI

## Roadmap

Funcionalidades que imagino que seriam bom ser implementadas:

- **Copiar/Colar arquivos na sidebar** — a UI de "Copiar" e "Cortar" já existe no menu de contexto, mas apenas copia o caminho para o clipboard; a operação real de cópia/colagem de arquivos ainda não foi implementada
- **Redimensionamento de colunas em tabelas** — o TipTap suporta tabelas redimensionáveis, mas está desabilitado (`resizable: false`); habilitar melhoraria a experiência com tabelas
- **Busca em arquivos** — pesquisa por conteúdo dentro dos arquivos abertos ou em todo o diretório, similar ao Ctrl+Shift+F do VS Code
- **Suporte a outros tipos de arquivo** — a configuração já prevê múltiplas extensões (`ALLOWED_EXTENSIONS`); adicionar suporte a `.txt` e outros formatos é apenas configuração
- **Atalhos de aba por número** — Ctrl+1, Ctrl+2... para ir diretamente à aba correspondente
- **Exportar para PDF/HTML** — exportar notas para outros formatos a partir do editor
- **Temas alternativos** — suporte a tema claro e outras paletas de cores
- **Conflito de edição** — detectar e tratar o caso em que um arquivo é modificado externamente enquanto há alterações não salvas na aba aberta
- **Tooltip de texto selecionado** - Adicionar tooltip para quando um texto for selecionado, para adição de estilização do texto como negrito, italico e sublinhado, entre outros
- **Confirmar fechar arquivo editado** - Adicionar dialogo de confirmação quando fechar um arquivo que está editado e não foi salvo ainda

## Tecnologias

| Camada   | Tecnologia                 |
| -------- | -------------------------- |
| Desktop  | Electron 41                |
| Frontend | React 19 + TypeScript      |
| Build    | Vite 8                     |
| Editor   | TipTap 3                   |
| Estilo   | Tailwind CSS 4 + DaisyUI 5 |
| Testes   | Vitest 4 + Storybook 10    |
| Linting  | Oxlint                     |

## Como executar

**Pré-requisitos:** Node.js 22+ e npm

```bash
# Instalar dependências
npm install

# Modo desenvolvimento (Electron + Vite com HMR)
npm run dev

# Apenas o servidor de desenvolvimento do renderer
npm run dev:renderer
```

## Build e distribuição

```bash
# Build completo (renderer + electron)
npm run build

# Gerar instalador para distribuição
npm run dist
```

Os instaladores são gerados na pasta `release/`:

- **Windows:** instalador NSIS (`.exe`)
- **macOS:** imagem de disco (`.dmg`)
- **Linux:** AppImage (`.AppImage`)

## Atalhos de teclado

| Atalho         | Ação                 |
| -------------- | -------------------- |
| `Ctrl+S`       | Salvar arquivo atual |
| `Ctrl+O`       | Abrir arquivo        |
| `Ctrl+Shift+O` | Abrir pasta          |
| `Ctrl+W`       | Fechar aba atual     |
| `Ctrl+Tab`     | Alternar entre abas  |
