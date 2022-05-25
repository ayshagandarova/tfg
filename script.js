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

var infoBarco = document.getElementById('infoBarco'); // button that gets the information of the ship, zone and type of fishing
var resInfoBarco = document.getElementById('resInfoBarco'); // the results of the ship

var infoPeces = document.getElementById('infoPeces');  // button that gets the information of each fish
var resInfoPeces = document.getElementById('resInfoPeces'); // the rsults of each fish


var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent
var datosFichero
var diccionario
var gBarco
var gPeces
var recognitionBarco
var recognitionPeces
var datosBarco 
var datosPeces

startRecognition()


function startRecognition() {

  setRecognition()
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      datosFichero = JSON.parse(xmlhttp.responseText);
      definirGramaticas();
      recognitionBarco = setRecognition(gBarco)
      recognitionPeces = setRecognition(gBarco)
      infoBarco.onclick = function () {
        recognitionBarco.start();
        resInfoBarco.textContent = 'Escuchando información del barco...';
      }

      infoPeces.onclick = function () {
        recognitionPeces.start();
        resInfoPeces.textContent = 'Escuchando información de los peces...';
      }

      recognitionBarco.onresult = function (event) { // ya tenemos la del barco
        var response = event.results[0][0].transcript;
        response = response.toLowerCase()
        resInfoBarco.innerHTML = response;
        tratamientoInfoBarco(response, "hola");
      }

      recognitionBarco.onnomatch = function (event) { // si no está en la grámatica...
        resInfoBarco.textContent = 'La palabra no está en la grámatica';
      }

      recognitionBarco.onerror = function (event) {
        resInfoBarco.textContent = 'Se ha producido un error: ' + event.error;
      }
    }
  };
  xmlhttp.open("GET", "datos.json", true);
  xmlhttp.send();
}

function tratamientoInfoBarco(palabra, diccionario) {
  for (var i = 0; i < diccionario.length; i++) {
    if (palabra == diccionario[i]) {
      console.log("Palabra coincide sin procesar: " + palabra);
      return palabra
    }
  }
  console.log(palabra)
  console.log(datosBarco)
  var palabras = palabra.split(" ");
  console.log(coincidenVocales(palabras, diccionario));

}

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
  return zonasGuardadas;
}

