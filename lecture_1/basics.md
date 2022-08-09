

# Functional Programming in Practice

>*A monad in X is just a monoid in the category of endofunctors of X*

---

# Lecture 1 - Basics

---

Agenda
1. Intro
2. Why FP?
3. What is wrong with OOP?
4. The essence of FP
5. Code example
6. QA

---

# Intro

---

## Programming

![Image](https://f.hubspotusercontent40.net/hubfs/5621549/01%20(2)-jpg.jpeg)

---

![Image](https://image.slidesharecdn.com/whyfunctionalprogrammingscc2014nc-141019154257-conversion-gate01/95/why-functional-programming-in-c-f-3-638.jpg?cb=1413733472)

---

## FP today

- React/Redux (frontend)
- ReactiveX/RxJS (frontend/backend)
- Streaming/Dataflow (data processing, data science, frontend, backend)
- Actor Model (parallel computing, distributed systems)
- CQRS/Event Sourcing (backend)
- Serverless architecture (Azure function, AWS lambda)

---

## Higher-order function

![Image](https://i.chzbgr.com/full/8579201280/hBF3D57C8/)

APL, J, Python, Pascal, F#, D, C#, Haskell, Clojure, Scheme, Erlang, Elixir, JavaScript, Go, Scala, Java (1.8+), Kotlin, Lua, Swift, Rust, Ruby, C++, D, ColdFusion Markup Language (CFML), PHP, R, Perl 6, Tcl

---

# Why FP?

---

## Advantages:
- **Simplicity.** Program's flow looks simple. Easy to maintain and extend in future
- **Reusability.** Program consists from small bricks - functions that can be used everywhere.
- **Stability.** Less bugs (Compiled means works). OC principle - easy to extend but hard to modify.
- **Stateless.** No side effects no state. Thread safe. Easy to predict the result.
- **Less code.** Bug-free software has 0 lines of code.
- **SOLID.** Cover all principles.
- **Language agnostic.** Most of popular languages more or less support functional paradigm

---

## Disadvantages:
- Hard to write. Takes time to write simple algorithm or business rule.
- Sometimes looks ugly and difficult to understand.
- To abstract. Even more than OOP.
- Math.
- Not very popular.

---

Bad

    const makeChunks = curry((chunksNumber, arr) =>
        take(
            chunksNumber,
            concat(
                chunk(ceil(arr.length / chunksNumber), arr),
                times(stubArray, chunksNumber))));


One more

    const addIfNotExist = (field, array, target) =>
        partial(ifWith(negate(some([field, get(field, target)])),
            concat,
            identity
        ), [array, target])();

---

Better

    this.workProductInfo$.pipe(
        filterNullish,
        get('id'),
        switchMap(ifWith(isNill,
                    this.service.getNew,
                    handleError(this.service.get, showError))),
        withLatestFrom(this.open$.pipe(filter(eq(true)))),
        map(head)
    ).subscribe(this.init);

Good

    app.use(flow(
        route('user/create'),
        map(mappers('user')),
        validate(validators('user')),
        save(repositories('user')),
        createResponse,
    ));

    const map = mapper => dto => mapper.map(dto);
    const validate = validate => entity => validate(entity);
    const save = repo => entity => entity.map(e => repo.save(e));
    const createResponse = result => result.cata(
        err => `Something went wrong. Error: ${err}`,
        value => json(value)
    );

---

Summary:

FP allows you to write program once and maintain it (forever) for a long time.

---

## Future is functional:
- Cheap resources
- Distributed systems
- Highload
- Trend (OOP is dead)


- Advanced languages
- Variety of libraries
- Smartness
- Focus on problem solving

---

## Why do YOU need FP?
- Write less code with more functionality.
- Be cool.

---

# What is wrong with OOP?

---

OOP should describe objects in the real world. Basicaly it should allow objects to communicate with each others in asynchronous way.

---

## BUT:
- OOP is not about objects it's about inheritance and statefull.
- You're not describing the world. You are coding business procedures.
- OOP usually brings overhead (so much patterns and abstractions over abstractions).
- OOP is not dead but close to.

---

## Still FP is not in enterprise:
- FP needs context. FP cannot describe the world better than OOP. FP is about operations.
- FP needs skills. FP is hard to learn. But once you've learned it you'll never come back.
- FP needs support. IT giants still don't support FP as they can. Open source is the main place where FP is growing.
- FP needs time. Only after React had blown up people started speaking about FP.

---

## So merge them both:
- Separate operations. Components is OOP. Behavior is FP.
- Include small simple functions in your code as much as possible.
- Try to declare in your code WHAT it does but not HOW it does.
- Localize problems and solve them with functions. Don't use FP globally.
- Practice.

---

## Is it worth?
#### You're already on the way:
- Every language and framework has included a lot of FP features in last two years.
- Redux, Reactive programming and Actor model is the most discussed topics.
- Probably you (will) work with Serverless applications, AWS lambdas, Data processing or even microservices without any state.

---

# The essence of FP

---

## What does FP mean?
- **Stateless - focus on one thing.** If you program consists of well written functions, you think about 10 lines of code every moment.
- **Function - first-class citizen.** Function can be a container, an input and an output.
- **Pureness.** Function returns the same output for the same input. Function receives at least 1 argument and returns a result. Function has no side-effects.
- **Total.** A function that is defined for all possible values of its input.
- **Immutability.** Pureness but for data.

---

## Pure function.

    // simple pure function
    function add(x, y) {
        return x + y;
    }

    // Is it pure?
    function counter(init) {
        let current = init;
        return () => {
            current += 1;
            return current;
        }
    }

    // Is it pure?
    function calculate(x, y) {
        validate(x); // can throw an error
        validate(y); // can throw an error
        const result = makeCalculation(x, y); // call another pure function
        db.save(result); // save result into DB
        return result;
    }

---

## Total function

- Defined for all possible input values.
- Always return a value (no infinite cycles).
- Never throw an exception.
- Never crash a system.

---

## Immutability
    const arr = [];
    arr.push(1); // mutate array
    const updated = arr.concat([1]); // produce new array

> RESOURCES ARE CHEAP. SO AVOID PREMATURE OPTIMIZATIONS AND MEASURE.

---

## Composition
    function map(params) {
        return {
            name: param.name,
            age: param.age
        };
    }

    function validate(entity) {
        if (!entity.name || !entity.age) {
            throw new Error('Validation error');
        }
        return entity;
    }

    function save(entity) {
        return db.save(entity);
    }

    function mapResponse(entity) {
        return {
            id: entity.id
        }
    }

    app.route('/save', (req, res, next) => {
        const entity = map(req);
        const validEntity = validate(entity);
        const result = save(validEntity);
        next(mapResponse(result));
    });

---

## Composition
    app.route('/save', (req, res, next) =>
        next(mapResponse(save(validate(map(req)))))); // LISP? o_O

---

## Composition
>f(g(x)) === (f * g)(x)

    app.route('save', (req, res, next) => flow(
        map,
        validate,
        save,
        mapResponse,
        r => next(r)
    )(req));

---

![Image](https://img.devrant.com/devrant/rant/r_88083_s8Bio.jpg)

---

# Code example

---

# QA
