// Pureness
{
    // Don't
    const x = 10;
    const y = 20;

    const sumXY = () => x + y;
    sumXY();

    // Do
    const x = 10;
    const y = 20;

    const sumXY = (x, y) => x + y;
    sumXY(x, y);

    // Don't
    const values = { a: 1 };

    function impureFunction ( items ) {
        const b = 1;
        items.a = items.a * b + 2;
        return items.a;
    }

    const c = impureFunction( values );

    // Do
    const values = { a: 1 };

    function pureFunction ( a ) {
        const b = 1;
        a = a * b + 2;
        return a;
    }

    const c = pureFunction( values.a );
}

// Immutability
{
    // Don't
    function normalize(user, params) {
        user.name = params.userName;
        user.lastName = params.userLastName;
        user.age = params.userAge;
    }

    // Do
    function normalize(user, params) {
        return {
            ...user,
            name: params.userName,
            lastName: params.userLastName,
            age: params.userAge
        };
    }

    // Don't
    const arr = [1, 2, 3];
    arr.push(4);

    // Do
    const arr = [1, 2, 3];
    const newArr = [...arr, 4];

    // Don't
    const arr = [1, 2, 3];
    const index = arr.indexOf(2);
    if (index !== -1) {
        arr.splice(index, 1);
    }

    // Do
    const arr = [1, 2, 3];
    const newArr = arr.filter(x => x !== 2);
}

// Higher-order function
{
    // Don't
    const censor = words => {
        const filtered = [];
        for (let i = 0, { length } = words; i < length; i++) {
          const word = words[i];
          if (word.length !== 4) filtered.push(word);
        }
        return filtered;
    };

    // Do
    const censor = words => filter(
        word => word.length !== 4,
        words
    );
}

// Composition
{
    // Don't
    const toSlug = input => encodeURIComponent(
        join('-')(
          map(toLowerCase)(
            split(' ')(
              input
            )
          )
        )
    );
    
    // Do
    const toSlug = compose(
        encodeURIComponent,
        join('-'),
        map(toLowerCase),
        split(' ')
    );
}

  
// Real example
{
    const hasPassword = _.get('password')
    const hasNoPassword = _.negate( hasPassword )
    const getUser = opts => db.find({email:opts.email, password:opts.password})
    const gotoCatch = err => e =>  { throw e } // optionally you can log stuff here
    const doAnalytics = Promise.all([logUser, logAnalytics])
    const notifyExpiryDate = opts => true         // mock
    const userAlmostExpired = opts => true         // mock
    const updateLastLogin = _.set('lastlogin', Date.now )
    const error = opts => err => true // mock 
    const reply = opts => req.send(opts)
    
    const createUser = opts => new Promise((resolve, reject) => {
        opts.password = '1234'
        db.create(opts)
            .then( resolve )
            .catch( resolve )
    })
    
    
    const loginUser   = _.flow()
        .then( error('no email') ).when( hasNoEmail    )
        .then( getUser           ).when( hasPassword   )
        .then( createUser        ).when( hasNoPassword )
        .then( doAnalytics       ).fork()
        .then( updateLastLogin   ).fork()
        .then( notifyExpiryDate  ).when( userAlmostExpired )
        .then( saveUser          )
        .then( doAnalytics       ).fork()
    
    
    const loginUserAndReply = _.flow(loginUser, _.log, reply)
        .catch( opts => error => reply({...opts,error}))
    
    /////////////////////////////////////////////////////////////////
    
    const doAnalytics = Promise.all([logUser, logAnalytics])
    const getUser = db.find({email:opts.email, password:opts.password})
    const notifyExpiryDate = opts => true         // mock
    const userAlmostExpired = opts => true         // mock
    const reply = opts => req.send(opts)
    
    const createUser = opts => new Promise( (resolve, reject) => {
        opts.password = '1234'
        db.create(opts)
            .then( resolve )
            .catch( resolve )
    })
    
    const loginUser = (opts) => new Promise( (resolve, reject) => {
        if (!opts.email) { 
            // log stuff here
            return req.send({err:"no email"})
        }
        let user
        let getOrCreateUser
        if (opts.password) { 
            getOrCreateUser = getUser
        } else {
            getOrCreateUser = createUser
        }
        getOrCreateUser(opts)
            .then((u) => {
                user = u
                doAnalytics.then( () => false ).catch( () => false ) 
            })
            .then( () => {
                user.lastlogin = Date.now()
            })
            .then( () => {
                if( userAlmostExpired(user) ){  
                    notifyExpiryDate(user)        
                }
            })
            .then( () => {
                doAnalytics.then( () => false ).catch( () => false ) 
            })
            .then( () => saveUser(user) )
            .then( () => reply(user) )
            .catch( err => {
                if( !user ) user = opts 
                reply({ err, ...user})  
            })  
    })
}
