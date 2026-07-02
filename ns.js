let numeroMaximo = 50;
let numeroSecreto = parseInt(Math.random() * numeroMaximo + 1);
let tentativas = 0;
let historico = [];
const resultado = document.querySelector('.resultado');
const botao = document.querySelector('.botao');
const input = document.querySelector('#NumeroSecreto');
const contadorEl = document.querySelector('.contador');
const historicoEl = document.querySelector('.historico');
const botaoRecomecar = document.getElementById('botaoRecomecar');
const dificuldadeSelect = document.getElementById('dificuldadeSelect');
const subtitulo = document.querySelector('h2');
const badgeDificuldade = document.getElementById('badgeDificuldade');
const heroButton = document.querySelector('.hero-button');
const difficultyCards = document.querySelectorAll('.difficulty-card');

function obterDadosDificuldade(valor) {
    const dados = {
        20: { label: 'FÁCIL', classe: 'facil' },
        50: { label: 'MÉDIO', classe: 'medio' },
        100: { label: 'DIFÍCIL', classe: 'dificil' },
        200: { label: 'INSANO', classe: 'insano' }
    };

    return dados[valor] || dados[50];
}

function atualizarStatus() {
    if (contadorEl) contadorEl.textContent = `Tentativas: ${tentativas}`;
    if (historicoEl) historicoEl.textContent = historico.length ? historico.join(', ') : '—';
}

function atualizarSubtitulo() {
    if (subtitulo) {
        subtitulo.textContent = `O número secreto está entre 1 e ${numeroMaximo}. Tente adivinhar!`;
    }
    const dadosDificuldade = obterDadosDificuldade(numeroMaximo);

    if (badgeDificuldade) {
        badgeDificuldade.textContent = dadosDificuldade.label;
        badgeDificuldade.classList.remove('badge-dificuldade--facil', 'badge-dificuldade--medio', 'badge-dificuldade--dificil', 'badge-dificuldade--insano');
        badgeDificuldade.classList.add(`badge-dificuldade--${dadosDificuldade.classe}`);
    }
    if (dificuldadeSelect) {
        dificuldadeSelect.value = String(numeroMaximo);
        dificuldadeSelect.classList.remove('dificuldade--facil', 'dificuldade--medio', 'dificuldade--dificil', 'dificuldade--insano');
        dificuldadeSelect.classList.add(`dificuldade--${dadosDificuldade.classe}`);
    }
    if (input) {
        input.max = String(numeroMaximo);
    }
    difficultyCards.forEach((card) => {
        const isActive = Number(card.dataset.difficulty) === numeroMaximo;
        card.classList.toggle('is-active', isActive);
        card.setAttribute('aria-pressed', String(isActive));
    });
}

function reiniciarJogo() {
    numeroSecreto = parseInt(Math.random() * numeroMaximo + 1);
    tentativas = 0;
    historico = [];
    botao.disabled = false;
    resultado.innerHTML = '';
    input.value = '';
    input.focus();
    if (botaoRecomecar) botaoRecomecar.style.display = 'none';
    atualizarStatus();
    atualizarSubtitulo();
}

// Adicionar event listener para a tecla Enter
input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        botao.click(); // Simula o clique no botão
    }
});

botao.addEventListener('click', function() {
    let palpite = input.value.trim();

    if (palpite === '' || isNaN(palpite)) {
        resultado.textContent = 'Por favor, insira um número válido.';
        return;
    }

    palpite = parseInt(palpite);

    if (palpite < 1 || palpite > numeroMaximo) {
        resultado.textContent = `Por favor, insira um número entre 1 e ${numeroMaximo}.`;
        return;
    }

    tentativas++;
    historico.push(palpite);
    if (historico.length > 5) historico.shift();
    atualizarStatus();

    if (palpite === numeroSecreto) {
        const dadosDificuldade = obterDadosDificuldade(numeroMaximo);
        resultado.innerHTML = `<div class="mensagem-acerto">
            <strong>Parabéns!</strong>
            <span>Você acertou o número secreto.</span>
            <div class="resultado-stats">
                <span><small>Número</small><b class="numero-secreto">${numeroSecreto}</b></span>
                <span><small>Tentativas</small><b>${tentativas}</b></span>
                <span><small>Dificuldade</small><b>${dadosDificuldade.label}</b></span>
            </div>
        </div>`;
        botao.disabled = true;
        if (botaoRecomecar) botaoRecomecar.style.display = 'block';
    } else {
        let mensagem = 'Que pena! Você errou.<br>';
        if (palpite < numeroSecreto) {
            mensagem += '<span class="dica-texto">Dica:</span> O número secreto é <span class="maiorMenor">maior</span> que o seu palpite.';
        } else {
            mensagem += '<span class="dica-texto">Dica:</span> O número secreto é <span class="maiorMenor">menor</span> que o seu palpite.';
        }
        resultado.innerHTML = mensagem; // Mudança de textContent para innerHTML para colocar span e mudar a cor da palavra "Dica"
    }

    input.value = '';
    input.focus();
});

if (botaoRecomecar) {
    botaoRecomecar.addEventListener('click', function() {
        reiniciarJogo();
    });
}

if (heroButton) {
    heroButton.addEventListener('click', function() {
        input.focus();
    });
}

if (dificuldadeSelect) {
    dificuldadeSelect.addEventListener('change', function() {
        numeroMaximo = parseInt(dificuldadeSelect.value);
        reiniciarJogo();
    });
}

difficultyCards.forEach((card) => {
    card.addEventListener('click', function() {
        numeroMaximo = parseInt(card.dataset.difficulty);
        reiniciarJogo();
    });
});

atualizarStatus();
atualizarSubtitulo();
