// Para trabalhar com canvas é preciso declarar o seu contexto, 2d ou 3d

// CanvasEl, precisa de uma largura para que possa definir o espaço de tela
// que o usuario vai usar para trabalhar

const canvasEl = document.querySelector("canvas"),
  canvasCtx = canvasEl.getContext("2d"),
  gapX = 10;

const mouse = { x: 0, y: 0 };

// Programação Orientada a objeto
// Objeto do campo
const field = {
  w: window.innerWidth,
  h: window.innerHeight,
  draw: function () {
    canvasCtx.fillStyle = "#286047"; // Definir cor do gramado
    canvasCtx.fillRect(0, 0, this.w, this.h); // definir largura e altura
  },
};

// Objeto da linha
const line = {
  w: 15,
  h: field.h,
  draw: function () {
    canvasCtx.fillStyle = "#ffffff";
    canvasCtx.fillRect(field.w / 2 - this.w / 2, 0, this.w, this.h);
  },
};

// Objeto das raquetes
const leftPaddle = {
  x: gapX,
  y: 0,
  w: line.w,
  h: 200,
  _move: function () {
    this.y = mouse.y - this.h / 2;
  },
  draw: function () {
    canvasCtx.fillStyle = "#ffffff";
    canvasCtx.fillRect(this.x, this.y, this.w, this.h);

    this._move();
  },
};

const rightPaddle = {
  x: field.w - line.w - gapX,
  y: 0,
  w: line.w,
  h: 200,
  speed: 4, // Facil: 4 - Medio: 5 - Dificil: 6
  _move: function () {
    if (this.y + this.h / 2 < ball.y + ball.r) {
      this.y += this.speed;
    } else {
      this.y -= this.speed;
    }
  },
  speedUp: function () {
    if (this.speed < 10) this.speed += 1; // Facil: 10 - Medio: 12 - Dificil: 14
  },
  draw: function () {
    canvasCtx.fillStyle = "#ffffff";
    canvasCtx.fillRect(this.x, this.y, this.w, this.h);

    this._move();
  },
};

// Objeto do placar
const score = {
  human: 0,
  computer: 0,
  increaseHuman: function () {
    this.human++;
  },
  increaseComputer: function () {
    this.computer++;
  },
  draw: function () {
    canvasCtx.font = "bold 72px Arial"; // Fonte do texto
    canvasCtx.textAlign = "center"; // Centralizar o texto
    canvasCtx.textBaseline = "top"; // Base do texto
    canvasCtx.fillStyle = "#01341D";
    // Esquerdo, humano
    canvasCtx.fillText(this.human, field.w / 4, 50); // Texto, x(lado esquerdo inicial usando grid) , y(do topo para baixo)
    // Direita, computador
    canvasCtx.fillText(this.computer, field.w / 4 + field.w / 2, 50); // Texto, x(lado esquerdo inicial usando grid / dividir a outra grid) , y(do topo para baixo)
  },
};

// Objeto da bola
const ball = {
  x: field.w / 2,
  y: field.h / 2,
  r: 20,
  speed: 5,
  directionX: 1,
  directionY: 1,
  _calcPosition: function () {
    // verifica se o jogador 1 fez um ponto (x > largura do campo)
    if (this.x > field.w - this.r - rightPaddle.w - gapX) {
      // verifica se a raquete direita está na posição y da bola
      if (
        this.y + this.r > rightPaddle.y &&
        this.y - this.r < rightPaddle.y + rightPaddle.h
      ) {
        // rebate a bola intervertendo o sinal de X
        this._reverseX();
      } else {
        // pontuar o jogador 1
        score.increaseHuman();
        this._pointUp();
      }
    }

    // verifica se o jogador 2 fez um ponto (x < 0)
    if (this.x < this.r + leftPaddle.w + gapX) {
      // verifica se a raquete esquerda está na posição y da bola
      if (
        this.y + this.r > leftPaddle.y &&
        this.y - this.r < leftPaddle.y + leftPaddle.h
      ) {
        // rebate a bola intervertendo o sinal de X
        this._reverseX();
      } else {
        // pontuar o jogador 2
        score.increaseComputer();
        this._pointUp();
      }
    }

    // verifica as laterais superior e inferior do campo
    if (
      (this.y - this.r < 0 && this.directionY < 0) ||
      (this.y > field.h - this.r && this.directionY > 0)
    ) {
      // rebate a bola invertendo o sinal do eixo Y
      this._reverseY();
    }
  },
  _reverseX: function () {
    // 1 * -1 = -1
    // -1 * -1 = 1
    this.directionX *= -1;
  },
  _reverseY: function () {
    // 1 * -1 = -1
    // -1 * -1 = 1
    this.directionY *= -1;
  },
  _speedUp: function () {
    if (this.speed < 15) {
      this.speed += 1; // Facil: 1 - Medio: 2 - Dificil: 3
    }
  },
  _pointUp: function () {
    this._speedUp();
    rightPaddle.speedUp();

    this.x = field.w / 2;
    this.y = field.h / 2;
  },
  _move: function () {
    this.x += this.directionX * this.speed;
    this.y += this.directionY * this.speed;
  },
  draw: function () {
    canvasCtx.fillStyle = "#ffffff";
    canvasCtx.beginPath();
    canvasCtx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
    canvasCtx.fill();

    this._calcPosition();
    this._move();
  },
};

function setup() {
  // window.innerWidth, innerHeight para definir a tela inteira
  canvasEl.width = canvasCtx.width = field.w;
  canvasEl.height = canvasCtx.height = field.h;
}

// draw=desenho, ela irá desenhar inicialmente as coisas de forma estática, Ex: Campo
// o 'canvas' funciona com sobreposição de camadas

// A propria api do 'canvas' ajuda a criar retangulos: fillRect(x(inicio), y(inicio), Largura, Altura)
// Circulos: arc(x(inicio), y(inicio), r(raio), 0(Onde o arco vai começar), 0.0 * Math.PI(Onde termina), false (Se vai andar no sentido ant-horário))
// Sempre definindo a cor antes do desenho

function draw() {
  field.draw();
  line.draw();

  leftPaddle.draw();
  rightPaddle.draw();

  score.draw();

  ball.draw();
}

// Criar um laço para animar
// Enquanto for true, e true nunca muda, então é infinito
// para criar quadro a quadro e não travar em computador ruim

// API para suavizar a animação
window.animateFrame = (function () {
  return (
    window.requestAnimationFrame || // Nativa do navegador
    window.webkitRequestAnimationFrame || // Google
    window.mozRequestAnimationFrame || // Mozilla
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame || // Microsoft
    function (callback) {
      return window.setTimeout(callback, 1000 / 60);
    }
  );
})();

function main() {
  animateFrame(main);
  draw();
}

setup();
main();

canvasEl.addEventListener("mousemove", function (e) {
  mouse.x = e.pageX;
  mouse.y = e.pageY;
});
