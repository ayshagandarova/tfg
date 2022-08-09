var infoGeneral = document.getElementById('infoGeneral'); // button that gets the information of the ship, zone and type of fishing
var resInfoGeneral = document.getElementById('resInfoGeneral'); // the results of the ship

var infoEspecies = document.getElementById('infoEspecies');  // button that gets the information of each fish
var resInfoEspecies = document.getElementById('resInfoEspecies'); // the rsults of each fish

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

var diccionario
var recognitionBarco
var recognitionPeces
var resultadoGeneral = {barco:"", zona:"", pesca: "", tipus:"", dia:"", caixes:"", mostres: "", codi:"", pes: ""}
var resultadoEspecies = {especie:[], codigo:[], talla: []}
var csv = "Codi;Especie;Talla individu;Pes caixa;Caixes;Mostres;Codi mostra;Tipus;Zona;Barca;Tipus pesca;Data;Observacions"
var separadorColumnas

setFecha()
startRecognition()

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

function startRecognition() {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      var datosFichero = JSON.parse(xmlhttp.responseText);  // contiene todo el json
      // var datosBarco, datosPeces
      var datos = { gGeneral: "", gEspecies:"", arrGeneral: "", arrEspecies: ""};  // esto  lo usaré como enums para sustiruir lo que se ha dicho por la forma correcta
      separadorColumnas = datosFichero.separadorColumnas // separador de las columnas () en el primer audio tiene que haber 8 columnas
      
      // en el segundo 2, y al juntar todas tienen que ser 10
      // Definimos las grámaticas e inicializamos el reconocimiento de voz
      definirGramaticas(datosFichero, datos);
      recognitionGeneral = setRecognition(datos.gGeneral, 'ca-ES')
      recognitionEspecies = setRecognition(datos.gEspecies, 'es-ES') // Las especies siempre serán en castellano

      // 
      infoGeneral.onclick = function () {
        recognitionGeneral.start();
        var fecha = document.getElementById('date')
        resultadoGeneral.dia = fecha.getAttribute('value')
        //resInfoGeneral.textContent = 'Registrando información del barco...';
      }

      infoEspecies.onclick = function () {
        recognitionEspecies.start();
        resInfoEspecies.textContent = 'Registrando información de las especies...';
      }

     // recognitionGeneral.onresult = function (event) { // hay respuesta válida
        //setResultadoGeneralNull(resultadoGeneral)
       /* resInfoGeneral.innerHTML = ""
        var esperamos = true
        for (var i = 0 ; i < event.results.length; i++){
          resInfoGeneral.innerHTML += event.results[i][0].transcript + " "
          //infoGeneral = infoGeneral.toLowerCase()
          //resInfoGeneral.innerHTML = infoGeneral;
         // console.log("Info general es: " + resInfoGeneral.innerHTML)
         var s = comprobarParseo(resInfoGeneral.innerHTML, 8)
         
          if (s !== null){
            esperamos = false
            //speechSynthesis.speak(new SpeechSynthesisUtterance(s));
          }else{
            
            //setCodiMuestras()
            console.log("esperamos para que nos den más datos")
          }
        }*/
        resInfoGeneral.innerHTML  = "barca nou capdepera zona alcudia pesca arrosegament tipus moralla blanca caixes 3 mostres 3 codi 1 pes 16 stop"
        recognitionGeneral.stop();
        s = comprobarParseo(resInfoGeneral.innerHTML, 8)
        resInfoGeneral.innerHTML = resInfoGeneral.innerHTML.toLowerCase()
        //if (!esperamos ){
          //console.log ("Enviamos esto a processGeneral: " + resInfoGeneral.innerHTML)
          var s = processGeneral(s, datos.arrBarco)
          //console.log("S es: " +s  + " y esperamos es " + esperamos)
          if (resInfoGeneral.innerHTML.includes("stop")){
            recognitionGeneral.stop();
          }
      //  }

        //recognitionGeneral.spealing

         // añadir aqui el parseo y que se añada directamente al array de resultados 
        // tambien añadir algo que cuando diga stop se haga se apague el reconocimiento 
        // añadir a lo mejor otra palabra para que Marina no tenga que pulsar el botón de especies
    //  }

     // recognitionEspecies.onresult = function (event) { // hay respuesta válida
        // limpiar el innerHTML y las variables guardadas
        // 
        resInfoEspecies.innerHTML = "especie scorpaena notata talles 3,5 2 9 19 20 14 especie dorado talla 5,5 9 19 20 14"
        /*var s
        var esperamos = true
        for (var i = 0 ; i < event.results.length; i++){
          resInfoEspecies.innerHTML += event.results[i][0].transcript + " "
          // comprobamos si el parseo se ha acabado o no
          s = comprobarParseo(resInfoEspecies.innerHTML, 2)
          
          if (s !== null){
            esperamos = false
            //speechSynthesis.speak(new SpeechSynthesisUtterance(s));
          }else{
            //setCodiMuestras()
            console.log("esperamos para que nos den más datos")
          }
        }*/
        s = comprobarParseo(resInfoEspecies.innerHTML, 2)
        resInfoEspecies.innerHTML = resInfoEspecies.innerHTML.toLowerCase()
    //    if (!esperamos ){
          s = processEspecies(s, datos.arrBarco)
          //console.log("S es: " +s  + " y esperamos es " + esperamos)
          if (resInfoEspecies.innerHTML.includes("stop")){
            recognitionEspecies.stop();
          }
     //   }
        
      //  var especies = event.results[0][0].transcript;
        // añadir aqui el parseo y que se añada directamente al array de resultados 
        // tambien añadir algo que cuando diga stop se haga se apague el reconocimiento 
        // añadir a lo mejor otra palabra para que Marina no tenga que pulsar el botón de especies
      //  especies = especies.toLowerCase()
       // resInfoEspecies.innerHTML = especies;
       //processEspecies(especies, datos.arrEspecies)
      //  crearCSV()
    //  }

      recognitionGeneral.onnomatch = function (event) { // si no se ha detectado bien 
        resInfoBarco.textContent = 'No ha respuesta válida del barco';
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
    codigo.innerHTML = i
    muestras.appendChild(codigo)
  }
  
}

