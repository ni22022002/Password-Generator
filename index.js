const inputSlider=document.querySelector("[data-lengthSlider]");
const lengthDisplay=document.querySelector("[data-lengthNumber]");
const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numbersCheck=document.querySelector("#numbers");
const symbolsCheck=document.querySelector("#symbols");
const indicator=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generateButton");
const allCheckBox=document.querySelectorAll("input[type=checkbox]");
const symbols ='~`!@#$%^&*()_-+={}[];:"<,>.?/';


let password="";
let passwordLength=10;
let checkCount=0;
handleslider();

//sets the password length
function handleslider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;
}


function setIndicator(color){
    indicator.style.backgroundColor=color;
    //shadow
}

function getRandomInteger(min,max){
    return Math.floor(Math.random()*(max-min))+min;
}

function generateRandomNumber(){
    return getRandomInteger(0,9);
}


function generateLowerCase(){
    return String.fromCharCode(getRandomInteger(97,123));
}


function generateUpperCase(){
    return String.fromCharCode(getRandomInteger(65,91));
}

function generateSymbol(){
    const randNum=getRandomInteger(0,symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSym=false;
    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower=true;
    if(numbersCheck.checked) hasNum=true;
    if(symbolsCheck.checked) hasSym=true;

    if(hasUpper && hasLower && (hasNum|| hasSym) && passwordLength >=8){
        setIndicator("#0f0");
    }
    else if(
        (hasLower || hasUpper) && 
        (hasNum || hasSym) &&
        passwordLength>=6
    ){
        setIndicator("#ff0");
    }else{
        setIndicator("#f00");
    }
}

async function copyContent(){
    
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="copied";
    }

    catch(e){
        copyMsg.innerText="failed";
    }

    // to make copy icon visible
    copyMsg.classList.add("active");

    setTimeout( ()=>{
        copyMsg.classList.remove("active");
    },2000);

}


function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}


function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)
        checkCount++;
    });

    // special condition
    if(passwordLength <checkCount){
        passwordLength = checkCount;
        handleslider();

    }
}

     allCheckBox.forEach( (checkbox) => {
        checkbox.addEventListener('change',handleCheckBoxChange);
     });

inputSlider.addEventListener('input', (e)=>{
    passwordLength = e.target.value;
    handleslider();
})

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value)
    copyContent();
})

generateBtn.addEventListener('click', () => {
    //none of checkbox is selected
    if(checkCount==0) 
    return;

    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleslider();
    }

    // lets find new password
    console.log("Start");
    // remove old password
    password="";

    // if(uppercaseCheck.checked){
    //     password +=generateUpperCase();
    // }

    // if(lowercaseCheck.checked){
    //     password +=generateLowerCase();
    // }

    // if(numbersCheck.checked){
    //     password +=generateRandomNumber();
    // }

    // if(symbolsCheck.checked){
    //     password +=generateSymbol();
    // }

    let funcArr=[];

    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

        if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);

        if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

        
        // compulsary

        for(let i=0;i<funcArr.length;i++){
            password +=  funcArr[i]();          
        }
        console.log("complusry done");
        
        // remaining
        for(let i=0;i<passwordLength-funcArr.length;i++){
            let randIndex=getRandomInteger(0,funcArr.length);
            console.log("randIndex" + randIndex);
            password +=funcArr[randIndex]();
        }

        console.log("remain done");

        // shuffle password
        password =shufflePassword(Array.from(password));

        // show in UI
        passwordDisplay.value=password;

        // calculate strength
        calcStrength();


    });



