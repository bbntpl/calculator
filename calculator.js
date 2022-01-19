'use strict';

/*DOM Elements*/
const allClearBtn = document.getElementById('all-clear');
const clearCharBtn = document.getElementById('backspace');
const equalBtn = document.getElementById('equal');
const calcDisplay = document.querySelector('.calc-screen__display');
const calcInput = document.querySelector('.calc-screen__input');
const opArray = Array.from(document.querySelectorAll('.operators'));
const digitNodeList = [...document.querySelectorAll('.digits')];
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
let strWithoutWhitespace = "";

//calculate a simple math
function calculate(op, a, b) {
    const arithmeticObj = {
        "*": +a * +b,
        "/": +a / +b,
        "+": +a + +b,
        "-": +a - +b,
    };
    return arithmeticObj[op];
}

/*It's functionality is to ranked the order of each operators in terms of precedence. 
    The highest ranked will be the first set of simple arithmetic expression to return its result.*/
function supersedeOperators(operator, operatorPrecedence) {
    if (operator == "/" && operatorPrecedence == 0) {
        return "/";
    }
    else if (operator == "*" && operatorPrecedence == 1) {
        return "*";
    }
    else if (operator == "+" && operatorPrecedence == 2) {
        return "+";
    }
    else if (operator == "-" && operatorPrecedence == 3) {
        return "-";
    }
}

//count the number of operators
function countOperators(numOfOp) {
    let operatorPrecedence = 0;
    numOfOp.forEach(operator => {
        if (operator == "/" || operator == "*" || operator == "+" || operator == "-") {
            return operatorPrecedence++;
        }
    });
    return operatorPrecedence;
}

//calculate the arithmetic expression with complexity
function evaluateAnswer() {
    //splitting the characters of the aritmetic expression with the whitespace
    let calcExp = calcDisplay.textContent.split(" ");
    let total = 0;
    /* 
        ii=0 is divide
        ii=1 is multiply
        ii=2 is add,
        ii=3 is substraction
    */
    for (let ii = 0; ii <= 3; ii++) {
        calcExp.reduce((p, v, i, arr) => {
            if (v == supersedeOperators(v, ii)) {
                let op = v;
                //making sure previous is not undefined after assigning as a whitespace
                p = arr[i - 1];
                total = calculate(op, p, arr[i + 1]);
                //replace the next value as total
                arr[i + 1] = total;
                //replacing the previous && current value with whitespace 
                arr[i] = " ";
                arr[i - 1] = " ";
            }
            else if (arr.length < 2) {
                //display the answer
                return calcInput.textContent = v;
            }
        });
        calcExp = calcExp.filter(function (str) {// removes all whitespaces value in the array
            return /\S/.test(str);
        });
    }
    //limit demical places to two
    roundToTwo(calcExp);
}

//display entered digit
digitNodeList.forEach(btn => btn.addEventListener("click", () => {
    strWithoutWhitespace = calcDisplay.textContent.replace(/\s/g, "");
    if (strWithoutWhitespace.length < 35) {
        calcDisplay.textContent += btn.textContent;
        allowOp = true;
    }
}));

//display entered operator unit
opArray.forEach(btn => btn.addEventListener("click", () => {
    allowDecimal = true;
    if (previousOp() == true && allowOp == true) {
        //adds a whitespace in-between the operator
        calcDisplay.textContent += ` ${btn.value} `;
        allowOp = false;
    }
    calcInput.textContent = '';
}));

//only allow one operator at a time
function previousOp() {
    return calcDisplay.textContent.length != 0 ? true : false;
}

//switch to positive or negative number
posNegBtn.onclick = () => {
    //convert array without removing the split delimiter
    let arr = calcDisplay.textContent.split(/(\s)/);

    //get the last item of the array
    let lastItem = arr[arr.length - 1];
    //It doesn't work without logical not/! 

    if (!(lastItem > 0)) {
        arr[arr.length - 1] = Math.abs(+lastItem);
    }
    else if (!(lastItem < 0)) {
        arr[arr.length - 1] = -Math.abs(+lastItem);
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

function filterNumbers(str) {
    return [...str].filter(n => typeof parseInt(n) === 'number').join('');
}
//limit decimal places to two
function roundToTwo(arr) {
    let finalResult = arr[0].toFixed(2);
    (arr[0].toString().indexOf('.') > -1) ? calcInput.textContent = finalResult : calcInput.textContent = arr[0];
}

factorialBtn.onclick = () => {
    const operatorsRegex = /\*|-|\/|\+/;
    const allowFactorial = !operatorsRegex.test(calcDisplay.textContent) || calcInput.textContent !== "";
    if (allowFactorial) {
        const mathExpToNumber = parseInt(filterNumbers(calcDisplay.textContent));
        const arr = [];
        let product = !operatorsRegex.test(calcDisplay.textContent) && calcInput.textContent === "" ? mathExpToNumber : parseInt(calcInput.textContent);
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
    const lastChar = calcDisplay.textContent.charAt(calcDisplay.textContent.length - 1);
    //if equals to a whitespace remove the preceding char aswell
    if (lastChar === " ") {
        calcDisplay.textContent = calcDisplay.textContent.substring(0, calcDisplay.textContent.length - 3);
        allowOp = true;
    }
    else if (lastChar == "." && !allowDecimal) {
        allowDecimal = true;
    }
    else {
        //remove the last character of the display alphanumeric text
        calcDisplay.textContent = calcDisplay.textContent.substring(0, calcDisplay.textContent.length - 1);
        allowOp = false;
    }
    calcInput.textContent = '';
}

//keyboard support
document.addEventListener('keydown', function (event) {
    if (!isNaN(Number(event.key))) {
        document.getElementById(`dig-${event.key}`).click();
    }
    else if (event.key === '/') {
        document.getElementById('divide').click();
    }
    else if (event.key === '*' || event.key === 'x') {
        document.getElementById('multiply').click();
    }
    else if (event.key === '+' || event.key === 't') {
        document.getElementById('add').click();
    }
    else if (event.key === '-') {
        document.getElementById('subtract').click();
    }
    else if (event.key === 's' || event.key === 'S') {
        posNegBtn.click();
    }
    else if (event.key === '!') {
        factorialBtn.click();
    }
    else if (event.code === 'Backspace') {
        clearCharBtn.click();
    }
    else if (event.code === 'Delete') {
        allClearBtn.click();
    }
    else if (event.key === '.') {
        decimalBtn.click();
    }
    else if (event.code === 'Enter') {
        equalBtn.click();
    }
});

//finalize result
equal.onclick = () => {
    evaluateAnswer();
    calcDisplay.textContent = calcInput.textContent;
}
