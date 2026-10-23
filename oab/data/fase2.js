/* 2ª fase do Exame de Ordem (prova prático-profissional, FGV)
   Peça profissional (5,00) + 4 questões discursivas (1,25 cada) na área escolhida pelo candidato.
   Aprovação com nota igual ou superior a 6,00. Casos inéditos, escritos para treino no formato da prova.
   Cada item traz: enunciado, espelho por tópicos (com valor), palavras-chave para a correção automática,
   roteiro de resposta passo a passo e uma resposta-modelo resumida. */
window.OAB = window.OAB || {};
OAB.F2 = {};

OAB.F2.PROVA = {
  peca: 5.0, questoes: 4, valorQuestao: 1.25, corte: 6.0, horas: 5, linhasPeca: 150, linhasQuestao: 30,
  regras: [
    'A peça vale 5,00 pontos e cada uma das 4 questões vale 1,25.',
    'Aprova quem fizer 6,00 ou mais, somando peça e questões.',
    'São 5 horas de prova. É permitido consultar legislação sem anotações, comentários ou jurisprudência.',
    'Peça errada (inadequação da peça) costuma zerar a peça inteira: identificar a peça é a primeira decisão.',
    'Não assine nem se identifique: termine com "Local..., Data..., Advogado..., OAB...". Identificação pode anular a prova.',
    'A peça tem até 150 linhas e cada questão até 30 linhas. O que passar do limite não é lido.'
  ]
};

// roteiro geral de qualquer peça: a ordem que o examinador espera encontrar
OAB.F2.ESTRUTURA = [
  {id: 'enderecamento', t: 'Competência e endereçamento', como: 'Comece pelo juízo competente: vara, comarca/seção, tribunal. Errar a competência custa ponto e às vezes compromete a peça.', re: '(excelent[ií]ssim|ju[ií]z|ju[ií]zo|vara|egr[eé]gio|tribunal|desembargador|ministro)'},
  {id: 'qualificacao', t: 'Qualificação das partes', como: 'Nome, nacionalidade, estado civil, profissão, CPF, endereço (sem inventar dados: use "nacionalidade...", "CPF..."). Indique também a parte contrária.', re: '(nacionalidade|brasileir|estado civil|solteir|casad|profiss|cpf|cnpj|rg\\b|portador|inscrit|residente|domiciliad|endere[cç]o)', min: 2},
  {id: 'peca', t: 'Nome da peça e fundamento legal', como: 'Diga exatamente qual é a peça (ex.: "RESPOSTA À ACUSAÇÃO, com fundamento nos arts. 396 e 396-A do CPP"). É o que define se a peça está certa.'},
  {id: 'cabimento', t: 'Cabimento, tempestividade e preliminares', como: 'Em recursos: cabimento, prazo e preparo. Em defesas: preliminares processuais antes do mérito.', re: '(tempestiv|cab[ií]vel|cabimento|prazo|preliminar|preparo|custas)', so: ['recurso', 'defesa']},
  {id: 'fatos', t: 'Fatos', como: 'Resuma os fatos do enunciado em poucas linhas, sem inventar dados novos.', re: '(dos fatos|do fato|s[ií]ntese|breve relato|relato f[aá]tico)'},
  {id: 'direito', t: 'Fundamentos jurídicos (mérito)', como: 'Uma tese por tópico: diga a tese, cite o dispositivo (artigo, súmula) e aplique ao caso. É onde está a maior parte da nota.', re: '(do direito|dos fundamentos|do m[eé]rito|fundamenta[cç][aã]o|fundamentos jur[ií]dicos)'},
  {id: 'pedidos', t: 'Pedidos e requerimentos', como: 'Peça tudo o que defendeu nos fundamentos, na mesma ordem: principal, subsidiário, provas, citação/intimação, honorários.', re: '(dos pedidos|do pedido|requer|pede|postula|diante do exposto|ante o exposto)'},
  {id: 'valor', t: 'Valor da causa', como: 'Obrigatório na petição inicial (art. 291 e 292 do CPC; na Justiça do Trabalho, pedidos líquidos — art. 840, §1º, da CLT).', re: '(valor da causa|d[aá]-se [aà] causa|atribui-se [aà] causa)', so: ['inicial']},
  {id: 'fechamento', t: 'Fechamento sem identificação', como: 'Termine com "Nestes termos, pede deferimento. Local..., Data..., Advogado..., OAB...". Nunca assine com o seu nome.', re: '(nestes termos|pede deferimento|termos em que|advogad[oa]\\.{0,3}|oab\\.{0,3})'}
];

