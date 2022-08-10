var infoGeneral = document.getElementById('infoGeneral'); // button that gets the information of the ship, zone and type of fishing
var resInfoGeneral = document.getElementById('resInfoGeneral'); // the results of the ship

var infoEspecies = document.getElementById('infoEspecies');  // button that gets the information of each fish
var resInfoEspecies = document.getElementById('resInfoEspecies'); // the rsults of each fish

var exportarCSV = document.getElementById('exportarCSV');

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

var recognitionGeneral
var recognitionEspecies
var resultadoGeneral = {barco:"", zona:"", pesca: "", tipus:"", dia:"", caixes:"", mostres: "", codi:"", pes: ""}
var resultadoEspecies = {especie:[], codigo:[], talla: []}
var csv = "Codi;Especie;Talla individu;Pes caixa;Caixes;Mostres;Codi mostra;Tipus;Zona;Barca;Tipus pesca;Data;Observacions"
var separadorColumnas
var nombresEspecies
var codigosEspecies
var correccioNumeros 

setFecha()
startRecognition()
exportarCSV.onclick = function () {
        
  crearCSV()

}

function startRecognition() {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      
      var datosFichero = JSON.parse(xmlhttp.responseText);  // contiene todo el json
      // var datosBarco, datosPeces
      
      var datos = { gGeneral: "", gEspecies:"", arrGeneral: "", arrEspecies: ""};  // esto  lo usaré como enums para sustiruir lo que se ha dicho por la forma correcta
      separadorColumnas = datosFichero.separadorColumnas // separador de las columnas () en el primer audio tiene que haber 8 columnas
      nombresEspecies = datosFichero.nombresLatin
      codigosEspecies = datosFichero.nombresLatinID
      correccioNumeros = datosFichero.numeros
    //  console.log("dos" in correccioNumeros.getel)
      // en el segundo 2, y al juntar todas tienen que ser 10
      // Definimos las grámaticas e inicializamos el reconocimiento de voz
      definirGramaticas(datosFichero, datos);
      recognitionGeneral = setRecognition(datos.gGeneral, 'ca-ES')
      recognitionEspecies = setRecognition(datos.gEspecies, 'es-ES') // Las especies siempre serán en castellano

      infoGeneral.onclick = function () {
        setResultadoGeneralNull(resultadoGeneral)
        recognitionGeneral.start();
        var fecha = document.getElementById('date')
        resultadoGeneral.dia = fecha.getAttribute('value')
        //resInfoGeneral.textContent = 'Registrando información del barco...';
      }
      infoEspecies.onclick = function () {
        recognitionEspecies.start();
      }
  
      recognitionGeneral.onresult = function (event) { // hay respuesta válida
        console.log(event.results[event.results.length - 1][0].transcript)
        if (!event.results[event.results.length - 1][0].transcript.includes(" fin")){
          console.log("queda información ")
          return // si no lleva la palabra stop no hace nada y espera a que haya
        }else {
          console.log(event)
          recognitionGeneral.stop();
          event.results[event.results.length - 1][0].transcript = event.results[event.results.length - 1][0].transcript.replace(" fin", "")
        }
      
        for (var i = 0 ; i < event.results.length; i++){
          resInfoGeneral.innerHTML += event.results[i][0].transcript + " "
          //console.log("Info general es: " + resInfoGeneral.innerHTML)
          //speechSynthesis.speak(new SpeechSynthesisUtterance(s));
          //setCodiMuestras()
        }
        //resInfoGeneral.innerHTML  = "barca nou capdepera zona alcudia pesca arrosegament tipus moralla blanca caixes 3 mostres 3 codi 1 pes 16 stop"
        resInfoGeneral.innerHTML = resInfoGeneral.innerHTML.toLowerCase()
        var s = comprobarParseo(resInfoGeneral.innerHTML, 8)
        if (s==null){
          // No se ha podido guardar la información, a lo mejor exportar un documento .txt
          // y a lo mejor leer lo que se ha guardado con sl speak
          
        }else{
          
          //console.log ("Enviamos esto a processGeneral: " + resInfoGeneral.innerHTML)
          s = processGeneral(s, datos.arrBarco)
          //console.log("S es: " +s  + " y esperamos es " + esperamos)
        } 
        setCodiMuestras()
      }

      // añadir aqui el parseo y que se añada directamente al array de resultados 
      // tambien añadir algo que cuando diga stop se haga se apague el reconocimiento 
      // añadir a lo mejor otra palabra para que Marina no tenga que pulsar el botón de especies

      recognitionEspecies.onresult = function (event) { // hay respuesta válida
        if (!event.results[event.results.length -1 ][0].transcript.includes(" fin")){
          return // si no lleva la palabra stop no hace nada y espera a que se registre
        }else {
          recognitionEspecies.stop();
          event.results[event.results.length - 1][0].transcript = event.results[event.results.length - 1][0].transcript.replace(" fin", "")
        }
      
        for (var i = 0 ; i < event.results.length; i++){
          resInfoEspecies.innerHTML += event.results[i][0].transcript + " "
          //console.log("Info general es: " + resInfoGeneral.innerHTML)
          //speechSynthesis.speak(new SpeechSynthesisUtterance(s));
          //setCodiMuestras()
        }
        //resInfoEspecies.innerHTML = "especie scorpaena notata talles 3,5 2 9 19 20 14 especie dorada talla 5,5 9 24 18 16"
        resInfoEspecies.innerHTML = resInfoEspecies.innerHTML.toLowerCase()
        var s = comprobarParseo(resInfoEspecies.innerHTML, 2)
        if (s==null){
          // No se ha podido guardar la información, a lo mejor exportar un documento .txt
          // y a lo mejor leer lo que se ha guardado con sl speak
        }else{
          s = processEspecies(s, datos.arrBarco)
        }
        //speechSynthesis.speak(new SpeechSynthesisUtterance(s));
        //setCodiMuestras()
        //console.log("S es: " +s  + " y esperamos es " + esperamos)
        //  var especies = event.results[0][0].transcript;
        // añadir aqui el parseo y que se añada directamente al array de resultados 
        // tambien añadir algo que cuando diga stop se haga se apague el reconocimiento 
        // añadir a lo mejor otra palabra para que Marina no tenga que pulsar el botón de especies
        //  especies = especies.toLowerCase()
        // resInfoEspecies.innerHTML = especies;
        //processEspecies(especies, datos.arrEspecies)
        //  crearCSV()
        //  }
      }
      recognitionGeneral.onnomatch = function (event) { // si no se ha detectado bien 
        resInfoBarco.textContent = 'No ha respuesta válida del barco';
      }
      recognitionEspecies.onnomatch = function (event) { // si no se ha detectado bien 
        resInfoBarco.textContent = 'No ha respuesta válida del barco';
      }
      recognitionGeneral.onerror = function (event) {
        resInfoBarco.textContent = 'Se ha producido un error: ' + event.error;
      }

      recognitionEspecies.onerror = function (event) {
        resInfoBarco.textContent = 'Se ha producido un error: ' + event.error;
      }
    }
  };
  xmlhttp.open("GET", "datos.json", true);
  xmlhttp.send();
}

