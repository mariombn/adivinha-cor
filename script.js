// Configurações da matriz
const columns = 'ABCDEF'.split('');
const rows = Array.from({ length: 6 }, (_, i) => i + 1);

// Variáveis para armazenar a cor e a posição escolhidas
let chosenColor;
let chosenPosition;
let attempts = 3;
let selectedColors = []; // Armazena as cores selecionadas pelos jogadores

// Função para gerar uma lista de cores em gradiente (arco-íris)
function generateRainbowColors(totalColors) {
    const colors = [];
    const saturationRange = [50, 100]; // Intervalo de saturação
    const lightnessRange = [30, 70];   // Intervalo de luminosidade

    for (let i = 0; i < totalColors; i++) {
        const hue = i * (360 / totalColors);
        const saturation = saturationRange[0] + (Math.sin(i) * (saturationRange[1] - saturationRange[0]) / 2) + ((saturationRange[1] - saturationRange[0]) / 2);
        const lightness = lightnessRange[0] + (Math.cos(i) * (lightnessRange[1] - lightnessRange[0]) / 2) + ((lightnessRange[1] - lightnessRange[0]) / 2);
        colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
    }
    return colors;
}

// Inicializa o jogo
function initGame() {
    attempts = 3; // Reinicia as tentativas
    selectedColors = []; // Limpa as cores selecionadas
    document.getElementById('final-screen').classList.add('hidden'); // Esconde a tela final
    document.getElementById('message').innerText = ''; // Limpa a mensagem
    document.getElementById('attempts-remaining').innerText = ''; // Limpa as tentativas restantes

    const totalButtons = columns.length * rows.length;
    const colors = generateRainbowColors(totalButtons);

    // Cria uma lista com todas as posições e cores correspondentes
    const positionsColors = [];
    let colorIndex = 0;
    for (let i = 0; i < rows.length; i++) {
        for (let j = 0; j < columns.length; j++) {
            const position = columns[j] + rows[i];
            positionsColors.push({
                position: position,
                color: colors[colorIndex]
            });
            colorIndex++;
        }
    }

    // Embaralha as posições e cores para a seleção inicial
    const shuffledPositionsColors = positionsColors.sort(() => 0.5 - Math.random());
    const selectedPositionsColors = shuffledPositionsColors.slice(0, 4);

    // Mostra as opções de cores para o jogador escolher
    const selectionDiv = document.getElementById('selection-buttons');
    selectionDiv.innerHTML = ''; // Limpa o conteúdo anterior
    selectedPositionsColors.forEach(item => {
        const btn = document.createElement('button');
        btn.style.backgroundColor = item.color;
        btn.dataset.color = item.color;
        btn.dataset.position = item.position;
        btn.innerHTML = item.position; // Exibe a posição
        btn.addEventListener('click', () => {
            chosenColor = item.color;
            chosenPosition = item.position;
            document.getElementById('color-selection').classList.add('hidden');
            startGame(colors);
        });
        selectionDiv.appendChild(btn);
    });

    document.getElementById('color-selection').classList.remove('hidden');
}

// Inicia a matriz de jogo
function startGame(colors) {
    const matrixDiv = document.getElementById('matrix');
    matrixDiv.innerHTML = ''; // Limpa o conteúdo anterior
    let colorIndex = 0;

    // Atualiza o número inicial de tentativas
    updateAttemptsMessage();

    for (let i = 0; i < rows.length; i++) {
        for (let j = 0; j < columns.length; j++) {
            const btn = document.createElement('button');
            btn.style.backgroundColor = colors[colorIndex];
            btn.dataset.color = colors[colorIndex];
            btn.dataset.position = columns[j] + rows[i];
            btn.innerHTML = btn.dataset.position; // Exibe a posição no botão

            btn.addEventListener('click', () => {
                if (btn.dataset.attempted) return;
                btn.dataset.attempted = true;

                // Adiciona a classe 'attempted' ao botão
                btn.classList.add('attempted');

                // Armazena a cor selecionada
                selectedColors.push({
                    color: btn.dataset.color,
                    position: btn.dataset.position
                });

                if (btn.dataset.color === chosenColor) {
                    // Exibe a mensagem de sucesso
                    document.getElementById('message').innerText = `Parabéns! Você acertou a cor na posição ${btn.dataset.position}!`;
                    endGame(true);
                } else {
                    attempts--;
                    if (attempts === 0) {
                        // Exibe a mensagem de derrota
                        document.getElementById('message').innerText = 'Game Over! Você perdeu.';
                        endGame(false);
                    } else {
                        // Exibe a mensagem de tentativa
                        document.getElementById('message').innerText = `Tente novamente!`;
                        updateAttemptsMessage();
                    }
                }
            });

            matrixDiv.appendChild(btn);
            colorIndex++;
        }
    }

    document.getElementById('game-matrix').classList.remove('hidden');
}

// Atualiza a mensagem de tentativas restantes
function updateAttemptsMessage() {
    document.getElementById('attempts-remaining').innerText = `Tentativas restantes: ${attempts}`;
}

// Função para finalizar o jogo e exibir a tela final
function endGame(won) {
    // Esconde a matriz do jogo após um pequeno atraso para o jogador ver a última mensagem
    setTimeout(() => {
        document.getElementById('game-matrix').classList.add('hidden');

        // Exibe as cores selecionadas pelos jogadores
        const selectedColorsDiv = document.getElementById('selected-colors');
        selectedColorsDiv.innerHTML = '';
        selectedColors.forEach(item => {
            const btn = document.createElement('button');
            btn.style.backgroundColor = item.color;
            btn.innerHTML = item.position;
            selectedColorsDiv.appendChild(btn);
        });

        // Exibe a cor escolhida pelo primeiro jogador
        const chosenColorDiv = document.getElementById('chosen-color-display');
        chosenColorDiv.innerHTML = '';
        const chosenBtn = document.createElement('button');
        chosenBtn.style.backgroundColor = chosenColor;
        chosenBtn.innerHTML = chosenPosition;
        chosenColorDiv.appendChild(chosenBtn);

        // Limpa mensagens
        document.getElementById('message').innerText = '';
        document.getElementById('attempts-remaining').innerText = '';

        document.getElementById('final-screen').classList.remove('hidden');
    }, 1000); // Atraso de 1 segundo
}

// Evento para o botão de reiniciar o jogo
document.getElementById('restart-button').addEventListener('click', () => {
    document.getElementById('final-screen').classList.add('hidden');
    initGame();
});

// Inicia o jogo ao carregar a página
window.onload = initGame;
