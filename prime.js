// gobal_var --so that u have to count var only once
let all_primes = [];
// all calculated prime numbers' list in ascending order

let needed_primes = [];

let notShowRes = false //if true, result will only be caculated but not show
// let showAllNumbers = true; //if false, only prime numbers will be displayed
// let showPrime = true; //if false, only non-prime numbers will be displayed

let isView = false;

document.addEventListener("DOMContentLoaded", () => {
    // view-menu event
    document.getElementById('view-menu').addEventListener('click', e=>{
        if (isView){
            document.querySelector('.subNav').style.display = 'none';
            isView = !isView;
        }
        else{
            document.querySelector('.subNav').style.display = 'flex';
            isView = !isView;
        }
    });
    // view-menu close event listener
    document.querySelector('.subNav > span').addEventListener('click', e=>{
        document.querySelector('.subNav').style.display = 'none';
        isView = false
    })

    //check boxs eventlistener
    document.querySelector('.subNav').addEventListener('click', ()=>{
        let subNavCheckBoxes = document.querySelectorAll('.subNav input[type="checkbox"]');

        if (subNavCheckBoxes[0].checked){
            // only prime
            document.querySelectorAll(".result-visual > div:not([data-prime])").forEach(e=>e.style.display = "none")
        }else{
            document.querySelectorAll(".result-visual > div:not([data-prime])").forEach(e=>e.style.display = "flex")
        }

        if (subNavCheckBoxes[1].checked){
            // only non-prime
            document.querySelectorAll(".result-visual > div[data-prime]").forEach(e=>e.style.display = "none")
        }else{
            document.querySelectorAll(".result-visual > div[data-prime]").forEach(e=>e.style.display = "flex")
        }

        if (subNavCheckBoxes[2].checked){
            // no val to display
            notShowRes = true
        }else{
            notShowRes = false
        }
    })

    // copyTextToClipboard eventlistener
    document.getElementById("copyTextToClipboard").addEventListener('click', ()=>{
        copyTextToClipboard(JSON.stringify(needed_primes));
    })


    // on documenat_content_loaded add get the value
    let input = window.location.search.substring(1).split('=')
    if (!input.length === 2){
        // invalid
        return;
    }

    // get stuff from localStorage, if not then => []
    all_primes = JSON.parse(localStorage.getItem('all_primes')) || [];

    let val = input[1]; // string
    inputVal(val);
});

function inputVal(val){
    console.log("[TAKING INPUT]");
    let nums = val.split('-');

    console.log("[INPUT]", nums);

    if (nums.length === 1){
        // he just passed only one number
        calculate(1, nums[0]) // 1 is not prime (starting from 1)
    }
    else if (nums.length === 2){
        // start-end
        calculate(...nums)
    }
    else if (nums.length === 3){
        // start-end-step
        calculate(...nums)
    }
    else {
        // wrong input
        console.error("[WRONG INPUT]");
        document.body.innerHTML = '<p>Invalid Arguments<p>';
        return;
    }
}

function calculate(start, end, step=1){

    console.log("[CACULATING]")
    
    start = parseInt(start);
    end = parseInt(end);
    step = parseInt(step);
    
    console.log(start, end, step);
    if (!(start && end && step && start>0 && end>0 && step>0 && start<end)){
        //wrong input
        console.error("[WRONG INPUT]");
        document.body.innerHTML = '<p>Invalid Arguments<p>';
        return;
    }

    // check if isAllPrime
    isAllPrime(end)

    console.log("[All Primes] ", all_primes);
    // all primes are found --> all_primes array

    // update dom
    updateDom(start, end, step)
}

