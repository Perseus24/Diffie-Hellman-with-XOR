let message = '';
let privateKeyA = Math.floor(Math.random()*256);
let privateKeyB = Math.floor(Math.random()*256);
let secretKey;

calculateKey();
function calculateKey(){
    publicKeyA = (1261n ** BigInt(privateKeyA)) % 9973n;
    publicKeyB = (1261n ** BigInt(privateKeyB)) % 9973n;
    document.querySelectorAll('#public-key').forEach(element => {
        element.innerHTML = publicKeyA
    })
}

function calculateSecretKey(num){
    //gets the inputted public key
    document.querySelectorAll('#inputPK').forEach(element => {
        if(element.value != ""){
            publicKey = element.value;
        }
    })
    //calculates the secret key using the formula below
    if(num){
        secretKey = (BigInt(publicKey) ** BigInt(privateKeyA)) % 9973n;
    }else{
        secretKeyB = (BigInt(publicKey) ** BigInt(privateKeyB)) % 9973n;
    }
    secretKey = Number(secretKey);
}

function encryptMessage(swn){
    if(validateInputs()){
        calculateSecretKey(1);
        //switching what to encrypt (an input text or a file input)
        swn?word = document.getElementById('message').value:word = message;
        //Performs an XOR function on each character of the message and the secret key by the ascii value of the character
        for(let i=0; i<word.length; i++){
            document.getElementById('encrypted-message').innerHTML += String.fromCharCode(word.charCodeAt(i) ^ secretKey);
        }
        document.getElementsByClassName('message-row-2')[0].style.display = "flex";
        document.getElementsByClassName('column-containers')[0].style.display = "none";
        document.getElementsByClassName('none')[0].style.display = "flex";
        document.getElementsByClassName('row')[0].style.display = "none";
    }
}

function decryptMessage(swn){
    if(validateInputs()){
        calculateSecretKey(1);
        swn?word = document.getElementById('message').value:word = message;
        for(let i=0; i<word.length; i++){
            document.getElementById('encrypted-message').innerHTML += String.fromCharCode(word.charCodeAt(i) ^ secretKeyB);
        }
        document.getElementsByClassName('message-row-2')[0].style.display = "flex";
        document.getElementsByClassName('column-containers')[0].style.display = "flex";
    }
}

function validateInputs(){
    counter = 1;
    document.querySelectorAll('#message').forEach(element => {
        if(element.value == "" && document.getElementById('fileInput').files.length === 0){
            alert("Please enter a message or input a file!");
            counter = 0;
        }else{
            pkNull = Array.from(document.querySelectorAll('#inputPK')).some(element => element.value !== "");
            if(!pkNull){
                alert("Please enter a public key!");
                counter = 0;
            }
        }
    });
    if(counter){
        return true;
    }else{
        return false;
    }
}

function decodeHtmlEntities(str) {
    //some characters from the web such as the ">" needs to be decoded because it would save to the file as "&gt;"
    const txt = document.createElement('textarea');
    txt.innerHTML = str;
    return txt.value;
}

document.getElementById('downloadButton').addEventListener('click', function() {
    const word = decodeHtmlEntities(document.getElementById('encrypted-message').innerHTML);
    const blob = new Blob([word], { type: 'text/plain' });
    const link = document.createElement('a');

    link.href = URL.createObjectURL(blob);
    link.download = 'encrypted-message.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

document.getElementById('fileInput').addEventListener('change', function(event) {
    //read the inputted text file
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function() {
        const text = reader.result;
        message = text;
    };
    reader.readAsText(file);
});

function switchThingsDesc(num){
    if(num){
        document.querySelectorAll('#type').forEach(element => {
            element.innerHTML = "Decrypt";
        })
        document.getElementById('encrypt-link').classList.remove('active-link');
        document.getElementById('decrypt-link').classList.add('active-link');
    }
    else{
        document.querySelectorAll('#type').forEach(element => {
            element.innerHTML = "Encrypt";
        })
        document.getElementById('encrypt-link').classList.add('active-link');
        document.getElementById('decrypt-link').classList.remove('active-link');
    }
}