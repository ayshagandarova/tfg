import FuzzySet from 'fuzzyset.js'

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent



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

var g_tipos_peces = '#JSGF V1.0; grammar tipos_peces; public <tipo_pez> = Boops boops | Blennius ocellaris | Chelidonichthys cuculus | Aspitrigla cuculus | Citharus linguatula | Cepola macrophthalma | Diplodus annularis | Dentex dentex | Lepidorhombus boscii | Lepidotrigla cavillone | Lepidotrigla dieuzeidei | Microphis ocellatus | Mullus surmuletus | Pagellus erythrinus | Serranus cabrilla | Scorpaena elongata | Scorpaena notata | Synchiroupus phaeton | Scorpaena porcus | Scorpaena scrofa | Spicara smaris | Solea solea | Sphyraena sphyraena | Symphodus tinca | Solea spp | Trachinus draco | Trigloporus lastoviza | Trachurus mediterraneus | Trachurus trachurus | Trachinus radiatus | Uranoscoper scaber | Zeus faber | Chelidonichthys lucerna | Sparus aurata | Physcis blennoides | Microglanis variegatus | Spondyliosoma cantharus | Mullus barbatus | Trigla lyra | Merluccius merluccius | Peristedion cataphractum | Trisopterus minuta | Phycis phycis | Larus viridis;'
//var colores = ['azul', 'verde', 'amarillo', 'rosa', 'lila', 'negro', 'blanco', 'rojo', 'celeste'];
//var columnas = ['Número', 'Color'];
//var grammar = '#JSGF V1.0; grammar columns; public <pez> = ' + colores.join(' | ') + ' ;'


var tipos_peces = ['Boops boops', 'Blennius ocellaris', 'Chelidonichthys cuculus', 'Aspitrigla cuculus', 
                  'Citharus linguatula', 'Cepola macrophthalma', 'Diplodus annularis', 'Dentex dentex', 
                  'Lepidorhombus boscii', 'Lepidotrigla cavillone', 'Lepidotrigla dieuzeidei', 
                  'Microphis ocellatus', 'Mullus surmuletus', 'Pagellus erythrinus', 'Serranus cabrilla', 
                  'Scorpaena elongata', 'Scorpaena notata', 'Synchiroupus phaeton', 'Scorpaena porcus', 
                  'Scorpaena scrofa', 'Spicara smaris', 'Solea solea', 'Sphyraena sphyraena', 
                  'Symphodus tinca', 'Solea spp', 'Trachinus draco', 'Trigloporus lastoviza', 
                  'Trachurus mediterraneus', 'Trachurus trachurus', 'Trachinus radiatus', 
                  'Uranoscoper scaber', 'Zeus faber', 'Chelidonichthys lucerna', 'Sparus aurata', 
                  'Physcis blennoides', 'Microglanis variegatus', 'Spondyliosoma cantharus', 
                  'Mullus barbatus', 'Trigla lyra', 'Merluccius merluccius', 'Peristedion cataphractum', 
                  'Trisopterus minuta', 'Phycis phycis', 'Larus viridis'];
var barcos = [ "BALEAR SEGUNDO", "REFALAR", "MYRI", "ES REFALAR", "ANTONIA MUNAR", "SITO PRIMERO", 
              "CAP VERMELL", "CALA BONA II", "MARJUPE SEGUNDO", "PUNTA DE VENT", "KATY", "FLOR DEL MAL", 
              "GERMANS TORRES", "JOAN TIX", "JOVEN DANIEL SEGUNDO", "MARCOS", "NOU DOS JOANS", "TIZONA", 
              "ZORRO", "PUNTA DES VENT", "JOVEN MIRMER", "MARISITA SEGUNDA", "BOGA", 
              "SEÑORA DE LOS ANGELES", "SPARUS", "BALEAR SEGUNDA", "VILLA SÓLLER", "AGILA", 
              "CAP DE REIG", "NA CLARA", "DOS JOANS", "ES CUBANOS", "ES VERGES", "L'AUBA SEGUNDO", 
              "PENYAL ROIG", "KURIPO", "FELIPE", "ROSITA", "SOLARET", "TRES HERMANOS", "CALYPSO", 
              "VIRGEN DEL CARMEN", "NA ROSA", "CAPDEVANTER", "NOU VISTALEGRA", "ANTONIA MUNAR II", 
              "JAUME", "LATXA", "JAIMITO IV", "SOLERET", "GOGA", "NOU VISTALEGRE", "NOVA PRINCESA", 
              "RACONET", "ALBA", "VIRGEN DEL CARMEN II", "JUMA III", "SEÑORA DE LOS ÁNGELES", 
              "BALEAR II", "NOU PATRASH", "NOU VILADELLÀ", "LA VENÇADA", "TOMALU", "ES PENYAL ROIG", 
              "MARJUPE PRIMERO", "JAUME III", "HERMANOS GONZÁLEZ", "ESCEM", "MARISITA II", 
              "NOU CAPDEPERA", "TONI CUARTO", "PETIT FUAT", "ROCA I", "SOLAES", "JUMA TERCERO", 
              "L'AVANÇADA", "MARCOS TERCERO", "NOU VILADEIA", "DANAGUS"];

