/* Sinopses ampliadas — parte 2 (mesmo formato da parte 1). */
OAB.SINX = OAB.SINX || {};
(function (X) {
var P = 'https://www.planalto.gov.br/ccivil_03/';

X.trab = {
  x: [
    'A jornada padrão é de 8 horas diárias e 44 semanais. O que passar disso é hora extra, com adicional de, no mínimo, 50%. O intervalo intrajornada é de 1 a 2 horas para quem trabalha mais de 6 horas, e de 15 minutos para quem trabalha de 4 a 6. Desde a Reforma de 2017, a supressão do intervalo gera o pagamento só do período suprimido, com natureza indenizatória. Entre duas jornadas, o descanso mínimo é de 11 horas.',
    'As férias são de 30 dias após 12 meses de trabalho, reduzidas conforme as faltas injustificadas. Podem ser divididas em até 3 períodos, um com pelo menos 14 dias e os outros com pelo menos 5. O pagamento é feito até 2 dias antes do início, com o terço constitucional; se for concedida fora do período concessivo, é paga em dobro. Na remuneração, separe salário (paga pelo empregador) de gorjeta (paga por terceiros), que integra a remuneração, mas não o salário.',
    'A estabilidade protege o emprego por um tempo. As que mais caem são: gestante (da confirmação da gravidez até 5 meses após o parto, mesmo no contrato por prazo determinado), dirigente sindical (do registro da candidatura até 1 ano após o mandato), cipeiro eleito (mesmo prazo, com suplente incluído) e acidentado (12 meses após a cessação do auxílio por incapacidade acidentário). O desconhecimento da gravidez pelo empregador não afasta a estabilidade.',
    'Na dispensa sem justa causa, o empregado recebe aviso prévio (30 dias mais 3 por ano trabalhado, até 90), saldo de salário, férias vencidas e proporcionais com 1/3, 13º proporcional e multa de 40% do FGTS. Na justa causa (art. 482), perde aviso, proporcionais e multa. Desde 2017 existe a rescisão por acordo (art. 484-A): metade do aviso indenizado e da multa do FGTS, saque de 80% do FGTS e sem seguro-desemprego. A rescisão indireta é a justa causa do empregador (art. 483).',
    'A prescrição trabalhista tem duas regras na Constituição (art. 7º, XXIX): o empregado tem 2 anos após o fim do contrato para ajuizar a ação e, nela, pode cobrar os últimos 5 anos, contados do ajuizamento. Para o FGTS não recolhido, o STF fixou a prescrição quinquenal. Contra menor de 18 anos não corre prescrição. A prescrição intercorrente foi admitida pela Reforma, com prazo de 2 anos.'
  ],
  tm: [
    { t: 'Relação de emprego e terceirização', x: 'Para haver vínculo de emprego, é preciso pessoa física, pessoalidade, não eventualidade, onerosidade e subordinação. Sem um desses elementos, há outra relação de trabalho.', p: ['Terceirização é lícita em qualquer atividade, inclusive na atividade-fim (STF, ADPF 324 e RE 958.252).', 'A tomadora responde subsidiariamente pelas verbas do período em que se beneficiou do serviço.', 'A Administração Pública só responde se provada a falha na fiscalização do contrato (STF, Tema 1.118).', 'Grupo econômico gera responsabilidade solidária; a mera identidade de sócios não basta.', 'Teletrabalho: regulado por produção ou por tarefa fica fora do controle de jornada.'] },
    { t: 'Trabalho da mulher e do menor', x: 'A CLT protege a maternidade e o trabalho de quem ainda está em formação, e a FGV pergunta os detalhes de idade e de prazo.', p: ['Proibido qualquer trabalho a menor de 16 anos, salvo como aprendiz a partir dos 14.', 'Ao menor de 18 é proibido trabalho noturno, perigoso ou insalubre.', 'Licença-maternidade de 120 dias; até 180 em empresa cidadã.', 'Dois descansos especiais de 30 minutos cada para amamentar, até o filho completar 6 meses.', 'A adotante também tem licença-maternidade e estabilidade.'] }
  ],
  pg: ['Tempo de deslocamento casa-trabalho não é mais tempo à disposição, mesmo em transporte fornecido pelo empregador (Reforma de 2017).', 'O aviso prévio, mesmo indenizado, integra o tempo de serviço.', 'Adicionais de insalubridade e de periculosidade não se acumulam; o empregado escolhe um.', 'A gestante em contrato de experiência também tem estabilidade (Súmula 244, III, do TST, ainda cobrada pela FGV).'],
  leis: [['CLT (Decreto-Lei 5.452/43)', P + 'decreto-lei/del5452compilado.htm'], ['Constituição Federal — art. 7º', P + 'constituicao/constituicao.htm']]
};

X.ptrab = {
  x: [
    'Há três ritos no processo do trabalho. O sumário vale para causas de até 2 salários mínimos. O sumaríssimo vai de 2 a 40 salários mínimos e exige pedido certo e líquido, sem citação por edital, com no máximo 2 testemunhas por parte. O ordinário fica para causas acima de 40 salários e para a Administração Pública, com até 3 testemunhas. Desde 2017, a petição inicial deve indicar o valor de cada pedido em qualquer rito.',
    'A audiência é una, e as partes devem comparecer pessoalmente. Se o reclamante faltar, o processo é arquivado, e ele paga custas, salvo se provar motivo justificável em 15 dias. Se o reclamado faltar, ocorre revelia e confissão quanto à matéria de fato; mas, se o advogado dele estiver presente, a contestação e os documentos são aceitos (art. 844, § 5º). A conciliação é tentada na abertura e depois das razões finais.',
    'O prazo dos recursos trabalhistas é de 8 dias, salvo os embargos de declaração (5 dias). O recurso ordinário ataca sentenças; o agravo de petição, as decisões na execução; o agravo de instrumento serve só para destrancar recurso. Para recorrer, o empregador paga custas e faz depósito recursal, que cai pela metade para entidades sem fins lucrativos, microempresas e empresas de pequeno porte e é dispensado para beneficiários da justiça gratuita e empresas em recuperação judicial.',
    'Os honorários de sucumbência no processo do trabalho foram criados pela Reforma de 2017: de 5% a 15% sobre o valor da condenação ou do proveito econômico. O STF (ADI 5.766) declarou inconstitucional a cobrança de honorários e de perícia do beneficiário da justiça gratuita usando créditos obtidos no processo. As custas são de 2%, com limite máximo previsto na CLT.',
    'Na execução trabalhista, o juiz pode agir de ofício só quando a parte não tem advogado. O executado é citado para pagar ou garantir a execução em 48 horas. Garantido o juízo, tem 5 dias para os embargos à execução. A desconsideração da personalidade jurídica segue o incidente do CPC. Desde 2017, cabe protesto e inscrição no BNDT somente depois de 45 dias da citação sem garantia.'
  ],
  tm: [
    { t: 'Competência da Justiça do Trabalho', x: 'Desde a EC 45/2004, a Justiça do Trabalho julga as ações oriundas da relação de trabalho, não apenas da relação de emprego. Mas há exceções importantes definidas pelo STF.', p: ['Não julga causas de servidores estatutários (STF, ADI 3.395).', 'Julga ações de indenização por dano moral e material decorrentes da relação de trabalho, inclusive por acidente.', 'Julga as ações sobre penalidades administrativas impostas pela fiscalização do trabalho.', 'A competência territorial é, em regra, o local da prestação do serviço, ainda que contratado em outro lugar.'] },
    { t: 'Jus postulandi e acordo extrajudicial', x: 'Na Justiça do Trabalho, empregado e empregador podem atuar sem advogado nas instâncias ordinárias. A exceção alcança os recursos ao TST, a ação rescisória, o mandado de segurança e a ação cautelar (Súmula 425 do TST).', p: ['Homologação de acordo extrajudicial: petição conjunta, com advogados diferentes para cada parte (art. 855-B).', 'O juiz tem 15 dias para analisar o acordo e pode recusar a homologação.', 'O pedido de homologação suspende o prazo prescricional quanto aos direitos nele especificados.'] }
  ],
  pg: ['No rito sumaríssimo, a sentença dispensa relatório.', 'O preposto não precisa ser empregado do reclamado (art. 843, § 3º).', 'A ausência do reclamante na audiência em que deveria depor gera confissão ficta, e não arquivamento.', 'O depósito recursal pode ser substituído por fiança bancária ou seguro-garantia judicial.'],
  leis: [['CLT — Processo do Trabalho (arts. 643 a 910)', P + 'decreto-lei/del5452compilado.htm']]
};

X.trib = {
  x: [
    'Os princípios são limites ao poder de tributar. Legalidade: tributo se cria e se aumenta por lei. Anterioridade: o tributo novo ou aumentado só é cobrado no exercício seguinte e, cumulativamente, depois de 90 dias. Há exceções que a FGV ama: II, IE, IOF e impostos extraordinários de guerra não respeitam nenhuma das duas; IPI respeita só os 90 dias; IR respeita só a anual. Imunidade é norma constitucional que impede a tributação; isenção é dispensa por lei.',
    'São cinco espécies tributárias: impostos (sem vinculação a atividade estatal), taxas (poder de polícia ou serviço público específico e divisível), contribuições de melhoria (valorização imobiliária decorrente de obra pública), empréstimos compulsórios (só a União, por lei complementar, em calamidade, guerra externa ou investimento urgente) e contribuições especiais. Taxa não pode ter base de cálculo própria de imposto.',
    'O crédito nasce com o lançamento. As causas de suspensão da exigibilidade são moratória, depósito integral, reclamações e recursos administrativos, liminar, tutela antecipada e parcelamento. A extinção vem pelo pagamento, compensação, transação, remissão, prescrição, decadência e outras do art. 156. A exclusão se dá por isenção e anistia. Decadência é o prazo para lançar (5 anos); prescrição, para cobrar (5 anos da constituição definitiva).',
    'Responsabilidade tributária é a transferência da obrigação a um terceiro. Na sucessão empresarial, quem adquire o fundo de comércio e continua a atividade responde integralmente, se o alienante parar, ou subsidiariamente, se ele continuar. O sócio-administrador só responde por atos com excesso de poderes ou infração de lei. O mero inadimplemento não gera essa responsabilidade (Súmula 430 do STJ), mas a dissolução irregular da empresa gera (Súmula 435).',
    'A Reforma Tributária (EC 132/2023, regulamentada pela LC 214/2025) troca PIS, Cofins, IPI, ICMS e ISS por um IVA dual: a CBS, da União, e o IBS, de Estados e Municípios, com o Imposto Seletivo para bens prejudiciais à saúde e ao meio ambiente. A transição vai de 2026 a 2033. O IBS é cobrado no destino, tem legislação única nacional e é administrado por um Comitê Gestor.'
  ],
  tm: [
    { t: 'Impostos em espécie: quem cobra e o que cai', x: 'A FGV escolhe poucos impostos e pergunta detalhes de competência e de fato gerador.', p: ['IPTU: Município; pode ser progressivo em razão do valor do imóvel e no tempo, como sanção ao imóvel não edificado.', 'ITBI: Município do local do imóvel; fato gerador é o registro da transmissão (STF, Tema 1.124).', 'ITCMD: Estado; em imóveis, cabe ao Estado da situação do bem; progressivo por força da EC 132/2023.', 'IPVA: Estado; desde a EC 132/2023 incide também sobre embarcações e aeronaves, e pode ter alíquotas diferenciadas por impacto ambiental.', 'ICMS não incide na transferência de mercadorias entre estabelecimentos do mesmo titular (STF, ADC 49).'] },
    { t: 'Processo tributário e execução fiscal', x: 'O contribuinte tem várias ações. A escolha depende do momento: antes do lançamento, depois do lançamento ou já com a execução proposta.', p: ['Antes do lançamento: ação declaratória; depois: ação anulatória.', 'Mandado de segurança: direito líquido e certo, prazo de 120 dias.', 'Execução fiscal: o executado é citado para pagar em 5 dias; embargos em 30 dias, com garantia do juízo.', 'Exceção de pré-executividade: matérias de ordem pública que não exigem dilação probatória (Súmula 393 do STJ).', 'Repetição de indébito: 5 anos a partir da extinção do crédito.'] }
  ],
  pg: ['Imunidade recíproca protege o patrimônio, a renda e os serviços dos entes políticos, mas não se aplica às empresas públicas que cobram tarifa e distribuem lucro.', 'Taxa de coleta de lixo domiciliar é constitucional; taxa de iluminação pública, não (Súmula Vinculante 41).', 'Denúncia espontânea afasta a multa, mas não se aplica a tributo declarado e pago com atraso (Súmula 360 do STJ).', 'Parcelamento suspende a exigibilidade, mas não extingue o crédito.'],
  leis: [['Código Tributário Nacional (Lei 5.172/66)', P + 'leis/l5172compilado.htm'], ['Lei de Execução Fiscal (Lei 6.830/80)', P + 'leis/l6830.htm']]
};

X.emp = {
  x: [
    'Empresário é quem exerce profissionalmente atividade econômica organizada para a produção ou circulação de bens ou de serviços (art. 966). Não é empresário quem exerce profissão intelectual, de natureza científica, literária ou artística, salvo se o exercício da profissão constituir elemento de empresa. O registro na Junta Comercial é obrigatório, mas tem natureza declaratória: o empresário irregular continua sendo empresário, só que sem benefícios como a recuperação judicial.',
    'Nas sociedades, o foco é a limitada e a anônima. Na limitada, a responsabilidade de cada sócio é restrita ao valor das suas quotas, mas todos respondem solidariamente pela integralização do capital. Ela pode ser unipessoal. Na sociedade anônima, o capital é dividido em ações e cada acionista responde apenas pelo preço de emissão das ações que subscreveu. A sociedade em comum (sem registro) gera responsabilidade ilimitada e solidária dos sócios.',
    'Títulos de crédito seguem três princípios: cartularidade (precisa do documento), literalidade (vale o que está escrito) e autonomia (cada obrigação é independente). O aval garante o pagamento e é autônomo; no Código Civil, o aval parcial é vedado, mas na lei do cheque e da letra de câmbio é permitido. O cheque é ordem de pagamento à vista; sua prescrição é de 6 meses, contados do fim do prazo de apresentação (30 dias na mesma praça, 60 em praça diferente).',
    'A recuperação judicial serve para manter a empresa viva. O devedor precisa exercer a atividade regularmente há mais de 2 anos. Deferido o processamento, as ações e execuções ficam suspensas por 180 dias (stay period), prorrogáveis uma vez. O plano é apresentado em 60 dias e pode ser votado em assembleia de credores. Na falência, a ordem de pagamento começa pelos créditos trabalhistas (até 150 salários mínimos) e de acidente de trabalho.'
  ],
  tm: [
    { t: 'Estabelecimento, nome e propriedade industrial', x: 'Estabelecimento é o conjunto de bens organizado para o exercício da empresa. Pode ser vendido (trespasse), e a venda tem regras para proteger os credores.', p: ['Trespasse: o adquirente responde pelos débitos anteriores contabilizados; o alienante fica solidário por 1 ano.', 'Sem autorização expressa, o alienante não pode fazer concorrência ao adquirente por 5 anos.', 'Patente de invenção vale 20 anos; modelo de utilidade, 15 anos, contados do depósito.', 'Registro de marca vale 10 anos, prorrogáveis por períodos iguais e sucessivos.', 'Marca de alto renome tem proteção em todos os ramos de atividade.'] },
    { t: 'Contratos empresariais', x: 'A FGV pergunta poucos contratos, mas com detalhes. Os mais comuns são franquia, arrendamento mercantil (leasing), alienação fiduciária e representação comercial.', p: ['Franquia (Lei 13.966/2019): a circular de oferta deve ser entregue com pelo menos 10 dias de antecedência à assinatura.', 'Na alienação fiduciária de bem móvel, o credor pode buscar e apreender o bem após comprovar a mora.', 'Leasing: a cobrança antecipada do valor residual garantido não descaracteriza o contrato (Súmula 293 do STJ).', 'Representação comercial: indenização mínima de 1/12 do total das comissões, na rescisão sem justa causa.'] }
  ],
  pg: ['A sociedade cooperativa é sempre simples, independentemente do objeto; a sociedade por ações é sempre empresária.', 'O endosso pode ser parcial? Não: o endosso parcial é nulo.', 'Microempresa e empresa de pequeno porte podem apresentar plano especial de recuperação judicial.', 'Na falência, o crédito com garantia real vem logo depois dos trabalhistas, até o limite do valor do bem gravado.'],
  leis: [['Código Civil — Livro II, Direito de Empresa (arts. 966 a 1.195)', P + 'leis/2002/l10406compilada.htm'], ['Lei de Falências e Recuperação (Lei 11.101/2005)', P + '_ato2004-2006/2005/lei/l11101.htm']]
};

X.dh = {
  x: [
    'Tratados de direitos humanos têm três posições na hierarquia. Se aprovados em cada Casa do Congresso, em dois turnos, por 3/5, equivalem a emenda constitucional (art. 5º, § 3º). Se aprovados pelo rito comum, têm status supralegal: estão abaixo da Constituição e acima das leis (STF, RE 466.343). É por isso que a prisão civil do depositário infiel é ilícita (Súmula Vinculante 25). A Convenção sobre os Direitos das Pessoas com Deficiência foi a primeira com status de emenda.',
    'O sistema interamericano tem dois órgãos. A Comissão Interamericana recebe petições de qualquer pessoa, grupo ou ONG, desde que esgotados os recursos internos, em até 6 meses da decisão definitiva. A Corte Interamericana só recebe casos enviados pela Comissão ou por um Estado, nunca diretamente pela vítima. As sentenças da Corte são definitivas e inapeláveis. O Brasil reconheceu a competência da Corte em 1998.',
    'A proteção interna vem da própria Constituição e de leis especiais. O incidente de deslocamento de competência (art. 109, § 5º) leva para a Justiça Federal casos de grave violação de direitos humanos, a pedido do Procurador-Geral da República ao STJ. Também caem as ações afirmativas (cotas raciais, declaradas constitucionais na ADPF 186), o Estatuto da Igualdade Racial e a Lei Maria da Penha.'
  ],
  tm: [
    { t: 'Sistema global (ONU) e princípios', x: 'Ao lado do sistema regional, há o sistema global, da ONU. Seus principais instrumentos formam a chamada Carta Internacional de Direitos Humanos.', p: ['Carta Internacional: Declaração Universal (1948), Pacto dos Direitos Civis e Políticos e Pacto dos Direitos Econômicos, Sociais e Culturais (ambos de 1966).', 'Os direitos humanos são universais, indivisíveis, interdependentes e inter-relacionados (Declaração de Viena, 1993).', 'Princípio pro persona: aplica-se a norma mais favorável à pessoa, seja interna ou internacional.', 'Vedação do retrocesso: direitos conquistados não podem ser suprimidos sem compensação.', 'O Tribunal Penal Internacional julga genocídio, crimes contra a humanidade, crimes de guerra e agressão, de forma complementar à jurisdição nacional.'] }
  ],
  pg: ['A vítima não leva o caso direto à Corte Interamericana; o caminho passa pela Comissão.', 'Tratado de direitos humanos aprovado sem o rito do § 3º é supralegal, e não lei ordinária.', 'O controle de convencionalidade pode ser feito por qualquer juiz, não só pelo STF.'],
  leis: [['Convenção Americana (Pacto de San José, Decreto 678/92)', P + 'decreto/d0678.htm']]
};

X.cdc = {
  x: [
    'Vício e fato são a dupla mais cobrada do CDC. Vício é um problema no próprio produto ou serviço, que não funciona como deveria; o prazo para reclamar é decadencial: 30 dias para não duráveis e 90 para duráveis. Fato (ou acidente de consumo) é quando o defeito causa dano à segurança do consumidor; o prazo é prescricional, de 5 anos. No fato do produto, o comerciante só responde se o fabricante não puder ser identificado ou se ele não conservar adequadamente produtos perecíveis.',
    'Os direitos básicos do art. 6º incluem informação adequada, proteção contra publicidade enganosa e abusiva, revisão de cláusulas e inversão do ônus da prova. A inversão é feita pelo juiz quando a alegação for verossímil ou o consumidor for hipossuficiente. O consumidor que compra fora do estabelecimento comercial (internet, telefone) tem 7 dias para desistir, sem justificativa, com devolução imediata dos valores.'
  ],
  tm: [
    { t: 'Práticas e cláusulas abusivas', x: 'O CDC proíbe práticas que exploram a vulnerabilidade do consumidor. As cláusulas abusivas são nulas de pleno direito, e o juiz pode reconhecê-las de ofício, salvo em contratos bancários (Súmula 381 do STJ).', p: ['Venda casada: condicionar o fornecimento de um produto à compra de outro.', 'Enviar produto sem solicitação: equipara-se a amostra grátis.', 'Cobrança indevida paga pelo consumidor gera devolução em dobro, salvo engano justificável.', 'Cadastro de inadimplentes: o consumidor deve ser comunicado por escrito antes da inscrição (Súmula 359 do STJ).', 'Na cobrança de dívidas, o consumidor não pode ser exposto a ridículo nem a constrangimento.'] },
    { t: 'Quem é consumidor', x: 'O CDC adota a teoria finalista mitigada: é consumidor o destinatário final do produto, mas o STJ estende a proteção a quem, mesmo usando o bem na atividade, é vulnerável.', p: ['Consumidor por equiparação: a coletividade, todas as vítimas do acidente de consumo e todos os expostos às práticas comerciais.', 'O CDC se aplica às instituições financeiras (Súmula 297 do STJ).', 'Não se aplica à relação entre condômino e condomínio, nem à locação regida pela Lei do Inquilinato.', 'Profissionais liberais respondem mediante verificação de culpa.'] }
  ],
  pg: ['Vício aparente: 30 ou 90 dias a contar da entrega; vício oculto: do momento em que ficar evidenciado.', 'O fornecedor tem 30 dias para sanar o vício; depois disso, o consumidor escolhe entre substituição, devolução do valor ou abatimento.', 'Plano de saúde de autogestão não se submete ao CDC (Súmula 608 do STJ).'],
  leis: [['Código de Defesa do Consumidor (Lei 8.078/90)', P + 'leis/l8078compilado.htm']]
};

X.eca = {
  x: [
    'Criança tem até 12 anos incompletos; adolescente, de 12 a 18. Só o adolescente recebe medida socioeducativa; à criança se aplicam medidas de proteção. As medidas socioeducativas são advertência, obrigação de reparar o dano, prestação de serviços à comunidade (até 6 meses), liberdade assistida (mínimo de 6 meses), semiliberdade e internação. A internação dura no máximo 3 anos, com reavaliação a cada 6 meses, e a liberação é compulsória aos 21 anos.',
    'A família substituta tem três formas: guarda, tutela e adoção. A adoção é medida excepcional e irrevogável. O adotante precisa ter pelo menos 18 anos e ser 16 anos mais velho que o adotado. Avós e irmãos não podem adotar. Antes da adoção há estágio de convivência de até 90 dias, prorrogáveis. A adoção internacional só ocorre quando esgotadas as possibilidades de colocação em família brasileira.'
  ],
  tm: [
    { t: 'Ato infracional e garantias', x: 'O adolescente que pratica fato descrito como crime comete ato infracional. Ele tem as mesmas garantias processuais de um adulto, e outras próprias da sua condição.', p: ['A internação provisória, antes da sentença, dura no máximo 45 dias.', 'A internação só cabe em três casos: grave ameaça ou violência à pessoa, reiteração de infrações graves ou descumprimento reiterado de medida anterior (até 3 meses, nesse último caso).', 'O ato infracional análogo ao tráfico de drogas, por si só, não conduz à internação (Súmula 492 do STJ).', 'Remissão: forma de exclusão, suspensão ou extinção do processo; não implica reconhecimento da responsabilidade.'] },
    { t: 'Conselho Tutelar e direitos fundamentais', x: 'O Conselho Tutelar é órgão permanente, autônomo e não jurisdicional, encarregado de zelar pelos direitos das crianças e dos adolescentes.', p: ['Cada Município tem pelo menos 1 Conselho Tutelar, com 5 membros eleitos para mandato de 4 anos.', 'O Conselho aplica medidas de proteção, mas não aplica medidas socioeducativas.', 'Vedado o uso de castigo físico ou tratamento cruel ou degradante (Lei Menino Bernardo).', 'Viagem nacional de menor de 16 anos desacompanhado dos pais exige autorização judicial, salvo nas exceções do art. 83.'] }
  ],
  pg: ['A idade considerada é a da data do fato, não a da sentença.', 'Prescrição de medida socioeducativa existe (Súmula 338 do STJ) e segue as regras do Código Penal.', 'A adoção por procuração é proibida.'],
  leis: [['Estatuto da Criança e do Adolescente (Lei 8.069/90)', P + 'leis/l8069compilado.htm']]
};

X.amb = {
  x: [
    'A responsabilidade ambiental tem três esferas independentes: civil, administrativa e penal. A civil é objetiva, baseada na teoria do risco integral, que não admite excludentes como caso fortuito ou força maior. A obrigação de reparar acompanha o imóvel (propter rem), e o novo dono responde pelo dano deixado pelo anterior (Súmula 623 do STJ). A reparação do dano ambiental é imprescritível (STF, Tema 999). A pessoa jurídica pode responder penalmente.',
    'Os instrumentos da Política Nacional do Meio Ambiente incluem o licenciamento, o estudo de impacto ambiental (EIA/RIMA), o zoneamento e as unidades de conservação. O EIA é exigido para atividades potencialmente causadoras de significativa degradação, com publicidade obrigatória. O Código Florestal prevê as Áreas de Preservação Permanente e a Reserva Legal, que é um percentual da propriedade rural, maior na Amazônia Legal.'
  ],
  tm: [
    { t: 'Princípios e competências ambientais', x: 'Os princípios orientam a solução das questões da prova. A competência para proteger o meio ambiente é comum a todos os entes, e a Lei Complementar 140/2011 organiza quem licencia.', p: ['Princípio da prevenção: risco conhecido; princípio da precaução: incerteza científica, que não justifica a omissão.', 'Poluidor-pagador: quem polui arca com os custos; usuário-pagador: quem usa recurso natural paga por ele.', 'O licenciamento é feito por um único ente federativo, conforme o impacto da atividade (LC 140/2011).', 'Unidades de conservação: de proteção integral (uso indireto) e de uso sustentável.'] }
  ],
  pg: ['No risco integral, nem a culpa exclusiva de terceiro afasta a responsabilidade civil ambiental.', 'Multa administrativa ambiental exige comprovação de culpa ou dolo do infrator (STJ, responsabilidade administrativa subjetiva).', 'O princípio da insignificância é aplicável a crimes ambientais apenas excepcionalmente.'],
  leis: [['Lei de Crimes Ambientais (Lei 9.605/98)', P + 'leis/l9605.htm'], ['Política Nacional do Meio Ambiente (Lei 6.938/81)', P + 'leis/l6938.htm'], ['Código Florestal (Lei 12.651/2012)', P + '_ato2011-2014/2012/lei/l12651.htm']]
};

X.intl = {
  x: [
    'A LINDB resolve conflitos de leis no espaço. Capacidade, nome e direitos de família seguem a lei do domicílio da pessoa. Bens seguem a lei do país onde estão situados. Obrigações seguem a lei do país onde se constituírem. A sucessão segue a lei do domicílio do falecido, mas, para bens no Brasil, aplica-se a lei brasileira se for mais favorável ao cônjuge ou aos filhos brasileiros. O casamento celebrado no Brasil segue a lei brasileira quanto às formalidades.',
    'A cooperação jurídica internacional tem três instrumentos: carta rogatória (pedido de ato processual, com exequatur concedido pelo STJ), auxílio direto (quando não há decisão estrangeira a ser cumprida) e homologação de sentença estrangeira (também pelo STJ). A jurisdição brasileira é exclusiva para ações sobre imóveis no Brasil e para inventário e partilha de bens aqui situados.'
  ],
  tm: [
    { t: 'Tratados e sujeitos de direito internacional', x: 'O tratado passa por fases: negociação, assinatura, aprovação pelo Congresso por decreto legislativo, ratificação pelo Presidente e promulgação por decreto. Só então ele vale internamente.', p: ['O Congresso resolve definitivamente sobre os tratados que acarretem encargos ao patrimônio nacional (art. 49, I).', 'Reserva: declaração do Estado que exclui ou modifica o efeito de certas cláusulas.', 'Imunidade de jurisdição do Estado estrangeiro é relativa nos atos de gestão (como relações de trabalho) e absoluta nos atos de império.', 'Extradição: o pedido vem de outro Estado e é julgado pelo STF.', 'Asilo político é concedido ao estrangeiro perseguido; refúgio exige fundado temor de perseguição por raça, religião, nacionalidade, grupo social ou opinião política.'] }
  ],
  pg: ['O STJ homologa a sentença estrangeira; o STF não faz mais isso desde a EC 45/2004.', 'Divórcio consensual simples estrangeiro dispensa a homologação do STJ (CPC, art. 961, § 5º).', 'A lei do domicílio, e não da nacionalidade, é o critério da LINDB.'],
  leis: [['LINDB (Decreto-Lei 4.657/42)', P + 'decreto-lei/del4657compilado.htm'], ['Lei de Migração (Lei 13.445/2017)', P + '_ato2015-2018/2017/lei/l13445.htm']]
};

X.filo = {
  x: [
    'O positivismo jurídico separa direito e moral: o direito é o que foi posto pela autoridade competente. Kelsen, na Teoria Pura do Direito, organiza as normas em uma pirâmide, com a norma fundamental no topo. Hart vê o direito como união de regras primárias (que impõem deveres) e secundárias (de reconhecimento, de alteração e de julgamento). O pós-positivismo reaproxima direito e moral e dá força normativa aos princípios: Dworkin distingue regras e princípios, e Alexy trata princípios como mandamentos de otimização, aplicados pela ponderação.',
    'Os clássicos da justiça caem com frequência. Aristóteles distingue a justiça distributiva (dar a cada um conforme o mérito) da corretiva (restabelecer a igualdade nas trocas e nos danos). Rawls propõe o véu da ignorância: escolheríamos princípios justos se não soubéssemos a nossa posição na sociedade. Kant formula o imperativo categórico: agir de modo que a sua ação possa ser lei universal e tratar o outro sempre como fim, nunca como meio.'
  ],
  tm: [
    { t: 'Interpretação e hermenêutica', x: 'A FGV pergunta os métodos de interpretação e os pensadores que os criticaram ou ampliaram.', p: ['Métodos clássicos: gramatical, lógico, sistemático, histórico e teleológico.', 'Hermenêutica filosófica (Gadamer): todo intérprete carrega uma pré-compreensão.', 'Habermas: a legitimidade do direito vem do processo democrático de discussão (agir comunicativo).', 'Bobbio: o ordenamento jurídico deve ter unidade, coerência e completude; as antinomias se resolvem pelos critérios hierárquico, cronológico e da especialidade.'] }
  ],
  pg: ['Para Kelsen, a norma fundamental é pressuposta, e não posta.', 'Para Dworkin, os princípios se aplicam por peso; as regras, no modo tudo ou nada.', 'Para Aristóteles, a equidade corrige a lei onde ela é falha por ser geral.'],
  leis: []
};

X.eleit = {
  x: [
    'As condições de elegibilidade estão no art. 14, § 3º, da Constituição: nacionalidade brasileira, pleno exercício dos direitos políticos, alistamento eleitoral, domicílio eleitoral na circunscrição, filiação partidária e idade mínima (35 anos para Presidente e Senador, 30 para Governador, 21 para Deputado e Prefeito, 18 para Vereador). As inelegibilidades estão na própria Constituição e na LC 64/90, com as hipóteses da Lei da Ficha Limpa.',
    'As principais ações são a ação de impugnação de registro de candidatura (AIRC, em 5 dias da publicação do pedido), a ação de investigação judicial eleitoral (AIJE, por abuso de poder) e a ação de impugnação de mandato eletivo (AIME, em 15 dias da diplomação, por abuso do poder econômico, corrupção ou fraude). A AIME tramita em segredo de justiça. O princípio da anualidade (art. 16) diz que a lei que altera o processo eleitoral não se aplica à eleição que ocorra até 1 ano da sua vigência.'
  ],
  tm: [
    { t: 'Partidos e propaganda', x: 'Os partidos têm autonomia para definir sua estrutura, mas devem respeitar o caráter nacional e a prestação de contas. A propaganda eleitoral tem calendário e limites rígidos.', p: ['A propaganda eleitoral só é permitida a partir de 16 de agosto do ano da eleição.', 'Coligações são proibidas nas eleições proporcionais desde a EC 97/2017; federações partidárias são permitidas, com duração mínima de 4 anos.', 'A cláusula de desempenho restringe o acesso ao fundo partidário e ao tempo de rádio e TV.', 'O detentor de mandato proporcional que se desfiliar sem justa causa perde o mandato (fidelidade partidária).'] }
  ],
  pg: ['Os inalistáveis são os estrangeiros e os conscritos durante o serviço militar obrigatório.', 'O voto é facultativo para analfabetos, maiores de 70 anos e maiores de 16 e menores de 18.', 'O analfabeto pode votar, mas é inelegível.'],
  leis: [['Lei das Inelegibilidades (LC 64/90)', P + 'leis/lcp/lcp64.htm'], ['Lei das Eleições (Lei 9.504/97)', P + 'leis/l9504.htm']]
};

X.fin = {
  x: [
    'O orçamento é composto por três leis de iniciativa do Executivo: o plano plurianual (PPA, metas para 4 anos), a lei de diretrizes orçamentárias (LDO, prioridades do ano seguinte) e a lei orçamentária anual (LOA, receitas e despesas do ano). A LOA não pode conter dispositivo estranho à previsão de receita e à fixação de despesa (princípio da exclusividade), salvo autorização para créditos suplementares e operações de crédito.',
    'A Lei de Responsabilidade Fiscal impõe limites à despesa com pessoal: 50% da receita corrente líquida para a União e 60% para Estados e Municípios. Os precatórios são pagos em ordem cronológica, com preferência para os créditos alimentares e, entre eles, para os titulares idosos, com doença grave ou com deficiência. As obrigações de pequeno valor dispensam precatório.'
  ],
  tm: [
    { t: 'Créditos adicionais e receitas públicas', x: 'Quando o orçamento não basta, o governo usa créditos adicionais. A FGV cobra a diferença entre os três tipos.', p: ['Crédito suplementar: reforça dotação existente; autorizado por lei e aberto por decreto.', 'Crédito especial: para despesa sem dotação específica; também depende de lei.', 'Crédito extraordinário: despesas imprevisíveis e urgentes, como guerra e calamidade; aberto por medida provisória na União.', 'Receita corrente (tributos, por exemplo) e receita de capital (empréstimos, alienação de bens).'] }
  ],
  pg: ['É vedada a vinculação de receita de impostos a órgão, fundo ou despesa, salvo as exceções constitucionais (saúde, educação).', 'Lei complementar trata das normas gerais de finanças públicas; a LOA é lei ordinária.'],
  leis: [['Lei de Responsabilidade Fiscal (LC 101/2000)', P + 'leis/lcp/lcp101.htm'], ['Lei 4.320/64 (normas de direito financeiro)', P + 'leis/l4320.htm']]
};

X.prev = {
  x: [
    'Os benefícios mais cobrados são as aposentadorias, o auxílio por incapacidade temporária, a aposentadoria por incapacidade permanente, o salário-maternidade e a pensão por morte. Desde a EC 103/2019, a aposentadoria programada exige 65 anos para homens e 62 para mulheres, com tempo mínimo de contribuição. A pensão por morte é devida aos dependentes, com cotas, e a duração varia conforme a idade do cônjuge.',
    'Segurado obrigatório é quem exerce atividade remunerada: empregado, empregado doméstico, contribuinte individual, trabalhador avulso e segurado especial. O facultativo é quem não exerce atividade, mas escolhe contribuir, a partir dos 16 anos. Carência é o número mínimo de contribuições para ter direito ao benefício: 12 para os benefícios por incapacidade, 10 para o salário-maternidade da contribuinte individual e 180 para a aposentadoria.'
  ],
  tm: [
    { t: 'Qualidade de segurado e ações', x: 'Mesmo sem contribuir, o segurado mantém a proteção por algum tempo: é o período de graça. Perdido esse prazo, perde-se a qualidade de segurado.', p: ['Período de graça: 12 meses após a última contribuição, ampliado para 24 com mais de 120 contribuições e com mais 12 se desempregado.', 'Acidente de qualquer natureza dispensa carência para os benefícios por incapacidade.', 'O prévio requerimento administrativo é, em regra, necessário antes da ação judicial (STF, RE 631.240).', 'As ações contra o INSS são julgadas pela Justiça Federal; as acidentárias, pela Justiça Estadual.'] }
  ],
  pg: ['Auxílio-acidente é indenizatório e não exige carência.', 'O segurado especial contribui sobre a comercialização da produção e não precisa recolher mensalmente.', 'Pensão por morte não exige carência.'],
  leis: [['Lei de Benefícios (Lei 8.213/91)', P + 'leis/l8213cons.htm'], ['Lei de Custeio (Lei 8.212/91)', P + 'leis/l8212cons.htm']]
};
})(OAB.SINX);

/* Junta a ampliação às sinopses originais. */
(function () {
  Object.keys(OAB.SINX).forEach(function (id) {
    var s = OAB.SIN[id], x = OAB.SINX[id]; if (!s) return;
    (x.x || []).forEach(function (t, i) { if (s.tm[i] && !s.tm[i].x) s.tm[i].x = t; });
    if (x.tm) s.tm = s.tm.concat(x.tm);
    if (x.pg) s.pg = s.pg.concat(x.pg);
    s.leis = x.leis || [];
  });
})();
