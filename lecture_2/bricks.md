# Functional Programming in Practice

>*A monad in X is just a monoid in the category of endofunctors of X*

---

# Lecture 2 - Bricks

---

Agenda:
1. Recap
2. Composition vs chain
3. Currying
4. Partial application
5. lodash/fp
6. Debriefing
7. QA

---

# Recap

---

1. **Statless - focus on one thing.**
2. **Higher-order function - first-class citizen.**
3. **Pure function - same output for same input.**
5. **Immutability - every operation returns new object.**

---

# Composition vs chain

---

## Common way
    const youngest = users
        .filter(x => x.isActive)
        .map(({ name, birthday }) => ({ name, birthday }))
        .reduce(customSort);

---

## Constraints
- OOP style
- Work only with collections (monads)
- Hard to extend

---

## Hard to extend
    const youngest = users
        .filter(x => x.isActive)
        .logInDb(db) // We have to extend Array.prototype. Bad
        .map(({ name, birthday }) => ({ name, birthday }))
        .reduce(customSort);

---

## Composition

    // bottom-top
    const youngest = getMax(mapUser(logInDb(db)(filter(x => x.isActive)(users))))

    const youngest = compose(
        getMax,
        mapUser,
        logInDb(db),
        filter(x => x.isActive),
    )(users);

    // top-bottom
    const activeUsers = filter(x => x.isActive, users);
    logInDb(db, activeUsers);
    const mappedUsers = mapUser(activeUsers);
    const youngest = getMax(mappedUsers);

    const youngest = pipe(
        filter(x => x.isActive),
        logInDb(db),
        mapUser,
        getMax
    )(users);

---

## Implementation
f(g(z(x))) === (f @ g @ z)(x)

    const compose = (...fns) => x =>
        fns.reduceRight((v, fn) => fn(v), x);

    const pipe = (...fns) => x =>
        fns.reduce((v, f) => f(v), x);

---

## Problem
    // top-bottom
    const youngest = pipe(
        filter(x => x.isActive), // call the function
        logInDb(db), // call the function
        mapUser, // don't call the function
        getMax // don't call the function
    )(users);

---

# Curry

---

f(x) = y

---

## Simple F# example
    let add x y = x + y
    let add2 = add 2
    let result = add2 3 // returns 5

---

## Simple JS example 
    function add(x) {
        return function(y) {
            return x + y;
        }
    }

---

## More functional way
    const add = x => y => x + y;
    const add2 = add(2);
    const result = add2(3); // returns 5

---

>Curried function first fills in the arguments then invokes the body

---

## Back to the issue
    const logInDb = db => users => each(db.log, user); // curried function

    const youngest = pipe(
        filter(x => x.isActive), // call the function
        logInDb(db), // call the function
        mapUser, // don't call the function
        getMax // don't call the function
    )(users);

---

## How to curry
    const add = (x, y) => x + y;
    const add2 = add(2);
    const result = add2(3); // NaN is not a function

---

## Implementation
    const curry f => a => b => f(a, b);

    const add = (x, y) => x + y;
    const newAdd = curry(add);
    const add2 = newAdd(2);
    const result = add2(3); // return 5

*Use library instead (lodash, Ramda, etc)*

[lodash curry](https://github.com/lodash/lodash/blob/npm/_createCurry.js)

[Doc](https://gist.github.com/jfmengels/6b973b69c491375117dc#_curryfunc)

---

# Partial application

---

## Split arguments
    const reduce = (reducer, init) => collection =>
    collection.reduce(reducer, init);

    const reducer = reduce((c, n) => c + n, 0);
    const sum = reducer([1, 2, 3, 4, 5]);

---

## Example
    const getUpdateCommand = (db, file, http) => userId => {
        // get user from db
        // save in file
        // send by http
    }
    const updateUser = getUpdateCommand(dbMock, fileMock, httpMock);
    updateUser(42); // test method with mocked dependencies

---

![](http://www.pivotactivation.ca/wp-content/uploads/2015/08/blog2.png)

---

# lodash/fp

- flow
- filter
- map
- reduce
- partition
- flatten
- without
- curry

[Documentation](https://gist.github.com/jfmengels/6b973b69c491375117dc)

[(Ramda docs)](https://ramdajs.com/docs/)

---

# Debriefing

---

# QA
