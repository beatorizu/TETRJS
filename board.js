class Board {
    grid;

    reset () {
        this.grid = this.getEmptyBoard();
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
                    (this.aboveFloor(y))
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
}
