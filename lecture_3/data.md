# Functional Programming in Practice

>*A monad in X is just a monoid in the category of endofunctors of X*

---

# Lecture 3 - DATA

---

Agenda:
1. Recap
2. Immutability
3. Immutable.js
4. Monads
5. monet.js
6. Summary
7. QA

---

# Recap

---

1. Pure function
2. Stateless
3. Function composition

---

![](https://wiki.factorio.com/images/Pipe_network_animation.gif)

---

# Immutability

---

`An immutable object is an object whose state cannot be modified after it is created. (Wiki)`

---

## Advantages

- Programs with immutable objects are less complicated to think about, since you don't need to worry about how an object may evolve over time.

- You don't need to make defensive copies of immutable objects when returning or passing to other functions, since there is no possibility an immutable object will be modified behind your back.

- One copy of an object is just as good as another, so you can cache objects or re-use the same object multiple times.

---

- Immutable objects are good for sharing information between threads in a multi-threaded environment since they don't need to be synchronized.

- Operations on immutable objects return new immutable objects while operations that cause side-effects on mutable objects usually return void. This means several operations can be chained together.

---

## Disadvantages

- Cyclic data structures such as graphs are difficult to build. If you have two objects which can't be modified after initialization, how can you get them to point to each other?

- Allocating lots and lots of small objects rather than modifying ones you already have can have a performance impact. Usually the complexity of either the allocator or the garbage collector depends on the number of objects on the heap.

- Naive implementations of immutable data structures can result in extremely poor performance. It is possible to write efficient immutable data structures, it just takes a little more thought.

---

`Apart from all these legitimate reasons, alas, the most probable cause why people keep creating mutable objects is inertia of mind, a.k.a. resistance to change. ... in fact, many of us humans positively resist new ideas and processes. "I have been programming like this for nn years and I don't care about the latest stupid fads!" (A guy from stackoverflow)`

---

## Simple example

    const array = [];
    array.push(42); // mutate the state

    const newArray = arr.concat(42); 

    // or 
    const newArray2 = [...arr, 42];

    // or
    const anotherArray = concat(arr, 42);

---

   

    const user = { name: 'John', age: 20 };
    user.age++; // mutate the state

    const newUser = Object.assign({}, user, {
        age: user.age + 1
    });

    // or
    const newUser2 = { ...user, age: user.age + 1 };

    // or
    const updatedUser = assign(user, {
        age: user.age + 1
    });

---

Perfectly works:

1. Collections
2. Promises, Observables
3. Other monads

$~$

Could have troubles with:

1. Strings
2. Big objects
3. Repetitive operations

---

# Immutable.js

LIST, MAP, SET, STACK, SEQ

---

## Map

    const { Map } = require('immutable');
    const map1 = Map({ a: 1, b: 2, c: 3 }); 
    const map2 = map1.set('b', 50); // { a: 1, b: 50, c: 3 }
    map1.get('b') + " vs. " + map2.get('b'); // 2 vs. 50

---

## List

    const list = List.of(1, 2, 3, 4);
    list.set(0, 42); // [42, 2, 3, 4]
    list.set(1, 42); // [1, 42, 3, 4]
    list.skipWhile(x => x < 3); // [1, 2] 

---

## Docs

[Immutable.js](https://facebook.github.io/immutable-js/docs/#/)

---

# Monads

![Monad](http://adit.io/imgs/functors/value_and_context.png)

---

## Definition

> A monad is a way of composing functions that require context in addition to the return value, such as computation, branching, or I/O.

$~$

Unwraps the value > feeds it to the function > wraps the result

---

### Collection

    [1, 2, 3, 4].
        map(x => {        // unwraps the value
            return x * 2; // apply a function and wrap the result
        });

---

### Promise

    loadUser()
        .then(user => loadCompany(user.id))
        .then(company => console.log(company));

---

### Option

    Some(42).map(value => value * 2); // Some(84)
    None().map(value => value * 2); // None
    Some(0).flatMap(value => Some(42)); // Some(42)

---

## Why monads?

1. Avoid errors or invalid data related to outer world
2. Create better function composition (avoid if)
3. Allows us to use declarative style

---

## Types

1. Maybe. Represent some or nothing
2. Either. Represent one of two values
3. List. Represent an immutable collection
4. IO. Sequential execution of I/O actions (lazy)
5. Reader. Inject dependencies.

---

## Maybe (Option)

> The Maybe type encapsulates an optional value. A value of type Maybe a either contains a value of type **A** (represented as Some **A**), or it is empty (represented as Nothing). Using Maybe is a good way to deal with errors or exceptional cases without resorting to drastic measures such as error.

---

### Using maybe

    const value = Some(42);
    value.map(v => console.log());
    value
        .flatMap(v => Some(v * 2))
        .map(result => console.log(result));

    const result = value.cata(
        () => 'Default',
        v => `Has value ${v}`
    );

    concat(
        Some(42),
        None,
    ).map(([v1, v2]) => console.log(v1, v2)); // not executed

---

## List

> Lists are used to model nondeterministic computations which may return an arbitrary number of results. There is a certain parallel with how Maybe represented computations which could return zero or one value; but with lists, we can return zero, one, or many values (the number of values being reflected in the length of the list).

---

### Using list

    const result = List
        .of(1, 2, 3)
        .cons(4)
        .filter(x => x < 3)
        .head();               // result = 1

    const result = List
        .of(Some(1), Some(2), Some(3))
        .sequenceMaybe()       // Some(List(1, 2, 3))
        .map(list => list.find(x => x === 3))
        .cata(
            () => -1,
            v => v             // returns 3
        );

---

## Either

> The Either type represents values with two possibilities: a value of type Either **A** **B** is either Left **A** or Right **B**. It represents a value which is either correct or an error.

> By convention Left is error and Right is value.

---

### Using Either

    const validateUser = u => isEmpty(u.name)
        ? Left('Name is required)
        : Right(u);

    const saveUser = u => u.map(u => db.saveUser(u));

    const logError = e => console.error(e);
    const logSuccess = result => console.log(result);

    flow(
        validateUser,
        saveUser,
        result => result.cata(logError, logSuccess)
    )({ name: 'John' });

---

# monet.js

`Monet is a library designed to bring great power to your JavaScript programming.`

[Documentation](https://monet.github.io/monet.js/)

---

# Summary

![](https://i1.wp.com/kilon.org/blog/wp-content/uploads/2012/11/355sfc.jpg)

---

1. Keep in mind that you're working in stateless and asynchronous environment.
2. Avoid null, undefined, errors, incorrect data.
3. Build chains and flows.
4. Handle outer data (network, database, filesystem, thirdparty code) not inner.
5. Write declarative code that describes **WHAT** and not **HOW**.

---

![](http://natestrong.com/wp-content/uploads/2017/08/dont-over-engineer-01.png)

---

![](https://memegenerator.net/img/instances/75657391/over-engineering-i-do-not-think-it-means-what-you-think-it-means.jpg)

---

# QA
