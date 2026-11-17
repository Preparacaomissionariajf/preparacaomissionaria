/* =========================================================
   TUDO QUE VOCÊ PRECISA EDITAR ESTÁ AQUI.
   Itens marcados com TODO são provisórios.
   ========================================================= */
window.SITE = {
  couple: { a: 'Fernando', b: 'Larissa' },

  // TODO: data/hora reais
  weddingDate: '2027-01-09T09:00:00-03:00',   // TODO: confirmar o horário
  togetherSince: '2025-12-21T00:00:00-03:00',   // começaram a namorar (cronômetro "juntos há")
  place: 'Ribeirão Preto, SP',

  // Confirmação de presença
  whatsapp: '5500000000000',   // TODO: seu número com DDI+DDD (usado se não houver endpoint)
  rsvpEndpoint: '',            // opcional: URL de um Formspree/Google Apps Script que receba POST JSON

  // Carta de abertura
  invite: { src: 'assets/convite.jpg' },
  photo: { src: 'assets/foto-casal.jpg' },
  note: [
    'Querido(a) convidado(a),',
    'você faz parte da nossa história e não dá pra imaginar esse dia sem você por perto. Vem celebrar com a gente: uma manhã no templo, um brunch cheio de carinho e uma noite de boa energia.',
    'Confirma sua presença aqui no site!',
    'Com amor, Fernando & Larissa ♡'
  ],

  // Nossa história (mapa)
  story: {
    intro: 'Cada pedacinho do mapa guarda um capítulo nosso. Toque nos ícones para ler.',
    map: 'assets/mapa.jpg',
    mapFallback: 'assets/mapa-placeholder.svg',
    // x e y em % (0–100) sobre a imagem, na posição de cada ícone do SEU mapa
    chapters: [
      { x: 14.4, y: 26, title: 'Cada um com seu começo', date: '2002 · 2003', text: 'Larissa nasceu em 09/12/2002 e Fernando em 18/11/2003. Sem imaginar, cada um já caminhava na direção do outro.', photo: 'assets/historia/1.jpg' },
      { x: 52, y: 27.3, title: 'Nos conhecemos', date: '2024', text: 'Foi no Instituto, em 2024, que as nossas histórias se cruzaram.', photo: 'assets/historia/2.jpg' },
      { x: 83.4, y: 28, title: 'O musical de Frozen', date: '2024', text: '“Vejo uma porta abrir com você.” O musical nos aproximou e virou a trilha sonora do começo de tudo.', photo: 'assets/historia/3.jpg' },
      { x: 19, y: 40.5, title: 'O primeiro beijo', date: '', text: 'Durante um “ensaio do musical”. 🌙', photo: 'assets/historia/4.jpg' },
      { x: 16.7, y: 57.5, title: 'Primeiro date', date: '', text: 'Baccio di Latte foi o nosso primeiro encontro de verdade.', photo: 'assets/historia/5.jpg' },
      { x: 84, y: 51.5, title: 'E aí já era…', date: '21/12/2025', text: 'Começamos a namorar em 21/12/2025.', photo: 'assets/historia/6.jpg' },
      { x: 49, y: 66.5, title: 'Au pair na França', date: '01/03/2026', text: 'Em 01/03/2026 a Larissa embarcou para a França como au pair. Brasil e França, e o coração nos dois lugares.', photo: 'assets/historia/7.jpg' },
      { x: 83.7, y: 78, title: 'Paris', date: '12/06/2026', text: 'No melhor dia dos namorados, em Paris, com a Torre Eiffel ao fundo, veio o pedido.', photo: 'assets/historia/8.jpg' },
      { x: 51.2, y: 76, title: 'Volta ao Brasil', date: '03/12/2026', text: 'Em 03/12/2026 voltamos para o Brasil, já de olho no grande dia.', photo: 'assets/historia/9.jpg' },
      { x: 20, y: 86, title: 'Nosso casamento', date: '09/01/2027', text: 'Em 09/01/2027, no templo, vamos nos casar para a eternidade.', photo: 'assets/historia/10.jpg' },
      { x: 55, y: 88, title: 'Ribeirão Preto', date: '', text: 'E a nossa história continua em Ribeirão Preto…', photo: 'assets/historia/11.jpg' }
    ]
  },

  // Programação. mapsQuery = o que será buscado no Google Maps
  events: [
    {
      id: 'templo', icon: '⛪', time: '09:00', title: 'Selamento no Templo',   // TODO horários
      place: 'Templo de Ribeirão Preto', address: 'Templo de Ribeirão Preto, Ribeirão Preto, SP',   // TODO: conferir nome e endereço
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