function setFecha(){
  var fecha = document.getElementById('date')
  var d = new Date();
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  resultadoGeneral.dia =  d.getFullYear() + '-' + mes + '-' +  dia
  fecha.setAttribute('value', resultadoGeneral.dia)
}

function setCodiMuestras(){
  var element = document.getElementById('selecciona_muestra')
  if (element !== null) {
    element.remove()
  }
  var muestras = document.getElementById('codi')
  for (var i =1; i <= resultadoGeneral.mostres; i++){
    var codigo = document.createElement('option')
    codigo.setAttribute('value', i)
    codigo.setAttribute('id', i)
    codigo.innerHTML = i
    muestras.appendChild(codigo)
  }
  
}

function setResultadoGeneralNull(resultadoGeneral){
  resultadoGeneral.barco=""
  resultadoGeneral.zona=""
  resultadoGeneral.pesca=""
  resultadoGeneral.tipus=""
  resultadoGeneral.caixes=""
  resultadoGeneral.mostres=""
  resultadoGeneral.codi=""
  resultadoGeneral.pes=""
}

function crearCSV(){
  // codi, especie, talla, pes caixa,  pes total (totes les caixes), numero total de caixes, mostres, codi, tipus (moralla), zona, barca, tipusPesca, data, obesrvacions
  
  /*una vez que tengo los datos de lo de especie
  creo una parte del csv 
  Tengo que tener un toggle que me indica que codigo de muestra es
  Un desplegable que elige la fecha (predeterminado el día actual)*/

  var resultado = document.getElementById('guardarCSV');
  // primero recorremos las especies y guardamos la info general con la especie + tallas
  // luego recorremos otra especie con sus tallas y así sucesivamente 
  var select = document.getElementById('codi');
  resultadoGeneral.codigo = select.options[select.selectedIndex].value;
  for (var i = 0; i < resultadoEspecies.especie.length; i++){
    for (var j = 0; i < resultadoEspecies.talla[i].length; j++){
      csv += resultadoEspecies.codigo + ',' + resultadoEspecies.especie[i] + ',' + resultadoEspecies.talla[i][j] + ',' + 
      resultadoGeneral.pes + ',' + resultadoGeneral.caixes + ',' + resultadoGeneral.mostres + ',' + resultadoGeneral.codi +
      ',' + resultadoGeneral.tipus + ',' + resultadoGeneral.zona + ',' + resultadoGeneral.barco + ',' + resultadoGeneral.pesca + ',' + resultadoGeneral.dia + "\n"
      
      var resultadoHTML = '<th>' + resultadoEspecies.codigo + '</th><th>' + resultadoEspecies.especie[i] + '</th><th>' + resultadoEspecies.talla[i][j] + '</th><th>' + 
      resultadoGeneral.pes + '</th><th>' + resultadoGeneral.caixes + '</th><th>' + resultadoGeneral.mostres + '</th><th>' + resultadoGeneral.codi +
      '</th><th>' + resultadoGeneral.tipus + '</th><th>' + resultadoGeneral.zona + '</th><th>' + resultadoGeneral.barco + '</th><th>' + resultadoGeneral.pesca +
      '</th><th>' + resultadoGeneral.dia + '</th>'
      var row = resultado.insertRow()
      row.innerHTML = resultadoHTML
    }
  }
  console.log(csv)
}

