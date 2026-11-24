/*PARSER-START*/
const PRESET = {
  gasto: ['Alimentação', 'Mercado', 'Transporte', 'Moradia', 'Contas', 'Saúde', 'Lazer', 'Educação', 'Compras', 'Outros'],
  receita: ['Salário', 'Freela', 'Vendas', 'Investimentos', 'Presente', 'Outros']
};
const KW = {
  gasto: [
    ['Mercado', 'mercado supermercado atacadao hortifruti sacolao acougue feira'],
    ['Alimentação', 'padaria restaurante lanche lanchonete ifood pizza cafe almoco jantar sorvete bar hamburguer churrasco'],
    ['Transporte', 'uber 99 taxi gasolina combustivel posto onibus metro estacionamento pedagio passagem'],
    ['Moradia', 'aluguel condominio iptu reforma'],
    ['Contas', 'luz agua internet telefone celular energia gas conta'],
    ['Saúde', 'farmacia medico consulta dentista exame hospital remedio'],
    ['Lazer', 'cinema show viagem hotel streaming netflix spotify parque'],
    ['Educação', 'curso escola faculdade livro mensalidade'],
    ['Compras', 'roupa loja shopee amazon shein']
  ],
  receita: [
    ['Salário', 'salario holerite'],
    ['Freela', 'freela freelance freelancer bico projeto'],
    ['Vendas', 'venda vendas vendi cliente'],
    ['Investimentos', 'rendimento rendimentos dividendo dividendos juros cdb acoes investimento'],
    ['Presente', 'presente']
  ]
};
const NW = { zero:0, um:1, uma:1, dois:2, duas:2, tres:3, quatro:4, cinco:5, seis:6, sete:7, oito:8, nove:9, dez:10, onze:11, doze:12, treze:13, catorze:14, quatorze:14, quinze:15, dezesseis:16, dezessete:17, dezoito:18, dezenove:19, vinte:20, trinta:30, quarenta:40, cinquenta:50, sessenta:60, setenta:70, oitenta:80, noventa:90, cem:100, cento:100, duzentos:200, duzentas:200, trezentos:300, trezentas:300, quatrocentos:400, quatrocentas:400, quinhentos:500, quinhentas:500, seiscentos:600, seiscentas:600, setecentos:700, setecentas:700, oitocentos:800, oitocentas:800, novecentos:900, novecentas:900 };
const NMUL = { mil: 1000, milhao: 1e6, milhoes: 1e6 };
const STOP = new Set('gastei gastou gasto paguei pago pagamento comprei compra recebi ganhei entrou caiu saiu foi deu vendi receita despesa eu reais real conto contos pila pilas valor total r$ hoje'.split(' '));
const LEAD = new Set('na no em nas nos numa num de do da dos das a o as os um uma com pra para pro pelo pela por e'.split(' '));
const SMALL = new Set(['de', 'da', 'do', 'das', 'dos', 'e', 'em', 'no', 'na']);

const fold = s => Array.from(s).map(c => Array.from(c.normalize('NFD').toLowerCase())[0] || ' ').join('');
const reEsc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const titleCase = s => s.split(' ').filter(Boolean).map((w, i) => (i > 0 && SMALL.has(fold(w))) ? w.toLowerCase() : (/[A-ZÀ-Ý]/.test(w.slice(1)) ? w : w.charAt(0).toUpperCase() + w.slice(1))).join(' ');
const numPt = s => /^\d{1,3}(?:\.\d{3})+(?:,\d{1,2})?$/.test(s) ? parseFloat(s.replace(/\./g, '').replace(',', '.')) : parseFloat(s.replace(',', '.'));

const NUM = '(\\d{1,3}(?:\\.\\d{3})+(?:,\\d{1,2})?|\\d+(?:[.,]\\d{1,2})?)';
const CUR = '(?:reais|real|conto|contos|pila|pilas)';
const CENT = '(?:\\s+e\\s+(\\d{1,2})\\s*centavos?)?';
const reA = new RegExp('\\br\\$\\s*' + NUM + '(?:\\s*(mil)\\b)?' + CENT);
const reB = new RegExp('\\b' + NUM + '(?:\\s*(mil)\\b)?\\s*' + CUR + '\\b' + CENT);
const reC = new RegExp('\\b' + NUM + '(?:\\s*(mil)\\b)?' + CENT);
const WTOK = Object.keys(NW).concat(Object.keys(NMUL)).sort((a, b) => b.length - a.length).join('|');
const reW = new RegExp('\\b(?:' + WTOK + ')(?:(?:\\s+e)?\\s+(?:' + WTOK + '))*\\b(\\s+' + CUR + '\\b)?', 'g');
const PRE = '(?:\\b(?:no|na|com|via|pelo|pela|em|de)\\s+)?';
const PAY = [
  ['Débito', new RegExp(PRE + '(?:\\bcartao\\s+(?:de\\s+)?)?\\bdebito\\b')],
  ['Crédito', new RegExp(PRE + '(?:\\bcartao\\s+(?:de\\s+)?)?\\bcredito\\b|' + PRE + '\\bcartao\\b')],
  ['Pix', new RegExp(PRE + '\\bpix\\b')],
  ['À vista', new RegExp(PRE + '(?:\\ba\\s+vista\\b|\\bdinheiro\\b|\\bem\\s+especie\\b)')],
  ['Boleto', new RegExp(PRE + '\\bboleto\\b')],
  ['Transferência', new RegExp(PRE + '\\b(?:transferencia|ted)\\b')]
];

function wordsValue(run) {
  let total = 0, cur = 0;
  for (const t of run.split(/\s+/)) {
    if (t === 'e') continue;
    if (t in NW) cur += NW[t];
    else if (t in NMUL) { total += (cur || 1) * NMUL[t]; cur = 0; }
  }
  return total + cur;
}

