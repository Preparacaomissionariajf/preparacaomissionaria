const fs=require('fs');
const src=fs.readFileSync(__dirname+'/parser.js','utf8');
const {parse}=new Function(src+';return {parse}')();
const ctx={plans:[{id:'pessoal',name:'Pessoal'},{id:'casamento',name:'Casamento'},{id:'empresa',name:'Empresa'}],cats:[{name:'Roupas',kind:'gasto'}]};
for(const t of [
 'Gastei 50 reais na padaria dona maria no pix categoria alimentação',
 'recebi 2.500 de salário',
 'gastei R$ 129,90 na loja Renner no crédito em 3x categoria roupas',
 'paguei mil e duzentos reais do aluguel no pix',
 'gastei vinte e cinco reais no uber',
 'gastei 300 no casamento no buffet pix',
 'gastei 300 no buffet no pix no plano casamento',
 'recebi 300 de freela ontem no pix',
 'gastei 12,50 no mercado no débito plano empresa',
 'gastei 2 mil no cartão de crédito na loja de móveis categoria casa e jardim',
 'recebi 50 reais e 30 centavos de cashback',
 'gastei 45 na farmácia à vista',
 'gastei sem valor nenhum',
]){const p=parse(t,ctx);console.log(t,'\n  =>',JSON.stringify({...p,date:p.date.toISOString().slice(0,10)}))}
