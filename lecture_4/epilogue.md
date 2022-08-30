# Functional Programming in Practice

>*A monad in X is just a monoid in the category of endofunctors of X*

---

# Lecture 4 - Epilogue

---

Agenda:
1. Recap
2. Recursion
3. Memoization
4. Transducer
5. Use cases
6. QA 

---

# Recap

---

1. Basics
2. Functions
3. Monads

---

![](https://pbs.twimg.com/profile_images/3721323888/6a98e991533b92fb21a8d15fa50162b6_400x400.jpeg)

---

# Recursion

---

## Simple recursion

    const factorial = n => 
        n < 2 ? 1 : n * factorial(n - 1); 

    console.log(factorial(5)); // 120

---

## Tail recursion

    const factorial = n => {
        const fact = (n, acc) => 
            n < 2 ? acc : fact(n - 1, n * acc);
          return fact(n, 1)
    }

    console.log(factorial(5)); // 120

---

## Non tail recursion

    const sum = x => x === 1 ? x : x + sum(x - 1);

    // sum(5)
    // 5 + sum(4)
    // 5 + (4 + sum(3))
    // 5 + (4 + (3 + sum(2)))
    // 5 + (4 + (3 + (2 + sum(1))))
    // 5 + (4 + (3 + (2 + 1)))
    // 15

---

## Tail recursion

    const tailsum = (x, total = 0) =>
        x === 0 ? total : tailsum(x - 1, total + x);

    // tailsum(5, 0)
    // tailsum(4, 5)
    // tailsum(3, 9)
    // tailsum(2, 12)
    // tailsum(1, 14)
    // tailsum(0, 15)
    // 15

---

## Definition

> A tail recursion is a recursive function where the function calls itself at the end ("tail") of the function in which no computation is done after the return of recursive call.
>
> Note! Safari is the only browser that supports tail call optimization.

---

# Memoization

---

> Memoization is the programmatic practice of making long recursive/iterative functions run much faster.

> Memoization is an optimization technique used primarily to speed up computer programs by storing the results of expensive function calls and returning the cached result when the same inputs occur again.

---

## Example

    const array = [1, 2, 3, 4];
    const memoMap = memoize(map(x => x * 2));
    const newArray = memoMap(array);
    const anotherArray = 
        memoMap(array); // instantly returns a result

---

## Example

    const reorderMatrix = (columns, rowNumber, columnNumber, item) => {
        const memoizedFlatten = memoize(flatten);
        const currentIndex = ceil(
            memoizedFlatten(columns).length / columns.length
        ) * columnNumber + rowNumber;

        return flow(
            memoizedFlatten,
            reorderArray(item, currentIndex),
            makeChunks(columns.length)
        )(columns);
    };

---

> If you want to store your data - use cache. If you want to store your calculcations - use memoization.

---

# Transducer

---

> A transducer is a device that converts energy from one form to another. Usually a transducer converts a signal in one form of energy to a signal in another.

---

Chain

![](https://cdn-images-1.medium.com/max/800/1*mJicJiOZT4M9jwv6kMkwRg.gif)

Transducers

![](https://cdn-images-1.medium.com/max/800/1*rEOyWd0MTPv_NZvzDaFbkA.gif)

---

## Example

    const compose = (...fns) => x => 
        fns.reduceRight((y, f) => f(y), x);

    const map = f => 
        step => (a, c) => step(a, f(c)); // reducer 1

    const filter = predicate =>  // reducer 2
        step => (a, c) => predicate(c) ? step(a, c) : a;

    const doubleEvens = compose( // compose reducers 
        filter(n => n % 2 === 0),
        map(n => n * 2)
    );

---

## Example

    const arrayConcat = (a, c) => a.concat([c]); // final reducer 
    const xform = doubleEvens(arrayConcat);
    
    const result = [1,2,3,4,5,6]
        .reduce(xform, []); // [4, 8, 12]

    console.log(result);

[Explanation](https://medium.com/javascript-scene/transducers-efficient-data-processing-pipelines-in-javascript-7985330fe73d)

---

## Ramda example

    const numbers = [1, 2, 3, 4];
    const transducer = R.compose(
        R.map(x => x + 1), 
        R.take(2)
    );

    R.into([], transducer, numbers); //=> [2, 3]

    const intoArray = R.into([]);
    intoArray(transducer, numbers); //=> [2, 3]

---

## Ramda example

    const isOdd = x => x % 2 === 1;
    const firstOddTransducer = R.compose(
        R.filter(isOdd), 
        R.take(1)
    );

    R.transduce(
        firstOddTransducer, // transducer
        R.flip(R.append), // concat results
        [], // initial
        R.range(0, 100)); //=> [1]

---

# FP Use Cases

---

1. Data processing
2. Workflow
3. Stateless operations
4. Elmish architecture (redux, ng-rx)
5. Azure function / AWS Lambda
6. [SAFE](https://safe-stack.github.io/docs/overview/)

---

# QA

---

![](https://t4.ftcdn.net/jpg/00/53/74/81/360_F_53748147_hoGawdREiqFKxiFn39bgRL72sAe9WUb4.webp)