function isNum(val){
  return !isNaN(val)
}

// método que parsea la respuesta del barco
function parsear(response, num){
  for (var i = 0; i<separadorColumnas.length; i++){
    if (separadorColumnas[i] === "barca " || separadorColumnas[i] === "barco " || separadorColumnas[i] === "especies " 
    || separadorColumnas[i] === "especie "
    || separadorColumnas[i] === "talla " || separadorColumnas[i] === "talles " || separadorColumnas[i] === "medidas "
    || separadorColumnas[i] === "medides " || separadorColumnas[i] === "tallas "  ){
      response = response.replace(separadorColumnas[i] , "")
    }else{
      response = response.replace(separadorColumnas[i] , ";")
    }
  }
  response = response.split(";")
  console.log(response)
  if (response.length < num){
    return null
  }
  return response;
}

function comprobarParseo(response, num){
  response = parsear(response, num)
  if (response === null){
    return null
  }
  return response
}
function processGeneral(response ) {

  //barco, zona, pesca, tipus, caixes, mostres, codi, pes
  resultadoGeneral.barco = response[0]
  resultadoGeneral.zona = response[1]
  resultadoGeneral.pesca = response[2]
  resultadoGeneral.tipus = response[3]
  resultadoGeneral.caixes = response[4]
  resultadoGeneral.mostres = response[5]
  resultadoGeneral.codi = response[6]
  resultadoGeneral.pes = response[7]

  if (!isNum(response[5])){
    resultadoGeneral.mostres =2
  }
  var s = response[0] + " " +response[1] +  response[2] + " "+ response[3] + " "+ response[4] + " "+ response[5] + " "+ response[6] + " "+ response[7];

  var resultado = document.getElementById('guardInformacionGeneral');
  var row = resultado.insertRow()
  var resultadoHTML = ""
  for (var i =0; i< 8; i++){
    resultadoHTML += "<th>" + response[i] + "</th>"
    //var cell = row.insertCell() 
    //cell.innerHTML = response[i]
  }
  row.innerHTML = resultadoHTML
  return s
}

