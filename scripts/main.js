"use strict";
const LIMIT = 15; // Limit of characters on display
let prevValue = ''; // Value previously inputted by user [DEBUG]

let displayedContent = document.querySelector('.current-value'); // Everything displayed on calculator 
let displayLength = 0;

// When buttons clicked, adds value to display
let buttons = document.querySelectorAll('.number, .operator');
buttons.forEach((button) => { 
  button.addEventListener('click', () => { 
	updateDisplay(button.textContent);
  });
});

// When result (equality) button clicked, displays result
let resultButton = document.querySelector('#result');
resultButton.addEventListener('click', () => {
	if(prevValue >= '0' && prevValue <= '9'){
		let result = calculate(displayedContent.textContent);
		result = checkResult(result)
		console.log(result);
		displayedContent.textContent = Number(result);
		displayLength = Number(result).toString().length;
		prevValue = result.charAt(result.length-1);
		if(Number(result).toString().indexOf('.')!= -1)
			document.querySelector("#dot").disabled = true;
		else
			document.querySelector("#dot").disabled = false;
	}
	else
		alert('You can\'t end expression with operator!');
});

// When clear button clicked, clears display from any content, and deletes current memory 
let clearButton = document.querySelector('#clr');
clearButton.addEventListener('click', () => {
	clearAll();
});

// When undo button clicked, deletes last display value
let undoButton = document.querySelector('#undo');
undoButton.addEventListener('click', () => {
	if(displayedContent.textContent.charAt(displayLength-1) == '.')
		document.querySelector("#dot").disabled = false;
	else if(displayedContent.textContent.charAt(displayLength-1) < '0' || displayedContent.textContent.charAt(displayLength-1) > '9'){
		let prevNumberContainsDot = false;
		let i=2;
		while((displayedContent.textContent.charAt(displayLength-i) >= '0' && displayedContent.textContent.charAt(displayLength-i) <= '9') || displayedContent.textContent.charAt(displayLength-i) == '.'){
			if(displayedContent.textContent.charAt(displayLength-i) == '.'){
				prevNumberContainsDot = true;
				break;
			}
			i++;
		}

		if (prevNumberContainsDot == true)
			document.querySelector("#dot").disabled = true;
	}
	displayedContent.textContent = displayedContent.textContent.slice(0, -1);
	displayLength--;
	prevValue = displayedContent.textContent.charAt(displayLength-1);
});

// Updates displayed value [after checking corectness]
function updateDisplay(value){
	if(displayLength+1 < LIMIT){ 
		if(value == '0' && prevValue == '/')
			alert('You can\'t divide by zero')
		else if(value >= '0' && value <= '9'){
			displayedContent.textContent += value;
			displayLength++;
			prevValue = value;
		}
		else if(prevValue >= '0' && prevValue <= '9'){
			if(value == '.'){
				displayedContent.textContent += value;
				displayLength++;
				prevValue = value;
				document.querySelector("#dot").disabled = true;
			}
			else {
				displayedContent.textContent += value;
				displayLength++;
				prevValue = value;
				document.querySelector("#dot").disabled = false;
			}
		}
		else
			alert ('You can\'t input operator that way!');
	}
	else
		alert('There is no space for that!');
}

// Clears display and memory
function clearAll(){
	displayedContent.textContent = '';
	displayLength = 0;
	prevValue = '';
	document.querySelector("#dot").disabled = false;
}

// Checks result digit amount and value
function checkResult(number) {
	number = number.toFixed(5);
	if(number>=Math.pow(10, LIMIT-5)) {
		alert('The result is too big!');
		clearAll();
	}
	return number;
}

// Calculates expression
function calculate(string) {
	let expressionLength = string.length;
	let numbers = [], operators = [];
	let numAmount = 0, opAmount = 0;

	// Saves numbers and operators into arrays
	for(let i=0; i<expressionLength; i++) {
		let value = string.charAt(i);
		if(value >= '0' && value <= '9'){
			let max = expressionLength-i;
			numbers[numAmount] = 0;
			let afterDot = false;
			let digitAfterDot = 0.1;
			for(let j=-1; j<max; j++){
				value = string.charAt(i);
				if((value < '0' || value > '9') && value != '.'){
					i--;
					break;
				}
				else{
					if(value == '.'){
						afterDot = true;
						i++;
						continue;
					}
					if(afterDot == false){
						numbers[numAmount] = numbers[numAmount]*10 + Number(value);
						i++;
					}
					if(afterDot == true){
						numbers[numAmount] = numbers[numAmount] + Number(value)*digitAfterDot;
						digitAfterDot *= 0.1;
						i++;
					}
				}
			}
			numAmount++;
		}
		else
			operators[opAmount++] = value;
	}

	// Calculates value in right order
	for(let i=0; i<opAmount; i++){
		let currentOperator = '';
		let currentOperatorIndex = -1;
		for(let j=0; j<opAmount; j++){
			if(operators[j] == '*' || operators[j] == '/'){
				currentOperator = operators[j];
				currentOperatorIndex = j;
				break;
			}
		}
		if(currentOperatorIndex == -1){
			currentOperator = operators[0];
			currentOperatorIndex = 0;
		}

		numbers[currentOperatorIndex] = operate(numbers[currentOperatorIndex],currentOperator,numbers[currentOperatorIndex+1]);
		numbers.splice(currentOperatorIndex+1, 1);
		operators.splice(currentOperatorIndex, 1);
	}

	return numbers[0];
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
			clearAll();
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

// Keyboard support
document.addEventListener('keydown', function(e){
	let key = e.key;
	console.log(e);
	switch(key){
		case "0":
		case "1":
		case "2":
		case "3":
		case "4":
		case "5":
		case "6":
		case "7":
		case "8":
		case "9":
		case "+":
		case "-":
		case "*":
		case "/":
			updateDisplay(key);
			break;
		case ".":
			if(document.querySelector("#dot").disabled == false)
				updateDisplay(key);
			break;
		case "=":
				if(prevValue >= '0' && prevValue <= '9'){
					let result = calculate(displayedContent.textContent);
					result = checkResult(result)
					console.log(result);
					displayedContent.textContent = Number(result);
					displayLength = Number(result).toString().length;
					prevValue = result.charAt(result.length-1);
					if(Number(result).toString().indexOf('.')!= -1)
						document.querySelector("#dot").disabled = true;
					else
						document.querySelector("#dot").disabled = false;
				}
				else
					alert('You can\'t end expression with operator!');
				break;
		case "c":
			clearAll();
			break;
		case "Backspace":
			if(displayedContent.textContent.charAt(displayLength-1) == '.')
				document.querySelector("#dot").disabled = false;
			else if(displayedContent.textContent.charAt(displayLength-1) < '0' || displayedContent.textContent.charAt(displayLength-1) > '9'){
				let prevNumberContainsDot = false;
				let i=2;
				while((displayedContent.textContent.charAt(displayLength-i) >= '0' && displayedContent.textContent.charAt(displayLength-i) <= '9') || displayedContent.textContent.charAt(displayLength-i) == '.'){
					if(displayedContent.textContent.charAt(displayLength-i) == '.'){
						prevNumberContainsDot = true;
						break;
					}
					i++;
				}

				if (prevNumberContainsDot == true)
					document.querySelector("#dot").disabled = true;
			}
			displayedContent.textContent = displayedContent.textContent.slice(0, -1);
			displayLength--;
			prevValue = displayedContent.textContent.charAt(displayLength-1);
			break;
	}
});

