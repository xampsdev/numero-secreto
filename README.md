# Número Secreto 2.0

Jogo web interativo desenvolvido para praticar e aplicar fundamentos de desenvolvimento Front-end.

O jogador precisa descobrir um número secreto gerado aleatoriamente pelo sistema. A cada tentativa, a interface informa se o palpite deve ser maior ou menor, permitindo que o jogador utilize lógica para reduzir as possibilidades até encontrar a resposta correta.

A versão 2.0 evoluiu a proposta original com uma interface mais elaborada, diferentes níveis de dificuldade, feedback visual e uma experiência mais completa para o usuário.

## Preview

<p align="center">
  <img src="./previa/ns20.png" alt="Preview do Número Secreto 2.0" width="400">
</p>

## Demonstração

**Jogue online:**

[![Acessar o jogo](https://img.shields.io/badge/Jogar%20agora-Número%20Secreto-7CFC00?style=for-the-badge)](https://xampsdev.github.io/numero-secreto/)

**Repositório:**

[![GitHub](https://img.shields.io/badge/Ver%20código-GitHub-181717?style=for-the-badge&logo=github)](https://github.com/xampsdev/numero-secreto)

## Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript
- Manipulação do DOM
- Git e GitHub

## Funcionalidades

- Geração aleatória do número secreto
- Diferentes níveis de dificuldade
- Validação das tentativas do jogador
- Feedback indicando se o número secreto é maior ou menor
- Contagem de tentativas
- Atualização dinâmica da interface
- Reinicialização do jogo após uma vitória
- Interface responsiva para diferentes tamanhos de tela
- Feedback visual durante a interação
- Histórico de partidas

## Como funciona

O fluxo principal do jogo é:

1. O jogador escolhe um nível de dificuldade.
2. O sistema gera um número secreto dentro do intervalo correspondente.
3. O jogador informa um palpite.
4. O sistema compara o palpite com o número secreto.
5. A interface informa se o número secreto é:
   - maior que o palpite;
   - menor que o palpite;
   - igual ao palpite.
6. O jogador continua tentando até encontrar o número correto.

## Conceitos técnicos aplicados

### Manipulação do DOM

Atualização dinâmica dos elementos da interface de acordo com as ações do jogador.

### Eventos do navegador

Captura e tratamento das interações realizadas pelo usuário, como cliques e envio de tentativas.

### Estruturas condicionais

Uso de lógica de comparação para determinar o feedback exibido ao jogador.

### Controle de estado

Gerenciamento de informações como:

- número secreto;
- dificuldade selecionada;
- tentativas realizadas;
- histórico de partidas;
- estado atual do jogo.

### Geração de números aleatórios

Utilização de JavaScript para gerar o número secreto dentro do intervalo definido pela dificuldade selecionada.

### Organização de código

Separação entre a estrutura da interface, a estilização visual e a lógica principal da aplicação.

## Próximas melhorias

- aprimorar as animações de feedback;
- adicionar novos modos de jogo;
- melhorar o sistema de histórico.

## Autor

**XAN**

[GitHub](https://github.com/xampsdev) · [Portfólio](https://alexandrexan.github.io/projetos-do-xan/)