function categoryNames(kind, custom) {
  const names = PRESET[kind].slice();
  for (const c of custom || []) if (c.kind === kind && !names.some(n => fold(n) === fold(c.name))) names.splice(names.length - 1, 0, c.name);
  return names;
}
function resolveCategory(kind, text, custom) {
  const ft = fold(text.trim());
  const names = categoryNames(kind, custom);
  const exact = names.find(n => fold(n) === ft);
  if (exact) return { name: exact, isNew: false };
  if (ft.length >= 3) {
    const near = names.find(n => { const fn = fold(n); return fn.length >= 3 && (fn.startsWith(ft) || ft.startsWith(fn)); });
    if (near) return { name: near, isNew: false };
  }
  return { name: titleCase(text.trim()), isNew: true };
}
function inferCategory(kind, storeText, custom) {
  const f = fold(storeText);
  for (const c of custom || []) if (c.kind === kind && f && new RegExp('\\b' + reEsc(fold(c.name)) + '\\b').test(f)) return c.name;
  for (const [cat, words] of KW[kind]) {
    for (const w of words.split(' ')) if (f && new RegExp('\\b' + w + '\\b').test(f)) return cat;
  }
  return 'Outros';
}

function parse(text, ctx) {
  ctx = ctx || {};
  const W = { o: ' ' + String(text).replace(/\s+/g, ' ').replace(/[,;!?]\s/g, ' ').replace(/\.\s/g, ' ').replace(/[,.;!?]\s*$/, '').trim() + ' ' };
  W.f = fold(W.o);
  const cutAt = (i, len) => { W.o = W.o.slice(0, i) + ' ' + W.o.slice(i + len); W.f = W.f.slice(0, i) + ' ' + W.f.slice(i + len); };
  const cut = (re, g) => {
    const m = re.exec(W.f); if (!m) return null;
    let orig = null;
    if (g != null && m.indices && m.indices[g]) orig = W.o.slice(m.indices[g][0], m.indices[g][1]);
    cutAt(m.index, m[0].length);
    return { m, orig };
  };

  const kind = /\b(recebi|ganhei|entrou|caiu|recebimento|receita|vendi|rendeu|depositaram|deposito)\b/.test(W.f) ? 'receita' : 'gasto';

  let inst = 1;
  let r = cut(/\bparcelad[oa]\s+(?:em\s+)?(\d{1,2})\s*(?:x|vezes)?\b/) || cut(/\b(?:em\s+)?(\d{1,2})\s*(?:x|vezes)\b/);
  if (r) { inst = +r.m[1]; if (inst < 2 || inst > 24) inst = 1; }

  let back = 0;
  r = cut(/\b(anteontem|ontem|hoje)\b/);
  if (r) back = { anteontem: 2, ontem: 1, hoje: 0 }[r.m[1]];
  cut(/\bdia\s+\d{1,2}\b/);

  let method = '';
  for (const [name, re] of PAY) { if (cut(re)) { method = name; break; } }

  let planId = null;
  const plans = (ctx.plans || []).slice().sort((a, b) => b.name.length - a.name.length);
  for (const p of plans) {
    const n = reEsc(fold(p.name));
    const re = new RegExp('(?:\\b(?:no|na|do|da|para|pro|pra)\\s+(?:plano\\s+)?(?:o\\s+|a\\s+)?|\\bplano\\s+(?:o\\s+|a\\s+)?)' + n + '\\b');
    if (cut(re)) { planId = p.id; break; }
  }

  let cur = null;
  if (cut(/(?:€|\beuros?\b|\beur\b)/)) cur = 'EUR';
  let cents = 0;
  const calc = m => Math.round(((numPt(m[1]) * (m[2] ? 1000 : 1)) + (m[3] ? (+m[3]) / 100 : 0)) * 100);
  for (const re of [reA, reB, reC]) {
    const m = re.exec(W.f);
    if (m) { cents = calc(m); cutAt(m.index, m[0].length); break; }
  }
  if (!cents) {
    reW.lastIndex = 0;
    let m;
    while ((m = reW.exec(W.f))) {
      const val = wordsValue(m[0].replace(/\s+(?:reais|real|conto|contos|pila|pilas)$/, ''));
      if (val >= 10 || (m[1] && val >= 1)) { cents = val * 100; cutAt(m.index, m[0].length); break; }
    }
  }

  let explicit = null;
  r = cut(/(?:\b(?:na|em|de)\s+)?\bcategoria\s+(?:de\s+|do\s+|da\s+)?(.+?)(?=\s+(?:na|no|em|nas|nos)\s|\s+$)/d, 1);
  if (r && r.orig && r.orig.trim()) explicit = r.orig.trim();

  let words = W.o.split(/\s+/).filter(Boolean).filter(w => !STOP.has(fold(w)));
  while (words.length && LEAD.has(fold(words[0]))) words.shift();
  if (words.length > 1 && fold(words[0]) === 'loja') { words.shift(); while (words.length && LEAD.has(fold(words[0]))) words.shift(); }
  while (words.length && LEAD.has(fold(words[words.length - 1]))) words.pop();
  const store = titleCase(words.join(' '));

  let category, isNewCat = false;
  if (explicit) { const c = resolveCategory(kind, explicit, ctx.cats); category = c.name; isNewCat = c.isNew; }
  else category = inferCategory(kind, store, ctx.cats);

  const date = new Date(); date.setDate(date.getDate() - back);
  return { kind, cents, store, category, isNewCat, method, planId, inst, date, cur };
}
/*PARSER-END*/
