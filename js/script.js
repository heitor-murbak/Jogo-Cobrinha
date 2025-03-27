const canvas = document.getElementById('meucanvas');

const ctx = canvas.getContext('2d');

const tamanho = 30;

const cobra = [
    { x: 210, y: 210 },
    { x: 240, y: 210 }
];

const randomNumber = (min, max) => {
    return Math.round(Math.random() * (max - min ) + min)
}

const randomPositionW = () => {
    const numberW = randomNumber(0, canvas.width - tamanho)
    return Math.round(numberW / 30) * 30
}

const randomPositionH = () => {
    const numberH = randomNumber(0, canvas.height - tamanho)
    return Math.round(numberH / 30) * 30
}


const comida = {
    x: randomPositionW(),
    y: randomPositionH(),
    color: "red"
}

let direction, loopId

const desenhaComida = () => {

    const{ x, y, color } = comida

    ctx.shadowColor = color
    ctx.shadowBlur = 6
    ctx.fillStyle = color
    ctx.fillRect(x, y, tamanho, tamanho)
    ctx.shadowBlur = 0

}

const desenhaCobra = () => {
    ctx.fillStyle = "#ddd"

    cobra.forEach((position, index) =>{
        if(index == cobra.length - 1) {
            ctx.fillStyle = "white"
        }

        ctx.fillRect(position.x, position.y, tamanho, tamanho)
    })
}

const moveCobra = () => {
    if(!direction) return

    const cabeca = cobra[cobra.length - 1]

    cobra.shift()

    if(direction == "right") {
        cobra.push({ x: cabeca.x + tamanho, y: cabeca.y })
    }

    if(direction == "left") {
        cobra.push({ x: cabeca.x - tamanho, y: cabeca.y })
    }

    if(direction == "down") {
        cobra.push({ x: cabeca.x, y: cabeca.y + tamanho })
    }

    if(direction == "up") {
        cobra.push({ x: cabeca.x, y: cabeca.y - tamanho})
    }
}

const drawGrid = () => {
    ctx.lineWidth = 1
    ctx.strokeStyle = "black"

    for (let i = 30; i < canvas.width; i += 30) {
        ctx.beginPath()
        ctx.lineTo(i, 0)
        ctx.lineTo(i, 600)
        ctx.stroke()

        ctx.beginPath()
        ctx.lineTo(0, i)
        ctx.lineTo(900, i)
        ctx.stroke()
    }


}

const chackEat = () => {
    const cabeca = cobra[cobra.length - 1]

    if(cabeca.x == comida.x && cabeca.y == comida.y){
        cobra.push(cabeca)

        let x = randomPositionW()
        let y = randomPositionH()

        while (cobra.find((position)=> position.x == x && position.y == y)){
            x = randomPositionW()
            y = randomPositionH()
        }

        comida.x = x
        comida.y = y
    }
}

const resetGame = () => {
    direction = null;
    cobra.length = 2; 
    cobra[0] = { x: 210, y: 210 };
    cobra[1] = { x: 240, y: 210 };
    
    comida.x = randomPositionW();
    comida.y = randomPositionH();
};

const checkCollision = () =>{
    const cabeca = cobra[cobra.length - 1]
    const neckIndex = cobra.length - 2

    const wallCollision = cabeca.x < -30 || cabeca.x > 900 || cabeca.y < -30 || cabeca.y > 600

    const selfCollision = cobra.find((position, index) => {
        return index < neckIndex && position.x == cabeca.x && position.y == cabeca.y
    })

    if(wallCollision || selfCollision){
        resetGame()
        alert("Você perdeu!")
    }

}


const gameLoop = () =>{
    clearInterval(loopId)
    ctx.clearRect(0, 0, 900, 600)

    desenhaComida();
    drawGrid();
    desenhaCobra();
    moveCobra();
    chackEat();
    checkCollision();

    loopId = setTimeout(() =>{
        gameLoop();
    }, 100)
}

gameLoop();

document.addEventListener("keydown", ({key}) =>{
    if(key == "ArrowRight" && direction != "left"){
        direction = "right"
    }

    if(key == "ArrowLeft" && direction != "right"){
        direction = "left"
    }

    if(key == "ArrowDown" && direction != "up"){
        direction = "down"
    }

    if(key == "ArrowUp" && direction != "down"){
        direction = "up"
    }
})