# Hometask 1
## Solve the task using pure functions, immutable objects and function composition (it would be better if you use point free functions).

> You have a list of orders { name, price, date }. You have to write a public function that transforms the list to matrix grouped by date. (you can write as many private functions as you need).
> - Names should be capitalized.
> - Price should be extended with $ prefix
> - If the row has invalid data (empty name, date or price) store it in the separate collection
>
> Print a table of valid orders and list of invalid orders. Try to split each operation into a function. Try to write the algorithm as clean as possible. Avoid data mutations and loops. Try to avoid statements like _if_ and _switch_. Good luck!

## Input

`{ name: 'TV', price: 300, date: '2018-10-10' },`

`{ name: 'laptop', price: 600, date: '2018-10-12' },`

`{ name: 'PC', price: 800, date: '2018-09-05' },`

`{ name: 'owen', price: 300 },`

`{ name: 'Camera', price: 500, date: '2018-03-03' },`

`{ name: 'Fridge', price: 1000, date: '2018-12-11' },`

`{ name: 'table', price: 150, date: '2018-12-10' },`

`{ name: 'Sofa', price: 400, date: '2018-12-10' },`

`{ name: 'chair', date: '2018-09-10' },`

`{ name: 'Window', price: 300, date: '2018-05-05' },`

## Output

 | 2018-03-03 | 2018-05-05 | 2018-09-05 | 2018-10-10 | 2018-10-12 | 2018-12-10 | 2018-12-11 |
 | --- | --- | --- | --- | --- | --- | --- |
 | Camera - $500 | Window - $300 | PC - $800 | TV - $300 | Laptop - $600 | Table - $150 | Fridge - $1000 |
  |  |  |  |  |  | Sofa - $150 | |

### Incorrect rows

`{ name: 'owen', price: 300 },`

`{ name: 'chair', date: '2018-09-10' },`