function crearCSV(){
  // codi, especie, talla, pes caixa,  pes total (totes les caixes), numero total de caixes, mostres, codi, tipus (moralla), zona, barca, tipusPesca, data, obesrvacions
  /*
  una vez que tengo los datos de lo de especie
  creo una parte del csv 
  Tengo que tener un toggle que me indica que codigo de muestra es
  Un desplegable que elige la fecha (predeterminado el día actual)

guardarCSV
  */
 
 var resultado = document.getElementById('guardarCSV');
 for (var i = 0; i< resultadoEspecies.talla.length; i++){
  csv += resultadoEspecies.codigo + ',' + resultadoEspecies.especie + ',' + resultadoEspecies.talla[i] + ',' + 
    resultadoGeneral.pes + ',' + resultadoGeneral.caixes + ',' + resultadoGeneral.mostres + ',' + resultadoGeneral.codi +
    ',' + resultadoGeneral.tipus + ',' + resultadoGeneral.zona + ',' + resultadoGeneral.barco + ',' + resultadoGeneral.presca + ',' + resultadoGeneral.dia 
  var resultadoHTML = '<th>' + resultadoEspecies.codigo + '</th><th>' + resultadoEspecies.especie + '</th><th>' + resultadoEspecies.talla[i] + '</th><th>' + 
    resultadoGeneral.pes + '</th><th>' + resultadoGeneral.caixes + '</th><th>' + resultadoGeneral.mostres + '</th><th>' + resultadoGeneral.codi +
    '</th><th>' + resultadoGeneral.tipus + '</th><th>' + resultadoGeneral.zona + '</th><th>' + resultadoGeneral.barco + '</th><th>' + resultadoGeneral.pesca + 
    '</th><th>' + resultadoGeneral.dia + '</th>'
  var row = resultado.insertRow()
  console.log(resultadoHTML)
  row.innerHTML = resultadoHTML
 }
 
}
function processEspecies(response) {
  console.log(response)
  if (resultadoGeneral.codi == ""){
    resultadoGeneral.codi = document.getElementById('selecciona_muestra').innerHTML
  }

  
  for (var i = 0; i < response.length; i++){
    response[i] = response[i].replace("," , ".")
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

  var resultado = document.getElementById('guardInformacionEspecies');
  for (var i = 0; i< resultadoEspecies.especie.length; i++){
    for (var j = 0; j < resultadoEspecies.talla[i].length; j++){
      var row = resultado.insertRow()
      resultadoHTML = "<th>" + resultadoEspecies.especie[i] + "</th><th>" + resultadoEspecies.talla[i][j] + "</th>"
      row.innerHTML = resultadoHTML
    }
    
  }
  /*
  resultadoEspecies.especie = response[0]
  response = response[1]
  for (var i=1; i<response.length; i++){
    resultadoEspecies.talla.push(response[i]) 
  }
  var resultado = document.getElementById('guardInformacionEspecies');
  for (var i = 0; i< response.length; i++){
    var row = resultado.insertRow()
    resultadoHTML = "<th>" + resultadoEspecies.especie + "</th><th>" + response[i] + "</th>"
    row.innerHTML = resultadoHTML
  }*/
  return response
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
function processGeneral(response) {

  //barco, zona, pesca, tipus, caixes, mostres, codi, pes
  resultadoGeneral.barco = response[0]
  resultadoGeneral.zona = response[1]
  resultadoGeneral.pesca = response[2]
  resultadoGeneral.tipus = response[3]
  resultadoGeneral.caixes = response[4]
  resultadoGeneral.mostres = response[5]
  resultadoGeneral.codi = response[6]
  resultadoGeneral.pes = response[7]

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


/*
Método que corrige la palabra que le pasan:
 - Si la palabra ya está en el diccionario, se devuelve la misma
 - 
*/

// creates the grammar of the data from json
function definirGramaticas(datosFichero, datos, gramaticas) {

  /* eliminar
    var tipos_peces = ['trigloporus lastoviza', 'scorpaena notata', 'scorpaena scrofa', 'trachinus draco', 'serranus cabrilla', 'chelidonichthys cuculus', 'lepidotrigla cavillone', 'scorpaena porcus', 'lepidotrigla dieuzeidei', 'uranoscoper scaber', 'blennius ocellaris', 'trachinus radiatus', 'zeus faber', 'diplodus annularis', 'symphodus tinca', 'spicara smaris', 'microphis ocellatus', 'citharus linguatula', 'trisopterus minuta', 'pedaç', 'solea solea', 'chelidonichthys lucerna', 'mullus surmuletus', 'dorada', 'microglanis variegatus', 'trachurus mediterraneus', 'lepidorhombus boscii', 'sphyraena sphyraena', 'cepola macrophthalma', 'synchiroupus phaeton', 'solea spp', 'scorpaena elongata', 'merluccius merluccius', 'peristedion cataphractum', 'boops boops', 'pagellus erythrinus', 'dentex dentex', 'physcis blennoides', 'spondyliosoma cantharus', 'mullus barbatus', 'trigla lyra', 'aspitrigla cuculus', 'trachurus trachurus', 'sparus aurata', 'phycis phycis', 'larus viridis'];
    // var tipos_peces_count = [1664, 1068, 904, 685, 570, 506, 466, 122, 111, 107, 87, 81, 23, 22, 19, 18, 13, 12, 12, 9, 8, 7, 6, 4, 4, 3, 3, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1];
    //var g_tipos_peces = '#JSGF V2.0; grammar tipos_peces; public <tipo_pez> = ' + datosFichero.nombresLatin.join(' | ') + ' ;';

    //var barcos = ['es refalar', 'punta de vent', 'myri', 'antonia munar', 'antonia munar ii', 'marjupe segundo', 'balear segundo', 'nou capdepera', 'penyal roig', 'villa sóller', 'balear segunda', 'marisita segunda', 'balear ii', 'refalar', 'marisita ii', 'punta des vent', 'joven mirmer', 'es penyal roig', 'cap vermell', 'cap de reig', 'sito primero', 'nou patrash', 'es verges', 'tomalu', 'na clara', 'agila', 'joven daniel segundo', 'señora de los ángeles', 'felipe', 'joan tix', 'soleret', 'zorro', 'solaret', 'es cubanos', 'nou dos joans', 'alba', 'virgen del carmen ii', 'cala bona ii', 'flor del mal', 'hermanos gonzález', 'sparus', 'marjupe primero', 'rosita', 'jaume', 'latxa', 'kuripo', 'germans torres', 'juma iii', 'juma tercero', 'na rosa', 'solaes', 'katy', 'calypso', 'jaume iii', 'toni cuarto', 'petit fuat', 'marcos tercero', 'dos joans', 'raconet', 'señora de los angeles', "l'auba segundo", 'virgen del carmen', 'goga', 'nova princesa', 'escem', 'marcos', 'capdevanter', 'nou viladeia', 'boga', 'tres hermanos', 'jaimito iv', 'nou viladellà', 'roca i', "l'avançada", 'tizona', 'nou vistalegra', 'nou vistalegre', 'la vençada', 'danagus'];
    // var barcos_count = [1134, 422, 391, 333, 317, 314, 303, 287, 269, 247, 240, 218, 205, 203, 197, 170, 169, 161, 140, 81, 50, 48, 47, 43, 37, 36, 35, 33, 28, 24, 24, 23, 23, 22, 18, 18, 17, 15, 15, 15, 14, 13, 12, 12, 12, 11, 10, 9, 9, 8, 8, 7, 7, 7, 7, 6, 6, 5, 5, 4, 4, 4, 4, 4, 4, 3, 3, 3, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1];
    //var g_barcos = '#JSGF V1.0; grammar tipos_peces; public <barco> = ' + datosFichero.barcos.join(' | ') + ' ;';

    //var zonas = ['santanyí', 'sóller', 'cala rajada', 'alcudia', 'portocolom', 'alcúdia', 'palma', 'colonia de sant jordi', 'portocristo', 'pollença', 'andratx', 'colònia de sant jordi', 'portvocolom', 'calarajada'];
    //var zonas_count = [2839, 917, 704, 619, 556, 423, 105, 104, 93, 92, 60, 45, 23, 8];
    //var g_zona = '#JSGF V1.0; grammar tipos_peces; public <zona> = ' + datosFichero.zonas.join(' | ') + ' ;';

    //zonas = zonas.normalize('NFD').replace(/[\u0300-\u036f]/g, ""); // quitar acentos
    //var tipusPesca = ['arrossegament', 'art menor'];
    //var tipus_count = [5768, 822]
    //var g_tipus = '#JSGF V1.0; grammar tipos_peces; public <tipo> = ' + datosFichero.tipoPesca.join(' | ') + ' ;';

    //var tipus_algo = ['morralla vermella', 'morrallí', 'morralla', 'cap-roig', 'morralla blanca', 'mescla cabrachos, escaparotas, rascacios, escorporas o cabra...', 'aranyes', 'peix de sopa', 'mescla escorpora, rascacio', 'cap-roig', 'serrans', 'variat', 'rata', 'mescladís', 'escorpores', 'varietat escòrpores', 'aranya'];
    //var tipus_algo_count = [2975, 1322, 933, 395, 304, 183, 121, 99, 70, 66, 42, 35, 15, 12, 10, 7, 1];
    //var g_tipus_algo = '#JSGF V1.0; grammar tipos_peces; public <tipus_algo> = ' + datosFichero.peces.join(' | ') + ' ;';
  
    datosBarco = datosFichero.barcos.concat(datosFichero.zonas.concat(datosFichero.tipoPesca))
    datosBarco = datosBarco.normalize('NFD')//.replace(/[\u0300-\u036f]/g, ""); // quitar acentos

    datosPeces = datosFichero.nombresLatin.concat(datosFichero.peces)
    datosPeces = datosPeces.normalize('NFD')//.replace(/[\u0300-\u036f]/g, ""); // quitar acentos
  */

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
  recognition.maxAlternatives = 1; // te muestra las diferentes alternativas para que el usuario pueda elegir, nosotros solo utilizaremos una
  return recognition;
}
