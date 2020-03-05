const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');

let board = new Board(ctx);

let accountValues = {
    score: 0,
    lines: 0
}

function updateAccount(key, value) {
    let element = document.getElementById(key);
    if (element) {
        element.textContent = value;
    }
}

let account = new Proxy(accountValues, {
    set: (target, key, value) => {
        target[key] = value;
        updateAccount(key, value);
        return true;
    }
});

function play() {
    board.reset();
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

        board.dropPiece();
    }

    // Clear board before drawing new state
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    board.draw();
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
                account.score += POINTS.HARD_DROP;
                board.piece.move(p);
                p = moves[KEY.DOWN](board.piece);
            }
        }
        else if (board.valid(p)) {
            if (event.keyCode === KEY.DOWN) {
                account.score += POINTS.HARD_DROP;
            }
            // If the move is valid, move the piece
            board.piece.move(p);
        }
    }
});
