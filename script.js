var infoGeneral = document.getElementById('infoGeneral'); // button that gets the information of the ship, zone and type of fishing
var resInfoGeneral = document.getElementById('resInfoGeneral'); // the results of the ship

var infoEspecies = document.getElementById('infoEspecies');  // button that gets the information of each fish
var resInfoEspecies = document.getElementById('resInfoEspecies'); // the rsults of each fish

var observaciones = document.getElementById('observaciones')

// color de los botones:
infoGeneral.style.background = 'rgb(237, 202, 90)'
infoEspecies.style.background = 'rgb(237, 202, 90)'
observaciones.style.background = 'rgb(237, 202, 90)'

var exportarCSV = document.getElementById('exportarCSV');

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

var recognitionGeneral
var recognitionEspecies
var recognitionObservaciones
var resultadoGeneral = {barco:"", zona:"", pesca: "", tipus:"", dia:"", caixes:"", mostres: "", codi:"", pes: "", observaciones: []}
var resultadoEspecies = {especie:[], codigo:[], talla: [] }
var csv = "Codi;Especie;Talla individu;Pes caixa;Caixes;Mostres;Codi mostra;Tipus;Zona;Barca;Tipus pesca;Data;Observacions\n"
var datos = { gGeneral: "", gEspecies:"", vocGeneral: [], especies: [], codigos: [], separadorColumnas: []};

setFecha()
startRecognition()
exportarCSV.onclick = function () {
  console.log("helloooou")
  rellenarCSV()
  crearCSV()
}

