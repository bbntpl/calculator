'use strict';

/*DOM Elements*/
const allClearBtn = document.getElementById('all-clear');
const clearCharBtn = document.getElementById('backspace');
const equalBtn = document.getElementById('equal');
const calcDisplay = document.querySelector('.calc-screen__display');
const calcInput = document.querySelector('.calc-screen__input');
const opArray = Array.from(document.querySelectorAll(".operators"));
const digitNodeList = [...document.querySelectorAll(".digits")];
const posNegBtn = document.getElementById('plus-add');
const decimalBtn = document.getElementById('decimal');
const factorialBtn = document.getElementById('factorial');
const switchPref = document.querySelector('.op-precedence');
const switchDisplay = document.querySelector('.display-as-result');
const screenPrecedence = document.querySelector('.calc-screen__precedence');
const screenDAR = document.querySelector('.calc-screen__DAR');

//limiters
let allowDecimal = true;
let allowOp = false;
let operatorPrecedence = false;
let DAR = false;
let strWithoutWhitespace = "";

//return the simple arithmetic expressions associated with the operator
function calculate(op, a, b) {
    let arithmeticObj = {
        "*": +a * +b,
        "/": +a / +b,
        "+": +a + +b,
        "-": +a - +b,
    };
    return arithmeticObj[op];
}

/*It's functionality is to ranked the order of each operators in terms of precedence. 
    The highest ranked will be the first set of simple arithmetic expression to return its result.*/
function supersedeOperators(v, ii) {
    if (v == "/" && ii == 0) {
        return "/";
    }
    else if (v == "*" && ii == 1) {
        return "*";
    }
    else if (v == "+" && ii == 2) {
        return "+";
    }
    else if (v == "-" && ii == 3) {
        return "-";
    }
}
//counts the number of operators
function countOperators(arr) {
    let ii = 0;
    arr.forEach(el => {
        if (el == "/" || el == "*" || el == "+" || el == "-") {
            return ii++;
        }
    });
    return ii;
}
function evaluateSimple() {
    let arr = calcDisplay.textContent.split(" ");
    console.table(arr);
    let endOfLoop = countOperators(arr); //number of operators
    for (let i = 0; i < endOfLoop; i++) {
        arr[2] = calculate(arr[1], arr[0], arr[2]);
        arr.shift(arr[1]);
        arr.shift(arr[0]);
    }
    if (arr[0].toString().indexOf('.') > -1) {
        let finalResult = arr[0].toFixed(2);
        return calcInput.textContent = finalResult;
    }
    else {
        return calcInput.textContent = arr.join("");
    }
}

//evaluate the arithmetic expression while precedence operator is enabled
function evaluateComplex() {
    let arr = calcDisplay.textContent.split(" "); //splitting the characters of the aritmetic expression with the whitespace
    let total = 0;
    for (let ii = 0; ii <= 3; ii++) { //ii=0 is divide, ii=1 is multiply, ii=2 is add, ii=3 is substraction
        arr.reduce((p, v, i, arr) => { //checks each character to compare
            if (v == supersedeOperators(v, ii)) {
                let op = v;
                p = arr[i - 1]; //making sure previous is not undefined after assigning as a whitespace
                total = calculate(op, p, arr[i + 1]); //it calculates the number inbetween the operator by calling the calculate func
                arr[i + 1] = total; //replace the next value as total
                arr[i] = " "; //replace the current value with whitespace 
                arr[i - 1] = " ";//replace the previous value with whitespace 
            }
            else if (arr.length < 2) {
                return calcInput.textContent = v; //return the current value 
            }
        });
        arr = arr.filter(function (str) {// removes all whitespaces value in the array
            return /\S/.test(str);
        });
    }
    //limit demical places to two
    roundToTwo(arr);
}

//display entered digit
digitNodeList.forEach(btn => btn.addEventListener("click", () => {
    strWithoutWhitespace = calcDisplay.textContent.replace(/\s/g, "");
    if (strWithoutWhitespace.length < 20) {
        calcDisplay.textContent += btn.textContent;
        allowOp = true;
    }
}));

