function setCodiMuestras(){
    var select = document.getElementById('codi')
    var element = document.getElementById('selecciona_muestra')
    if (element !== null) {
      element.remove()
    }else {
        while (select.options.length != 0){
            select.remove(0);
        }
    }
    for (var i =1; i <= resultadoGeneral.mostres; i++){
      var codigo = document.createElement('option')
      codigo.setAttribute('value', i)
      codigo.setAttribute('id', i)
      codigo.innerHTML = i
      select.appendChild(codigo)
    }
    resultadoGeneral.observaciones = new Array(resultadoGeneral.mostres)
    for (var i = 0; i < resultadoGeneral.observaciones.length; i++){
      resultadoGeneral.observaciones[i] = ""
    }
    infoEspecies.innerHTML = "Escuchar información especies " + selectCodi.options[selectCodi.selectedIndex].value
    observaciones.innerHTML = "Registrar observaciones de la muestra " + selectCodi.options[selectCodi.selectedIndex].value
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
    var del = ';'
    var select = document.getElementById('codi');
    resultadoGeneral.codi = select.options[select.selectedIndex].value;
    for (var k = 0; k< resultadoTodasLasEspecies.length; k++){
        var codi = k+1
        var aux = resultadoTodasLasEspecies[k]
        for (var i = 0; i < aux.especie.length; i++){
            for (var j = 0; j < aux.talla[i].length; j++){
                var resultadoHTML = '<th>' + aux.codigo[i] + '</th><th>' + aux.especie[i] + '</th><th>' + aux.talla[i][j] + '</th><th>' + 
                resultadoGeneral.pes + '</th><th>' + resultadoGeneral.caixes + '</th><th>' + resultadoGeneral.mostres + '</th><th>' + codi +
                '</th><th>' + resultadoGeneral.tipus + '</th><th>' + resultadoGeneral.zona + '</th><th>' + resultadoGeneral.barco + '</th><th>' + resultadoGeneral.pesca +
                '</th><th>' + resultadoGeneral.dia + '</th><th>' + resultadoGeneral.observaciones[k] + '</th>' 
                var row = tablaResultado.insertRow()
                row.innerHTML = resultadoHTML
                csv += aux.codigo[i] + del + aux.especie[i] + del + aux.talla[i][j] + del + 
                resultadoGeneral.pes + del + resultadoGeneral.caixes + del + resultadoGeneral.mostres + del + codi + del + 
                resultadoGeneral.tipus + del + resultadoGeneral.zona + del + resultadoGeneral.barco + del + resultadoGeneral.pesca + del + 
                resultadoGeneral.dia + del + resultadoGeneral.observaciones[k] +  "\n"
            }
        }
    }
    if(resultadoGeneral.codi != select.options[select.length-1].value){
        resInfoGeneral.value = ""
    }
    resultadoTodasLasEspecies = []
    setResultadoEspeciesNull()
}

function crearCSV(){
    var link = window.document.createElement("a");
    link.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURI(csv));
    link.setAttribute("download", resultadoGeneral.dia + "_" + resultadoGeneral.barco.replaceAll(" ", "_") + "_" + resultadoGeneral.tipus.replaceAll(" ", "_") + ".csv"); 
    link.click();
    resInfoGeneral.value = ""
    setResultadoGeneralNull()
    resInfoEspecies.value = ""
    resInfoObservaciones = ""
}
  
function isNum(val){
    return !isNaN(val)
}
  
function comprobarParseo(response, num){
    response = response.toLowerCase()
    for (var i = 0; i<datos.separadorColumnas.length; i++){
        if ((datos.separadorColumnas[i] === "barca " || datos.separadorColumnas[i] === "barco ") 
        && response.includes(datos.separadorColumnas[i]) ){
            response = response.replaceAll(datos.separadorColumnas[i] , "")
        } else if (response.includes(datos.separadorColumnas[i])){
            response = response.replaceAll(datos.separadorColumnas[i] , ";")
        }
    }
    if(response[response.length-1]==" "){
        response = response.slice(0, response.length - 1);
    }
    response = response.split(";")
    if (response.length != num || !isNum(response[5]) ){
      return null
    }
    return response;
}

function processGeneral(response ) {
    resultadoGeneral.barco = response[0]
    resultadoGeneral.zona = response[1]
    resultadoGeneral.pesca = response[2]
    resultadoGeneral.tipus = response[3]
    resultadoGeneral.caixes = response[4]
    resultadoGeneral.mostres = response[5]
    resultadoGeneral.codi = response[6]
    resultadoGeneral.pes = response[7]
  
    var tabla = document.getElementById('guardInformacionGeneral');
    if (tabla.rows.length > 1){
        tabla.deleteRow(1);
    }
    var row = tabla.insertRow()
    var tablaHTML = ""
    for (var i =0; i< 8; i++){
        tablaHTML += "<th>" + response[i] + "</th>"
    }
    row.innerHTML = tablaHTML
}
 // especie serranus cabrilla 17,5 20,5 especie scorpaena scrofa talles 16 especie serranus cabrilla talla 18  
