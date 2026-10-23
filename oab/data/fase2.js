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
    ]},
  /* ============================== DIREITO ADMINISTRATIVO ============================== */
  {id: 'adm-p1', area: 'administrativo', tipo: 'peca', pecaTipo: ['inicial', 'recurso'],
    titulo: 'Aprovada dentro das vagas e não nomeada',
    enunciado: 'Paula foi aprovada em 1º lugar no concurso público para o cargo de Analista Administrativo do Município Alfa, cujo edital previa 2 vagas. O resultado foi homologado e publicado em 01/09/2024, com validade de 2 anos, sem prorrogação. O prazo de validade terminou em 01/09/2026 sem que Paula fosse nomeada. Em agosto de 2026, ainda durante a validade, o Prefeito publicou edital de novo concurso para o mesmo cargo e contratou servidores temporários para as mesmas funções. Paula guarda o edital, a publicação da homologação com a sua classificação e as publicações do novo concurso e das contratações. Hoje é 20/10/2026.',
    comando: 'Na qualidade de advogado(a) de Paula, elabore a peça processual adequada para garantir a sua nomeação com a maior rapidez possível, considerando que toda a prova é documental.',
    pecaCorreta: 'Mandado de segurança com pedido liminar',
    opcoesPeca: ['Mandado de segurança com pedido liminar', 'Ação popular', 'Ação civil pública', 'Habeas data', 'Mandado de injunção'],
    pecaChaves: ['mandado de seguran[cç]a', '12\\.?016'],
    topicos: [
      {t: 'Endereçamento: Juízo da Vara da Fazenda Pública da Comarca do Município Alfa', v: 0.20, ch: ['fazenda p[uú]blica', 'munic[ií]pio alfa', 'vara']},
      {t: 'Qualificação da impetrante, indicação da autoridade coatora (Prefeito) e da pessoa jurídica interessada (Município) — art. 6º da Lei 12.016/2009', v: 0.40, ch: ['autoridade coatora', 'prefeito', 'munic[ií]pio', 'art\\.? ?6']},
      {t: 'Nome da peça: mandado de segurança com pedido liminar (art. 5º, LXIX, CF e art. 1º da Lei 12.016/2009)', v: 0.40, ch: ['mandado de seguran[cç]a', 'lxix', '12\\.?016', 'liminar']},
      {t: 'Tempestividade: impetração dentro de 120 dias do fim da validade do concurso (art. 23 da Lei 12.016/2009)', v: 0.30, ch: ['120 dias', 'cento e vinte', 'art\\.? ?23', 'decad']},
      {t: 'Direito líquido e certo comprovado por documentos (edital, homologação e classificação)', v: 0.40, ch: ['l[ií]quido e certo', 'prova documental', 'pr[eé]-constitu', 'documento']},
      {t: 'Mérito: o aprovado dentro do número de vagas tem direito subjetivo à nomeação (STF, RE 598.099, Tema 161)', v: 1.10, ch: ['direito subjetivo', 'n[uú]mero de vagas', '598\\.?099', 'tema 161', 'nomea']},
      {t: 'Preterição: novo concurso e contratação temporária para as mesmas funções durante a validade (art. 37, IV, CF)', v: 0.40, ch: ['preteri', 'art\\.? ?37,? ?iv', 'tempor[aá]ri', 'novo concurso']},
      {t: 'Princípios: vinculação ao edital, boa-fé, segurança jurídica e proteção da confiança (art. 37, caput, CF)', v: 0.40, ch: ['boa-f[eé]', 'seguran[cç]a jur[ií]dica', 'confian[cç]a', 'vincula[cç][aã]o ao edital', 'moralidade']},
      {t: 'Liminar: fundamento relevante e risco de ineficácia da medida, para nomeação ou reserva da vaga (art. 7º, III, da Lei 12.016/2009)', v: 0.50, ch: ['art\\.? ?7', 'fundamento relevante', 'inefic', 'periculum', 'fumus', 'reserva']},
      {t: 'Pedidos: notificação da autoridade (art. 7º, I), ciência ao órgão de representação do Município (art. 7º, II), oitiva do MP (art. 12), concessão da segurança para nomeação e posse; sem pedido de honorários (art. 25)', v: 0.60, ch: ['notifica', 'ci[eê]ncia', 'minist[eé]rio p[uú]blico', 'art\\.? ?12', 'concess[aã]o da seguran', 'posse']},
      {t: 'Valor da causa e fechamento: local, data, advogado, OAB', v: 0.30, ch: ['valor da causa', 'oab', 'nestes termos']}
    ],
    roteiro: [
      {passo: 'Identifique a peça', como: 'Prova toda documental, ato de autoridade e pedido de rapidez: mandado de segurança com liminar.', fundamento: 'Art. 5º, LXIX, CF; Lei 12.016/2009'},
      {passo: 'Competência e partes', como: 'Vara da Fazenda Pública Municipal; impetrado é o Prefeito (autoridade coatora), e o Município é a pessoa jurídica interessada.', fundamento: 'Art. 6º da Lei 12.016/2009'},
      {passo: 'Mostre o prazo', como: 'A validade acabou em 01/09/2026; a impetração em outubro está dentro dos 120 dias.', fundamento: 'Art. 23 da Lei 12.016/2009'},
      {passo: 'Tese central', como: 'Aprovada dentro das vagas tem direito subjetivo à nomeação; a preterição por temporários e novo concurso reforça o direito.', fundamento: 'STF, RE 598.099; art. 37, IV, CF'},
      {passo: 'Peça a liminar', como: 'Fundamento relevante (documentos) e risco de ineficácia (vaga ocupada por terceiros).', fundamento: 'Art. 7º, III, da Lei 12.016/2009'},
      {passo: 'Pedidos e fechamento', como: 'Notificação, ciência ao Município, MP, concessão da segurança; não peça honorários. Valor da causa e "Local..., Data..., Advogado..., OAB...".', fundamento: 'Arts. 7º, 12 e 25 da Lei 12.016/2009'}
    ],
    modelo: 'EXCELENTÍSSIMO SENHOR DOUTOR JUIZ DE DIREITO DA VARA DA FAZENDA PÚBLICA DA COMARCA DO MUNICÍPIO ALFA. PAULA..., nacionalidade..., estado civil..., profissão..., CPF..., endereço..., por seu advogado, vem impetrar MANDADO DE SEGURANÇA COM PEDIDO LIMINAR, com fundamento no art. 5º, LXIX, da CF e na Lei 12.016/2009, contra ato omissivo do PREFEITO DO MUNICÍPIO ALFA, vinculado ao MUNICÍPIO ALFA (art. 6º). I – DA TEMPESTIVIDADE (art. 23). II – DOS FATOS. III – DO DIREITO LÍQUIDO E CERTO: aprovação dentro das vagas e direito subjetivo à nomeação (RE 598.099); preterição (art. 37, IV, CF); boa-fé e proteção da confiança. IV – DA LIMINAR (art. 7º, III). V – DOS PEDIDOS: notificação da autoridade (art. 7º, I); ciência ao Município (art. 7º, II); oitiva do MP (art. 12); concessão da segurança para nomeação e posse. Valor da causa: R$ ... Nestes termos, pede deferimento. Local..., Data..., Advogado..., OAB...'
  },
  {id: 'adm-q1', area: 'administrativo', tipo: 'questao', titulo: 'Viatura que bateu no carro',
    enunciado: 'Uma viatura da Polícia Militar do Estado Alfa, conduzida pelo soldado Bruno em alta velocidade, sem estar em ocorrência, colidiu com o carro de Laura, causando danos materiais. Laura quer ser indenizada e pretende processar diretamente o soldado.',
    itens: [
      {letra: 'A', p: 'Qual a natureza da responsabilidade do Estado neste caso? Fundamente.', v: 0.60, esp: 'Responsabilidade objetiva, baseada na teoria do risco administrativo: basta provar a conduta do agente, o dano e o nexo causal, sem discutir culpa (art. 37, §6º, da CF).', ch: ['objetiva', '37,? ?§ ?6', 'risco administrativo', 'nexo']},
      {letra: 'B', p: 'Laura pode ajuizar a ação diretamente contra o soldado? Fundamente.', v: 0.65, esp: 'Não. A ação deve ser proposta contra o Estado, e não contra o agente (STF, Tema 940 — tese da dupla garantia). O Estado, condenado, pode cobrar do soldado em ação regressiva se provar dolo ou culpa (art. 37, §6º, parte final).', ch: ['940', 'dupla garantia', 'regress', 'dolo ou culpa']}
    ],
    roteiro: [
      {passo: 'Item A', como: 'Diga "objetiva", cite o artigo e liste os elementos: conduta, dano e nexo.', fundamento: 'Art. 37, §6º, CF'},
      {passo: 'Item B', como: 'Responda "não", explique a dupla garantia e a ação regressiva por dolo ou culpa.', fundamento: 'STF, Tema 940'}
    ]},
  {id: 'adm-q2', area: 'administrativo', tipo: 'questao', titulo: 'Contratação sem licitação',
    enunciado: 'O Município Beta quer contratar uma cantora consagrada pela crítica para o show de aniversário da cidade, por meio do seu empresário exclusivo. Meses depois, uma enchente destruiu uma ponte e o Município precisa contratar com urgência uma empresa para a obra emergencial.',
    itens: [
      {letra: 'A', p: 'A contratação da cantora exige licitação? Fundamente.', v: 0.60, esp: 'Não. É caso de inexigibilidade de licitação, por inviabilidade de competição, na contratação de profissional do setor artístico consagrado pela crítica ou pela opinião pública, diretamente ou por empresário exclusivo (art. 74, II, da Lei 14.133/2021).', ch: ['inexigibilidade', 'art\\.? ?74', '14\\.?133', 'empres[aá]rio exclusivo', 'consagrad']},
      {letra: 'B', p: 'Como fica a contratação da obra emergencial e qual o seu prazo máximo? Fundamente.', v: 0.65, esp: 'É hipótese de dispensa de licitação por emergência (art. 75, VIII, da Lei 14.133/2021), para obras concluídas em no máximo 1 ano a partir da emergência, vedadas a prorrogação e a recontratação da mesma empresa com base na mesma situação.', ch: ['dispensa', 'art\\.? ?75', 'viii', 'emerg', 'um ano', '1 ano', 'prorroga']}
    ],
    roteiro: [
      {passo: 'Separe as figuras', como: 'Inexigibilidade (competição inviável) e dispensa (competição possível, mas a lei dispensa).', fundamento: 'Arts. 74 e 75 da Lei 14.133/2021'},
      {passo: 'Item B', como: 'Cite o prazo máximo de 1 ano e as vedações.', fundamento: 'Art. 75, VIII, da Lei 14.133/2021'}
    ]},
  {id: 'adm-q3', area: 'administrativo', tipo: 'questao', titulo: 'Improbidade e culpa',
    enunciado: 'Um secretário municipal, por falta de cuidado, deixou de conferir uma planilha e assinou um pagamento em duplicidade a uma empresa, causando prejuízo ao erário. Não houve intenção de causar dano. O fato ocorreu em março de 2022 e a ação de improbidade foi ajuizada em 2026.',
    itens: [
      {letra: 'A', p: 'A conduta culposa configura ato de improbidade administrativa? Fundamente.', v: 0.65, esp: 'Não. Após a Lei 14.230/2021, todos os atos de improbidade exigem dolo, inclusive os que causam lesão ao erário (art. 1º, §§1º a 3º, e art. 10 da Lei 8.429/1992). A modalidade culposa foi extinta (STF, Tema 1.199). O ressarcimento pode ser buscado por outra via.', ch: ['dolo', '14\\.?230', '1\\.?199', 'culposa', 'art\\.? ?10']},
      {letra: 'B', p: 'A ação foi ajuizada dentro do prazo prescricional? Fundamente.', v: 0.60, esp: 'Sim. A ação de improbidade prescreve em 8 anos, contados da ocorrência do fato ou, nas infrações permanentes, do dia em que cessou a permanência (art. 23 da Lei 8.429/1992). Fato de 2022 e ação em 2026: dentro do prazo.', ch: ['8 anos', 'oito anos', 'art\\.? ?23', 'ocorr[eê]ncia do fato', 'prescri']}
    ],
    roteiro: [
      {passo: 'Item A', como: 'Afirme a exigência de dolo e cite a mudança legal e o tema do STF.', fundamento: 'Lei 14.230/2021; STF, Tema 1.199'},
      {passo: 'Item B', como: 'Prazo de 8 anos contados do fato; aplique às datas do enunciado.', fundamento: 'Art. 23 da Lei 8.429/1992'}
    ]},
  {id: 'adm-q4', area: 'administrativo', tipo: 'questao', titulo: 'Anular ou revogar',
    enunciado: 'Em 2019, a Administração Federal concedeu a João uma gratificação por ato que, depois se descobriu, contrariava a lei. João recebeu os valores de boa-fé. Em 2026, a Administração quer anular o ato. Em outro caso, quer desfazer uma autorização válida que deixou de ser conveniente.',
    itens: [
      {letra: 'A', p: 'Qual a diferença entre anular e revogar um ato administrativo? Fundamente.', v: 0.60, esp: 'A anulação desfaz ato ilegal, com efeitos retroativos, e pode ser feita pela Administração ou pelo Judiciário. A revogação desfaz ato válido por conveniência e oportunidade, com efeitos para o futuro, e só pela Administração (Súmula 473 do STF; art. 53 da Lei 9.784/1999).', ch: ['473', 'art\\.? ?53', '9\\.?784', 'conveni[eê]ncia', 'ilegal', 'ex tunc', 'ex nunc']},
      {letra: 'B', p: 'A Administração ainda pode anular a gratificação de João? Fundamente.', v: 0.65, esp: 'Não. O direito da Administração de anular atos que geram efeitos favoráveis ao destinatário decai em 5 anos, salvo comprovada má-fé (art. 54 da Lei 9.784/1999). De 2019 a 2026 passaram mais de 5 anos e João estava de boa-fé.', ch: ['art\\.? ?54', 'cinco anos', '5 anos', 'decad', 'm[aá]-f[eé]', 'boa-f[eé]']}
    ],
    roteiro: [
      {passo: 'Item A', como: 'Compare motivo, efeitos e quem pode praticar cada um.', fundamento: 'Súmula 473 do STF; art. 53 da Lei 9.784/1999'},
      {passo: 'Item B', como: 'Decadência de 5 anos e boa-fé do servidor.', fundamento: 'Art. 54 da Lei 9.784/1999'}
    ]},

  /* ============================== DIREITO CONSTITUCIONAL ============================== */
  {id: 'con-p1', area: 'constitucional', tipo: 'peca', pecaTipo: 'controle',
    titulo: 'Lei estadual de trânsito',
    enunciado: 'A Assembleia Legislativa do Estado Alfa aprovou, e o Governador sancionou, a Lei Estadual nº 1.234/2026, que autoriza os motoristas a converter à direita com o semáforo vermelho em todas as vias do Estado e reduz os limites de velocidade nas rodovias estaduais. A lei entrou em vigor na data da publicação e já gera acidentes e autuações conflitantes com o Código de Trânsito Brasileiro. Não existe lei complementar federal que autorize os Estados a legislar sobre o tema. O Partido Político Gama, com representação no Congresso Nacional, procura você para questionar a lei como um todo, diretamente no tribunal competente.',
    comando: 'Na qualidade de advogado(a) do Partido Gama, elabore a peça processual cabível para retirar a lei do ordenamento jurídico com efeitos gerais e com a maior urgência possível.',
    pecaCorreta: 'Ação direta de inconstitucionalidade com pedido de medida cautelar',
    opcoesPeca: ['Ação direta de inconstitucionalidade com pedido de medida cautelar', 'Ação declaratória de constitucionalidade', 'Arguição de descumprimento de preceito fundamental', 'Mandado de segurança', 'Ação popular'],
    pecaChaves: ['a[cç][aã]o direta de inconstitucionalidade', '\\badi\\b', '9\\.?868'],
    topicos: [
      {t: 'Endereçamento: Excelentíssimo Senhor Ministro Presidente do Supremo Tribunal Federal', v: 0.20, ch: ['supremo tribunal federal', '\\bstf\\b', 'ministro presidente']},
      {t: 'Legitimidade ativa: partido político com representação no Congresso Nacional, legitimado universal (art. 103, VIII, CF; art. 2º, VIII, da Lei 9.868/1999)', v: 0.50, ch: ['art\\.? ?103', 'viii', 'partido pol[ií]tico', 'legitimad', 'universal']},
      {t: 'Indicação dos requeridos: Assembleia Legislativa e Governador do Estado Alfa', v: 0.30, ch: ['assembleia legislativa', 'governador']},
      {t: 'Nome da peça: ação direta de inconstitucionalidade com pedido de medida cautelar (art. 102, I, "a", CF e Lei 9.868/1999)', v: 0.40, ch: ['a[cç][aã]o direta de inconstitucionalidade', '102', '9\\.?868', 'cautelar']},
      {t: 'Cabimento: lei estadual contestada em face da Constituição Federal, no controle concentrado do STF', v: 0.30, ch: ['lei estadual', 'controle concentrado', 'cab[ií]vel', 'cabimento']},
      {t: 'Mérito: inconstitucionalidade formal orgânica — competência privativa da União para legislar sobre trânsito e transporte (art. 22, XI, CF)', v: 1.10, ch: ['art\\.? ?22', '\\bxi\\b', 'privativa da uni[aã]o', 'tr[aâ]nsito', 'formal', 'org[aâ]nica']},
      {t: 'Ausência de lei complementar autorizando os Estados (art. 22, parágrafo único, CF)', v: 0.40, ch: ['lei complementar', 'par[aá]grafo [uú]nico']},
      {t: 'Medida cautelar: plausibilidade do direito e perigo da demora, com acidentes e autuações conflitantes (art. 10 da Lei 9.868/1999)', v: 0.50, ch: ['art\\.? ?10', 'cautelar', 'periculum', 'fumus', 'plausib', 'perigo']},
      {t: 'Pedidos: informações dos requeridos (art. 6º), manifestação do AGU e do PGR (art. 8º), concessão da cautelar e procedência para declarar a inconstitucionalidade da lei', v: 0.70, ch: ['informa[cç][oõ]es', 'advogado-geral da uni[aã]o', '\\bagu\\b', 'procurador-geral da rep[uú]blica', '\\bpgr\\b', 'proced', 'art\\.? ?8']},
      {t: 'Procuração com poderes específicos e cópia da lei impugnada (art. 3º, parágrafo único, da Lei 9.868/1999)', v: 0.30, ch: ['poderes espec[ií]ficos', 'art\\.? ?3', 'c[oó]pia da lei']},
      {t: 'Fechamento: local, data, advogado, OAB', v: 0.30, ch: ['nestes termos', 'pede deferimento', 'oab']}
    ],
    roteiro: [
      {passo: 'Identifique a peça', como: 'Lei estadual contra a CF, efeitos gerais, no tribunal, com urgência: ADI com medida cautelar no STF.', fundamento: 'Art. 102, I, "a", CF; Lei 9.868/1999'},
      {passo: 'Mostre a legitimidade', como: 'Partido com representação no Congresso é legitimado universal: não precisa provar pertinência temática.', fundamento: 'Art. 103, VIII, CF'},
      {passo: 'Indique os requeridos', como: 'Assembleia Legislativa (que aprovou) e Governador (que sancionou).', fundamento: ''},
      {passo: 'Tese', como: 'Trânsito e transporte são competência privativa da União; sem lei complementar delegando, o Estado não pode legislar: inconstitucionalidade formal orgânica.', fundamento: 'Art. 22, XI e parágrafo único, CF'},
      {passo: 'Cautelar', como: 'Plausibilidade (vício evidente) e perigo (acidentes, autuações em conflito com o CTB).', fundamento: 'Art. 10 da Lei 9.868/1999'},
      {passo: 'Pedidos e documentos', como: 'Informações, AGU, PGR, cautelar, procedência; procuração com poderes específicos e cópia da lei. Não há valor da causa.', fundamento: 'Arts. 3º, 6º e 8º da Lei 9.868/1999'}
    ],
    modelo: 'EXCELENTÍSSIMO SENHOR MINISTRO PRESIDENTE DO SUPREMO TRIBUNAL FEDERAL. PARTIDO POLÍTICO GAMA, com representação no Congresso Nacional, CNPJ..., por seu advogado (procuração com poderes específicos — art. 3º, parágrafo único, da Lei 9.868/1999), vem propor AÇÃO DIRETA DE INCONSTITUCIONALIDADE COM PEDIDO DE MEDIDA CAUTELAR, com fundamento no art. 102, I, "a", e no art. 103, VIII, da CF, e na Lei 9.868/1999, em face da Lei Estadual nº 1.234/2026, editada pela ASSEMBLEIA LEGISLATIVA e pelo GOVERNADOR DO ESTADO ALFA. I – DA LEGITIMIDADE (legitimado universal). II – DO CABIMENTO. III – DA INCONSTITUCIONALIDADE FORMAL ORGÂNICA: competência privativa da União (art. 22, XI, CF) e ausência de lei complementar (art. 22, parágrafo único). IV – DA MEDIDA CAUTELAR (art. 10). V – DOS PEDIDOS: informações (art. 6º); oitiva do AGU e do PGR (art. 8º); cautelar para suspender a lei; procedência para declarar sua inconstitucionalidade. Nestes termos, pede deferimento. Local..., Data..., Advogado..., OAB...'
  },
  {id: 'con-q1', area: 'constitucional', tipo: 'questao', titulo: 'Informações negadas',
    enunciado: 'Carlos pediu ao órgão estadual de segurança pública acesso às informações sobre ele registradas em um banco de dados, por suspeitar que haja um registro errado que o impede de tomar posse em um cargo. O pedido administrativo foi negado sem justificativa.',
    itens: [
      {letra: 'A', p: 'Qual a ação constitucional adequada? Fundamente.', v: 0.65, esp: 'Habeas data, para assegurar o conhecimento de informações relativas à pessoa do impetrante constantes de registros ou bancos de dados de entidades governamentais, e para retificá-las (art. 5º, LXXII, "a" e "b", da CF; Lei 9.507/1997).', ch: ['habeas data', 'lxxii', '9\\.?507']},
      {letra: 'B', p: 'Era necessário o pedido administrativo prévio? Fundamente.', v: 0.60, esp: 'Sim. A petição inicial deve ser instruída com a prova da recusa ao acesso às informações (art. 8º, parágrafo único, da Lei 9.507/1997; Súmula 2 do STJ). No caso, a recusa existiu, o que permite a impetração.', ch: ['recusa', 'art\\.? ?8', 's[uú]mula 2', 'pr[eé]vio']}
    ],
    roteiro: [
      {passo: 'Item A', como: 'Nomeie o remédio, o inciso e a finalidade (conhecer e retificar).', fundamento: 'Art. 5º, LXXII, CF'},
      {passo: 'Item B', como: 'Explique o interesse de agir pela recusa administrativa.', fundamento: 'Art. 8º da Lei 9.507/1997; Súmula 2 do STJ'}
    ]},
  {id: 'con-q2', area: 'constitucional', tipo: 'questao', titulo: 'Brasileiro naturalizado',
    enunciado: 'Ahmed se naturalizou brasileiro em 2018. Em 2026, um país estrangeiro pediu a sua extradição por um crime de roubo cometido lá em 2016. Ahmed também pretende, no futuro, ser Ministro do Supremo Tribunal Federal.',
    itens: [
      {letra: 'A', p: 'É possível a extradição de Ahmed? Fundamente.', v: 0.65, esp: 'Sim. O brasileiro naturalizado pode ser extraditado por crime comum praticado antes da naturalização, ou por comprovado envolvimento em tráfico de drogas (art. 5º, LI, da CF). O roubo é crime comum e foi cometido antes de 2018.', ch: ['\\bli\\b', 'antes da naturaliza', 'crime comum', 'naturalizado']},
      {letra: 'B', p: 'Ahmed pode ser Ministro do STF? Fundamente.', v: 0.60, esp: 'Não. O cargo de Ministro do STF é privativo de brasileiro nato (art. 12, §3º, IV, da CF).', ch: ['12,? ?§ ?3', 'nato', 'privativ']}
    ],
    roteiro: [
      {passo: 'Item A', como: 'Regra (nato não é extraditado) e as duas exceções do naturalizado.', fundamento: 'Art. 5º, LI, CF'},
      {passo: 'Item B', como: 'Cite o rol de cargos privativos de brasileiro nato.', fundamento: 'Art. 12, §3º, CF'}
    ]},
  {id: 'con-q3', area: 'constitucional', tipo: 'questao', titulo: 'Iniciativa de lei e medida provisória',
    enunciado: 'Um deputado federal apresentou projeto de lei que cria 200 cargos no Ministério da Saúde. O projeto foi aprovado e sancionado pelo Presidente da República. No mesmo ano, o Presidente editou medida provisória criando um novo tipo penal.',
    itens: [
      {letra: 'A', p: 'A lei que criou os cargos é constitucional? A sanção presidencial corrige o problema? Fundamente.', v: 0.65, esp: 'Não. É da iniciativa privativa do Presidente a lei que cria cargos na administração direta (art. 61, §1º, II, "a", da CF). O vício de iniciativa é formal e não é sanado pela sanção, segundo o STF.', ch: ['61', 'iniciativa privativa', 'v[ií]cio de iniciativa', 'san[cç][aã]o', 'formal']},
      {letra: 'B', p: 'A medida provisória pode criar tipo penal? Fundamente.', v: 0.60, esp: 'Não. É vedada a edição de medida provisória sobre direito penal (art. 62, §1º, I, "b", da CF).', ch: ['62', 'vedad', 'direito penal']}
    ],
    roteiro: [
      {passo: 'Item A', como: 'Iniciativa privativa e a orientação de que a sanção não convalida.', fundamento: 'Art. 61, §1º, II, "a", CF'},
      {passo: 'Item B', como: 'Limite material das medidas provisórias.', fundamento: 'Art. 62, §1º, I, "b", CF'}
    ]},
  {id: 'con-q4', area: 'constitucional', tipo: 'questao', titulo: 'Controle difuso no tribunal',
    enunciado: 'Uma Câmara do Tribunal de Justiça do Estado Beta, composta por 3 desembargadores, afastou a aplicação de uma lei estadual em um recurso, sem declará-la expressamente inconstitucional, mas por entender que ela contraria a Constituição. Em outro caso, o STF declarou incidentalmente a inconstitucionalidade de uma lei federal em recurso extraordinário.',
    itens: [
      {letra: 'A', p: 'A decisão da Câmara foi válida? Fundamente.', v: 0.65, esp: 'Não. Os tribunais só podem declarar a inconstitucionalidade de lei pelo voto da maioria absoluta dos membros ou do órgão especial (cláusula de reserva de plenário — art. 97 da CF). Afastar a lei sem declarar expressamente também viola a regra (Súmula Vinculante 10).', ch: ['art\\.? ?97', 'reserva de plen[aá]rio', 'vinculante 10', 'maioria absoluta', '[oó]rg[aã]o especial']},
      {letra: 'B', p: 'Qual o papel do Senado Federal após a decisão do STF em controle difuso? Fundamente.', v: 0.60, esp: 'O Senado pode suspender, no todo ou em parte, a execução da lei declarada inconstitucional por decisão definitiva do STF (art. 52, X, da CF), estendendo os efeitos a todos.', ch: ['52', '\\bx\\b', 'suspend', 'senado']}
    ],
    roteiro: [
      {passo: 'Item A', como: 'Reserva de plenário e a súmula vinculante sobre o "afastamento" disfarçado.', fundamento: 'Art. 97 da CF; Súmula Vinculante 10'},
      {passo: 'Item B', como: 'Competência do Senado para suspender a lei.', fundamento: 'Art. 52, X, CF'}
    ]},

  /* ============================== DIREITO EMPRESARIAL ============================== */
  {id: 'emp-p1', area: 'empresarial', tipo: 'peca', pecaTipo: 'inicial',
    titulo: 'Duplicatas protestadas',
    enunciado: 'Alfa Tecidos Ltda., sociedade empresária regularmente registrada na Junta Comercial, vendeu mercadorias a Beta Confecções Ltda., cujo único estabelecimento fica em Goiânia/GO. Beta aceitou três duplicatas que somam R$ 120.000,00, vencidas há mais de 90 dias, e não as pagou. Os títulos foram protestados para fins falimentares, com a identificação de quem recebeu a intimação do protesto. Beta não apresentou nenhuma justificativa para o não pagamento e continua em funcionamento. O valor supera 40 salários mínimos. Alfa procura você querendo a medida judicial mais eficaz para receber o crédito, inclusive com a possibilidade de afastar a devedora do mercado.',
    comando: 'Na qualidade de advogado(a) de Alfa Tecidos Ltda., elabore a peça processual adequada, com base exclusivamente na impontualidade da devedora.',
    pecaCorreta: 'Pedido de falência',
    opcoesPeca: ['Pedido de falência', 'Ação monitória', 'Execução de título extrajudicial', 'Habilitação de crédito', 'Ação de cobrança'],
    pecaChaves: ['pedido de fal[eê]ncia', 'requerimento de fal[eê]ncia', 'decreta[cç][aã]o da fal[eê]ncia', 'fal[eê]ncia'],
    topicos: [
      {t: 'Endereçamento: Juízo da Vara de Falências (ou Cível) da Comarca de Goiânia/GO, local do principal estabelecimento da devedora (art. 3º da Lei 11.101/2005)', v: 0.30, ch: ['goi[aâ]nia', 'principal estabelecimento', 'art\\.? ?3', 'fal[eê]ncias']},
      {t: 'Qualificação da credora e da devedora', v: 0.20, ch: ['cnpj', 'sede', 'qualific']},
      {t: 'Nome da peça: pedido de falência com fundamento no art. 94, I, da Lei 11.101/2005', v: 0.50, ch: ['pedido de fal[eê]ncia', 'requer.*fal[eê]ncia', '94', '11\\.?101']},
      {t: 'Legitimidade ativa do credor (art. 97, IV) e certidão de regularidade da credora empresária na Junta Comercial (art. 97, §1º)', v: 0.40, ch: ['art\\.? ?97', 'legitim', 'certid[aã]o', 'regularidade', 'junta comercial']},
      {t: 'Impontualidade: obrigação líquida em títulos executivos protestados, acima de 40 salários mínimos, sem relevante razão de direito (art. 94, I)', v: 1.10, ch: ['impontualidade', '40 sal[aá]rios', 'quarenta sal[aá]rios', 'l[ií]quida', 'relevante raz[aã]o', 'protestad']},
      {t: 'Duplicatas aceitas são títulos executivos extrajudiciais (art. 15 da Lei 5.474/1968)', v: 0.40, ch: ['5\\.?474', 'art\\.? ?15', 'duplicata', 't[ií]tulo executivo']},
      {t: 'Protesto para fim falimentar e instrução com os títulos e instrumentos de protesto (art. 94, §3º; Súmula 361 do STJ)', v: 0.50, ch: ['94,? ?§ ?3', '361', 'instrumento de protesto', 'fim falimentar', 'fins falimentares']},
      {t: 'Pedidos: citação da devedora para contestar em 10 dias, com a faculdade do depósito elisivo (art. 98 e parágrafo único)', v: 0.60, ch: ['art\\.? ?98', '10 dias', 'dez dias', 'dep[oó]sito elisivo', 'cita[cç][aã]o']},
      {t: 'Pedido de decretação da falência e das providências do art. 99', v: 0.40, ch: ['decreta[cç][aã]o da fal[eê]ncia', 'art\\.? ?99', 'decretar']},
      {t: 'Valor da causa: valor do crédito', v: 0.30, ch: ['valor da causa', '120\\.000']},
      {t: 'Fechamento: local, data, advogado, OAB', v: 0.30, ch: ['nestes termos', 'pede deferimento', 'oab']}
    ],
    roteiro: [
      {passo: 'Identifique a peça', como: 'Credor, títulos protestados acima de 40 salários mínimos, sem justificativa, e o pedido de afastar a devedora do mercado: pedido de falência por impontualidade.', fundamento: 'Art. 94, I, da Lei 11.101/2005'},
      {passo: 'Competência', como: 'Juízo do local do principal estabelecimento da devedora: Goiânia.', fundamento: 'Art. 3º da Lei 11.101/2005'},
      {passo: 'Legitimidade e documentos', como: 'Credor tem legitimidade; sendo empresário, junta certidão da Junta Comercial. Junte os títulos e os instrumentos de protesto.', fundamento: 'Art. 97, IV e §1º; art. 94, §3º'},
      {passo: 'Fundamente a impontualidade', como: 'Obrigação líquida, títulos executivos (duplicatas aceitas), protesto, valor acima de 40 salários mínimos e ausência de relevante razão de direito.', fundamento: 'Art. 94, I; Lei 5.474/1968; Súmula 361 do STJ'},
      {passo: 'Pedidos', como: 'Citação para contestar em 10 dias ou fazer o depósito elisivo; decretação da falência; valor da causa e fechamento.', fundamento: 'Arts. 98 e 99 da Lei 11.101/2005'}
    ],
    modelo: 'EXCELENTÍSSIMO SENHOR DOUTOR JUIZ DE DIREITO DA VARA DE FALÊNCIAS E RECUPERAÇÕES JUDICIAIS (OU CÍVEL) DA COMARCA DE GOIÂNIA/GO. ALFA TECIDOS LTDA., CNPJ..., sede..., por seu advogado, vem formular PEDIDO DE FALÊNCIA de BETA CONFECÇÕES LTDA., CNPJ..., com estabelecimento em Goiânia/GO, com fundamento no art. 94, I, da Lei 11.101/2005. I – DA COMPETÊNCIA (art. 3º). II – DA LEGITIMIDADE (art. 97, IV e §1º — certidão da Junta Comercial anexa). III – DOS FATOS. IV – DO DIREITO: impontualidade — duplicatas aceitas (Lei 5.474/1968), líquidas, protestadas para fim falimentar (art. 94, §3º; Súmula 361 do STJ), acima de 40 salários mínimos, sem relevante razão de direito. V – DOS PEDIDOS: citação para contestar em 10 dias, facultado o depósito elisivo (art. 98); decretação da falência (art. 99). Valor da causa: R$ 120.000,00. Nestes termos, pede deferimento. Local..., Data..., Advogado..., OAB...'
  },
  {id: 'emp-q1', area: 'empresarial', tipo: 'questao', titulo: 'Sócios da limitada',
    enunciado: 'A sociedade Delta Ltda. tem três sócios: Ana (50% das quotas), Bruno (30%) e Caio (20%). O capital social ainda não foi totalmente integralizado, pois Caio não pagou suas quotas. A sociedade tem dívidas com fornecedores. Ana e Bruno querem excluir Caio, que vem praticando atos de inegável gravidade que põem em risco a empresa. O contrato social prevê exclusão por justa causa.',
    itens: [
      {letra: 'A', p: 'Os sócios podem ser cobrados pelas dívidas da sociedade? Em que limite? Fundamente.', v: 0.60, esp: 'Na limitada, a responsabilidade de cada sócio é restrita ao valor de suas quotas, mas todos respondem solidariamente pela integralização do capital social (art. 1.052 do CC). Enquanto as quotas de Caio não forem pagas, todos respondem pelo valor que falta integralizar.', ch: ['1\\.?052', 'solidari', 'integraliza']},
      {letra: 'B', p: 'Caio pode ser excluído extrajudicialmente? Como? Fundamente.', v: 0.65, esp: 'Sim. A maioria dos sócios, representativa de mais da metade do capital, pode excluir sócio que pratica atos de inegável gravidade, por alteração do contrato social, se houver previsão de exclusão por justa causa (art. 1.085 do CC), com reunião ou assembleia convocada para esse fim e ciência do acusado para exercer a defesa (art. 1.085, parágrafo único).', ch: ['1\\.?085', 'metade do capital', 'justa causa', 'altera[cç][aã]o do contrato', 'defesa']}
    ],
    roteiro: [
      {passo: 'Item A', como: 'Limite das quotas e solidariedade pela integralização.', fundamento: 'Art. 1.052 do CC'},
      {passo: 'Item B', como: 'Requisitos da exclusão extrajudicial: maioria do capital, previsão contratual, atos graves e direito de defesa.', fundamento: 'Art. 1.085 do CC'}
    ]},
  {id: 'emp-q2', area: 'empresarial', tipo: 'questao', titulo: 'Cheque sem fundos',
    enunciado: 'Rita recebeu um cheque emitido na mesma praça de pagamento em 10/01/2025, mas só o apresentou ao banco em 30/03/2025, quando foi devolvido por falta de fundos. Rita quer cobrar o valor em 2026.',
    itens: [
      {letra: 'A', p: 'Qual era o prazo de apresentação do cheque e qual a consequência do atraso para a cobrança do emitente? Fundamente.', v: 0.60, esp: 'O prazo de apresentação é de 30 dias da emissão, quando o cheque é da mesma praça (art. 33 da Lei 7.357/1985). Perdido o prazo, o portador ainda pode cobrar o emitente; só perde o direito contra os endossantes (art. 47, II), e a prescrição da execução corre do fim do prazo de apresentação.', ch: ['30 dias', 'trinta dias', 'art\\.? ?33', '7\\.?357', 'mesma pra[cç]a', 'art\\.? ?47']},
      {letra: 'B', p: 'Rita ainda pode executar o cheque em 2026? Que alternativa ela tem? Fundamente.', v: 0.65, esp: 'Não. A execução prescreve em 6 meses contados do fim do prazo de apresentação (art. 59 da Lei 7.357/1985). Ela pode usar a ação de locupletamento em 2 anos (art. 61) ou a ação monitória em 5 anos, contados do dia seguinte à data de emissão (Súmula 503 do STJ).', ch: ['6 meses', 'seis meses', 'art\\.? ?59', 'monit[oó]ria', '503', 'locupletamento', 'art\\.? ?61']}
    ],
    roteiro: [
      {passo: 'Item A', como: 'Prazo de 30 ou 60 dias conforme a praça e o efeito do atraso.', fundamento: 'Arts. 33 e 47 da Lei 7.357/1985'},
      {passo: 'Item B', como: 'Prescrição da execução e as duas ações que restam.', fundamento: 'Arts. 59 e 61 da Lei 7.357/1985; Súmula 503 do STJ'}
    ]},
  {id: 'emp-q3', area: 'empresarial', tipo: 'questao', titulo: 'Pedido de recuperação judicial',
    enunciado: 'A Sigma Indústria Ltda., registrada há 3 anos na Junta Comercial, enfrenta crise financeira e quer pedir recuperação judicial. Um dos credores é um banco que tem alienação fiduciária sobre máquinas da empresa.',
    itens: [
      {letra: 'A', p: 'A Sigma preenche o requisito temporal para pedir recuperação judicial? Fundamente.', v: 0.60, esp: 'Sim. Pode requerer recuperação judicial o devedor que exerce regularmente suas atividades há mais de 2 anos (art. 48 da Lei 11.101/2005), além de não ser falido e de não ter obtido recuperação nos últimos 5 anos.', ch: ['art\\.? ?48', '2 anos', 'dois anos', 'regularmente']},
      {letra: 'B', p: 'O crédito do banco com alienação fiduciária se submete à recuperação? Fundamente.', v: 0.65, esp: 'Não. O credor titular da posição de proprietário fiduciário não se submete aos efeitos da recuperação judicial (art. 49, §3º, da Lei 11.101/2005), mas não pode retirar do estabelecimento bens de capital essenciais à atividade durante o prazo de suspensão de 180 dias (art. 6º, §4º).', ch: ['49,? ?§ ?3', 'fiduci', 'n[aã]o se submete', '180 dias', 'bens de capital', 'essencia']}
    ],
    roteiro: [
      {passo: 'Item A', como: 'Requisito dos 2 anos e os demais impedimentos.', fundamento: 'Art. 48 da Lei 11.101/2005'},
      {passo: 'Item B', como: 'Crédito fiduciário fora da recuperação e a ressalva dos bens essenciais.', fundamento: 'Art. 49, §3º; art. 6º, §4º'}
    ]},
  {id: 'emp-q4', area: 'empresarial', tipo: 'questao', titulo: 'Desconsideração da personalidade',
    enunciado: 'Em uma execução contra a Ômega Comércio Ltda., o credor descobriu que os sócios pagavam despesas pessoais com a conta da empresa e transferiam bens da sociedade para os próprios nomes, sem contrapartida. A sociedade não tem mais bens.',
    itens: [
      {letra: 'A', p: 'É possível atingir o patrimônio dos sócios? Com qual fundamento? Fundamente.', v: 0.65, esp: 'Sim. Há abuso da personalidade jurídica por confusão patrimonial (art. 50, §2º, do CC), o que autoriza a desconsideração para estender os efeitos das obrigações aos bens dos sócios beneficiados (teoria maior, art. 50, caput).', ch: ['art\\.? ?50', 'confus[aã]o patrimonial', 'abuso', 'desvio de finalidade', 'teoria maior']},
      {letra: 'B', p: 'Qual o procedimento processual para isso? Fundamente.', v: 0.60, esp: 'O incidente de desconsideração da personalidade jurídica (arts. 133 a 137 do CPC), cabível em qualquer fase do processo, inclusive na execução, que suspende o processo (art. 134, §3º) e garante a citação dos sócios para se manifestarem em 15 dias (art. 135).', ch: ['incidente', '133', '134', '135', 'cita[cç][aã]o dos s[oó]cios', '15 dias']}
    ],
    roteiro: [
      {passo: 'Item A', como: 'Identifique o abuso (confusão patrimonial) e a teoria maior do Código Civil.', fundamento: 'Art. 50 do CC'},
      {passo: 'Item B', como: 'Nomeie o incidente e os seus efeitos.', fundamento: 'Arts. 133 a 137 do CPC'}
    ]},

  /* ============================== DIREITO TRIBUTÁRIO ============================== */
  {id: 'tri-p1', area: 'tributario', tipo: 'peca', pecaTipo: ['inicial', 'recurso'],
    titulo: 'IPTU antigo cobrado de quem já vendeu',
    enunciado: 'Marcos vendeu um imóvel em Goiânia/GO em novembro de 2014, com escritura pública registrada na matrícula em dezembro de 2014. O Município de Goiânia lançou de ofício o IPTU de 2015 em nome de Marcos, com notificação e vencimento em março de 2015. A execução fiscal só foi ajuizada em maio de 2024, contra Marcos. Uma conta bancária de Marcos foi penhorada no valor integral da dívida, e ele foi intimado da penhora em 05/10/2026. Não houve nenhuma causa de suspensão ou interrupção da prescrição antes do ajuizamento.',
    comando: 'Na qualidade de advogado(a) de Marcos, elabore a peça processual adequada para a defesa dos interesses do cliente na execução, considerando que o juízo está garantido e que há necessidade de produzir prova documental.',
    pecaCorreta: 'Embargos à execução fiscal',
    opcoesPeca: ['Embargos à execução fiscal', 'Exceção de pré-executividade', 'Ação anulatória de débito fiscal', 'Mandado de segurança', 'Repetição de indébito'],
    pecaChaves: ['embargos [aà] execu[cç][aã]o fiscal', 'embargos [aà] execu[cç][aã]o', '6\\.?830'],
    topicos: [
      {t: 'Endereçamento: Juízo da Vara da Fazenda Pública Municipal da Comarca de Goiânia/GO, por dependência à execução fiscal', v: 0.30, ch: ['fazenda p[uú]blica', 'goi[aâ]nia', 'depend[eê]ncia']},
      {t: 'Qualificação do embargante e do embargado (Município de Goiânia)', v: 0.20, ch: ['munic[ií]pio de goi[aâ]nia', 'embargad', 'cpf']},
      {t: 'Nome da peça: embargos à execução fiscal (art. 16 da Lei 6.830/1980)', v: 0.50, ch: ['embargos [aà] execu[cç][aã]o', '6\\.?830', 'art\\.? ?16']},
      {t: 'Tempestividade e garantia do juízo: 30 dias da intimação da penhora (art. 16, III, e §1º, da Lei 6.830/1980)', v: 0.50, ch: ['30 dias', 'trinta dias', 'intima[cç][aã]o da penhora', 'garantia', 'garantido', 'tempestiv']},
      {t: 'Prescrição: mais de 5 anos entre a constituição definitiva do crédito (2015) e o ajuizamento (2024) — art. 174 do CTN; extinção do crédito (art. 156, V, do CTN)', v: 1.00, ch: ['art\\.? ?174', 'prescri', 'cinco anos', '5 anos', '156', 'constitui[cç][aã]o definitiva']},
      {t: 'Ilegitimidade passiva: imóvel vendido e registrado em 2014; o contribuinte é o proprietário (art. 34 do CTN) e o crédito se sub-roga no adquirente (art. 130 do CTN)', v: 0.80, ch: ['ilegitimidade', 'art\\.? ?34', 'art\\.? ?130', 'sub-roga', 'adquirente', 'propriet[aá]rio']},
      {t: 'Pedido de efeito suspensivo: juízo garantido e requisitos da tutela provisória (art. 919, §1º, do CPC)', v: 0.40, ch: ['efeito suspensivo', '919']},
      {t: 'Pedidos: intimação da Fazenda para impugnar em 30 dias (art. 17 da Lei 6.830/1980), procedência, extinção da execução, levantamento da penhora e honorários', v: 0.60, ch: ['art\\.? ?17', 'impugna', 'proced', 'extin', 'levantamento', 'honor[aá]rios']},
      {t: 'Provas: escritura e matrícula do imóvel juntadas com a inicial (art. 16, §2º, da Lei 6.830/1980)', v: 0.20, ch: ['escritura', 'matr[ií]cula', 'provas']},
      {t: 'Valor da causa: valor da execução', v: 0.20, ch: ['valor da causa']},
      {t: 'Fechamento: local, data, advogado, OAB', v: 0.30, ch: ['nestes termos', 'pede deferimento', 'oab']}
    ],
    roteiro: [
      {passo: 'Identifique a peça', como: 'Execução fiscal em curso, juízo garantido pela penhora e necessidade de prova: embargos à execução fiscal (a exceção de pré-executividade não admite produção de prova).', fundamento: 'Art. 16 da Lei 6.830/1980'},
      {passo: 'Prazo e competência', como: '30 dias da intimação da penhora (05/10/2026); distribuição por dependência à execução, na Vara da Fazenda Pública Municipal.', fundamento: 'Art. 16, III, da Lei 6.830/1980'},
      {passo: 'Tese 1: prescrição', como: 'Constituição definitiva em 2015 e ajuizamento em 2024: mais de 5 anos, sem causa interruptiva. Extinção do crédito.', fundamento: 'Arts. 174 e 156, V, do CTN'},
      {passo: 'Tese 2: ilegitimidade', como: 'Em 2015 Marcos já não era proprietário; o IPTU se sub-roga no adquirente.', fundamento: 'Arts. 34 e 130 do CTN'},
      {passo: 'Efeito suspensivo', como: 'Juízo garantido e risco de levantamento do dinheiro penhorado.', fundamento: 'Art. 919, §1º, do CPC'},
      {passo: 'Pedidos e fechamento', como: 'Intimação da Fazenda para impugnar, procedência, extinção, levantamento da penhora, honorários; provas; valor da causa e fechamento.', fundamento: 'Art. 17 da Lei 6.830/1980'}
    ],
    modelo: 'EXCELENTÍSSIMO SENHOR DOUTOR JUIZ DE DIREITO DA VARA DA FAZENDA PÚBLICA MUNICIPAL DA COMARCA DE GOIÂNIA/GO. Distribuição por dependência aos autos da Execução Fiscal nº... MARCOS..., nacionalidade..., estado civil..., profissão..., CPF..., endereço..., por seu advogado, vem opor EMBARGOS À EXECUÇÃO FISCAL, com fundamento no art. 16 da Lei 6.830/1980, em face do MUNICÍPIO DE GOIÂNIA. I – DA TEMPESTIVIDADE E DA GARANTIA DO JUÍZO (art. 16, III e §1º). II – DOS FATOS. III – DO DIREITO: 1. Prescrição (art. 174 do CTN) e extinção do crédito (art. 156, V). 2. Ilegitimidade passiva (arts. 34 e 130 do CTN). IV – DO EFEITO SUSPENSIVO (art. 919, §1º, do CPC). V – DOS PEDIDOS: intimação do embargado para impugnar em 30 dias (art. 17); procedência para extinguir a execução e levantar a penhora; honorários; provas (escritura e matrícula anexas). Valor da causa: R$ ... Nestes termos, pede deferimento. Local..., Data..., Advogado..., OAB...'
  },
  {id: 'tri-q1', area: 'tributario', tipo: 'questao', titulo: 'Aumento do IPTU',
    enunciado: 'O Município Teta publicou em 15/12/2025 uma lei que aumentou a alíquota do IPTU. Em outra lei, publicada em 20/12/2025, atualizou a planta de valores, elevando a base de cálculo (valor venal) dos imóveis.',
    itens: [
      {letra: 'A', p: 'A partir de quando o aumento da alíquota pode ser cobrado? Fundamente.', v: 0.65, esp: 'Devem ser observadas a anterioridade anual e a nonagesimal (art. 150, III, "b" e "c", da CF). O aumento só pode ser cobrado a partir de 15/03/2026, 90 dias após a publicação, pois é a data mais tardia entre as duas regras.', ch: ['150', 'anterioridade', 'nonagesimal', 'noventena', '90 dias', 'noventa dias', '15/03']},
      {letra: 'B', p: 'E o aumento da base de cálculo? Fundamente.', v: 0.60, esp: 'A fixação da base de cálculo do IPTU é exceção à noventena (art. 150, §1º, da CF), mas respeita a anterioridade anual: pode ser cobrada a partir de 01/01/2026.', ch: ['150,? ?§ ?1', 'exce[cç][aã]o', 'base de c[aá]lculo', '01/01', '1º de janeiro', 'anterioridade anual']}
    ],
    roteiro: [
      {passo: 'Item A', como: 'Aplique as duas anterioridades e escolha a data mais distante.', fundamento: 'Art. 150, III, "b" e "c", CF'},
      {passo: 'Item B', como: 'Cite a exceção da base de cálculo do IPTU à noventena.', fundamento: 'Art. 150, §1º, CF'}
    ]},
  {id: 'tri-q2', area: 'tributario', tipo: 'questao', titulo: 'Imunidades',
    enunciado: 'Uma igreja aluga um imóvel de sua propriedade e aplica todo o aluguel na manutenção de seus templos. O Município exige IPTU sobre o imóvel alugado. Uma editora, por sua vez, foi cobrada de ICMS sobre a venda de livros digitais e de aparelhos leitores de livros eletrônicos.',
    itens: [
      {letra: 'A', p: 'É devido o IPTU sobre o imóvel alugado da igreja? Fundamente.', v: 0.60, esp: 'Não. A imunidade dos templos (art. 150, VI, "b", da CF) alcança o patrimônio, a renda e os serviços relacionados às finalidades essenciais (art. 150, §4º). O imóvel alugado continua imune quando o aluguel é aplicado nessas finalidades (Súmula Vinculante 52).', ch: ['150', 'templo', 'vinculante 52', 'finalidades essenciais', '§ ?4']},
      {letra: 'B', p: 'A venda dos livros digitais e dos leitores é imune? Fundamente.', v: 0.65, esp: 'Sim. A imunidade de livros (art. 150, VI, "d", da CF) alcança os livros eletrônicos e os suportes próprios exclusivamente utilizados para fixá-los, como os leitores de livros eletrônicos (Súmula Vinculante 57).', ch: ['vinculante 57', 'livro eletr[oô]nico', 'e-book', '\\bd\\b', 'suportes']}
    ],
    roteiro: [
      {passo: 'Item A', como: 'Imunidade religiosa, a regra do §4º e a súmula vinculante.', fundamento: 'Art. 150, VI, "b", e §4º, CF; SV 52'},
      {passo: 'Item B', como: 'Imunidade cultural ampliada ao livro digital e ao leitor.', fundamento: 'Art. 150, VI, "d", CF; SV 57'}
    ]},
  {id: 'tri-q3', area: 'tributario', tipo: 'questao', titulo: 'Redirecionamento ao sócio',
    enunciado: 'A empresa Lambda Ltda. deixou de pagar ICMS por dificuldades financeiras. Meses depois, encerrou as atividades sem baixa nos órgãos competentes e o oficial de justiça certificou que ela não funciona mais no endereço cadastrado. A Fazenda pede o redirecionamento da execução ao sócio-gerente.',
    itens: [
      {letra: 'A', p: 'O simples não pagamento do tributo permite responsabilizar o sócio-gerente? Fundamente.', v: 0.60, esp: 'Não. O inadimplemento da obrigação tributária pela sociedade, por si só, não gera a responsabilidade solidária do sócio-gerente (Súmula 430 do STJ). É preciso ato praticado com excesso de poderes ou infração de lei, contrato social ou estatutos (art. 135, III, do CTN).', ch: ['430', 'inadimplemento', 'art\\.? ?135', 'excesso de poderes', 'infra[cç][aã]o de lei']},
      {letra: 'B', p: 'E a dissolução irregular? Fundamente.', v: 0.65, esp: 'Presume-se dissolvida irregularmente a empresa que deixa de funcionar no seu domicílio fiscal sem comunicar aos órgãos competentes, o que legitima o redirecionamento da execução ao sócio-gerente (Súmula 435 do STJ; art. 135, III, do CTN).', ch: ['435', 'dissolu[cç][aã]o irregular', 'redirecion', 'art\\.? ?135']}
    ],
    roteiro: [
      {passo: 'Item A', como: 'Mero inadimplemento não basta: cite a súmula e o artigo do CTN.', fundamento: 'Súmula 430 do STJ; art. 135, III, CTN'},
      {passo: 'Item B', como: 'Dissolução irregular presumida e o redirecionamento.', fundamento: 'Súmula 435 do STJ'}
    ]},
  {id: 'tri-q4', area: 'tributario', tipo: 'questao', titulo: 'Restituição de tributo pago a mais',
    enunciado: 'A empresa Kappa pagou ISS indevidamente em março de 2021 e quer pedir a restituição em outubro de 2026. Em outro caso, um comerciante quer restituir ICMS pago a maior, cujo valor foi repassado no preço aos consumidores.',
    itens: [
      {letra: 'A', p: 'A Kappa ainda pode pedir a restituição do ISS? Fundamente.', v: 0.60, esp: 'Não. O direito de pleitear a restituição se extingue em 5 anos contados da extinção do crédito tributário, ou seja, do pagamento (art. 168, I, do CTN; art. 3º da LC 118/2005). O prazo terminou em março de 2026.', ch: ['168', 'cinco anos', '5 anos', '118', 'pagamento']},
      {letra: 'B', p: 'O comerciante pode pedir a restituição do ICMS? Em que condições? Fundamente.', v: 0.65, esp: 'Só se provar que assumiu o encargo financeiro do tributo ou, no caso de tê-lo transferido a terceiro, estiver por este expressamente autorizado a recebê-lo (art. 166 do CTN; Súmula 546 do STF).', ch: ['166', '546', 'encargo', 'autoriza', 'repercuss']}
    ],
    roteiro: [
      {passo: 'Item A', como: 'Prazo de 5 anos do pagamento e aplicação às datas.', fundamento: 'Art. 168, I, CTN; LC 118/2005'},
      {passo: 'Item B', como: 'Tributo indireto: prova do encargo ou autorização de quem o suportou.', fundamento: 'Art. 166 do CTN; Súmula 546 do STF'}
    ]}
];

