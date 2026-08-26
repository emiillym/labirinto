// =====================================================
// CONFIGURAÇÕES
// =====================================================


// IMAGEM DO JUMPSCARE
const IMAGEM_SUSTO =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT-w-Ls3oUup5kGBGv2DHKfA7NJP_2GQoBxxILSta3R-1FLGKPvIaLqMc_&s=10";


// ÁUDIO DO PRIMEIRO SUSTO
const SOM_SUSTO =
    "bloodbath-98-death-scream.mp3";


// ÁUDIO QUE TOCA DEPOIS DA TELA PRETA
const SOM_FAAAAH =
    "fahhhhhhhhhhhhhh.mp3";


// =====================================================
// ELEMENTOS
// =====================================================

const canvas =
    document.getElementById("labirinto");

const ctx =
    canvas.getContext("2d");

const faseTexto =
    document.getElementById("fase");

const mensagem =
    document.getElementById("mensagem");

const vitoria =
    document.getElementById("vitoria");

const textoVitoria =
    document.getElementById("textoVitoria");

const proxima =
    document.getElementById("proxima");

const reiniciar =
    document.getElementById("reiniciar");

const jumpscare =
    document.getElementById("jumpscare");

const imagemSusto =
    document.getElementById("imagemSusto");

const telaPreta =
    document.getElementById("telaPreta");

const final =
    document.getElementById("final");


// =====================================================
// FASES
// =====================================================

const fases = [

    // FASE 1
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


    // FASE 2
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


    // FASE 3
    [
        "111111111111111",
        "1P0000001000001",
        "111111110111101",
        "100000010000101",
        "101111011111101",
        "101000010000001",
        "101011111111101",
        "101000000000101",
        "101111111110101",
        "100000000010101",
        "111111111010101",
        "100000001010001",
        "101111101011101",
        "1000000010000S1",
        "111111111111111"
    ]
];


// =====================================================
// ESTADO
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

    mapa =
        fases[faseAtual]
        .map(linha => linha.split(""));


    jogador = {
        x: 0,
        y: 0
    };


    saida = {
        x: 0,
        y: 0
    };


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


    faseTexto.textContent =
        `Fase ${faseAtual + 1} de 3`;


    if (faseAtual === 0) {

        mensagem.textContent =
            "Leve a bolinha até a saída!";

    } else if (faseAtual === 1) {

        mensagem.textContent =
            "Agora ficou mais difícil...";

    } else {

        mensagem.textContent =
            "Última fase. Concentre-se.";
    }


    ajustarCanvas();

    desenhar();

    jogando = true;
}


// =====================================================
// TAMANHO
// =====================================================

function ajustarCanvas() {

    const largura =
        mapa[0].length;

    const altura =
        mapa.length;


    const tamanhoMaximo =
        Math.min(
            window.innerWidth * .90,
            window.innerHeight * .65,
            650
        );


    tamanhoCelula =
        Math.floor(
            tamanhoMaximo /
            Math.max(
                largura,
                altura
            )
        );


    canvas.width =
        largura *
        tamanhoCelula;


    canvas.height =
        altura *
        tamanhoCelula;
}


// =====================================================
// DESENHAR
// =====================================================

function desenhar() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // FUNDO
    ctx.fillStyle =
        "#ffffff";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // PAREDES
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

            if (
                mapa[y][x] === "1"
            ) {

                ctx.fillStyle =
                    "#202028";


                ctx.fillRect(

                    x *
                    tamanhoCelula,

                    y *
                    tamanhoCelula,

                    tamanhoCelula,

                    tamanhoCelula
                );
            }
        }
    }


    // SAÍDA
    ctx.fillStyle =
        "#31c46c";


    ctx.fillRect(

        saida.x *
        tamanhoCelula + 4,

        saida.y *
        tamanhoCelula + 4,

        tamanhoCelula - 8,

        tamanhoCelula - 8
    );


    // JOGADOR
    ctx.fillStyle =
        "#5546e8";


    ctx.beginPath();


    ctx.arc(

        jogador.x *
        tamanhoCelula +
        tamanhoCelula / 2,

        jogador.y *
        tamanhoCelula +
        tamanhoCelula / 2,

        tamanhoCelula * .3,

        0,

        Math.PI * 2
    );


    ctx.fill();
}