function startRecognition() {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      
      var datosFichero = JSON.parse(xmlhttp.responseText);  // contiene todo el json
      definirGramaticas(datosFichero, datos);
      
      recognitionGeneral = setRecognition(datos.gramatica, 'ca-ES')
      recognitionEspecies = setRecognition(datos.gramatica, 'ca-ES') // Las especies siempre serán en castellano
      recognitionObservaciones = setRecognition(datos.gGeneral, 'ca-ES') //añadir otros tambien
      infoGeneral.onclick = function () {
        if (infoGeneral.style.background == 'rgb(237, 202, 90)'){
          infoGeneral.style.background = 'rgb(227, 94, 27)';
          setResultadoGeneralNull()
          recognitionGeneral.start();
          var fecha = document.getElementById('date')
          resultadoGeneral.dia = fecha.getAttribute('value')
        }else{
          recognitionGeneral.stop();
          infoGeneral.style.background = 'rgb(237, 202, 90)';
        }
        
        //resInfoGeneral.textContent = 'Registrando información del barco...';
      }
      infoEspecies.onclick = function () {
        if ( infoEspecies.style.background == 'rgb(237, 202, 90)'){
          infoEspecies.style.background = 'rgb(227, 94, 27)';
          recognitionEspecies.start();
        }else {
          recognitionEspecies.stop();
          infoEspecies.style.background = 'rgb(237, 202, 90)';
        }
        
      }

      observaciones.onclick = function() {
        if ( infoEspecies.style.background == 'rgb(237, 202, 90)'){
          observaciones.style.background = 'rgb(227, 94, 27)';
          recognitionObservaciones.start();
        }else {
          recognitionObservaciones.stop();
          observaciones.style.background = 'rgb(237, 202, 90)';
        }
      }
  
      recognitionGeneral.onresult = function (event) { // hay respuesta válida
        if (!event.results[event.results.length - 1][0].transcript.includes(" final")){
          console.log("queda información ")
          return // si no lleva la palabra stop no hace nada y espera a que haya
        }else {
          recognitionGeneral.stop();
          infoGeneral.style.background = 'rgb(237, 202, 90)';
        }
      
        // comrpobamos las 5 opciones:
        var prova 
        console.log(event.results)
        for (var i = 0 ; i <event.results[i].length; i++){ // comprueba los diferentes onmatch
          for (var j = 0; j < event.results.length; j++){ // comprueba toda la oracion 
            prova = event.results[i][j].transcript + " "
            if (prova.includes(" final")){
              prova = prova.replace(" final", "");
            }
          }
          prova = prova.toLowerCase()
          var s = comprobarParseo(prova, 8)
          console.log(s)
          if (s != null){
            resInfoGeneral.innerHTML = prova
            s = processGeneral(s, datos.arrBarco)
            setCodiMuestras()
            recognitionGeneral.stop()
            infoGeneral.style.background = 'rgb(237, 202, 90)';
            break;
          }
          prova = ""
          //speechSynthesis.speak(new SpeechSynthesisUtterance(s));
        }
      //  resInfoGeneral.innerHTML  = "barca nou capdepera zona alcudia pesca arrosegament tipus moralla blanca caixes 3 mostres 3 codi 1 pes 16"
      }

      // añadir aqui el parseo y que se añada directamente al array de resultados 
      // tambien añadir algo que cuando diga stop se haga se apague el reconocimiento 
      // añadir a lo mejor otra palabra para que Marina no tenga que pulsar el botón de especies

      recognitionEspecies.onresult = function (event) { // hay respuesta válida
       if (!event.results[event.results.length -1 ][0].transcript.includes(" final")){
          return // si no lleva la palabra stop no hace nada y espera a que se registre
        }else {
          if (resultadoEspecies.especie[0] != null){ 
            rellenarCSV()
          }
          recognitionEspecies.stop();
          infoEspecies.style.background = 'rgb(237, 202, 90)';
          event.results[event.results.length - 1][0].transcript = event.results[event.results.length - 1][0].transcript.replace(" final", "")
        }
      
        for (var i = 0 ; i < event.results.length; i++){
          resInfoEspecies.innerHTML += event.results[i][0].transcript + " "
          //speechSynthesis.speak(new SpeechSynthesisUtterance(s));        
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

        // añadir aqui el parseo y que se añada directamente al array de resultados 
        // tambien añadir algo que cuando diga stop se haga se apague el reconocimiento 
        // añadir a lo mejor otra palabra para que Marina no tenga que pulsar el botón de especies
        recognitionEspecies.stop()
        infoEspecies.style.background = 'rgb(237, 202, 90)';
      }
      recognitionObservaciones.onresult = function (event) {
        var obser = ""
        if (!event.results[event.results.length - 1][0].transcript.includes(" final")){
          console.log("queda información ")
          return // si no lleva la palabra stop no hace nada y espera a que haya
        }else {
          recognitionObservaciones.stop();
          observaciones.style.background = 'rgb(237, 202, 90)';
          event.results[event.results.length - 1][0].transcript = event.results[event.results.length - 1][0].transcript.replace(" final", "")
        }

        for (var i = 0 ; i < event.results.length; i++){
          obser += event.results[i][0].transcript + " "
        }

        var select = document.getElementById('codi');
        var codi = select.options[select.selectedIndex].value;
        console.log(obser)
        resultadoGeneral.observaciones[codi] = obser
        observaciones.style.background = 'rgb(237, 202, 90)';
      }
   /*   recognitionGeneral.onnomatch = function (event) { // si no se ha detectado bien 
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
      }*/
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
  resultadoGeneral.observaciones = new Array(resultadoGeneral.mostres)
  for (var i = 0; i < resultadoGeneral.observaciones.length; i++){
    resultadoGeneral.observaciones[i] = ""
  }
}

function setResultadoGeneralNull(){
  resultadoGeneral.barco=""
  resultadoGeneral.zona=""
  resultadoGeneral.pesca=""
  resultadoGeneral.tipus=""
  resultadoGeneral.caixes=""
  resultadoGeneral.mostres=""
  resultadoGeneral.codi=""
  resultadoGeneral.pes=""
  resultadoGeneral.observaciones = []
}

function setResultadoEspeciesNull(){
  resultadoEspecies.codigo = []
  resultadoEspecies.especie = []
  resultadoEspecies.talla = []
}

function rellenarCSV(){
  var resultado = document.getElementById('guardarCSV');
  // primero recorremos las especies y guardamos la info general con la especie + tallas
  // luego recorremos otra especie con sus tallas y así sucesivamente 
  var del = ';'
  var select = document.getElementById('codi');
  resultadoGeneral.codi = select.options[select.selectedIndex].value;
  console.log(resultadoEspecies.especie)
  console.log(resultadoEspecies.talla)
  for (var i = 0; i < resultadoEspecies.especie.length; i++){
    for (var j = 0; j < resultadoEspecies.talla[i].length; j++){
      var resultadoHTML = '<th>' + resultadoEspecies.codigo[i] + '</th><th>' + resultadoEspecies.especie[i] + '</th><th>' + resultadoEspecies.talla[i][j] + '</th><th>' + 
      resultadoGeneral.pes + '</th><th>' + resultadoGeneral.caixes + '</th><th>' + resultadoGeneral.mostres + '</th><th>' + resultadoGeneral.codi +
      '</th><th>' + resultadoGeneral.tipus + '</th><th>' + resultadoGeneral.zona + '</th><th>' + resultadoGeneral.barco + '</th><th>' + resultadoGeneral.pesca +
      '</th><th>' + resultadoGeneral.dia + '</th><th>' + resultadoGeneral.observaciones[resultadoGeneral.codi - 1] + '</th>' 
      var row = resultado.insertRow()
      row.innerHTML = resultadoHTML
      console.log(csv)
      console.log(resultadoHTML)
      csv += resultadoEspecies.codigo[i] + del + resultadoEspecies.especie[i] + del + resultadoEspecies.talla[i][j] + del + 
      resultadoGeneral.pes + del + resultadoGeneral.caixes + del + resultadoGeneral.mostres + del + resultadoGeneral.codi + del + 
      resultadoGeneral.tipus + del + resultadoGeneral.zona + del + resultadoGeneral.barco + del + resultadoGeneral.pesca + del + resultadoGeneral.dia 
      + resultadoGeneral.observaciones[resultadoGeneral.codi - 1] + "\n"
    }
  }
  
  setResultadoEspeciesNull()
}

function crearCSV(){
  // codi, especie, talla, pes caixa,  pes total (totes les caixes), numero total de caixes, mostres, codi, tipus (moralla), zona, barca, tipusPesca, data, obesrvacions
  
  /*una vez que tengo los datos de lo de especie
  creo una parte del csv 
  Tengo que tener un toggle que me indica que codigo de muestra es
  Un desplegable que elige la fecha (predeterminado el día actual)*/
  
  var link = window.document.createElement("a");
  link.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURI(csv));
  link.setAttribute("download", resultadoGeneral.dia + ".csv");
  link.click();
}