function processEspecies(response) {
    if (resultadoGeneral.codi == ""){
        resultadoGeneral.codi = document.getElementById('selecciona_muestra').innerHTML
    }
    resultadoTodasLasEspecies[selectCodi.options[selectCodi.selectedIndex].value - 1] = resultadoEspecies
    var tablaEspecies = document.getElementById('guardInformacionEspecies');
    while (tablaEspecies.rows.length > 1){
        tablaEspecies.deleteRow(1);
    }
    resInfoEspecies.value = ""

    var anteriorNumero = false
    var especieAnterior = 0
    response = response.replaceAll(" y medio", ",5")
    response = response.replaceAll("ymedio", ",5")
    response = response.replaceAll(":30", ",5")
    response = response.replaceAll(":", " ")
    response = response.replaceAll("\n" , " ")
    response = response.replaceAll("    " , " ")
    response = response.replaceAll("   " , " ")
    response = response.replaceAll("  " , " ")
    response = response.replaceAll("," , ".")
    if(response[response.length-1]==" "){
        response = response.slice(0, response.length - 1);
    }
    response = response.split(" ")
    var tallas = new Array()
    resultadoEspecies.especie[especieAnterior] = response[0] 
    for (var i = 1; i < response.length; i++){
        if (!isNum(response[i]) && !anteriorNumero ){  // si no es numero y lo anterior no era un número
            resultadoEspecies.especie[especieAnterior] += " " + response[i]
        }else if (!isNum(response[i]) && anteriorNumero){ // no es numero y lo anterior es un numero
            anteriorNumero = false
            especieAnterior++;
            resultadoEspecies.especie[especieAnterior] = response[i] // registramos nueva especie
        }else if(isNum(response[i]) && !anteriorNumero) {// es numero y anterior no era numero
            anteriorNumero = true;
            if (tallas.length > 0){
                resultadoEspecies.talla[especieAnterior-1] = tallas
            }
            var tallas = new Array()
            tallas.push(response[i].replace("." , ","))
            if (i + 1 == response.length){
                resultadoEspecies.talla[especieAnterior] = tallas
            }
        }else if(isNum(response[i]) && anteriorNumero){
            tallas.push(response[i].replace("." , ","))
            if (i + 1 == response.length){
                resultadoEspecies.talla[especieAnterior] = tallas
            }
        }
    }
    var tablaEspecies = document.getElementById('guardInformacionEspecies');
    for (var i = 0; i< resultadoEspecies.especie.length; i++){
        for (var j=0; j<datos.especies.length; j++){
            if (datos.especies[j].includes(resultadoEspecies.especie[i].toLowerCase())){
                resultadoEspecies.especie[i] = datos.especies[j]
                resultadoEspecies.codigo[i] = datos.codigos[j]
            break;
            }
        }
        for (var j = 0; j < resultadoEspecies.talla[i].length; j++){
            var row = tablaEspecies.insertRow()
            resultadoHTML = "<th>" + resultadoEspecies.especie[i] + "</th><th>" + resultadoEspecies.codigo[i] + "</th><th>" + resultadoEspecies.talla[i][j] + "</th>"
            row.innerHTML = resultadoHTML
        }
    }
    resultadoTodasLasEspecies[selectCodi.options[selectCodi.selectedIndex].value - 1] = resultadoEspecies
    return response
}

function definirGramaticas(datosFichero, datos) {
    datos.vocGeneral = datosFichero.barcos.concat(datosFichero.zonas.concat(datosFichero.pesca.concat(datosFichero.tipus)))
    datos.especies = datosFichero.especie
    datos.separadorColumnas = datosFichero.separadorColumnas 
    datos.codigos = datosFichero.codigos
    datos.gramatica = '#JSGF V1.0; grammar vocabulario; public <vocabulario> = ' + 
      datos.especies.join(' | ') + ' | ' + datos.vocGeneral.join(' | ') + ' | ' + datos.separadorColumnas.join(' | ')  + ' ;';
}
  
function handleFileSelect(evt) {
    var files = evt.target.files; 
    playFile(files[0]);
}
  
function playFile(file) {
    if (file.type == 'audio/wav' || file.type == 'audio/mpeg'){
        var freader = new FileReader();
        freader.onload = function(e) {
            player.src = e.target.result;
        };
        freader.onerror = function(e){
            swal ( "No se ha podido leer el archivo" ,"",  "error" )
        }
        freader.readAsDataURL(file);
    }else{ // si no tiene ese formato no tenemos que añadir el archivo
        swal ( "El archivo no tiene el formato adecuado (debe ser wav o mp3)" , "", "error" )
    }
}
  
function playAndRegister() {
    if(player.src != null){
        player.play(); 
    }
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