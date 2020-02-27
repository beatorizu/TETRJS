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
}