OAB.F2.AREAS = [
  {id: 'administrativo', nome: 'Direito Administrativo', cor: '#5AD07A', pecas: [
    {n: 'Mandado de segurança', q: 'Ato ilegal de autoridade, direito líquido e certo provado por documentos, até 120 dias da ciência do ato.', f: 'Art. 5º, LXIX, CF e Lei 12.016/2009'},
    {n: 'Ação de indenização contra o Estado', q: 'Dano causado por agente público: responsabilidade objetiva.', f: 'Art. 37, §6º, CF'},
    {n: 'Ação anulatória de ato administrativo', q: 'Ato com vício (competência, forma, motivo, finalidade, objeto) que precisa de prova além de documentos.', f: 'Procedimento comum do CPC'},
    {n: 'Contestação em ação de improbidade', q: 'Defesa do agente ou do particular acusado de improbidade.', f: 'Lei 8.429/1992 (com a Lei 14.230/2021)'},
    {n: 'Apelação / agravo de instrumento', q: 'Recorrer de sentença ou de decisão interlocutória do rol do art. 1.015 do CPC.', f: 'Arts. 1.009 e 1.015 do CPC'}
  ]},
  {id: 'civil', nome: 'Direito Civil', cor: '#4C8DFF', pecas: [
    {n: 'Petição inicial', q: 'O cliente quer propor a ação (cobrança, indenização, obrigação de fazer, despejo, alimentos…).', f: 'Arts. 319 e 320 do CPC'},
    {n: 'Contestação', q: 'O cliente foi citado e precisa se defender no prazo de 15 dias.', f: 'Arts. 335 a 342 do CPC'},
    {n: 'Apelação', q: 'Há sentença desfavorável; prazo de 15 dias úteis.', f: 'Arts. 1.009 a 1.014 do CPC'},
    {n: 'Agravo de instrumento', q: 'Decisão interlocutória do rol do art. 1.015 (ex.: tutela provisória).', f: 'Arts. 1.015 a 1.020 do CPC'},
    {n: 'Embargos de declaração', q: 'Decisão com omissão, contradição, obscuridade ou erro material; 5 dias.', f: 'Arts. 1.022 a 1.026 do CPC'},
    {n: 'Embargos à execução / impugnação ao cumprimento de sentença', q: 'Defesa do executado: título extrajudicial (embargos) ou judicial (impugnação).', f: 'Arts. 914 e 525 do CPC'}
  ]},
  {id: 'constitucional', nome: 'Direito Constitucional', cor: '#FF6B6B', pecas: [
    {n: 'ADI / ADC / ADPF', q: 'Controle concentrado; atenção aos legitimados do art. 103 da CF.', f: 'Lei 9.868/1999 e Lei 9.882/1999'},
    {n: 'Mandado de segurança', q: 'Direito líquido e certo contra ato de autoridade.', f: 'Art. 5º, LXIX, CF e Lei 12.016/2009'},
    {n: 'Mandado de injunção', q: 'Falta de norma regulamentadora que inviabiliza direito constitucional.', f: 'Art. 5º, LXXI, CF e Lei 13.300/2016'},
    {n: 'Ação popular', q: 'Cidadão contra ato lesivo ao patrimônio público, à moralidade, ao meio ambiente.', f: 'Art. 5º, LXXIII, CF e Lei 4.717/1965'},
    {n: 'Habeas data / reclamação / recurso extraordinário', q: 'Informações pessoais; desrespeito a decisão do STF; ofensa direta à CF.', f: 'Art. 5º, LXXII; art. 102, I, "l"; art. 102, III, CF'}
  ]},
  {id: 'empresarial', nome: 'Direito Empresarial', cor: '#FECA57', pecas: [
    {n: 'Pedido de falência', q: 'Credor com título protestado acima de 40 salários mínimos ou execução frustrada.', f: 'Art. 94 da Lei 11.101/2005'},
    {n: 'Petição de recuperação judicial', q: 'Devedor empresário em crise, com mais de 2 anos de atividade regular.', f: 'Arts. 48 e 51 da Lei 11.101/2005'},
    {n: 'Habilitação ou impugnação de crédito', q: 'Incluir ou corrigir crédito no quadro geral.', f: 'Arts. 7º a 20 da Lei 11.101/2005'},
    {n: 'Ação monitória / execução de título de crédito', q: 'Cheque, nota promissória ou duplicata sem pagamento.', f: 'Art. 700 do CPC; Leis 7.357/85 e 5.474/68'},
    {n: 'Contestação / apelação em ação societária', q: 'Dissolução parcial, apuração de haveres, exclusão de sócio.', f: 'Arts. 599 a 609 do CPC; arts. 1.028 a 1.032 e 1.085 do CC'}
  ]},
  {id: 'penal', nome: 'Direito Penal', cor: '#B678FF', pecas: [
    {n: 'Resposta à acusação', q: 'Denúncia recebida e réu citado: 10 dias para a defesa, com pedido de absolvição sumária.', f: 'Arts. 396 e 396-A do CPP'},
    {n: 'Memoriais (alegações finais)', q: 'Instrução encerrada; juiz abriu prazo para alegações finais por escrito.', f: 'Art. 403, §3º, do CPP'},
    {n: 'Apelação', q: 'Sentença condenatória ou absolutória: interposição em 5 dias e razões em 8.', f: 'Arts. 593 e 600 do CPP'},
    {n: 'Recurso em sentido estrito', q: 'Hipóteses do art. 581 (ex.: pronúncia, rejeição da denúncia).', f: 'Art. 581 do CPP'},
    {n: 'Habeas corpus', q: 'Prisão ou ameaça ilegal à liberdade de locomoção.', f: 'Art. 5º, LXVIII, CF e arts. 647 e 648 do CPP'},
    {n: 'Relaxamento / liberdade provisória / revogação da preventiva', q: 'Prisão ilegal (relaxamento) ou legal mas desnecessária.', f: 'Art. 5º, LXV e LXVI, CF; arts. 310, 316 e 321 do CPP'},
    {n: 'Agravo em execução / revisão criminal', q: 'Decisão do juiz da execução; condenação transitada com erro.', f: 'Art. 197 da LEP; art. 621 do CPP'}
  ]},
  {id: 'trabalho', nome: 'Direito do Trabalho', cor: '#F368E0', pecas: [
    {n: 'Reclamação trabalhista', q: 'O empregado quer cobrar direitos; pedidos certos e com valor.', f: 'Art. 840, §1º, da CLT'},
    {n: 'Contestação', q: 'A empresa foi notificada e se defende em audiência (ou por escrito no PJe).', f: 'Art. 847 da CLT'},
    {n: 'Recurso ordinário', q: 'Sentença da Vara do Trabalho; 8 dias, com depósito recursal e custas.', f: 'Art. 895, I, da CLT'},
    {n: 'Recurso de revista', q: 'Acórdão do TRT que contraria lei federal, súmula do TST ou da CF.', f: 'Art. 896 da CLT'},
    {n: 'Agravo de petição / embargos à execução', q: 'Decisões na fase de execução.', f: 'Arts. 884 e 897, "a", da CLT'},
    {n: 'Inquérito para apuração de falta grave', q: 'Dispensa de empregado estável que exige ação prévia.', f: 'Arts. 853 a 855 da CLT'}
  ]},
  {id: 'tributario', nome: 'Direito Tributário', cor: '#48DBFB', pecas: [
    {n: 'Mandado de segurança', q: 'Cobrança ou ato ilegal com prova documental, até 120 dias.', f: 'Lei 12.016/2009'},
    {n: 'Ação anulatória de débito fiscal', q: 'Crédito já lançado que precisa ser anulado.', f: 'Art. 38 da Lei 6.830/1980'},
    {n: 'Ação declaratória de inexistência de relação jurídico-tributária', q: 'Antes do lançamento, para não pagar tributo indevido.', f: 'Art. 19, I, do CPC'},
    {n: 'Repetição de indébito', q: 'Tributo pago indevidamente; prazo de 5 anos.', f: 'Arts. 165 e 168 do CTN'},
    {n: 'Embargos à execução fiscal', q: 'Execução fiscal ajuizada e juízo garantido; 30 dias.', f: 'Art. 16 da Lei 6.830/1980'},
    {n: 'Exceção de pré-executividade', q: 'Matéria de ordem pública sem necessidade de prova (ex.: prescrição).', f: 'Súmula 393 do STJ'}
  ]}
];

