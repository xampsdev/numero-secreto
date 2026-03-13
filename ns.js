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

function atualizarStatus() {
    if (contadorEl) contadorEl.textContent = `Tentativas: ${tentativas}`;
    if (historicoEl) historicoEl.textContent = historico.length ? historico.join(', ') : '—';
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
        resultado.textContent = 'Por favor, insira um número entre 1 e 50.';
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
        numeroSecreto = parseInt(Math.random() * numeroMaximo + 1);
        tentativas = 0;
        historico = [];
        botao.disabled = false;
        resultado.innerHTML = '';
        input.value = '';
        input.focus();
        botaoRecomecar.style.display = 'none';
        atualizarStatus();
    });
}

atualizarStatus();

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
        '#ff0000ff',
        '#00ff00ff',
        '#0000ffff'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
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
for (let i = 0; i < columns; i++) {
    drops[i] = 1;
}

function draw() {
    // Fundo preto com leve transparência (efeito rastro)
    ctx.fillStyle = isMobile ? "rgba(0, 0, 0, 0.18)" : "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Estilo dos números
    ctx.fillStyle = getRandomRGBColor();
    ctx.font = fontSize + "px monospace";

    // Desenha os números
    for (let i = 0; i < drops.length; i++) {
        const text = numbers.charAt(Math.floor(Math.random() * numbers.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Reinicia a queda
        if (drops[i] * fontSize > canvas.height && Math.random() > (isMobile ? 0.99 : 0.975)) {
            drops[i] = 0;
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
        for (let i = 0; i < newColumns; i++) {
            if (typeof drops[i] === "undefined") drops[i] = 1;
        }
    }, 250);
});
