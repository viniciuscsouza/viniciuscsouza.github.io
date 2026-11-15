---
title: 'Cada número do /teamwork vale o que vale o árbitro que o confere'
author: Vinicius Costa
pubDatetime: 2026-11-15T11:00:00Z
featured: false
draft: false
tags:
  - agentes
  - verificação
  - engenharia
description: 'Balanço do /teamwork (13/11): o número se confere onde o árbitro existia antes da campanha, e mede o substituto onde o próprio pipeline o construiu.'
---

No dia 13 de novembro, a Google publicou um balanço de trabalhos feitos com o /teamwork, o modo multiagente do Antigravity. São quatro domínios: matemática, química, sistemas de software e engenharia de machine learning. O texto é assinado por Vahab Mirrokni, Google Fellow e VP de Google Research, e afirma que todo o trabalho foi feito em colaboração com especialistas humanos. O post anuncia também o outro lado: /teamwork e /boost passam a estar disponíveis no Antigravity e o Deep Review também, com inscrições abertas para 10 mil pesquisadores acadêmicos receberem seis meses de acesso gratuito à faixa mais alta de uso. O documento junta, num texto só, os resultados de um harness multiagente com um critério por domínio, e é isso que dá o que discutir.

O post parte de uma premissa de arquitetura, e ela é o que faz o resto fazer sentido. Segundo o texto, a geração de um modelo é imprevisível, o que deixa uma lacuna entre uma tentativa e a resposta certa. Ele também afirma que modelos perdem detalhes em tarefas de vários dias, porque a atenção se espalha por uma janela de contexto que só cresce. O conserto declarado não é aumentar a janela. É particionar o contexto por construção: cada agente recebe apenas os arquivos e as ferramentas de um passo específico, coordenadores passam tarefas a sucessores com contexto limpo, e críticos e auditores verificam o resultado sem ver o raciocínio de quem o produziu. A premissa é declaração de desenho, não resultado medido no post.

O post não separa os números por tipo de árbitro. Separo, porque é isso que decide o que cada cifra prova.

O primeiro grupo tem árbitro anterior à campanha, que o agente não consegue editar. Em matemática, quem confere é o kernel do Lean 4, e a divisão de trabalho está explícita: matemáticos humanos confirmam que o enunciado formal corresponde ao problema original, e a partir daí "the proof only compiles if every logical step holds". A conjectura de Courtade–Kumar, de 2013, foi provada em generalidade total com o padrão Long Proof e formalizada em Lean 4, em cerca de 50 milhões de linhas. O LEAP, framework do time com o Google Cloud AI, produziu segundo o post a formalização de ponta a ponta da conjectura de Weil: cerca de 1,8 milhão de linhas em 28.800 invocações de subagentes. Em sistemas, a campanha de duas semanas no Zircon, o microkernel do Fuchsia, gerou cerca de 800 mil linhas de Rust que passam em todos os testes unitários do kernel e inicializam em hardware arm64. O libgav1 foi reescrito em cerca de 170 mil linhas de Rust, com paridade bit a bit numa suíte de conformidade. Nesses casos o número se confere contra algo que existia antes de o agente começar: o kernel, a suíte de testes, o hardware.

O segundo grupo tem um árbitro que o próprio pipeline construiu. No DuoDiscover, que otimiza kernels de TPU, a avaliação completa em hardware leva de 7 a 32 minutos, o que limita quantos candidatos cabem numa campanha. A solução foi construir avaliadores substitutos de 23 segundos, os yardsticks, e validá-los periodicamente contra execuções completas com correlação de Kendall. O resultado reportado é 4,09x de speedup geométrico médio sobre as implementações de referência em 17 kernels do JAXBench, e 2,99x em sete kernels Pallas de inferência do vLLM. Em química, um laço de 30 agentes especializados com um simulador espectral de informação física determina estrutura molecular a partir de dados de NMR: 95% de acerto top-1 e 100% top-3 em moléculas de benchmark, perto do dobro de um agente sozinho, segundo o post. O conjunto não é nomeado nem contado ali. Aqui o árbitro existe, mas nasceu dentro do mesmo pipeline, e o que ele garante é a ordenação de candidatos.

