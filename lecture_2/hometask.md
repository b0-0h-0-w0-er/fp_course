# Hometask 2
## Solve the task using point free functions, function composition and partial application. Use either Ramda or lodash/fp

> You have a dynamic table (matrix) of objects { id, row, column, position }. Write a function that allows to move an item in any position in matrix and calculate new row, column and position values for all objects. Note: you **cannot** mutate *id* of the object.
>
> Print a table before and after transformation. Try to split each operation into a function. Try to write the algorithm as clean as possible. Avoid data mutations and loops. Try to avoid statements like _if_ and _switch_. Good luck!

## Input
    const table = [
        [
            { id: 0, row: 0, column: 0, position: 1 },
            { id: 1, row: 1, column: 0, position: 2 },
            { id: 2, row: 2, column: 0, position: 3 }
        ],
        [
            { id: 3, row: 0, column: 1, position: 4 },
            { id: 4, row: 1, column: 1, position: 5 },
            { id: 5, row: 2, column: 1, position: 6 }
        ],
        [
            { id: 6, row: 0, column: 2, position: 7 },
            { id: 7, row: 1, column: 2, position: 8 },
            { id: 8, row: 2, column: 2, position: 9 }
        ]
    ]

    printTable(table);

| id: 0 | id: 3 | id: 6 |
 | --- | --- | --- |
 | id: 1 | id: 4 | id: 7 |
 | id: 2 | id: 5 | id: 8 |


    const newColumn = 2;
    const newRow = 2;
    const item = table[0][0];

    const newTable = rearrangeMatrix(table, newColumn, newRow, item);

    printTable(table);

## Output

    // inner representation of newTable
    [
        [
            { id: 1, row: 0, column: 0, position: 1 },
            { id: 2, row: 1, column: 0, position: 2 },
            { id: 3, row: 2, column: 0, position: 3 },
        ],
        [
            { id: 4, row: 0, column: 1, position: 4 },
            { id: 5, row: 1, column: 1, position: 5 },
            { id: 6, row: 2, column: 1, position: 6 },
        ],
        [
            { id: 7, row: 0, column: 2, position: 7 },
            { id: 8, row: 1, column: 2, position: 8 }
            { id: 0, row: 2, column: 2, position: 9 },
        ]
    ]

| id: 1 | id: 4 | id: 7 |
 | --- | --- | --- |
 | id: 2 | id: 5 | id: 8 |
 | id: 3 | id: 6 | id: 0 |