OAB.F2.ITENS = [
  /* ============================== DIREITO CIVIL ============================== */
  {id: 'civ-p1', area: 'civil', tipo: 'peca', pecaTipo: 'inicial',
    titulo: 'Geladeira paga e não entregue',
    enunciado: 'Maria, professora, residente em Goiânia/GO, comprou pela internet, em 10/08, uma geladeira da Loja Frio Bom Ltda., com sede em São Paulo/SP, pagando R$ 4.000,00 à vista no cartão. A entrega estava prometida para 20/08. Desde então, a loja não entrega o produto, não devolve o dinheiro e ignora os protocolos de atendimento abertos por Maria. Maria tem uma filha de 2 anos que depende de leite e alimentos refrigerados e, há 40 dias, guarda os alimentos na casa de vizinhos. Ela procura você querendo receber a geladeira o quanto antes ou, se isso não for possível, o dinheiro de volta, além de ser compensada pelo transtorno.',
    comando: 'Na qualidade de advogado(a) de Maria, elabore a peça processual adequada para a defesa dos interesses da cliente, considerando que ainda não há processo em curso.',
    pecaCorreta: 'Petição inicial de ação de obrigação de fazer c/c indenização por danos morais, com pedido de tutela de urgência',
    opcoesPeca: ['Petição inicial de ação de obrigação de fazer c/c indenização por danos morais, com pedido de tutela de urgência', 'Contestação', 'Notificação extrajudicial', 'Ação monitória', 'Mandado de segurança'],
    pecaChaves: ['obriga[cç][aã]o de fazer', 'peti[cç][aã]o inicial', 'a[cç][aã]o de'],
    topicos: [
      {t: 'Endereçamento: Juízo de Direito da Vara Cível da Comarca de Goiânia/GO (foro do domicílio do consumidor)', v: 0.25, ch: ['vara c[ií]vel', 'goi[aâ]nia', '101'], dica: 'Art. 101, I, do CDC permite ao consumidor ajuizar no seu domicílio.'},
      {t: 'Qualificação da autora e da ré (art. 319, II, CPC)', v: 0.20, ch: ['319', 'cnpj', 'cpf', 'qualifica']},
      {t: 'Nome da ação: obrigação de fazer c/c indenização por danos morais com tutela de urgência', v: 0.30, ch: ['obriga[cç][aã]o de fazer', 'danos morais', 'tutela']},
      {t: 'Fatos: compra, pagamento, prazo de entrega descumprido e tentativas de solução', v: 0.20, ch: ['fatos', 'entrega', 'pag']},
      {t: 'Relação de consumo: Maria consumidora e a loja fornecedora (arts. 2º e 3º do CDC)', v: 0.40, ch: ['rela[cç][aã]o de consumo', 'consumidor', 'fornecedor', 'art\\.? ?2', 'art\\.? ?3']},
      {t: 'Cumprimento forçado da oferta ou restituição do valor (art. 35, I e III, do CDC)', v: 0.60, ch: ['art\\.? ?35', 'oferta', 'cumprimento for[cç]ado', 'restitui']},
      {t: 'Dano moral pela privação de bem essencial e pelo descaso (art. 6º, VI, do CDC)', v: 0.50, ch: ['dano moral', 'danos morais', '6[º°o]?,? ?vi', 'art\\.? ?6']},
      {t: 'Inversão do ônus da prova (art. 6º, VIII, do CDC)', v: 0.30, ch: ['invers[aã]o', '[oô]nus da prova', 'viii']},
      {t: 'Tutela de urgência: probabilidade do direito e perigo de dano, com a filha pequena (art. 300 do CPC)', v: 0.60, ch: ['art\\.? ?300', 'tutela de urg', 'probabilidade', 'perigo de dano']},
      {t: 'Pedidos: tutela para entrega em prazo com multa diária (art. 537 CPC), procedência, conversão em perdas e danos/restituição, danos morais, citação, honorários', v: 0.80, ch: ['multa di[aá]ria', 'astreinte', '537', 'proced', 'cita[cç][aã]o', 'honor[aá]rios', 'restitui']},
      {t: 'Audiência de conciliação (opção) e provas (art. 319, VI e VII, CPC)', v: 0.30, ch: ['concilia', 'provas', 'vii']},
      {t: 'Valor da causa: R$ 4.000,00 + valor pretendido de danos morais (art. 292, V e VI, CPC)', v: 0.30, ch: ['valor da causa', '292']},
      {t: 'Fechamento: local, data, advogado, OAB', v: 0.25, ch: ['nestes termos', 'pede deferimento', 'oab']}
    ],
    roteiro: [
      {passo: 'Identifique a peça', como: 'Não há processo e Maria quer o produto ou o dinheiro: é petição inicial, de obrigação de fazer cumulada com indenização, com tutela de urgência.', fundamento: 'Arts. 319 e 300 do CPC'},
      {passo: 'Escolha a competência', como: 'Relação de consumo permite ajuizar no domicílio da consumidora: Vara Cível de Goiânia.', fundamento: 'Art. 101, I, do CDC'},
      {passo: 'Qualifique as partes', como: 'Maria (com "nacionalidade...", "CPF...") e a Loja Frio Bom Ltda. ("CNPJ...", sede em São Paulo/SP).', fundamento: 'Art. 319, II, do CPC'},
      {passo: 'Narre os fatos', como: 'Compra em 10/08, pagamento de R$ 4.000,00, entrega prometida para 20/08, protocolos ignorados, filha de 2 anos.', fundamento: ''},
      {passo: 'Desenvolva o direito', como: 'Relação de consumo → descumprimento da oferta (cumprimento forçado ou restituição) → dano moral → inversão do ônus da prova.', fundamento: 'Arts. 2º, 3º, 6º, VI e VIII, e 35 do CDC'},
      {passo: 'Fundamente a tutela de urgência', como: 'Probabilidade: comprovante de pagamento. Perigo: criança sem alimentos refrigerados. Peça entrega em 48h sob multa diária.', fundamento: 'Arts. 300 e 537 do CPC'},
      {passo: 'Feche com pedidos e valor da causa', como: 'Tutela, citação, procedência, alternativa de restituição, danos morais, inversão, provas, audiência, honorários; valor da causa e fechamento sem assinatura.', fundamento: 'Arts. 291, 292 e 319 do CPC'}
    ],
    modelo: 'EXCELENTÍSSIMO SENHOR DOUTOR JUIZ DE DIREITO DA ___ VARA CÍVEL DA COMARCA DE GOIÂNIA/GO. MARIA..., nacionalidade..., estado civil..., professora, CPF..., residente em Goiânia/GO, por seu advogado (procuração anexa), vem propor AÇÃO DE OBRIGAÇÃO DE FAZER C/C INDENIZAÇÃO POR DANOS MORAIS COM PEDIDO DE TUTELA DE URGÊNCIA, com fundamento nos arts. 319 e 300 do CPC e nos arts. 6º e 35 do CDC, em face de LOJA FRIO BOM LTDA., CNPJ..., com sede em São Paulo/SP. I – DOS FATOS (resumo). II – DO DIREITO: relação de consumo (arts. 2º e 3º CDC); descumprimento da oferta e direito ao cumprimento forçado ou à restituição (art. 35, I e III); dano moral (art. 6º, VI); inversão do ônus da prova (art. 6º, VIII). III – DA TUTELA DE URGÊNCIA (art. 300 CPC), com multa diária (art. 537). IV – DOS PEDIDOS (...). Valor da causa: R$ ... (art. 292, V e VI). Nestes termos, pede deferimento. Local..., Data..., Advogado..., OAB...'
  },
  {id: 'civ-q1', area: 'civil', tipo: 'questao', titulo: 'Prazo para pedir indenização',
    enunciado: 'Em 05/03/2023, Pedro teve o carro atingido por um ônibus da Viação Rápida Ltda., que avançou o sinal vermelho. Pedro só procurou um advogado em 20/04/2026, querendo ser indenizado pelos danos materiais.',
    itens: [
      {letra: 'A', p: 'A pretensão de Pedro ainda pode ser exercida? Fundamente.', v: 0.65, esp: 'Não. A pretensão de reparação civil prescreve em 3 anos (art. 206, §3º, V, do CC), contados da violação do direito (art. 189 do CC). O prazo terminou em 05/03/2026.', ch: ['206', 'tr[eê]s anos', '3 anos', '189', 'prescri']},
      {letra: 'B', p: 'Se Pedro tivesse ajuizado a ação em 01/03/2026 e o despacho que ordenou a citação saísse em 10/03/2026, a prescrição estaria consumada? Fundamente.', v: 0.60, esp: 'Não. O despacho que ordena a citação interrompe a prescrição (art. 202, I, do CC) e a interrupção retroage à data da propositura da ação (art. 240, §1º, do CPC), desde que o autor promova a citação no prazo legal.', ch: ['202', 'interromp', 'interrup', '240', 'retroag']}
    ],
    roteiro: [
      {passo: 'Responda logo de cara', como: 'Comece com "Não, a pretensão está prescrita" e só depois explique.', fundamento: ''},
      {passo: 'Cite o prazo e o termo inicial', como: 'Reparação civil: 3 anos, contados do acidente (nascimento da pretensão).', fundamento: 'Arts. 189 e 206, §3º, V, do CC'},
      {passo: 'No item B, use a retroação', como: 'Interrupção pelo despacho de citação, retroagindo à propositura.', fundamento: 'Art. 202, I, CC e art. 240, §1º, CPC'}
    ]},
  {id: 'civ-q2', area: 'civil', tipo: 'questao', titulo: 'Fiança sem autorização do cônjuge',
    enunciado: 'João, casado com Ana pelo regime da comunhão parcial, assinou sozinho como fiador um contrato de locação de seu amigo Carlos. Carlos deixou de pagar os aluguéis e o locador executou João diretamente, sem cobrar antes o patrimônio de Carlos. O contrato não tem cláusula de renúncia a benefícios.',
    itens: [
      {letra: 'A', p: 'João pode exigir que primeiro sejam executados os bens de Carlos? Fundamente.', v: 0.60, esp: 'Sim. O fiador demandado pode exigir que sejam primeiro executados os bens do devedor (benefício de ordem — art. 827 do CC), pois não renunciou a ele (art. 828, I, do CC). Deve nomear bens do devedor livres e desembargados (art. 827, parágrafo único).', ch: ['827', 'benef[ií]cio de ordem', '828']},
      {letra: 'B', p: 'Qual a consequência da ausência de autorização de Ana na fiança? Fundamente.', v: 0.65, esp: 'A fiança exige autorização do cônjuge, salvo no regime da separação absoluta (art. 1.647, III, do CC). Sem ela, a garantia é ineficaz por inteiro (Súmula 332 do STJ), e o ato é anulável a pedido de Ana (art. 1.649 do CC).', ch: ['1\\.?647', 'outorga', 'autoriza[cç][aã]o', '332', '1\\.?649', 'inefic']}
    ],
    roteiro: [
      {passo: 'Item A: benefício de ordem', como: 'Afirme o direito, cite o artigo e mostre que não houve renúncia no contrato.', fundamento: 'Arts. 827 e 828, I, do CC'},
      {passo: 'Item B: outorga conjugal', como: 'Fiança exige autorização do cônjuge; sem ela, ineficácia total da garantia.', fundamento: 'Art. 1.647, III, CC e Súmula 332 do STJ'}
    ]},
  {id: 'civ-q3', area: 'civil', tipo: 'questao', titulo: 'Recurso certo contra cada decisão',
    enunciado: 'Na ação de cobrança movida por Lúcia, o juiz indeferiu o pedido de tutela de urgência. Meses depois, proferiu sentença julgando o pedido procedente, mas deixou de se manifestar sobre o pedido de juros de mora expressamente formulado na inicial.',
    itens: [
      {letra: 'A', p: 'Qual o recurso cabível contra a decisão que indeferiu a tutela de urgência e em que prazo? Fundamente.', v: 0.60, esp: 'Agravo de instrumento (art. 1.015, I, do CPC), no prazo de 15 dias úteis (arts. 1.003, §5º, e 219 do CPC).', ch: ['agravo de instrumento', '1\\.?015', '15 dias', 'quinze', '1\\.?003']},
      {letra: 'B', p: 'Qual a medida adequada para sanar a falta de manifestação sobre os juros? Fundamente, indicando prazo e efeito sobre o prazo de outros recursos.', v: 0.65, esp: 'Embargos de declaração por omissão (art. 1.022, II, do CPC), em 5 dias (art. 1.023). Eles interrompem o prazo para outros recursos (art. 1.026).', ch: ['embargos de declara', '1\\.?022', 'omiss', '5 dias', 'cinco', '1\\.?023', '1\\.?026', 'interromp']}
    ],
    roteiro: [
      {passo: 'Nomeie o recurso', como: 'Escreva o nome do recurso na primeira linha da resposta.', fundamento: ''},
      {passo: 'Dê o fundamento e o prazo', como: 'Item A: rol do art. 1.015 e 15 dias. Item B: omissão, 5 dias e efeito interruptivo.', fundamento: 'Arts. 1.003, 1.015, 1.022, 1.023 e 1.026 do CPC'}
    ]},
  {id: 'civ-q4', area: 'civil', tipo: 'questao', titulo: 'Alimentos dos avós e prisão civil',
    enunciado: 'Bruno, 8 anos, representado pela mãe, recebe pensão do pai, que paga valor muito abaixo das suas necessidades e está há 5 meses sem pagar nada. Os avós paternos têm boa condição financeira.',
    itens: [
      {letra: 'A', p: 'É possível pedir alimentos aos avós paternos? Em que condições? Fundamente.', v: 0.60, esp: 'Sim, de forma complementar e subsidiária, quando os pais não puderem suprir totalmente as necessidades do menor (art. 1.696 e 1.698 do CC; Súmula 596 do STJ).', ch: ['1\\.?696', '1\\.?698', '596', 'subsidi', 'complementar', 'av[oó]s']},
      {letra: 'B', p: 'Pode ser decretada a prisão civil do pai por todas as 5 prestações em atraso? Fundamente.', v: 0.65, esp: 'Não por todas. A prisão civil autoriza a cobrança das 3 prestações anteriores ao ajuizamento da execução e das que vencerem no curso do processo (art. 528, §7º, do CPC; Súmula 309 do STJ). As anteriores seguem pelo rito da penhora.', ch: ['528', '309', 'tr[eê]s', '3 presta', 'pris[aã]o civil']}
    ],
    roteiro: [
      {passo: 'Item A: diga "sim" e a condição', como: 'Obrigação avoenga é complementar e subsidiária.', fundamento: 'Art. 1.698 CC e Súmula 596 STJ'},
      {passo: 'Item B: limite da prisão', como: 'Só as 3 últimas antes da execução e as vincendas; o restante pela penhora.', fundamento: 'Art. 528, §7º, CPC e Súmula 309 STJ'}
    ]},

  /* ============================== DIREITO PENAL ============================== */
  {id: 'pen-p1', area: 'penal', tipo: 'peca', pecaTipo: 'defesa',
    titulo: 'Furto de um desodorante',
    enunciado: 'José, 24 anos, primário, sem antecedentes, foi abordado pelo segurança de um supermercado em Anápolis/GO ao sair sem pagar um desodorante de R$ 15,00, que foi imediatamente devolvido ao estabelecimento. O Ministério Público ofereceu denúncia pelo crime de furto simples (art. 155, caput, do CP). A denúncia foi recebida pelo Juízo da 1ª Vara Criminal de Anápolis e José foi citado pessoalmente em uma segunda-feira, 02/09. José procura você no mesmo dia. Há duas testemunhas que podem confirmar que ele estava desempregado e que nunca respondeu a outro processo.',
    comando: 'Na qualidade de advogado(a) de José, elabore a peça processual cabível, privativa de advogado, considerando o momento processual, indicando seus fundamentos e o último dia do prazo.',
    pecaCorreta: 'Resposta à acusação',
    opcoesPeca: ['Resposta à acusação', 'Memoriais (alegações finais)', 'Habeas corpus', 'Apelação', 'Recurso em sentido estrito'],
    pecaChaves: ['resposta [aà] acusa[cç][aã]o', '396'],
    topicos: [
      {t: 'Endereçamento: Juízo da 1ª Vara Criminal da Comarca de Anápolis/GO', v: 0.15, ch: ['vara criminal', 'an[aá]polis']},
      {t: 'Qualificação e indicação da peça: resposta à acusação, arts. 396 e 396-A do CPP', v: 0.40, ch: ['resposta [aà] acusa', '396']},
      {t: 'Tempestividade: 10 dias da citação; último dia 12/09', v: 0.30, ch: ['10 dias', 'dez dias', '12/09', '12 de setembro', 'tempestiv']},
      {t: 'Princípio da insignificância: mínima ofensividade, ausência de periculosidade, reduzido grau de reprovabilidade e inexpressividade da lesão; bem devolvido', v: 1.00, ch: ['insignific', 'atipicidade material', 'ofensividade', 'periculosidade', 'reprovabilidade', 'inexpressiv', 'bagatela']},
      {t: 'Atipicidade material: o fato não constitui crime', v: 0.40, ch: ['atipic', 'n[aã]o constitui crime', 'fato at[ií]pico']},
      {t: 'Pedido de absolvição sumária (art. 397, III, do CPP)', v: 0.80, ch: ['absolvi[cç][aã]o sum[aá]ria', '397', 'iii']},
      {t: 'Tese subsidiária: furto privilegiado — réu primário e coisa de pequeno valor (art. 155, §2º, do CP)', v: 0.60, ch: ['155,? ?§ ?2', 'privilegiad', 'pequeno valor', 'prim[aá]rio']},
      {t: 'Tese subsidiária: acordo de não persecução penal (art. 28-A do CPP)', v: 0.40, ch: ['28-a', 'n[aã]o persecu']},
      {t: 'Rol de testemunhas e requerimento de provas (art. 396-A)', v: 0.30, ch: ['testemunha', 'rol']},
      {t: 'Pedidos finais em ordem: absolvição sumária; subsidiariamente, privilégio e ANPP; produção de provas', v: 0.40, ch: ['subsidiariamente', 'requer', 'pedidos']},
      {t: 'Fechamento: local, data (12/09), advogado, OAB', v: 0.25, ch: ['oab', 'nestes termos', 'pede deferimento']}
    ],
    roteiro: [
      {passo: 'Situe o momento processual', como: 'Denúncia recebida e réu citado: a defesa é a resposta à acusação, em 10 dias.', fundamento: 'Arts. 396 e 396-A do CPP'},
      {passo: 'Calcule o prazo', como: 'Prazo penal conta a partir do dia seguinte à citação e não se interrompe: de 02/09, termina em 12/09.', fundamento: 'Art. 798, §1º, do CPP'},
      {passo: 'Enderece e qualifique', como: 'Juízo da 1ª Vara Criminal de Anápolis/GO; José, já qualificado nos autos.', fundamento: ''},
      {passo: 'Tese principal: insignificância', como: 'Liste os 4 vetores do STF e aplique: R$ 15,00, bem devolvido, réu primário, sem violência.', fundamento: 'Princípio da insignificância (STF, HC 84.412)'},
      {passo: 'Peça a absolvição sumária', como: 'Fato atípico materialmente: absolvição sumária.', fundamento: 'Art. 397, III, do CPP'},
      {passo: 'Teses subsidiárias', como: 'Furto privilegiado e ANPP, se o juiz não absolver.', fundamento: 'Art. 155, §2º, do CP; art. 28-A do CPP'},
      {passo: 'Provas e fechamento', como: 'Rol com as duas testemunhas; pedidos na ordem; "Local..., 12/09, Advogado..., OAB...".', fundamento: 'Art. 396-A do CPP'}
    ],
    modelo: 'EXCELENTÍSSIMO SENHOR DOUTOR JUIZ DE DIREITO DA 1ª VARA CRIMINAL DA COMARCA DE ANÁPOLIS/GO. Processo nº... JOSÉ..., já qualificado, vem, por seu advogado, apresentar RESPOSTA À ACUSAÇÃO, com fundamento nos arts. 396 e 396-A do CPP. I – DA TEMPESTIVIDADE (citação em 02/09; prazo final 12/09). II – DOS FATOS. III – DO DIREITO: 1. Princípio da insignificância e atipicidade material (mínima ofensividade, nenhuma periculosidade social, reduzido grau de reprovabilidade, inexpressividade da lesão; bem restituído). 2. Subsidiariamente, furto privilegiado (art. 155, §2º, CP). 3. Subsidiariamente, ANPP (art. 28-A CPP). IV – DOS PEDIDOS: absolvição sumária (art. 397, III, CPP); subsidiariamente... ; oitiva das testemunhas arroladas. Nestes termos, pede deferimento. Local..., 12/09..., Advogado..., OAB...'
  },
  {id: 'pen-q1', area: 'penal', tipo: 'questao', titulo: 'Prescrição e idade do réu',
    enunciado: 'Lucas, com 19 anos na data do fato, praticou crime cuja pena máxima é de 4 anos. A denúncia foi recebida 5 anos depois do fato.',
    itens: [
      {letra: 'A', p: 'Ocorreu a prescrição da pretensão punitiva antes do recebimento da denúncia? Fundamente.', v: 0.65, esp: 'Sim. Pela pena máxima de 4 anos, a prescrição seria de 8 anos (art. 109, IV, do CP), mas o prazo é reduzido pela metade porque Lucas tinha menos de 21 anos na data do fato (art. 115 do CP): 4 anos. Como a denúncia só foi recebida após 5 anos, a punibilidade está extinta (art. 107, IV, do CP).', ch: ['115', 'metade', '109', '21 anos', '107']},
      {letra: 'B', p: 'Qual seria o primeiro marco interruptivo da prescrição neste caso? Fundamente.', v: 0.60, esp: 'O recebimento da denúncia (art. 117, I, do CP).', ch: ['117', 'recebimento da den[uú]ncia']}
    ],
    roteiro: [
      {passo: 'Calcule em etapas', como: 'Pena máxima → tabela do art. 109 → redução do art. 115 → compare com o tempo decorrido.', fundamento: 'Arts. 109, IV, e 115 do CP'},
      {passo: 'Conclua e cite a extinção', como: 'Extinção da punibilidade pela prescrição.', fundamento: 'Art. 107, IV, do CP'}
    ]},
  {id: 'pen-q2', area: 'penal', tipo: 'questao', titulo: 'Legítima defesa e júri',
    enunciado: 'Rafael foi atacado com uma faca por Tiago e, para se defender, desferiu um golpe com um pedaço de madeira que derrubou o agressor. Já com Tiago desacordado no chão, Rafael deu mais três golpes, que o levaram à morte.',
    itens: [
      {letra: 'A', p: 'Rafael agiu em legítima defesa? Analise o primeiro golpe e os golpes seguintes. Fundamente.', v: 0.65, esp: 'O primeiro golpe foi em legítima defesa: repeliu injusta agressão atual usando moderadamente o meio necessário (art. 25 do CP). Os golpes posteriores, com o agressor já desacordado, configuram excesso punível, respondendo Rafael pelo excesso doloso ou culposo (art. 23, parágrafo único, do CP).', ch: ['art\\.? ?25', 'legítima defesa', 'legitima defesa', 'excesso', '23', 'injusta agress']},
      {letra: 'B', p: 'Qual o órgão competente para julgar Rafael, caso denunciado por homicídio doloso? Fundamente.', v: 0.60, esp: 'O Tribunal do Júri, competente para os crimes dolosos contra a vida (art. 5º, XXXVIII, "d", da CF e art. 74, §1º, do CPP).', ch: ['j[uú]ri', 'xxxviii', '74']}
    ],
    roteiro: [
      {passo: 'Separe os momentos', como: 'Analise cada golpe: os requisitos da legítima defesa existem no primeiro e somem nos seguintes.', fundamento: 'Art. 25 do CP'},
      {passo: 'Nomeie o excesso', como: 'Excesso punível, doloso ou culposo.', fundamento: 'Art. 23, parágrafo único, do CP'},
      {passo: 'Competência', como: 'Crime doloso contra a vida: Júri.', fundamento: 'Art. 5º, XXXVIII, "d", CF'}
    ]},
  {id: 'pen-q3', area: 'penal', tipo: 'questao', titulo: 'Prisão preventiva de ofício',
    enunciado: 'Durante a instrução de um processo por estelionato (pena máxima de 5 anos), o juiz, sem requerimento do Ministério Público ou representação da autoridade policial, decretou a prisão preventiva do réu, afirmando apenas que "o crime é grave e gera revolta social". A prisão já dura 120 dias sem qualquer reavaliação.',
    itens: [
      {letra: 'A', p: 'A decretação da preventiva foi válida? Fundamente.', v: 0.65, esp: 'Não. O juiz não pode decretar a preventiva de ofício (art. 311 do CPP, com a Lei 13.964/2019). Além disso, a gravidade abstrata do crime não basta: é preciso fundamentação concreta nos requisitos do art. 312 do CPP (art. 315, §2º).', ch: ['311', 'de of[ií]cio', '312', '315', 'gravidade abstrata', 'fundamenta']},
      {letra: 'B', p: 'Que providência a defesa pode adotar diante da falta de reavaliação? Fundamente.', v: 0.60, esp: 'A preventiva deve ser revista a cada 90 dias, sob pena de se tornar ilegal (art. 316, parágrafo único, do CPP). A defesa pode pedir a revogação/relaxamento ao juiz ou impetrar habeas corpus (art. 5º, LXVIII, CF; art. 648 do CPP).', ch: ['316', '90 dias', 'noventa', 'habeas corpus', 'relaxamento', 'revoga']}
    ],
    roteiro: [
      {passo: 'Dois vícios no item A', como: 'Decretação de ofício e fundamentação genérica.', fundamento: 'Arts. 311, 312 e 315 do CPP'},
      {passo: 'Item B: revisão periódica', como: 'Prazo de 90 dias e o remédio cabível.', fundamento: 'Art. 316, parágrafo único, do CPP'}
    ]},
  {id: 'pen-q4', area: 'penal', tipo: 'questao', titulo: 'Porte de droga para consumo',
    enunciado: 'Ana foi surpreendida com 2 gramas de cocaína em uma festa, sem qualquer outro indício de comércio. Foi encaminhada à delegacia, e o delegado lavrou auto de prisão em flagrante por tráfico.',
    itens: [
      {letra: 'A', p: 'Qual a tipificação adequada e as penas aplicáveis? Fundamente.', v: 0.65, esp: 'Porte de droga para consumo pessoal (art. 28 da Lei 11.343/2006), que não admite pena privativa de liberdade: advertência, prestação de serviços à comunidade e medida educativa. Considera-se a natureza e a quantidade, o local, as circunstâncias e a conduta (art. 28, §2º).', ch: ['art\\.? ?28', '11\\.?343', 'consumo pessoal', 'advert', 'presta[cç][aã]o de servi', 'medida educativa', '§ ?2']},
      {letra: 'B', p: 'A prisão em flagrante e a competência estão corretas? Fundamente.', v: 0.60, esp: 'Não. Para o art. 28 não se impõe prisão em flagrante: lavra-se termo circunstanciado e a autora é encaminhada ao juízo (art. 48, §2º, da Lei 11.343/2006). A competência é do Juizado Especial Criminal (art. 48, §1º, da Lei 11.343/2006 e Lei 9.099/1995).', ch: ['48', 'termo circunstanciado', 'juizado especial', '9\\.?099', 'jecrim']}
    ],
    roteiro: [
      {passo: 'Desclassifique', como: 'Mostre que a quantidade e as circunstâncias indicam consumo, citando os critérios.', fundamento: 'Art. 28, §2º, da Lei 11.343/2006'},
      {passo: 'Consequência processual', como: 'Sem flagrante: termo circunstanciado e Juizado Especial.', fundamento: 'Art. 48, §§1º e 2º, da Lei 11.343/2006'}
    ]},

  /* ============================== DIREITO DO TRABALHO ============================== */
  {id: 'tra-p1', area: 'trabalho', tipo: 'peca', pecaTipo: 'inicial',
    titulo: 'Dispensa sem acerto e horas extras',
    enunciado: 'Carla trabalhou como vendedora na Calçados Passo Firme Ltda., em Aparecida de Goiânia/GO, de 01/02/2023 a 30/06/2026, com salário de R$ 2.500,00. Trabalhava de segunda a sábado, das 9h às 19h, com 30 minutos de intervalo para almoço, sem receber horas extras. Foi dispensada sem justa causa em 30/06/2026, com aviso prévio indenizado, e até hoje não recebeu as verbas rescisórias nem as guias do FGTS e do seguro-desemprego. Carla está desempregada.',
    comando: 'Na qualidade de advogado(a) de Carla, elabore a peça processual cabível para defender os interesses da cliente, observando o rito ordinário.',
    pecaCorreta: 'Reclamação trabalhista',
    opcoesPeca: ['Reclamação trabalhista', 'Contestação', 'Recurso ordinário', 'Ação de consignação em pagamento', 'Mandado de segurança'],
    pecaChaves: ['reclama[cç][aã]o trabalhista', '840'],
    topicos: [
      {t: 'Endereçamento: Vara do Trabalho de Aparecida de Goiânia/GO, local da prestação de serviços (art. 651 da CLT)', v: 0.25, ch: ['vara do trabalho', 'aparecida', '651']},
      {t: 'Qualificação da reclamante e da reclamada; nome da peça com fundamento no art. 840, §1º, da CLT', v: 0.35, ch: ['reclama[cç][aã]o trabalhista', '840', 'cnpj']},
      {t: 'Justiça gratuita: desempregada (art. 790, §§3º e 4º, da CLT)', v: 0.30, ch: ['justi[cç]a gratuita', 'gratuidade', '790']},
      {t: 'Verbas rescisórias: saldo de salário, aviso prévio proporcional (Lei 12.506/2011), 13º e férias proporcionais + 1/3, FGTS + 40% e liberação das guias', v: 0.80, ch: ['verbas rescis', 'aviso pr[eé]vio', '12\\.?506', 'f[eé]rias', '13', 'fgts', '40', 'seguro-desemprego', 'guias']},
      {t: 'Multa do art. 477, §8º, da CLT pelo atraso (pagamento devido em até 10 dias — §6º)', v: 0.50, ch: ['477', 'multa', '10 dias', 'dez dias']},
      {t: 'Multa do art. 467 da CLT sobre as verbas incontroversas não pagas na audiência', v: 0.30, ch: ['467']},
      {t: 'Horas extras além da 8ª diária e 44ª semanal, com adicional de 50% e reflexos (art. 7º, XIII e XVI, CF; art. 59 CLT)', v: 0.70, ch: ['horas extras', 'adicional de 50', '50%', 'xvi', 'art\\.? ?59', 'reflexo', '44']},
      {t: 'Intervalo intrajornada suprimido: pagamento indenizatório do período suprimido (30 min) com acréscimo de 50% (art. 71, §4º, CLT)', v: 0.50, ch: ['intervalo', '71', 'intrajornada', 'suprimid']},
      {t: 'Pedidos líquidos, certos e determinados, com valor (art. 840, §1º, CLT)', v: 0.50, ch: ['l[ií]quid', 'valor', 'r\\$']},
      {t: 'Honorários de sucumbência (art. 791-A da CLT), notificação da reclamada e provas', v: 0.35, ch: ['791-a', 'honor[aá]rios', 'notifica', 'provas']},
      {t: 'Valor da causa e fechamento: local, data, advogado, OAB', v: 0.45, ch: ['valor da causa', 'oab', 'nestes termos']}
    ],
    roteiro: [
      {passo: 'Identifique a peça', como: 'Não há processo e Carla quer cobrar direitos: reclamação trabalhista pelo rito ordinário.', fundamento: 'Art. 840, §1º, da CLT'},
      {passo: 'Competência territorial', como: 'Local onde Carla prestou serviços: Vara do Trabalho de Aparecida de Goiânia.', fundamento: 'Art. 651 da CLT'},
      {passo: 'Qualificação e gratuidade', como: 'Qualifique as partes e peça justiça gratuita: Carla está desempregada.', fundamento: 'Art. 790, §§3º e 4º, da CLT'},
      {passo: 'Um tópico por direito', como: 'Verbas rescisórias → multas dos arts. 477 e 467 → horas extras → intervalo. Cada um com fato, fundamento e pedido.', fundamento: 'Arts. 59, 71, §4º, 467 e 477 da CLT; art. 7º, XIII e XVI, CF'},
      {passo: 'Liquide os pedidos', como: 'Indique o valor de cada pedido (pode ser estimado). Pedido sem valor pode ser extinto.', fundamento: 'Art. 840, §§1º e 3º, da CLT'},
      {passo: 'Feche', como: 'Notificação, procedência, honorários, provas, valor da causa; "Local..., Data..., Advogado..., OAB...".', fundamento: 'Art. 791-A da CLT'}
    ],
    modelo: 'EXCELENTÍSSIMO SENHOR DOUTOR JUIZ DA ___ VARA DO TRABALHO DE APARECIDA DE GOIÂNIA/GO. CARLA..., nacionalidade..., estado civil..., vendedora, CPF..., CTPS..., endereço..., por seu advogado, vem propor RECLAMAÇÃO TRABALHISTA pelo rito ordinário, com fundamento no art. 840, §1º, da CLT, em face de CALÇADOS PASSO FIRME LTDA., CNPJ..., endereço... I – DA JUSTIÇA GRATUITA (art. 790, §§3º e 4º). II – DO CONTRATO. III – DAS VERBAS RESCISÓRIAS e das multas dos arts. 477, §8º, e 467. IV – DAS HORAS EXTRAS (art. 7º, XIII e XVI, CF; art. 59 CLT) e reflexos. V – DO INTERVALO INTRAJORNADA (art. 71, §4º). VI – DOS PEDIDOS (líquidos): a) ... R$ ...; ... honorários (art. 791-A). Valor da causa: R$ ... Nestes termos, pede deferimento. Local..., Data..., Advogado..., OAB...'
  },
  {id: 'tra-q1', area: 'trabalho', tipo: 'questao', titulo: 'Gestante dispensada',
    enunciado: 'Júlia foi contratada por contrato de experiência de 90 dias. No 60º dia, foi dispensada. Dias depois descobriu que já estava grávida na data da dispensa. A empresa alega que não sabia da gravidez e que contrato de experiência não gera estabilidade.',
    itens: [
      {letra: 'A', p: 'O desconhecimento da gravidez pelo empregador afasta a estabilidade? Fundamente.', v: 0.60, esp: 'Não. A estabilidade da gestante vai da confirmação da gravidez até 5 meses após o parto (art. 10, II, "b", do ADCT), e o desconhecimento do empregador não afasta o direito (Súmula 244, I, do TST).', ch: ['adct', '10,? ?ii', '244', 'desconhecimento', 'cinco meses', '5 meses']},
      {letra: 'B', p: 'A estabilidade se aplica ao contrato de experiência? Que pedido Júlia pode fazer? Fundamente.', v: 0.65, esp: 'Sim, a estabilidade alcança contratos por prazo determinado, inclusive de experiência (Súmula 244, III, do TST). Júlia pode pedir a reintegração ou, se exaurido o período, a indenização correspondente (Súmula 244, II, do TST).', ch: ['244', 'iii', 'prazo determinado', 'reintegra', 'indeniza']}
    ],
    roteiro: [
      {passo: 'Responda e cite a fonte', como: 'Estabilidade constitucional transitória e súmula do TST para cada item.', fundamento: 'Art. 10, II, "b", ADCT; Súmula 244 do TST'}
    ]},
  {id: 'tra-q2', area: 'trabalho', tipo: 'questao', titulo: 'Preparo do recurso ordinário',
    enunciado: 'A sentença condenou a empresa Alfa Serviços Ltda. a pagar R$ 30.000,00. A reclamante, beneficiária da justiça gratuita, também quer recorrer da parte em que perdeu.',
    itens: [
      {letra: 'A', p: 'Qual o recurso cabível, o prazo e os requisitos de preparo para a empresa? Fundamente.', v: 0.65, esp: 'Recurso ordinário, em 8 dias (art. 895, I, da CLT), com recolhimento das custas (art. 789, §1º, da CLT) e do depósito recursal (art. 899, §1º, da CLT), dentro do prazo do recurso.', ch: ['recurso ordin', '895', '8 dias', 'oito', 'custas', '789', 'dep[oó]sito recursal', '899']},
      {letra: 'B', p: 'A reclamante precisa fazer depósito recursal? Fundamente.', v: 0.60, esp: 'Não. O depósito recursal garante o juízo para eventual execução contra o empregador; além disso, os beneficiários da justiça gratuita são isentos do depósito (art. 899, §10, da CLT) e das custas (art. 790-A da CLT).', ch: ['899', '§ ?10', 'isent', '790-a', 'gratuita']}
    ],
    roteiro: [
      {passo: 'Item A em três partes', como: 'Nome do recurso, prazo e preparo (custas + depósito).', fundamento: 'Arts. 789, 895 e 899 da CLT'},
      {passo: 'Item B', como: 'Isenção da beneficiária da gratuidade.', fundamento: 'Art. 899, §10, e art. 790-A da CLT'}
    ]},
  {id: 'tra-q3', area: 'trabalho', tipo: 'questao', titulo: 'Equiparação salarial',
    enunciado: 'Marcos e Paulo exercem a mesma função, com igual produtividade e perfeição técnica, no mesmo estabelecimento. Paulo ganha 30% mais. Paulo trabalha na empresa há 8 anos e na função há 3 anos; Marcos está na empresa há 3 anos e na função há 2 anos.',
    itens: [
      {letra: 'A', p: 'Marcos tem direito à equiparação salarial com Paulo? Fundamente.', v: 0.65, esp: 'Não. Além da identidade de função, do mesmo estabelecimento e do trabalho de igual valor, a equiparação exige diferença de tempo de serviço para o mesmo empregador não superior a 4 anos e diferença de tempo na função não superior a 2 anos (art. 461, caput e §1º, da CLT). Na função a diferença é de 1 ano (dentro do limite), mas na empresa é de 5 anos, acima dos 4 permitidos.', ch: ['461', '4 anos', 'quatro anos', '2 anos', 'dois anos', 'mesmo estabelecimento']},
      {letra: 'B', p: 'A existência de plano de cargos e salários na empresa altera a resposta? Fundamente.', v: 0.60, esp: 'Sim. Quando o empregador tiver quadro de carreira ou plano de cargos e salários, não se aplica a equiparação (art. 461, §2º, da CLT), dispensada a homologação ou registro em órgão público.', ch: ['461', '§ ?2', 'quadro de carreira', 'plano de cargos']}
    ],
    roteiro: [
      {passo: 'Teste cada requisito', como: 'Mesma função, mesmo estabelecimento, igual valor, e as duas diferenças de tempo (4 anos no empregador, 2 na função).', fundamento: 'Art. 461, caput e §1º, da CLT'},
      {passo: 'Item B: exceção', como: 'Quadro de carreira afasta a equiparação.', fundamento: 'Art. 461, §2º, da CLT'}
    ]},
  {id: 'tra-q4', area: 'trabalho', tipo: 'questao', titulo: 'Prescrição trabalhista',
    enunciado: 'Roberto foi dispensado em 10/01/2024 e ajuizou reclamação em 05/12/2025, pedindo horas extras de todo o contrato, que durou de 2015 a 2024, e depósitos de FGTS não recolhidos desde 2016.',
    itens: [
      {letra: 'A', p: 'Há prescrição a ser reconhecida quanto às horas extras? Fundamente.', v: 0.65, esp: 'A ação foi ajuizada dentro de 2 anos da extinção do contrato (prescrição bienal respeitada), mas só podem ser cobradas as parcelas dos 5 anos anteriores ao ajuizamento, ou seja, a partir de 05/12/2020 (art. 7º, XXIX, da CF; art. 11 da CLT; Súmula 308, I, do TST).', ch: ['xxix', 'art\\.? ?11', 'bienal', 'quinquenal', 'cinco anos', '5 anos', '308', 'dois anos']},
      {letra: 'B', p: 'Qual a prescrição aplicável aos depósitos de FGTS? Fundamente.', v: 0.60, esp: 'Prescrição quinquenal, respeitado o prazo bienal após o fim do contrato (art. 7º, XXIX, CF; STF, ARE 709.212; Súmula 362 do TST, com a modulação para prazos já em curso em 13/11/2014).', ch: ['362', '709', 'quinquenal', 'cinco anos', 'fgts']}
    ],
    roteiro: [
      {passo: 'Duas prescrições', como: 'Primeiro verifique a bienal (2 anos da extinção); depois limite as parcelas aos 5 anos anteriores à ação.', fundamento: 'Art. 7º, XXIX, CF; art. 11 da CLT'},
      {passo: 'FGTS', como: 'Cite a mudança do STF e a súmula do TST com a modulação.', fundamento: 'ARE 709.212; Súmula 362 do TST'}
    ]}
];
