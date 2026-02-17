# 🔥 Tinder Mockup — Deploy Guide

## Estrutura do projeto

```
tinder-mockup/
├── public/
│   ├── icon-192.png
│   └── icon-512.png
├── src/
│   ├── main.jsx
│   └── App.jsx
├── index.html
├── package.json
└── vite.config.js
```

---

## 🚀 Deploy no Vercel (recomendado — grátis)

### Opção A: Via GitHub (mais fácil)

1. Crie um repositório no GitHub:
   ```bash
   git init
   git add .
   git commit -m "tinder mockup"
   git remote add origin https://github.com/SEU_USER/tinder-mockup.git
   git push -u origin main
   ```

2. Acesse [vercel.com](https://vercel.com) → **New Project**
3. Importe o repositório → clique **Deploy**
4. Pronto! Você ganha uma URL tipo `https://tinder-mockup-xxx.vercel.app`

### Opção B: Via Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

---

## 🌐 Outras opções de deploy gratuito

### Netlify (também ótimo)
```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

### GitHub Pages
```bash
# Em vite.config.js, adicione: base: '/tinder-mockup/'
npm run build
npx gh-pages -d dist
```

---

## 💻 Rodar localmente

```bash
npm install
npm run dev
# Abre em http://localhost:5173
```

---

## 📱 Instalar como PWA (após deploy)

### iPhone (Safari)
1. Abra a URL no Safari
2. Toque em **Compartilhar** (quadradinho com seta)
3. Role e toque **"Adicionar à Tela de Início"**
4. O app aparece igual a um app nativo!

### Android (Chrome)
1. Abra a URL no Chrome
2. Toque nos **3 pontinhos** → **"Instalar app"** / **"Adicionar à tela inicial"**

---

## 🔒 Nota sobre câmera

A câmera só funciona em:
- **HTTPS** (Vercel/Netlify dão isso automaticamente)
- **localhost** (durante desenvolvimento)

Em HTTP simples, o navegador bloqueia `getUserMedia` por segurança — por isso deploy é necessário para a feature funcionar em produção.

---

## 🎮 Modos disponíveis

| Modo | Comportamento |
|------|--------------|
| 🎉 Match Clássico | Tela de "It's a Match!" com animação |
| 💋 Modo Beijo | Countdown → convite direto para beijo com câmera frontal ao vivo |
