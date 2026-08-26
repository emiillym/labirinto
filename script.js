// =====================================================
// CONFIGURAÇÕES DO JUMPSCARE
// =====================================================

const IMAGEM_SUSTO =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT-w-Ls3oUup5kGBGv2DHKfA7NJP_2GQoBxxILSta3R-1FLGKPvIaLqMc_&s=10";

const SOM_SUSTO =
    "bloodbath-98-death-scream.mp3";

const SOM_FAAAAH =
    "fahhhhhhhhhhhhhh.mp3";


// =====================================================
// ELEMENTOS DA PÁGINA
// =====================================================

const canvas = document.getElementById("labirinto");
const ctx = canvas.getContext("2d");

const faseTexto = document.getElementById("fase");
const mensagem = document.getElementById("mensagem");

const vitoria = document.getElementById("vitoria");
const textoVitoria = document.getElementById("textoVitoria");
const proxima = document.getElementById("proxima");

const reiniciar = document.getElementById("reiniciar");

const jumpscare = document.getElementById("jumpscare");
const imagemSusto = document.getElementById("imagemSusto");

const telaPreta = document.getElementById("telaPreta");
const final = document.getElementById("final");


// =====================================================
// LABIRINTOS
//
// 1 = parede
// 0 = caminho
// P = jogador
// S = saída
// =====================================================

const fases = [

    // =================================================
    // FASE 1
    // =================================================

    [
        "11111111111",
        "1P000000001",
        "11111111101",
        "10000000001",
        "10111111111",
        "10000000001",
        "10111111111",
        "100000000S1",
        "11111111111"
    ],


    // =================================================
    // FASE 2
    // =================================================

    [
        "1111111111111",
        "1P00010000001",
        "1011101011111",
        "1000101000001",
        "1110101111101",
        "1000100000101",
        "1011111110101",
        "1000000010101",
        "1111111010101",
        "1000000010001",
        "1011111111111",
        "10000000000S1",
        "1111111111111"
    ],


    // =================================================
    // FASE 3
    // =================================================

    [
        
    "111111101111111",
    "1P0000101000001",
    "111110101010111",
    "100010100010001",
    "111010111011101",
    "100010001000101",
    "101011101111101",
    "101000100000101",
    "101111111110101",
    "101000100000101",
    "101010101111101",
    "100010101000001",
    "101110101011101",
    "1000100000100S1",
    "111111111111111"
]
    ]

];


// =====================================================
// VARIÁVEIS DO JOGO
// =====================================================

let faseAtual = 0;

let mapa = [];

let jogador = {
    x: 0,
    y: 0
};

let saida = {
    x: 0,
    y: 0
};

let tamanhoCelula = 40;

let jogando = false;


// =====================================================
// CARREGAR FASE
// =====================================================

function carregarFase() {

    // Copia o mapa para não modificar
    // a fase original.

    mapa = fases[faseAtual].map(
        linha => linha.split("")
    );


    jogador = {
        x: 0,
        y: 0
    };


    saida = {
        x: 0,
        y: 0
    };


    // Procura jogador e saída.

    for (
        let y = 0;
        y < mapa.length;
        y++
    ) {

        for (
            let x = 0;
            x < mapa[y].length;
            x++
        ) {

            if (mapa[y][x] === "P") {

                jogador.x = x;
                jogador.y = y;

                mapa[y][x] = "0";
            }


            if (mapa[y][x] === "S") {

                saida.x = x;
                saida.y = y;

                mapa[y][x] = "0";
            }

        }

    }


    // Atualiza o texto.

    faseTexto.textContent =
        `Fase ${faseAtual + 1} de ${fases.length}`;


    if (faseAtual === 0) {

        mensagem.textContent =
            "Leve a bolinha até a saída!";

    }

    else if (faseAtual === 1) {

        mensagem.textContent =
            "Agora ficou um pouco mais difícil...";

    }

    else {

        mensagem.textContent =
            "Última fase. Concentre-se.";

    }


    ajustarCanvas();

    desenhar();

    jogando = true;
}


// =====================================================
// TAMANHO DO CANVAS
// =====================================================

function ajustarCanvas() {

    const largura =
        mapa[0].length;

    const altura =
        mapa.length;


    const tamanhoMaximo =
        Math.min(
            window.innerWidth * 0.90,
            window.innerHeight * 0.65,
            650
        );


    tamanhoCelula =
        Math.floor(
            tamanhoMaximo /
            Math.max(largura, altura)
        );


    canvas.width =
        largura * tamanhoCelula;

    canvas.height =
        altura * tamanhoCelula;
}


// =====================================================
// DESENHAR LABIRINTO
// =====================================================

function desenhar() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // Fundo

    ctx.fillStyle = "#ffffff";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // Paredes

    for (
        let y = 0;
        y < mapa.length;
        y++
    ) {

        for (
            let x = 0;
            x < mapa[y].length;
            x++
        ) {

            if (mapa[y][x] === "1") {

                ctx.fillStyle =
                    "#202028";

                ctx.fillRect(

                    x * tamanhoCelula,

                    y * tamanhoCelula,

                    tamanhoCelula,

                    tamanhoCelula

                );

            }

        }

    }


    // Saída

    ctx.fillStyle =
        "#31c46c";

    ctx.fillRect(

        saida.x * tamanhoCelula + 4,

        saida.y * tamanhoCelula + 4,

        tamanhoCelula - 8,

        tamanhoCelula - 8

    );


    // Jogador

    ctx.fillStyle =
        "#5546e8";

    ctx.beginPath();

    ctx.arc(

        jogador.x * tamanhoCelula +
        tamanhoCelula / 2,

        jogador.y * tamanhoCelula +
        tamanhoCelula / 2,

        tamanhoCelula * 0.30,

        0,

        Math.PI * 2

    );

    ctx.fill();

}


