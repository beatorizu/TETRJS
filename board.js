class Board {
    ctx;
    grid;
    piece;

    constructor(ctx) {
        this.ctx = ctx;
        this.init();
    }

    init() {
        // Calculate the size of canvas from constants
        this.ctx.canvas.width = COLS * BLOCK_SIZE;
        this.ctx.canvas.height = ROWS * BLOCK_SIZE;

        // Scale blocks
        this.ctx.scale(BLOCK_SIZE, BLOCK_SIZE);
    }

    reset () {
        this.grid = this.getEmptyBoard();
        this.piece = new Piece(this.ctx);
    }

    getEmptyBoard () {
        return Array.from(
            {length: ROWS}, () => Array(COLS).fill(0)
        )
    }

    valid(p) {
        return p.shape.every((row, dy) => {
            return row.every((value, dx) => {
                let x = p.x + dx;
                let y = p.y + dy;
                return (
                    this.isEmpty(value) ||
                    (this.insideWalls(x)) &&
                    (this.aboveFloor(y) && this.isNotOccupied(x, y))
                );
            });
        });
    }

    isEmpty(value) {
        return value === 0;
    }

    insideWalls(x) {
        return x >= 0 && x < COLS;
    }

    aboveFloor(y) {
        return y < ROWS;
    }

    isNotOccupied(x, y) {
        return this.grid[y][x] === 0;
    }

    rotate(piece) {
        // Clone with JSON for immutability
        let p = JSON.parse(JSON.stringify(piece));

        for (let y = 0; y < p.shape.length; ++y) {
            for (let x = 0; x < y; ++x) {
                [p.shape[x][y], p.shape[y][x]] = [p.shape[y][x], p.shape[x][y]];
            }
        }

        p.shape.forEach(row => row.reverse());

        return p;
    }

    freeze() {
        this.piece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                    this.grid[y + this.piece.y][x + this.piece.x] = value;
                }
            });
        });
    }

    drawTiles() {
        this.grid.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                    this.ctx.fillStyle = COLORS[value - 1];
                    this.ctx.fillRect(x, y, 1, 1);
                }
            });
        });
    }

    draw() {
        this.piece.draw();
        this.drawTiles();
    }

    dropPiece() {
        let p = moves[KEY.DOWN](this.piece);

        if (this.valid(p)) {
            this.piece.move(p);
        } else {
            this.freeze();
            this.clearLines();
            this.piece = new Piece(this.ctx);
        }

        return true;
    }

    clearLines() {
        let lines = 0;
        this.grid.forEach((row, y) => {
            if (row.every(value => value > 0)) {
                lines++;
                this.grid.splice(y, 1);
                this.grid.unshift(Array(COLS).fill(0));
            }
        });
        if (lines > 0) {
            account.score += this.getLineClearPoints(lines);
        }
    }

    getLineClearPoints(lines) {
        return lines === 1 ? POINTS.SINGLE :
               lines === 2 ? POINTS.DOUBLE :
               lines === 3 ? POINTS.TRIPLE :
               lines === 4 ? POINTS.TETRIS :
               0
    }
}
