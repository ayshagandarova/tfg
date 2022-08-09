/* FUNCIONS JQUERY 

function leerCsv(texto, separador=';', omitirEncabezado=false){
  if (typeof texto !== 'string') {
    throw TypeError('El argumento debe ser una cadena de caracteres.');
  }
  return texto.slice(omitirEncabezado ? texto.indexof( '\n') + 1: 0)
  .split('\n')
  .map(l => l.split (separador));

}
    var datos
    fichero = new XMLHttpRequest();
    fichero.onreadystatechange = function() {
      if (fichero.readyState == 4 ) {
        let allText = fichero.responseText;
        datos = leerCsv(allText)
        console.log(datos)
      }
    }
    fichero.open("GET", "colores.csv", true);
    fichero.send()

 
    $(document).ready(function(){
     
        $(document).load("colores.csv", function(responseTxt, statusTxt, xhr){
          if(statusTxt == "success")
            console.log(responseTxt)
          if(statusTxt == "error")
            alert("Error: " + xhr.status + ": " + xhr.statusText);
        });
      
    });
    

readTextFile()
*/

/*
function identificarZona(response, diccionario){
  if (response[0] in diccionario){ // si es de las fáciles ej: santanyí
    resultadoBarco.zona = response[0];
  }
  
 // hacer una comprobación de más de una palabra 
  return response
}
*/

/*
    var coincide = true;
    for (var i = 0; i < palabrasZonas.length; i++){
      for (var j = 0; j< palabrasZonas.length && coincide; j++){
        if (posVocalsPalabra[j] == palabrasZonas[i][j]){
          coincide = false;
          palabrasZonas.splice(i,1)
        }
      }
      coincide = true
    }
    /*
    for (var i = 0; i< palabrasZonas.length; i++){
      console.log(palabrasZonas[i]);
    }
    console.log(zonas[posicion])
  */


    function coincidenVocales(palabras, zonas) {
        var posVocalsPalabra = new Array();
        var palabrasInfoBarcos = new Array();
        var zonasGuardadas = new Array();
        var contadorZonas = 0;
        var contador;
        var posicion
        var vocales = ['a', 'e', 'i', 'o', 'u'];
        for (var i = 0; i < palabras.length; i++) { // comprueba cada palabra de la oración
          contador = 0;
          for (var j = 0; j < palabras[i].length; j++) { // dentro de esa palabra mira cada letra 
            for (var k = 0; k < vocales.length; k++) { // dentro de cada 
              if (palabras[i][j] == vocales[k]) {
                posVocalsPalabra[contador] = vocales[k];
                contador++;
              }
            }
          }
        }
        var posVocalsZonas = new Array()
        for (var i = 0; i < zonas.length; i++) { // zonas
          contador = 0;
          console.log("Palabra de zona que estoy mirando: " + zonas[i])
          for (var j = 0; j < zonas[i].length; j++) { // dentro de esa palabra mira cada letra 
            var contadorPalabra = 0
            console.log("++++Vamos a mirar que letra analizamos de las palabras de zonas: " + zonas[i][j])
            for (var k = 0; k < vocales.length; k++) { // dentro de cada 
              if (zonas[i][j] == vocales[k]) {
                console.log("----La vocal " + vocales[k] + " coincide con la letra " + zonas[i][j] + " de la palabra " + zonas[i])
                posVocalsZonas[contador] = vocales[k];
                contador++;
                posicion = i
              }
            }
          }
          console.log(" la palabra que hemos dicho tiene " + posVocalsPalabra.length + " vocales y la palabra de zonas tiene " + posVocalsZonas.length + " vocales")
          if (posVocalsPalabra.length == posVocalsZonas.length) {
            for (var j = 0; j < posVocalsPalabra.length; j++) {
              if (posVocalsPalabra[j] == posVocalsZonas[j]) {
                console.log("Añadimos esta combinación de letras porque coincide con la original")
                palabrasZonas[contadorZonas] = posVocalsPalabra;
                zonasGuardadas[contadorZonas] = zonas[i]
                contadorZonas++;
              }
            }
          }
        }
        console.log("Las palabras que coinciden en que tiene el mismo número de vocales son: " + zonasGuardadas)
        return zonasGuardadas;
      }
      

      /*
  Método que devuelve un array que tiene una diferencia de 1 con la palabra que le han pasado por parámetro
  Las strings se pueden crear por:
    - Añadiendo una letra accidenta
  This consists of all strings that can be created by:
    - Adding any one character (from the alphabet) anywhere in the word.
    - Removing any one character from the word.
    - Transposing (switching) the order of any two adjacent characters in a word.
    - Substituting any character in the word with another character.
*/
function editDistance1(palabra) {
    var vocales = ['a', 'e', 'i', 'o', 'u'];
  
    word = word.toLowerCase().split('');
    var results = [];
  
    //Adding any one character (from the alphabet) anywhere in the word.
    for (var i = 0; i <= word.length; i++) {
      for (var j = 0; j < alphabet.length; j++) {
        var newWord = word.slice();
        newWord.splice(i, 0, alphabet[j]);
        results.push(newWord.join(''));
      }
    }
  
    //Removing any one character from the word.
    if (word.length > 1) {
      for (var i = 0; i < word.length; i++) {
        var newWord = word.slice();
        newWord.splice(i, 1);
        results.push(newWord.join(''));
      }
    }
  
    //Transposing (switching) the order of any two adjacent characters in a word.
    if (word.length > 1) {
      for (var i = 0; i < word.length - 1; i++) {
        var newWord = word.slice();
        var r = newWord.splice(i, 1);
        newWord.splice(i + 1, 0, r[0]);
        results.push(newWord.join(''));
      }
    }
  
    //Substituting any character in the word with another character.
    for (var i = 0; i < word.length; i++) {
      for (var j = 0; j < alphabet.length; j++) {
        var newWord = word.slice();
        newWord[i] = alphabet[j];
        results.push(newWord.join(''));
      }
    }
  
  
    return results;
  }
  


/* css 

function w3_open() {
  document.getElementById("mySidebar").style.display = "block";
  document.getElementById("myOverlay").style.display = "block";
}

function w3_close() {
  document.getElementById("mySidebar").style.display = "none";
  document.getElementById("myOverlay").style.display = "none";
}

// Modal Image Gallery
function onClick(element) {
  document.getElementById("img01").src = element.src;
  document.getElementById("modal01").style.display = "block";
  var captionText = document.getElementById("caption");
  captionText.innerHTML = element.alt;
}
*/

//var columnas = ['Número', 'Color'];

/*
var columnsHTML= '';s
columnas.forEach(function(v, i, a){
  console.log(v, i);
  columnsHTML += '<span> ' + v + ', </span>';
});*/


function identificarBarco(response, diccionario){
  if (response[0] in diccionario){ // si es de las fáciles ej: santanyí
    resultadoBarco.zona = response[0];
  }

 // hacer una comprobación de más de una palabra 
  return response
}
// método que comprueba cada palabra de la oración y lo pone en el formato que toca
function tratamientoInfoBarco(response, diccionario) {
  for (var i = 0; i < diccionario.length; i++) {
    if (response == diccionario[i]) {
      console.log("Palabra coincide sin procesar: " + response);
      return response
    }
  }
  var response = response.split(" ");
  console.log(coincidenVocales(response, diccionario));

}

// Gets json data from  file and saves it in datosFichero
function getData(file) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      datosFichero = JSON.parse(xmlhttp.responseText);
      console.log(datosFichero)
    }
  };
  xmlhttp.open("GET", file, true);
  xmlhttp.send();
}