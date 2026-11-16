/* =========================================================
   TUDO QUE VOCÊ PRECISA EDITAR ESTÁ AQUI.
   Itens marcados com TODO são provisórios.
   ========================================================= */
window.SITE = {
  couple: { a: 'Fernando', b: 'Larissa' },

  // TODO: data/hora reais
  weddingDate: '2026-12-19T09:00:00-03:00',
  togetherSince: '2021-03-14T00:00:00-03:00',   // início do namoro (cronômetro "juntos há")
  place: 'Cidade, Estado',                       // TODO

  // Confirmação de presença
  whatsapp: '5500000000000',   // TODO: seu número com DDI+DDD (usado se não houver endpoint)
  rsvpEndpoint: '',            // opcional: URL de um Formspree/Google Apps Script que receba POST JSON

  // Carta de abertura
  invite: {
    line: 'convidam você para celebrar o nosso selamento',
    when: '19 · 12 · 2026',     // TODO
    where: 'Cidade, Estado',    // TODO
    script: 'juntos para sempre'
  },
  photo: { src: 'assets/foto-casal.jpg', stamp: "'26 11 16", caption: 'nós dois' },
  note: [
    'Querido(a) convidado(a),',
    'você faz parte da nossa história e não dá pra imaginar esse dia sem você por perto. Vem celebrar com a gente: uma manhã no templo, um brunch cheio de carinho e uma noite de boa energia.',
    'Confirma sua presença aqui no site!',
    'Com amor, Fernando & Larissa ♡'
  ],

  // Nossa história (mapa)
  story: {
    intro: 'Cada pedacinho do mapa guarda um capítulo nosso. Toque nos ícones para ler.',
    map: 'assets/mapa.jpg',                 // sua imagem
    mapFallback: 'assets/mapa-placeholder.svg',
    // x e y em % (0–100) sobre a imagem, na posição de cada ícone do SEU mapa
    chapters: [
      { x: 12, y: 24, title: 'Onde tudo começou', date: 'TODO', text: 'TODO: conte aqui como vocês se conheceram.', photo: 'assets/historia/1.jpg' },
      { x: 48, y: 38, title: 'O primeiro encontro', date: 'TODO', text: 'TODO: o primeiro café, o primeiro olhar…', photo: 'assets/historia/2.jpg' },
      { x: 82, y: 35, title: 'O pedido', date: 'TODO', text: 'TODO: como foi o pedido.', photo: 'assets/historia/3.jpg' },
      { x: 64, y: 77, title: 'O noivado', date: 'TODO', text: 'TODO: o anel e o sim.', photo: 'assets/historia/4.jpg' },
      { x: 20, y: 80, title: 'Rumo ao templo', date: 'TODO', text: 'TODO: a preparação para o selamento.', photo: 'assets/historia/5.jpg' }
    ]
  },

  // Programação. mapsQuery = o que será buscado no Google Maps
  events: [
    {
      id: 'templo', icon: '⛪', time: '09:00', title: 'Selamento no Templo',   // TODO horários
      place: 'Templo de TODO', address: 'TODO: endereço completo do templo',
      text: 'O momento mais importante do dia: nos ajoelhar no altar e selar o nosso casamento.',
      buttons: [ { label: 'Dress code', modal: 'dress-templo' }, { label: 'O que é o selamento?', modal: 'selamento' } ]
    },
    {
      id: 'brunch', icon: '🥂', time: '11:30',
      title: 'Brunch',
      place: 'TODO: nome do local', address: 'TODO: endereço completo do brunch',
      text: 'Fotos, abraços e uma mesa farta para começar a celebração.',
      buttons: [ { label: 'Dress code', modal: 'dress-brunch' } ]
    },
    {
      id: 'churrasco', icon: '🔥', time: '19:00',
      title: 'Churrasco',
      place: 'TODO: nome do local', address: 'TODO: endereço completo do churrasco',
      text: 'Para quem quiser confraternizar com a gente à noite.',
      buttons: [ { label: 'O que levar', modal: 'levar' } ]
    }
  ],

  modals: {
    'dress-brunch': {
      title: 'Dress code',
      html: `
        <h4>Passeio Completo Leve (Brunch &amp; Templo)</h4>
        <p>Para celebrarmos essa manhã especial com fotos no templo e um brunch delicioso, pedimos trajes leves, elegantes e em tons claros, pastéis ou estampas florais (como verde-sálvia, azul-claro, rosa, lavanda, amarelo-manteiga e pêssego).</p>
        <p><strong>Para elas:</strong> Vestidos midi ou longos fluidos, ou conjuntos de alfaiataria leves. Estampas florais e tecidos naturais são super bem-vindos. Por favor, evitem a cor branca (reservada à noiva).</p>
        <p><strong>Para eles:</strong> Calça de alfaiataria, sarja ou linho em tons claros (bege, areia, caqui) combinada com camisa social ou de linho (branca, off-white ou em tons claros). Blazer leve é bem-vindo, e a gravata é dispensável.</p>
        <p class="avoid"><strong>O que evitar:</strong> Jeans, bermudas, camisetas básicas e roupas muito escuras ou pesadas.</p>`,
      refsTitle: 'Referências',
      refs: ['assets/dresscode/brunch-1.jpg', 'assets/dresscode/brunch-2.jpg', 'assets/dresscode/brunch-3.jpg', 'assets/dresscode/brunch-4.jpg']
    },
    'dress-templo': {
      title: 'Dress code — Templo',
      // TODO: revisar/pesquisar
      html: `
        <p>Para o templo, os convidados virão com a <strong>roupa dominical de sempre</strong>: bonita, discreta e confortável. Não é necessário usar roupa branca do templo nem vestes cerimoniais.</p>
        <p>Se estiver em dúvida, pense no que você vestiria para a reunião sacramental no domingo.</p>`
    },
    'selamento': {
      title: 'O que é o selamento?',
      // TODO: revisar o texto
      html: `
        <p>O selamento é uma ordenança sagrada realizada dentro do templo de A Igreja de Jesus Cristo dos Santos dos Últimos Dias. Nela, um casal é unido por esta vida e por toda a eternidade, e os filhos que vierem a nascer na aliança também fazem parte dessa família eterna.</p>
        <p>Para nós, é muito mais do que uma cerimônia: é o início de uma família construída em torno de Cristo, e queremos dividir a alegria desse dia com quem amamos.</p>`
    },
    'levar': {
      title: 'O que levar',
      // TODO: ajustar
      html: `
        <p>Quem quiser participar e confraternizar com a gente à noite pode levar um <strong>kit churrasco</strong> e muita <strong>boa energia</strong>.</p>
        <p>Combine entre vocês, leve o que puder e venha com vontade de celebrar.</p>`
    }
  },

  // Lista FECHADA de convidados. Quem tiver o mesmo "group" confirma junto (família/casal).
  // events omitido = convidado para todos os eventos. Para limitar: events: ['templo','brunch']
  guests: [
    { name: 'Convidado Exemplo Um', group: 'fam-exemplo' },
    { name: 'Convidada Exemplo Dois', group: 'fam-exemplo' },
    { name: 'Fulano de Tal' },
    { name: 'Beltrana da Silva', events: ['brunch', 'churrasco'] }
  ]
};
