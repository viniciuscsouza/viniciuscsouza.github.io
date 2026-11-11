---
author: Vinicius Costa
pubDatetime: 2026-11-11T11:00:00Z
title: "Pedágio da especialização: o que o BotPsy ensina sobre modelos pequenos"
slug: botpsy-pedagio-da-especializacao
featured: false
draft: false
tags:
  - inteligencia-artificial
  - agentes
  - modelos
  - open-source
description: "Tether AI Research publicou o BotPsy, de 0,8 B, para chamada de ferramentas. O ajuste fino derrubou o modelo; professores o trouxeram de volta."
---

Hoje, 11 de novembro de 2026, a Tether AI Research publicou no blog do Hugging Face o BotPsy, um modelo de 0,8 bilhão de parâmetros construído sobre o Qwen3.5-0.8B e voltado a chamada de ferramentas. Escrevo sobre ele porque o post dos autores conta uma história menos óbvia que o título. A receita de especialização estraga o modelo antes de consertá-lo, e o conserto vem de professores, não de mais dados.

A tese que quero defender é esta: especializar um modelo pequeno em chamada de ferramenta cobra um pedágio sobre o que ele já sabia, e o BotPsy indica que esse pedágio se paga com professor especialista e feedback token a token, não com mais dado. Os números que sustentam isso saíram todos dos próprios autores, em execuções feitas em 3 de novembro, e o post não cita avaliação de terceiro. Vou usá-los com essa ressalva em mente, e não vou repeti-la a cada parágrafo.

A receita tem quatro estágios. O primeiro é um ajuste fino de parâmetro inteiro em conversas com uso de ferramenta. Até aí, nada de estranho. O problema aparece no que o próprio texto diz sobre o resultado: o SFT "boosts tool use but pushes knowledge and instruction following below the base model". Em português, melhora o uso de ferramenta e empurra conhecimento e seguimento de instrução para abaixo do modelo base. A Figura 4 mostra essa queda, mas os valores desse estágio intermediário não aparecem em número no texto, então não tenho como dizer quanto o modelo perdeu.

Minha leitura, que o post não formula assim, é que o uso de ferramenta foi o que o treino olhou, e o resto saiu junto. Quando o gradiente só enxerga uma tarefa, a capacidade vizinha não entra na conta. Não é uma falha de implementação. É o custo que aparece quando a função de perda não protege o que não está nela.

A recuperação vem do segundo estágio, que os autores chamam de MOPD: destilação on-policy com KL reversa calculada por token, tendo como professores três modelos Qwen3.5-4B. Cada professor passou por RL próprio em uma habilidade: tool use, raciocínio geral e seguimento de instrução. O aluno de 0,8 B gera as próprias respostas, e a cada token recebe o sinal da distribuição do professor relevante para aquela habilidade. Por isso a tese fala de feedback por token. O sinal chega em cada passo da geração, e não só no fim.

O terceiro estágio são duas rodadas de RL com DAPO e uma recompensa de crédito parcial, que pontua separadamente o nome da ferramenta, os nomes dos argumentos e os valores dos argumentos. Crédito parcial muda o que o modelo aprende a valorizar: uma chamada que acerta a ferramenta e erra um valor deixa de valer zero.

Os ganhos que interessam ao argumento são três. O BFCL v4 vai de 23,4 para 44,0, e o τ-bench de 23,2 para 51,5 — quase o dobro nos dois. O terceiro é o Claw-Eval, que desconta a nota quando a tarefa é concluída de forma insegura: ali o BotPsy sai de 39,3 para 46,5 e continua sendo o mais baixo da sua faixa de tamanho. Em conhecimento, o GPQA Diamond foi de 33,2 para 38,1 e o MMLU-Pro de 41,6 para 48,9. Em seguimento de instrução, o IFEval foi de 59,7 para 90,8 e o IFBench de 22,0 para 55,9. O Multi-IF fechou em 67,2, mas esse número esconde a curva: a primeira volta fez 84,3 e a terceira caiu para 51,0. Para quem constrói agente, a terceira volta é a que pesa, porque tarefa real raramente termina na primeira mensagem.

A manchete diz que 0,8 B bate um modelo 2,5 vezes maior. A comparação é com o Qwen3.5-2B-Think, e ela tem fronteira declarada. O BotPsy ganha em cinco de seis benchmarks de tool use e perde no Claw-Eval, com 46,5 contra 48,9. Onde perde de forma mais clara: busca web do BFCL, 14,0 contra 19,8; memória, 16,3 contra 26,1; casos especiais do ACEBench, 51,3 contra 58,0; e τ³-banking, com 4,1 num benchmark em que nenhum modelo passa de 5. A frase "bate um modelo maior" é verdadeira dentro desse recorte. Fora dele, o texto não afirma nada.