var g_barcos = '#JSGF V1.0; grammar tipos_peces; public <barco> = ' + barcos.join(' | ') + ' ;';
var zonas = ['SANTANYÍ', 'CALA RAJADA', 'SÓLLER', 'ANDRATX', 'PORTOCRISTO', 'ALCÚDIA', 'POLLENÇA', 
            'PALMA', 'COLÒNIA DE SANT JORDI', 'ALCUDIA', 'PORTOCOLOM', 'COLONIA DE SANT JORDI', 'CALARAJADA', 
            'PORTVOCOLOM'];

var g_zona = '#JSGF V1.0; grammar tipos_peces; public <zona> = ' + zonas.join(' | ') + ' ;';
var tipus = ['arrossegament', 'art menor'];
var g_tipus = '#JSGF V1.0; grammar tipos_peces; public <tipo> = ' + tipus.join(' | ') + ' ;';
var tipus_algo = ['MORRALLÍ', 'MORRALLA', 'PEIX DE SOPA', 'CAP-ROIG', 'MORRALLA VERMELLA', 
                  'VARIETAT ESCÒRPORES', 'VARIAT', 'MESCLA CABRACHOS, ESCAPAROTAS, RASCACIOS, ESCORPORAS O CABRA...', 
                  'SERRANS', 'ESCORPORES', 'MORRALLA BLANCA', 'ARANYES', 'ARANYA', 'MESCLA ESCORPORA, RASCACIO', 
                  'MESCLADÍS', 'RATA', 'CAP- ROIG'];
var g_tipus_algo = '#JSGF V1.0; grammar tipos_peces; public <tipus_algo> = ' + tipus_algo.join(' | ') + ' ;';

fs = FuzzySet(tipos_peces);
var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();

speechRecognitionList.addFromString(grammar, 1); // el uno indica la importancia respecto a otras gramaticas

recognition.grammars = speechRecognitionList;

recognition.continuous = false; // true si el reconocimiento de voz se hace de forma continua
recognition.lang = 'ca-ES'; // idioma
recognition.interimResults = false; // true si queremos resultados provisionales, false para resultados finales
recognition.maxAlternatives = 1; // te muestra las diferentes alternativas para que el usuario pueda elegir, nosotros solo utilizaremos una

var diagnostic = document.querySelector('.outputText'); // aqui añade la palabra escuchada al párrafo de resultado
var hints = document.querySelector('.hints');  // aquí añade todas las palabras de la gramática
var boton = document.querySelector('.botonEscuchar');

var columnas = ['Número', 'Color'];

/*
var columnsHTML= '';
columnas.forEach(function(v, i, a){
  console.log(v, i);
  columnsHTML += '<span> ' + v + ', </span>';
});*/
hints.innerHTML = grammar + '.';



boton.onclick = function() {
  recognition.start();
  console.log('Escuchando...');
}

recognition.onresult = function(event) {
    var pez = event.results[0][0].transcript;
    console.log("Resultado: "+ pez);
    console.log(fs.get(pez));
    diagnostic.textContent = 'Result received: ' + pez + '.';
    console.log('Resultado: ' + event.results[0][0].transcript);
    
  }


  recognition.onnomatch = function(event) {
    diagnostic.textContent = 'I didnt recognise that color.';
  }

  recognition.onerror = function(event) {
    diagnostic.textContent = 'Error occurred in recognition: ' + event.error;
  }