function isAllPrime(end){
    /* This func calculate all prime and mutate the global all_primes variable */

    let starting_point = 1; //calculation will be started form this val
    if (all_primes.length){
        // if the array is not empty, check how many values has caculated already
        
        let  last_element = all_primes[all_primes.length - 1];
        if (end <= last_element) {
            // means all values are caculated and no need to count(mutate global var)
            return;
        }else{
            // end > last_element
            // some values need to be calculated
            starting_point = last_element + 1; //calculate values from the last prime+1 in the list, so that that prime doesn't get inserted in the array again
        }
    }

    for (let i = starting_point; i <= end; i++){
        if(isPrime(i)){ 
            // returns bool
            // list not contains that number
            // add it to the list
            //console.info('[new Prime]', i);
            all_primes.push(i);
        }
    }

    //after all calculation, store that array  for future use
    localStorage.setItem('all_primes', JSON.stringify(all_primes));
}

function isPrime(num){
    // num == integer > 0; already checked!

    // '1' may come so check it
    if(num < 2) return false;
    else if(num === 2) return true; // 2-only even prime
    else if(!(num % 2)) return false; // even number, not=2
    else {
        //check if divisible by every prime less than sqrt(num)**--> formula of primeNumber
        // all_prime list can never be empty here (min_length==1, while value=2) 
        let sqrt_num = Math.sqrt(num);
        for (let i of all_primes){
            if (i > sqrt_num) break; // every prime less than(or equal) sqrt(num)
            if (!(num%i)) return false; // if any i can divide num, return false
        }
        return true; // if none returns false than its a prime number
    }
}

function updateDom(start, end, step){

    console.log('[notShowResult]', notShowRes);
    // console.log('[showAllNumbers]', showAllNumbers);
    // console.log('[showPrime]', showPrime);

    if(notShowRes){
        // user don't want to show all between start and end;
        //todo: ad ifPrime here
        return;
    }
    
    document.querySelector('.result-visual').innerHTML = '';
    // clearing dom af there was any
    
    let new_array = all_primes.slice(); // all_primes not empty here
    //copying array for efficiency (there are several method for copying an array)

    // delete those primes which are less than starting number
    // terminating "i > new_array[0]" condition
    while (true){
        if (!new_array.length || new_array[0] >= start) break;
        // break if array is empty OR array[0] > starting_value
        new_array.shift();
    }

    /* here is a problem with step value -solved in the next section
    // after deleting all unnecessary primes, length of the new_array will be the total_primes value
    let total_primes = new_array.length;
    // update dom
    document.querySelector('.totals').innerHTML = total_primes;
    */

   console.log('[Primes]-[after 1st portion deleted] ', new_array);
   
   let total_nums = 0; // all numbers that user needed
   let elementsToAppend = ""; // innerHtml

   for (let i=start; i<=end; i+=step){
       // increase total_nums by one;
       total_nums++;

        if ( !new_array.length || i < new_array[0] ){
            /*Checking if ...
            1. new_array is empty (means no prime left)
            2. or if not empty check current num is less than 1st element of primes 
            */
          
            // insert them as normal* numbers
       
            elementsToAppend+=`<div><span>${i}</span></div>`; 
            continue;
        }
        else if ( i > new_array[0] ){
            new_array.shift();
            console.log('[Deleted]', new_array.shift())
        
            elementsToAppend+=`<div><span>${i}</span></div>`;
            continue;
        }
        else {
            // if i==all_primes[0] --> means its a prime number
            
            /*as we have deleted all i > new_array[0] numbers this condition will never true */
            
            // insert it as prime*  number
            // and delete the 1st item(prime) of the array

            elementsToAppend+=`<div data-prime><span>${i}</span></div>`;
            new_array.shift();
            needed_primes.push(i);
            continue;
        }
    }
    console.log('[Needed Primes]', needed_primes);
    
    // after all update the counts and results in DOM
    document.querySelector('.totals').innerHTML = total_nums;
    document.querySelector('.primes').innerHTML = needed_primes.length;
    document.querySelector('.notPrimes').innerHTML = total_nums - needed_primes.length;

    document.querySelector('.result-visual').innerHTML = elementsToAppend;
}

function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
      fallbackCopyTextToClipboard(text);
      return;
    }
    navigator.clipboard.writeText(text).then(function() {
      console.log('Async: Copying to clipboard was successful!');
    }, function(err) {
      console.error('Async: Could not copy text: ', err);
    });
}