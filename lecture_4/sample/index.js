// Memoization

const array = [1,2,3,4,5,6];
const mmap =  _.memoize(_.map(x => { 
    console.log('iterate', x);
    return x * 2; 
}));

const newArray = mmap(array);
console.log(newArray);

// array.push(7);

const anotherArray = mmap([6,2,3,4,5,1]);
console.log(anotherArray);
