# Site do casamento — Fernando & Larissa

Site estático (HTML/CSS/JS, sem build). Para publicar na Vercel: importe o repositório e use `casamento` como *Root Directory*.

## O que editar
- **Textos, datas, endereços, convidados, eventos, dress code**: `js/data.js` (tudo marcado com `TODO` é provisório).
- **Imagens** (se faltar, aparece um placeholder):
  - `assets/foto-casal.jpg` — foto da carta (o efeito de filme é aplicado automaticamente)
  - `assets/mapa.jpg` — o mapa que você fez; ajuste `x`/`y` (%) de cada capítulo em `story.chapters`
  - `assets/historia/1.jpg … 5.jpg` — foto de cada capítulo
  - `assets/dresscode/brunch-1.jpg … brunch-4.jpg` — as 4 referências
- **Confirmação de presença**: lista fechada em `guests`. Respostas vão para `rsvpEndpoint` (POST JSON) e/ou WhatsApp (`whatsapp`).