/*
Método que corrige la palabra que le pasan:
 - Si la palabra ya está en el diccionario, se devuelve la misma
 - 
*/
function correct(palabra, diccionario) {
  if (palabra in diccionario) {
    return palabra
  }
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



// creates the grammar of the data from json
function definirGramaticas() {
  //var tipos_peces = ['trigloporus lastoviza', 'scorpaena notata', 'scorpaena scrofa', 'trachinus draco', 'serranus cabrilla', 'chelidonichthys cuculus', 'lepidotrigla cavillone', 'scorpaena porcus', 'lepidotrigla dieuzeidei', 'uranoscoper scaber', 'blennius ocellaris', 'trachinus radiatus', 'zeus faber', 'diplodus annularis', 'symphodus tinca', 'spicara smaris', 'microphis ocellatus', 'citharus linguatula', 'trisopterus minuta', 'pedaç', 'solea solea', 'chelidonichthys lucerna', 'mullus surmuletus', 'dorada', 'microglanis variegatus', 'trachurus mediterraneus', 'lepidorhombus boscii', 'sphyraena sphyraena', 'cepola macrophthalma', 'synchiroupus phaeton', 'solea spp', 'scorpaena elongata', 'merluccius merluccius', 'peristedion cataphractum', 'boops boops', 'pagellus erythrinus', 'dentex dentex', 'physcis blennoides', 'spondyliosoma cantharus', 'mullus barbatus', 'trigla lyra', 'aspitrigla cuculus', 'trachurus trachurus', 'sparus aurata', 'phycis phycis', 'larus viridis'];
 // var tipos_peces_count = [1664, 1068, 904, 685, 570, 506, 466, 122, 111, 107, 87, 81, 23, 22, 19, 18, 13, 12, 12, 9, 8, 7, 6, 4, 4, 3, 3, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1];
  var g_tipos_peces = '#JSGF V2.0; grammar tipos_peces; public <tipo_pez> = ' + datosFichero.nombresLatin.join(' | ') + ' ;';

  //var barcos = ['es refalar', 'punta de vent', 'myri', 'antonia munar', 'antonia munar ii', 'marjupe segundo', 'balear segundo', 'nou capdepera', 'penyal roig', 'villa sóller', 'balear segunda', 'marisita segunda', 'balear ii', 'refalar', 'marisita ii', 'punta des vent', 'joven mirmer', 'es penyal roig', 'cap vermell', 'cap de reig', 'sito primero', 'nou patrash', 'es verges', 'tomalu', 'na clara', 'agila', 'joven daniel segundo', 'señora de los ángeles', 'felipe', 'joan tix', 'soleret', 'zorro', 'solaret', 'es cubanos', 'nou dos joans', 'alba', 'virgen del carmen ii', 'cala bona ii', 'flor del mal', 'hermanos gonzález', 'sparus', 'marjupe primero', 'rosita', 'jaume', 'latxa', 'kuripo', 'germans torres', 'juma iii', 'juma tercero', 'na rosa', 'solaes', 'katy', 'calypso', 'jaume iii', 'toni cuarto', 'petit fuat', 'marcos tercero', 'dos joans', 'raconet', 'señora de los angeles', "l'auba segundo", 'virgen del carmen', 'goga', 'nova princesa', 'escem', 'marcos', 'capdevanter', 'nou viladeia', 'boga', 'tres hermanos', 'jaimito iv', 'nou viladellà', 'roca i', "l'avançada", 'tizona', 'nou vistalegra', 'nou vistalegre', 'la vençada', 'danagus'];
 // var barcos_count = [1134, 422, 391, 333, 317, 314, 303, 287, 269, 247, 240, 218, 205, 203, 197, 170, 169, 161, 140, 81, 50, 48, 47, 43, 37, 36, 35, 33, 28, 24, 24, 23, 23, 22, 18, 18, 17, 15, 15, 15, 14, 13, 12, 12, 12, 11, 10, 9, 9, 8, 8, 7, 7, 7, 7, 6, 6, 5, 5, 4, 4, 4, 4, 4, 4, 3, 3, 3, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1];
  var g_barcos = '#JSGF V1.0; grammar tipos_peces; public <barco> = ' + datosFichero.barcos.join(' | ') + ' ;';

  //var zonas = ['santanyí', 'sóller', 'cala rajada', 'alcudia', 'portocolom', 'alcúdia', 'palma', 'colonia de sant jordi', 'portocristo', 'pollença', 'andratx', 'colònia de sant jordi', 'portvocolom', 'calarajada'];
  //var zonas_count = [2839, 917, 704, 619, 556, 423, 105, 104, 93, 92, 60, 45, 23, 8];
  var g_zona = '#JSGF V1.0; grammar tipos_peces; public <zona> = ' + datosFichero.zonas.join(' | ') + ' ;';

  //zonas = zonas.normalize('NFD').replace(/[\u0300-\u036f]/g, ""); // quitar acentos
  //var tipusPesca = ['arrossegament', 'art menor'];
  //var tipus_count = [5768, 822]
  var g_tipus = '#JSGF V1.0; grammar tipos_peces; public <tipo> = ' + datosFichero.tipoPesca.join(' | ') + ' ;';

  //var tipus_algo = ['morralla vermella', 'morrallí', 'morralla', 'cap-roig', 'morralla blanca', 'mescla cabrachos, escaparotas, rascacios, escorporas o cabra...', 'aranyes', 'peix de sopa', 'mescla escorpora, rascacio', 'cap-roig', 'serrans', 'variat', 'rata', 'mescladís', 'escorpores', 'varietat escòrpores', 'aranya'];
  //var tipus_algo_count = [2975, 1322, 933, 395, 304, 183, 121, 99, 70, 66, 42, 35, 15, 12, 10, 7, 1];
  var g_tipus_algo = '#JSGF V1.0; grammar tipos_peces; public <tipus_algo> = ' + datosFichero.peces.join(' | ') + ' ;';

  datosBarco = datosFichero.barcos.concat(datosFichero.zonas.concat(datosFichero.tipoPesca))

  datosBarco = datosBarco.normalize('NFD')//.replace(/[\u0300-\u036f]/g, ""); // quitar acentos

  datosPeces = datosFichero.nombresLatin.concat(datosFichero.peces)
  datosPeces = datosPeces.normalize('NFD')//.replace(/[\u0300-\u036f]/g, ""); // quitar acentos
 
  var gBarco = '#JSGF V1.0; grammar infoBarco; public <infoBarco> = ' + datosFichero.barcos.join(' | ') + ' | ' + datosFichero.zonas.join(' | ') + ' | ' + datosFichero.tipoPesca.join(' | ') + ' ;';
  var gPeces = '#JSGF V1.0; grammar infoBarco; public <infoBarco> = ' + datosFichero.nombresLatin.join(' | ') + ' | ' + datosFichero.peces.join(' | ') + ' ;';

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

// sets the recognition API 
function setRecognition(gramatica) {
  var recognition = new SpeechRecognition();
  var speechRecognitionList = new SpeechGrammarList();
  speechRecognitionList.addFromString(gramatica, 1); // el uno indica la importancia respecto a otras gramaticas
  recognition.grammars = speechRecognitionList;
  recognition.continuous = false; // true si el reconocimiento de voz se hace de forma continua
  recognition.lang = 'ca-ES'; // idioma
  recognition.interimResults = false; // true si queremos resultados provisionales, false para resultados finales
  recognition.maxAlternatives = 1; // te muestra las diferentes alternativas para que el usuario pueda elegir, nosotros solo utilizaremos una
  return recognition;
}

// css 

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

//var columnas = ['Número', 'Color'];

/*
var columnsHTML= '';s
columnas.forEach(function(v, i, a){
  console.log(v, i);
  columnsHTML += '<span> ' + v + ', </span>';
});*/