function isNum(val){
  return !isNaN(val)
}

// método que parsea la respuesta del barco
function parsear(response, num){
  for (var i = 0; i<datos.separadorColumnas.length; i++){
    if (datos.separadorColumnas[i] === "barca " || datos.separadorColumnas[i] === "barco " || datos.separadorColumnas[i] === "especies " 
    || datos.separadorColumnas[i] === "especie "
    || datos.separadorColumnas[i] === "talla " || datos.separadorColumnas[i] === "talles " || datos.separadorColumnas[i] === "medidas "
    || datos.separadorColumnas[i] === "medides " || datos.separadorColumnas[i] === "tallas "  ){
      response = response.replace(datos.separadorColumnas[i] , "")
    }else{
      response = response.replace(datos.separadorColumnas[i] , ";")
    }
  }
  response = response.split(";")
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
        tallas.push(aux[j].replace("." , ","))
      } 
    }
    resultadoEspecies.talla[i] = tallas
  }
  
  //temporal

  var resultado = document.getElementById('guardInformacionEspecies');
  for (var i = 0; i< resultadoEspecies.especie.length; i++){
    for (var j=0; j<datos.especies.length; j++){
      if (resultadoEspecies.especie[i].includes(datos.especies[j])){
        resultadoEspecies.codigo[i] =  datos.codigos[j]
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
function definirGramaticas(datosFichero, datos) {
  datos.vocGeneral = datosFichero.barcos.concat(datosFichero.zonas.concat(datosFichero.pesca.concat(datosFichero.tipus)))
  //datos.barco = datos.barco.normalize('NFD')//.replace(/[\u0300-\u036f]/g, ""); // quitar acentos
  datos.especies = datosFichero.especie
  datos.separadorColumnas = datosFichero.separadorColumnas // separador de las columnas () en el primer audio tiene que haber 8 columnas
  datos.codigos = datosFichero.codigos
  //correccioNumeros = datosFichero.numeros
  //datos.peces = datos.peces.normalize('NFD')//.replace(/[\u0300-\u036f]/g, ""); // quitar acentos
 // datos.gramatica = '#JSGF V1.0; grammar infoGeneral; public <infoGeneral> = ' + datos.arrGeneral.join(' | ') + ';';
  datos.gramatica = '#JSGF V1.0; grammar vocabulario; public <vocabulario> = ' + 
    datos.especies.join(' | ') + ' | ' + datos.vocGeneral.join(' | ') + ' | ' + datos.separadorColumnas.join(' | ')  + 
    ' | ' + datosFichero.numeros.join(' | ')  + ' ;';
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
