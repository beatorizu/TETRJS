const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');

// Calculate the size of canvas from constants
ctx.canvas.width = COLS * BLOCK_SIZE;
ctx.canvas.height = ROWS * BLOCK_SIZE;

// Scale blocks
ctx.scale(BLOCK_SIZE, BLOCK_SIZE);

let board = new Board();

function play() {
    board.getEmptyBoard();
    let piece = new Piece(ctx);
    piece.draw();

    board.piece = piece;

    time.start = performance.now();
    animate();
}

let time = { start: 0, elapsed: 0, level: 1000 };

function animate(now = 0) {
    // Update elapsed time
    time.elapsed = now - time.start;

    // If elapsed time has passed time for current level
    if (time.elapsed > time.level) {
        // Restart counting from now
        time.start = now;
    }

    // Clear board before drawing new state
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    board.piece.draw();
    requestId = requestAnimationFrame(animate);
}

moves = {
    [KEY.SPACE]: p => ({ ...p, y: p.y + 1}),
    [KEY.LEFT]: p => ({ ...p, x: p.x - 1}),
    [KEY.RIGHT]: p => ({ ...p, x: p.x + 1}),
    [KEY.DOWN]: p => ({ ...p, y: p.y + 1}),
    [KEY.UP]: p => board.rotate(p)
}

document.addEventListener('keydown', event => {
    if (moves[event.keyCode]) {
        // Stop the event from bubbling
        event.preventDefault();

        // Get new state of piece
        let p = moves[event.keyCode](board.piece);

        if (event.keyCode === KEY.SPACE) {
            // Hard drop
            while (board.valid((p))) {
                board.piece.move(p);
                p = moves[KEY.DOWN](board.piece);
            }
        }
        else if (board.valid(p)) {
            // If the move is valid, move the piece
            board.piece.move(p);
        }
    }
});