Há um ponto sobre encadeamento que o resumo da release deixa de lado. Em retrieval multi-passo, o cenário complexo de "Information Retrieval & Research" pontua 15, contra 79 nas chamadas simples do mesmo grupo. A média de chamada simples somando todos os grupos de aplicação é 75, contra 54 do base. O modelo acerta bem o passo único e cai quando precisa costurar vários. Se o seu caso de uso é pesquisa com várias buscas, esse é o número que decide, não o das chamadas isoladas.

Sobre eficiência, o post mostra menos raciocínio por resposta certa: 3.690 tokens contra 11.563 no GPQA, e 1.912 contra 5.105 no MMLU-Pro. Loops repetitivos caem de 22,9% para 1,4%, e estouros do teto de 32k caem de 28,3% para 0,2%. Na segurança, as respostas inseguras em red team automatizado caem de 36% para 21%, e sob prompt injection, de 46% para 31%.

Agora, o "on-device" do título. O texto tem uma única frase sobre latência: "Shorter, more decisive reasoning should reduce latency on-device." Está no condicional, e com razão, porque não há tokens por segundo, consumo de memória ou nome de aparelho em lugar nenhum do post. Os benchmarks externos foram rodados em 03/11/2026. Então o que existe é uma expectativa razoável, apoiada em menos tokens de raciocínio, e não uma medida.

Também há uma contradição que vale registrar com cuidado. A licença declarada é Apache 2.0, com a expressão "for research and educational use". O texto do Apache 2.0 não tem cláusula de campo de uso: é uma licença permissiva, que não diz para que serve o software. Se a restrição estiver no arquivo que for publicado, o rótulo não descreve o arquivo; se não estiver, a frase do anúncio não descreve a licença. Não dá para saber qual dos dois hoje, porque os pesos ainda "will be released". Isso é leitura minha, não parecer jurídico, e a conferência fica para quando o download existir. A declaração de uso pretendido diz que o modelo não se destina a decisões automatizadas de alto risco, nem a aplicações com dinheiro, dados pessoais ou saúde. A lista de domínios que ele cobre cita finanças, e-mail e compras. O texto diz as duas coisas, e fica para quem for usar decidir como lê isso.

Fica a pergunta prática: o que olhar quando o próximo modelo pequeno com ferramenta aparecer? Eu olharia quatro coisas, nesta ordem:

Primeiro, se o estágio intermediário foi medido em número, e não só em figura. Sem a magnitude da queda em conhecimento e seguimento, não dá para saber quanto o professor precisou recuperar.

Segundo, a terceira volta do Multi-IF ou um teste equivalente de conversa longa. Se a curva cai do mesmo jeito, a receita não resolveu o problema de sustentar o contexto, só o de acertar a chamada.

Terceiro, a latência medida em aparelho, com tokens por segundo e memória de pico. Sem isso, "on-device" continua sendo um título.

Quarto, se a licença declarada bate com o arquivo que se baixa. Essa é a checagem mais barata das quatro e a que mais evita dor de cabeça depois.

O que o BotPsy mostra, num caso só e no harness de quem o publicou, é que o pedágio da especialização aparece na tabela do próprio autor e que a destilação de professores especialistas o reduz. O que não se pode concluir a partir dele é justamente o que decide uma adoção: quanto o modelo ocupa, quantos tokens por segundo entrega e como se comporta na conversa que passa da terceira volta. Quem for embarcar isso num aparelho vai gastar mais tempo medindo o que o anúncio não mediu do que lendo a tabela de BFCL.

<div class="persona" data-audio="/audio/botpsy-pedagio-da-especializacao-comentario.mp3">
  <button class="persona-avatar" type="button" aria-pressed="false" aria-label="Tocar o comentário em áudio com Helena">
    <img src="/personas/helena.webp" alt="Retrato de Helena, em estilo de gravura" width="480" height="480" loading="lazy" />
  </button>
  <p class="persona-name">Helena</p>
  <p class="persona-hint">Toque duas vezes para ouvir</p>
  <div class="persona-progress" aria-hidden="true"><span></span></div>
</div>

<p class="persona-note"><small>Comentário em áudio, 2 min 00: Helena separa a medida do modelo da medida da implantação e discorda do post: latência no celular é conta de quem adota, não lacuna do anúncio — e o corte vem antes pela memória, em Q4, do que pela velocidade. Não é a narração do texto.</small></p>