O terceiro grupo é medição interna ou enquete. Antes do STOC 2027, autores de 578 submissões, mais de um terço do total, optaram por receber parecer do Deep Review; numa pesquisa em andamento com N = 70, 90% classificaram o parecer como majoritariamente ou quase todo factual e 90% disseram que usariam de novo, com mais de 30% relatando bug de prova ou erro de digitação matematicamente relevante e 14% apontando lacuna técnica que levou mais de uma hora para corrigir. É relato de quem pediu o serviço, e o post não publica taxa de aceitação nem parecer de revisor. No Borg, a redução de 24% na preempção de cargas de TPU em alguns tipos de hardware é medida pela própria Google, sem verificação externa.

O padrão de reescrita é o que mais sustenta a tese. O post abre o parágrafo dizendo por que ele existe: migração grande falha quando o agente troca dependências por stubs ou altera os testes para que um port quebrado passe. O conserto é agendar cada módulo só depois que as suas dependências compilam e ligar cada módulo folha à suíte de testes original, sem modificação. Está dito ali que, sem árbitro fixo, o agente otimiza para o teste que passa. O padrão é anunciado como algo que estará disponível em breve no Antigravity, então ainda não dá para rodá-lo por fora.

O limite aparece onde o árbitro é substituto. Um yardstick de 23 segundos mede candidatos, não o resultado: o post não diz se o 4,09x saiu da execução completa ou do proxy, e a validação por correlação de Kendall é sobre a ordenação dos candidatos. Se essa correlação não se sustenta, o ganho não sobrevive à medição no hardware. O caso mais honesto do balanço é o libgav1. Começou cerca de 4x mais lento que o C++ original e só passou a 20 a 30% mais rápido, em x86_64 e ARM, depois de receber ferramentas de profiling e o mandato de maximizar a velocidade em clipes de amostra. O post não diz se os clipes usados para medir eram os mesmos usados para ajustar. O ganho veio de dar ao agente um árbitro de desempenho e um alvo.

Minha leitura: cada número do balanço vale o que vale o árbitro que o confere, e é por isso que o libgav1 diz mais do que o 95% da química. Onde o árbitro existia antes da campanha e o agente não podia editá-lo, o número se confere por fora. Onde o próprio pipeline construiu o substituto, o ganho mede o substituto. O 4x mais lento no primeiro dia é o detalhe que prova o ponto: velocidade não é propriedade do modelo, é resultado de ferramenta e de mandato.

Para quem usa, sobra uma lista de perguntas antes de olhar o número. Quem é o árbitro, e ele existia antes da campanha? O agente tinha permissão para editá-lo, ou o teste foi tocado durante o port? Se o número é contra um substituto, qual é a correlação dele com a medição real, e o resultado final saiu da medição completa? Qual foi o primeiro resultado, não só o último? E, em prova, quem confirmou que o enunciado formal é o problema certo. O post não traz preço: a documentação do /teamwork diz que o comando exige plano pago e começa com uma entrevista de escopo. Antes de tratar um balanço multiagente como evidência, vale perguntar o que é o árbitro antes de perguntar quanto o número subiu.

## 📎 Fonte Original

Google Research, "Advancing science & engineering with Antigravity's /teamwork" (13/11/2026, Vahab Mirrokni): https://www.research.google/blog/advancing-science-engineering-with-antigravitys-teamwork-feature/

Documentação do /teamwork no Antigravity: https://antigravity.google/docs/teamwork/

<div class="persona" data-audio="/audio/teamwork-arbitro-do-agente-comentario.mp3">
  <button class="persona-avatar" type="button" aria-pressed="false" aria-label="Tocar o comentário em áudio com Nadine">
    <img src="/personas/nadine.webp" alt="Retrato de Nadine, em estilo de gravura" width="480" height="480" loading="lazy" />
  </button>
  <p class="persona-name">Nadine</p>
  <p class="persona-hint">Toque duas vezes para ouvir</p>
  <div class="persona-progress" aria-hidden="true"><span></span></div>
</div>

<p class="persona-note"><small>Comentário em áudio, 2 min 13: Nadine cobra o conjunto de teste que a química não nomeia e a taxa que a enquete do Deep Review não publicou. Não é a narração do texto.</small></p>