// =====================================================
// MOVIMENTO
// =====================================================

function mover(dx, dy) {

    if (!jogando)
        return;


    const novoX =
        jogador.x + dx;

    const novoY =
        jogador.y + dy;


    if (
        novoY < 0 ||
        novoY >= mapa.length ||
        novoX < 0 ||
        novoX >= mapa[0].length
    ) {
        return;
    }


    if (
        mapa[novoY][novoX] === "1"
    ) {
        return;
    }


    jogador.x =
        novoX;

    jogador.y =
        novoY;


    desenhar();


    if (
        jogador.x === saida.x &&
        jogador.y === saida.y
    ) {

        terminouFase();
    }
}


// =====================================================
// TECLADO
// =====================================================

document.addEventListener(
    "keydown",
    event => {

        if (!jogando)
            return;


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
// TOUCH
// =====================================================

let toqueX = 0;
let toqueY = 0;


canvas.addEventListener(
    "touchstart",
    event => {

        event.preventDefault();

        const toque =
            event.touches[0];


        toqueX =
            toque.clientX;

        toqueY =
            toque.clientY;

    },
    {
        passive: false
    }
);


canvas.addEventListener(
    "touchend",
    event => {

        event.preventDefault();

        const toque =
            event.changedTouches[0];


        const dx =
            toque.clientX -
            toqueX;


        const dy =
            toque.clientY -
            toqueY;


        const distancia =
            Math.max(
                Math.abs(dx),
                Math.abs(dy)
            );


        if (distancia < 20)
            return;


        if (
            Math.abs(dx) >
            Math.abs(dy)
        ) {

            if (dx > 0)
                mover(1, 0);

            else
                mover(-1, 0);

        } else {

            if (dy > 0)
                mover(0, 1);

            else
                mover(0, -1);
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


    // FASE 3
    if (faseAtual === 2) {

        setTimeout(
            ativarJumpscare,
            400
        );

        return;
    }


    textoVitoria.textContent =
        `Você completou a fase ${faseAtual + 1}!`;


    vitoria.classList.add(
        "mostrar"
    );
}


// =====================================================
// PRÓXIMA FASE
// =====================================================

proxima.addEventListener(
    "click",
    () => {

        vitoria.classList.remove(
            "mostrar"
        );


        faseAtual++;


        carregarFase();
    }
);


// =====================================================
// REINICIAR
// =====================================================

reiniciar.addEventListener(
    "click",
    () => {

        carregarFase();
    }
);


// =====================================================
// JUMPSCARE
// =====================================================

function ativarJumpscare() {

    jogando = false;


    // COLOCA IMAGEM
    imagemSusto.src =
        IMAGEM_SUSTO;


    jumpscare.classList.add(
        "mostrar"
    );


    // PRIMEIRO ÁUDIO
    const audioSusto =
        new Audio(SOM_SUSTO);


    audioSusto.volume = 1;


    audioSusto.play()
        .catch(() => {});


    /*
       DEPOIS DO SUSTO:

       A imagem desaparece.
       A tela fica completamente preta.
    */

    setTimeout(
        () => {

            jumpscare.classList.remove(
                "mostrar"
            );


            telaPreta.classList.add(
                "mostrar"
            );


            /*
               ESPERA 2,5 SEGUNDOS
               ANTES DO "FAAAAAAH"
            */

            setTimeout(
                tocarFaaaaah,
                2500
            );

        },

        1800
    );
}


// =====================================================
// FAAAAAH
// =====================================================

function tocarFaaaaah() {

    const audioFah =
        new Audio(SOM_FAAAAH);


    audioFah.volume = 1;


    audioFah.play()
        .catch(() => {});


    /*
       DEPOIS DO ÁUDIO,
       MOSTRA O FINAL.
    */

    setTimeout(
        () => {

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
// REDIMENSIONAMENTO
// =====================================================

window.addEventListener(
    "resize",
    () => {

        if (mapa.length > 0) {

            ajustarCanvas();

            desenhar();
        }
    }
);


// =====================================================
// INICIAR
// =====================================================

carregarFase();