function processEspecies(response) {
  console.log(response)
  if (resultadoGeneral.codi == ""){
    resultadoGeneral.codi = document.getElementById('selecciona_muestra').innerHTML
  }

  for (var i = 0; i < response.length; i++){
    response[i] = response[i].replace("," , ".")
    response[i] = response[i].replace("-" , ".")
    var aux = response[i].split(" ")
    resultadoEspecies.especie[i] = aux[0]
    var tallas = new Array()
    for (var j = 1; j < aux.length; j++){
      if (!isNum(aux[j])){
        resultadoEspecies.especie[i] += " " + aux[j]
      }else{
        tallas.push(aux[j])
      } 
    }
    resultadoEspecies.talla[i] = tallas
  }
  
  //temporal

  var resultado = document.getElementById('guardInformacionEspecies');
  for (var i = 0; i< resultadoEspecies.especie.length; i++){
    for (var j=0; j<nombresEspecies.length; j++){
      if (resultadoEspecies.especie[i].includes(nombresEspecies[j])){
        resultadoEspecies.codigo[i] =  codigosEspecies[j]
        break;
      }
    }

    for (var j = 0; j < resultadoEspecies.talla[i].length; j++){
      var row = resultado.insertRow()
      resultadoHTML = "<th>" + resultadoEspecies.especie[i] + "</th><th>" + resultadoEspecies.codigo[i] + "</th><th>" + resultadoEspecies.talla[i][j] + "</th>"
      row.innerHTML = resultadoHTML
    }
    
  }
  return response
}

/*Método que corrige la palabra que le pasan:
 - Si la palabra ya está en el diccionario, se devuelve la misma */

// creates the grammar of the data from json
function definirGramaticas(datosFichero, datos, gramaticas) {
  datos.arrGeneral = datosFichero.barcos.concat(datosFichero.zonas.concat(datosFichero.tipoPesca))
  //datos.barco = datos.barco.normalize('NFD')//.replace(/[\u0300-\u036f]/g, ""); // quitar acentos
  datos.arrEspecies = datosFichero.nombresLatin
  //datos.peces = datos.peces.normalize('NFD')//.replace(/[\u0300-\u036f]/g, ""); // quitar acentos
  
  datos.gGeneral = '#JSGF V1.0; grammar infoBarco; public <infoBarco> = ' + datosFichero.barcos.join(' | ') + ' | ' + datosFichero.zonas.join(' | ') + ' | ' + datosFichero.tipoPesca.join(' | ') + ' ;';
  datos.gEspecies = '#JSGF V1.0; grammar infoBarco; public <infoBarco> = ' + datosFichero.nombresLatin.join(' | ') + ' ;';
}

// sets the recognition API 
function setRecognition(gramatica, idioma) {
  var recognition = new SpeechRecognition();
  var speechRecognitionList = new SpeechGrammarList();
  speechRecognitionList.addFromString(gramatica, 1); // el uno indica la importancia respecto a otras gramaticas
  recognition.grammars = speechRecognitionList;
  recognition.continuous = true; // true si el reconocimiento de voz se hace de forma continua
  recognition.lang = idioma // idioma
  recognition.interimResults = false; // true si queremos resultados provisionales, false para resultados finales
  recognition.maxAlternatives = 5; // te muestra las diferentes alternativas para que el usuario pueda elegir, nosotros solo utilizaremos una
  return recognition;
}
