"use strict";
const LIMIT = 9999999999;

let displayedNumber = 0;
let previousNumber = 0;
let operator = '';

// When number buttons clicked, displays proper number 
let numberButtons = document.querySelectorAll('.number');
numberButtons.forEach((button) => { 
  button.addEventListener('click', () => { 
	updateDisplay(Number(button.textContent));
  });
});

// When operator buttons clicked, saves first number, and operator, then clears display 
let operatorButtons = document.querySelectorAll('.operator');
operatorButtons.forEach((button) => { 
  button.addEventListener('click', () => { 
	previousNumber = displayedNumber;
	operator = `${button.textContent}`;
	displayedNumber = 0;
  });
});

// When result (euqlity) button clicked, [...]
let resultButton = document.querySelector('.result');
resultButton.addEventListener('click', () => {
	let display = document.querySelector('.current-number');
	let result = operate(previousNumber,operator,displayedNumber);
	if(checkResult(result)) {
		result = correctResult(result);
		display.textContent = `${result}`
		displayedNumber = Number(display.textContent);
		//previousNumber = result;
		operator = '=';
	}
	else{
		clearDisplay();
		deleteMemory();
	}
});

// When clear button clicked, clears display from any content, and deletes current memory 
let clearButton = document.querySelector('.clr');
clearButton.addEventListener('click', () => {
	clearDisplay();
	deleteMemory();
});


// Corrects result digit amount
function correctResult(number) {
	// TODO
	return number;
}

// Updates displayed number
function updateDisplay(number){
	let previousNumber = document.querySelector('.current-number');

	if(displayedNumber*10 + number <= LIMIT){
		displayedNumber = displayedNumber*10 + number;
		previousNumber.textContent = displayedNumber;
	}
	else
		alert('You are trying to input bigger number that it\'s possible!');
}

// Clears display from any content
function clearDisplay(){
	let display = document.querySelector('.current-number');
	display.textContent = '0';
	displayedNumber = 0;
}

// Deletes memory
function deleteMemory(){
	previousNumber = 0;
	operator = '';
}

// Checks if result isn't too big
function checkResult(number){
	if(number>LIMIT) {
		alert('The result is too big!');
		return false;
	}
	return true;
}

// Returns proper result based on two numbers and math operator
function operate(a,operator,b){
	switch(operator){
		case '+':
			return add(a,b);
			break;
		case '-':
			return substract(a,b);
			break;
		case '*':
			return multiply(a,b);
			break;
		case '/':
			return divide(a,b);
			break;
		case '=':
			return b;
			break;
		default:
			clearDisplay();
			deleteMemory();
			alert("Error: Invalid operator!");
			return 0;
			break;
	}
}

// Basic math operators functions
function add(a,b){
	return a+b;
}
function substract(a,b){
	return a-b;
}
function multiply(a,b){
	return a*b;
}
function divide(a,b){
	return a/b;
}

