# Diretrizes — Blog Matrix

Padrões de criação para artigos e assets do blog.

---

## Estrutura do Artigo (HTML)

Cada artigo é um arquivo `.html` independente em `/blog/`. Estrutura obrigatória:

```
blog/
├── index.html              ← Listagem de artigos
├── DIRETRIZES.md           ← Este arquivo
├── nome-do-artigo.html     ← Artigo individual
└── ...
```

### Head

- `<title>` → `{Título do artigo} · Matrix Blog`
- `<meta name="description">` → Resumo de até 160 caracteres
- `<link rel="canonical">` → URL completa do artigo na Vercel
- Open Graph: `og:title`, `og:description`, `og:type` (article), `article:published_time`, `article:tag`
- CSS: importar `/css/style.css` e `/css/blog.css`

### Body

```html
<article class="post-article">
  <header class="post-header">
    <div class="post-header__tags">
      <span class="post-header__tag">TAG</span>
    </div>
    <h1>Título do artigo</h1>
    <p class="post-header__desc">Descrição curta.</p>
    <div class="post-header__meta">
      <time datetime="YYYY-MM-DD">DD mmm YYYY</time>
      <span class="post-card__sep">·</span>
      <span>X min de leitura</span>
    </div>
  </header>

  <div class="post-body">
    <!-- Conteúdo do artigo -->
  </div>

  <footer class="post-footer">
    <a href="/blog/" class="post-footer__back">← Todos os artigos</a>
    <a href="/#contato" class="btn btn--primary">Iniciar um projeto →</a>
  </footer>
</article>
```

### Conteúdo (post-body)

- Usar `<h2>` para seções principais (nunca `<h1>` dentro do body)
- Código em `<pre><code>` — sem biblioteca de syntax highlighting
- Tabelas com `<table><thead><tbody>` semântico
- Listas com `<ul>` ou `<ol>`
- Blockquotes para notas importantes

---

## Imagem de Capa (Blog Card)

Cada artigo **deve ter** uma imagem de capa exibida no card da home e da listagem do blog.

### Especificações Técnicas

| Propriedade | Valor |
|-------------|-------|
| Formato | PNG |
| Aspect ratio | 16:9 |
| Resolução mínima | 600×338px |
| Local | `/assets/images/blog/{slug}.png` |
| Nome | Mesmo slug do artigo (ex: `starting-style.png`) |

### Diretrizes Visuais

1. **Fundo escuro** — usar `#0a0a0a` ou próximo, compatível com o tema do site
2. **Cor primária** — verde accent `#00ff88` para destaques e glows
3. **Estilo editorial** — clean, minimalista, premium. Não usar frames de dispositivos
4. **Relação com o conteúdo** — a imagem deve representar visualmente o tema do artigo:
   - Mostrar UI elements que o artigo ensina (tooltips, modais, toasts, etc.)
   - Incluir um snippet de código relevante em monospace (1-2 linhas, legível)
   - Representar o conceito central (animação, posicionamento, camadas, etc.)
5. **Sem texto genérico** — evitar títulos ou texto decorativo. O snippet de código é suficiente
6. **Subtle grain texture** — textura sutil de grão para combinar com o design do site

### Prompt de Referência

```
Dark editorial tech illustration (16:9, background #0a0a0a).
Conceito: [descrever o tema específico do artigo].
[Descrever os elementos visuais que representam o conceito].
Incluir snippet de código "[trecho relevante]" em monospace verde (#00ff88).
Minimalista, editorial, premium. Sem frames de dispositivos.
```

---

## Card na Home (index.html)

Cada artigo precisa de um card na seção Blog da página principal:

```html
<a href="/blog/{slug}.html" class="blog-preview-card reveal">
    <div class="blog-preview-card__cover">
        <img src="/assets/images/blog/{slug}.png" alt="" loading="lazy" width="600" height="338">
    </div>
    <div class="blog-preview-card__body">
        <div class="blog-preview-card__tags">
            <span class="blog-tag">TAG</span>
        </div>
        <h3>Título do artigo</h3>
        <p>Descrição curta do artigo.</p>
        <span class="blog-preview-card__meta">DD mmm YYYY · X min</span>
    </div>
</a>
```

---

## Checklist de Publicação

- [ ] Artigo `.html` criado em `/blog/`
- [ ] Meta tags (title, description, OG, canonical)
- [ ] Imagem de capa gerada em `/assets/images/blog/`
- [ ] Card adicionado na home (`index.html`, seção Blog)
- [ ] Card adicionado na listagem (`/blog/index.html`)
- [ ] Sitemap atualizado (`/sitemap.xml`)
- [ ] Testar links, imagens e responsividade