// =====================================================
// MOVIMENTAR JOGADOR
// =====================================================

function mover(dx, dy) {

    if (!jogando) {
        return;
    }


    const novoX =
        jogador.x + dx;

    const novoY =
        jogador.y + dy;


    // Impede sair do mapa.

    if (
        novoY < 0 ||
        novoY >= mapa.length ||
        novoX < 0 ||
        novoX >= mapa[0].length
    ) {

        return;

    }


    // Impede atravessar parede.

    if (
        mapa[novoY][novoX] === "1"
    ) {

        return;

    }


    jogador.x = novoX;

    jogador.y = novoY;


    desenhar();


    // Chegou na saída.

    if (
        jogador.x === saida.x &&
        jogador.y === saida.y
    ) {

        terminouFase();

    }

}


// =====================================================
// CONTROLES DO COMPUTADOR
// =====================================================

document.addEventListener(
    "keydown",
    function(event) {

        if (!jogando) {
            return;
        }


        switch (event.key) {

            case "ArrowUp":
            case "w":
            case "W":

                mover(0, -1);

                break;


            case "ArrowDown":
            case "s":
            case "S":

                mover(0, 1);

                break;


            case "ArrowLeft":
            case "a":
            case "A":

                mover(-1, 0);

                break;


            case "ArrowRight":
            case "d":
            case "D":

                mover(1, 0);

                break;

        }

    }
);


// =====================================================
// CONTROLES DO CELULAR
// =====================================================

let toqueInicialX = 0;
let toqueInicialY = 0;


canvas.addEventListener(
    "touchstart",
    function(event) {

        event.preventDefault();

        const toque =
            event.touches[0];

        toqueInicialX =
            toque.clientX;

        toqueInicialY =
            toque.clientY;

    },
    {
        passive: false
    }
);


canvas.addEventListener(
    "touchend",
    function(event) {

        event.preventDefault();

        const toque =
            event.changedTouches[0];


        const dx =
            toque.clientX -
            toqueInicialX;

        const dy =
            toque.clientY -
            toqueInicialY;


        const distancia =
            Math.max(
                Math.abs(dx),
                Math.abs(dy)
            );


        // Ignora toques muito pequenos.

        if (distancia < 20) {
            return;
        }


        // Movimento horizontal.

        if (
            Math.abs(dx) >
            Math.abs(dy)
        ) {

            if (dx > 0) {

                mover(1, 0);

            } else {

                mover(-1, 0);

            }

        }

        // Movimento vertical.

        else {

            if (dy > 0) {

                mover(0, 1);

            } else {

                mover(0, -1);

            }

        }

    },
    {
        passive: false
    }
);


// =====================================================
// TERMINOU A FASE
// =====================================================

function terminouFase() {

    jogando = false;


    // Se for a terceira fase,
    // começa o jumpscare.

    if (faseAtual === 2) {

        setTimeout(
            ativarJumpscare,
            400
        );

        return;
    }


    // Fases 1 e 2.

    textoVitoria.textContent =
        `Você completou a fase ${faseAtual + 1}!`;


    vitoria.classList.add(
        "mostrar"
    );

}


// =====================================================
// BOTÃO PRÓXIMA FASE
// =====================================================

proxima.addEventListener(
    "click",
    function() {

        vitoria.classList.remove(
            "mostrar"
        );


        faseAtual++;


        carregarFase();

    }
);


// =====================================================
// BOTÃO REINICIAR
// =====================================================

reiniciar.addEventListener(
    "click",
    function() {

        carregarFase();

    }
);


// =====================================================
// JUMPSCARE
// =====================================================

function ativarJumpscare() {

    jogando = false;


    // Coloca a imagem.

    imagemSusto.src =
        IMAGEM_SUSTO;


    // Mostra a imagem.

    jumpscare.classList.add(
        "mostrar"
    );


    // Toca o primeiro áudio.

    const audioSusto =
        new Audio(SOM_SUSTO);


    audioSusto.volume = 1;


    audioSusto.play()
        .catch(function() {

            console.log(
                "O navegador bloqueou o áudio."
            );

        });


    // Depois de 1,8 segundos,
    // fica tudo preto.

    setTimeout(
        function() {

            jumpscare.classList.remove(
                "mostrar"
            );


            telaPreta.classList.add(
                "mostrar"
            );


            // Espera 2,5 segundos
            // antes do FAAAAAH.

            setTimeout(
                tocarFaaaaah,
                2500
            );

        },
        1800
    );

}


// =====================================================
// SEGUNDO ÁUDIO — FAAAAAH
// =====================================================

function tocarFaaaaah() {

    const audioFah =
        new Audio(SOM_FAAAAH);


    audioFah.volume = 1;


    audioFah.play()
        .catch(function() {

            console.log(
                "O navegador bloqueou o áudio."
            );

        });


    // Espera o áudio terminar
    // antes de mostrar o final.

    setTimeout(
        function() {

            telaPreta.classList.remove(
                "mostrar"
            );


            final.classList.add(
                "mostrar"
            );

        },
        3500
    );

}


// =====================================================
// REDIMENSIONAR NO CELULAR/PC
// =====================================================

window.addEventListener(
    "resize",
    function() {

        if (mapa.length > 0) {

            ajustarCanvas();

            desenhar();

        }

    }
);


// =====================================================
// COMEÇAR JOGO
// =====================================================

carregarFase();