//display entered operator unit
opArray.forEach(btn => btn.addEventListener("click", () => {
    //adds a whitespace in-between the operator used as a split delimiter for later
    allowDecimal = true;
    if (previousOp() == true && allowOp == true) {
        calcDisplay.textContent += ` ${btn.value} `;
        allowOp = false;
    }
    calcInput.textContent = '';
}));

//limits the usability of the operator 
function previousOp() {
    return calcDisplay.textContent.length != 0 ? true : false;
}

//switch to positive or negative number
posNegBtn.onclick = () => {
    //convert array without removing the split delimiter
    let arr = calcDisplay.textContent.split(/(\s)/); 
    //get the last item of the array
    let str = arr[arr.length - 1];
    //It doesn't work without logical not/! 

    if (!(str > 0)) {
        arr[arr.length - 1] = Math.abs(+str);
    }
    else if (!(str < 0)) {
        arr[arr.length - 1] = -Math.abs(+str);
    }

    //return with altered last value of display
    return calcDisplay.textContent = arr.join(""); 
}

//add decimal character
decimalBtn.onclick = () => {
    if (allowDecimal === true) {
        calcDisplay.textContent += ".";
    }
    allowDecimal = false;
};

//limit decimal places to two
function roundToTwo(arr) {
    let finalResult = arr[0].toFixed(2);
    (arr[0].toString().indexOf('.') > -1) ? calcInput.textContent = finalResult : calcInput.textContent = arr[0];
}

factorialBtn.onclick = () => {
    if (calcInput.textContent !== "") {
        let arr = [];
        let product = parseInt(calcInput.textContent);
        for (let i = product - 1; i > 1; i--) {
            product *= i;
        }
        arr.push(product);
        roundToTwo(arr);
    }
}

//clear everything and resets back to default
allClearBtn.onclick = () => {
    calcInput.textContent = '';
    calcDisplay.textContent = '';
    allowDecimal = true;
}

//remove last character on display text
clearCharBtn.onclick = () => {
    if (calcDisplay.textContent.charAt(calcDisplay.textContent.length - 1) == " ") {
        calcDisplay.textContent = calcDisplay.textContent.substring(0, calcDisplay.textContent.length - 3); //if equals to a whitespace remove the preceding char aswell
        allowOp = true;
    }
    else {
        calcDisplay.textContent = calcDisplay.textContent.substring(0, calcDisplay.textContent.length - 1); //remove last character of the display text
        allowOp = false;
    }
    calcInput.textContent = '';
}

//keyboard support
document.addEventListener('keydown', function (event) {
    if (!isNaN(event.key)) {
        document.getElementById(`dig-${event.key}`).click();
    }
    else if (event.key === '/') {
        document.getElementById('divide').click();
    }
    else if(event.key === '*' || event.key === 'x'){
        document.getElementById('multiply').click();
    }
    else if(event.key === '+' || event.key === 't' ){
        document.getElementById('add').click();
    }
    else if (event.key === '-') {
        document.getElementById('subtract').click();
    }
    else if (event.key === 's') {
        posNegBtn.click();
    }
    else if (event.key === '!') {
        factorialBtn.click();
    }
    else if (event.key === 'Backspace') {
        clearCharBtn.click();
    }
    else if (event.key === 'Delete') {
        allClearBtn.click();
    }
    else if (event.key === '.') {
        decimalBtn.click();
    }
    else if (event.key === 'Enter') {
        equalBtn.click();
    }
});

switchPref.onclick = () => {
    operatorPrecedence === true ? operatorPrecedence = false : operatorPrecedence = true;
    screenPrecedence.classList.toggle('opPrecedence');
    calcInput.textContent = "";
}

switchDisplay.onclick = () => {
    DAR === true ? DAR = false : DAR = true;
    screenDAR.classList.toggle('screenDAR');
}

//finalize result
equal.onclick = () => {
    if (operatorPrecedence == true) {
        evaluateComplex();
    }
    else {
        evaluateSimple();
    }
    if (DAR == true) {
        calcDisplay.textContent = calcInput.textContent;
    }
}
