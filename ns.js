let numeroMaximo = 50;
let numeroSecreto = parseInt(Math.random() * numeroMaximo + 1);
console.log(numeroSecreto); // Para depuração, pode ser removido depois
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

function atualizarStatus() {
    if (contadorEl) contadorEl.textContent = `Tentativas: ${tentativas}`;
    if (historicoEl) historicoEl.textContent = historico.length ? historico.join(', ') : '—';
}

function atualizarSubtitulo() {
    if (subtitulo) {
        subtitulo.textContent = `O número secreto está entre 1 e ${numeroMaximo}. Tente adivinhar!`;
    }
    if (badgeDificuldade) {
        const label = numeroMaximo === 20 ? 'FÁCIL' : numeroMaximo === 100 ? 'DIFÍCIL' : 'MÉDIO';
        const classe = numeroMaximo === 20 ? 'badge-dificuldade--facil' : numeroMaximo === 100 ? 'badge-dificuldade--dificil' : 'badge-dificuldade--medio';
        badgeDificuldade.textContent = label;
        badgeDificuldade.classList.remove('badge-dificuldade--facil', 'badge-dificuldade--medio', 'badge-dificuldade--dificil');
        badgeDificuldade.classList.add(classe);
    }
    if (dificuldadeSelect) {
        const classeSelect = numeroMaximo === 20 ? 'dificuldade--facil' : numeroMaximo === 100 ? 'dificuldade--dificil' : 'dificuldade--medio';
        dificuldadeSelect.classList.remove('dificuldade--facil', 'dificuldade--medio', 'dificuldade--dificil');
        dificuldadeSelect.classList.add(classeSelect);
    }
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
        resultado.innerHTML = `<div class="mensagem-acerto">
            Parabéns! Você adivinhou o número secreto: <span class="numero-secreto">${numeroSecreto}</span> com ${tentativas} ${tentativas > 1 ? 'tentativas' : 'tentativa'}!
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

if (dificuldadeSelect) {
    dificuldadeSelect.addEventListener('change', function() {
        numeroMaximo = parseInt(dificuldadeSelect.value);
        reiniciarJogo();
    });
}

atualizarStatus();
atualizarSubtitulo();

const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");

// Ajusta tamanho do canvas para tela inteira
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

// Opção 1: Cor RGB fixa
// const color = "#ff0000ff";

// Opção 2: Função para gerar cores RGB aleatórias
function getRandomRGBColor() {
    const colors = [
        '#FF00FF',
        '#00FFFF',
        '#FFFF00',
        '#FFA500',
        '#800080',
        '#FF0000',
        '#00FF00',
        '#0000FF',
        '#FFFFFF'
    ];
    const weights = [2, 2, 2, 2, 2, 2, 2, 2, 0.5];
    let total = 0;
    for (let i = 0; i < weights.length; i++) total += weights[i];
    let r = Math.random() * total;
    for (let i = 0; i < colors.length; i++) {
        r -= weights[i];
        if (r <= 0) return colors[i];
    }
    return colors[colors.length - 1];
}
const color = getRandomRGBColor();

// Caracteres que vão "cair"
const numbers = "0123456789";
const isMobile = window.matchMedia("(max-width: 768px)").matches;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const toggleAnimacao = document.getElementById("toggleAnimacao");
const toggleStorageKey = "matrixAnimationEnabled";
const fontSize = isMobile ? 20 : 16;
const columns = Math.floor(canvas.width / fontSize);

// Array para controlar a "chuva"
const drops = [];
const dropColors = [];
for (let i = 0; i < columns; i++) {
    drops[i] = 1;
    dropColors[i] = getRandomRGBColor();
}

function draw() {
    // Fundo preto com leve transparência (efeito rastro)
    ctx.fillStyle = isMobile ? "rgba(0, 0, 0, 0.18)" : "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Estilo dos números
    ctx.font = fontSize + "px monospace";

    // Desenha os números
    for (let i = 0; i < drops.length; i++) {
        ctx.fillStyle = dropColors[i];
        const text = numbers.charAt(Math.floor(Math.random() * numbers.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Reinicia a queda
        if (drops[i] * fontSize > canvas.height && Math.random() > (isMobile ? 0.99 : 0.975)) {
            drops[i] = 0;
            if (Math.random() > 0.5) {
                dropColors[i] = getRandomRGBColor();
            }
        }

        drops[i]++;
    }
}

// Menos FPS em mobile para economizar bateria
let rafId = null;
let lastFrame = 0;
const frameInterval = isMobile ? 120 : 60;

function loop(ts) {
    if (!lastFrame || ts - lastFrame >= frameInterval) {
        draw();
        lastFrame = ts;
    }
    rafId = requestAnimationFrame(loop);
}

function startAnimation() {
    if (rafId === null) {
        lastFrame = 0;
        rafId = requestAnimationFrame(loop);
    }
}

function stopAnimation() {
    if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
    }
}

// Pausa quando a aba estiver oculta
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        stopAnimation();
    } else {
        if (toggleAnimacao && toggleAnimacao.checked && !prefersReducedMotion.matches) {
            startAnimation();
        }
    }
});

function syncAnimationState() {
    if (prefersReducedMotion.matches) {
        if (toggleAnimacao) {
            toggleAnimacao.checked = false;
            toggleAnimacao.disabled = true;
        }
        stopAnimation();
        return;
    }

    if (toggleAnimacao) {
        toggleAnimacao.disabled = false;
        if (toggleAnimacao.checked && !document.hidden) {
            startAnimation();
        } else {
            stopAnimation();
        }
    } else if (!document.hidden) {
        startAnimation();
    }
}

if (toggleAnimacao) {
    const saved = localStorage.getItem(toggleStorageKey);
    if (saved !== null) {
        toggleAnimacao.checked = saved === "true";
    }

    toggleAnimacao.addEventListener("change", () => {
        localStorage.setItem(toggleStorageKey, String(toggleAnimacao.checked));
        syncAnimationState();
    });
}

prefersReducedMotion.addEventListener("change", syncAnimationState);

syncAnimationState();

// Ajusta se mudar o tamanho da tela
let resizeTimeout;
window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;
        // Recalcular colunas conforme novo tamanho
        const newColumns = Math.floor(canvas.width / fontSize);
        drops.length = newColumns;
        dropColors.length = newColumns;
        for (let i = 0; i < newColumns; i++) {
            if (typeof drops[i] === "undefined") drops[i] = 1;
            if (typeof dropColors[i] === "undefined") dropColors[i] = getRandomRGBColor();
        }
    }, 250);
});
