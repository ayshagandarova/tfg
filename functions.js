
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
    infoEspecies.innerHTML = "Registrar la muestra " + selectCodi.options[selectCodi.selectedIndex].value
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
    var resultado = document.getElementById('guardarCSV');
    // primero recorremos las especies y guardamos la info general con la especie + tallas
    // luego recorremos otra especie con sus tallas y así sucesivamente 
    var del = ';'
    var select = document.getElementById('codi');
    resultadoGeneral.codi = select.options[select.selectedIndex].value;
    for (var i = 0; i < resultadoEspecies.especie.length; i++){
      for (var j = 0; j < resultadoEspecies.talla[i].length; j++){
        var resultadoHTML = '<th>' + resultadoEspecies.codigo[i] + '</th><th>' + resultadoEspecies.especie[i] + '</th><th>' + resultadoEspecies.talla[i][j] + '</th><th>' + 
        resultadoGeneral.pes + '</th><th>' + resultadoGeneral.caixes + '</th><th>' + resultadoGeneral.mostres + '</th><th>' + resultadoGeneral.codi +
        '</th><th>' + resultadoGeneral.tipus + '</th><th>' + resultadoGeneral.zona + '</th><th>' + resultadoGeneral.barco + '</th><th>' + resultadoGeneral.pesca +
        '</th><th>' + resultadoGeneral.dia + '</th><th>' + resultadoGeneral.observaciones[resultadoGeneral.codi - 1] + '</th>' 
        var row = resultado.insertRow()
        row.innerHTML = resultadoHTML
        csv += resultadoEspecies.codigo[i] + del + resultadoEspecies.especie[i] + del + resultadoEspecies.talla[i][j] + del + 
        resultadoGeneral.pes + del + resultadoGeneral.caixes + del + resultadoGeneral.mostres + del + resultadoGeneral.codi + del + 
        resultadoGeneral.tipus + del + resultadoGeneral.zona + del + resultadoGeneral.barco + del + resultadoGeneral.pesca + del + resultadoGeneral.dia 
        + resultadoGeneral.observaciones[resultadoGeneral.codi - 1] + "\n"
      }
    }
    if(resultadoGeneral.codi != select.options[select.length-1].value){
        resInfoGeneral.value = ""
    }
    setResultadoEspeciesNull()
}

function crearCSV(){
    if (resultadoEspecies.especie[0] != null){ 
        rellenarCSV()
    }
    var link = window.document.createElement("a");
    link.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURI(csv));
    link.setAttribute("download", resultadoGeneral.dia + ".csv"); 
    link.click();
    resInfoGeneral.value = ""
    setResultadoGeneralNull()
}
  
function isNum(val){
    return !isNaN(val)
}
  
function parsear(response, num){
    for (var i = 0; i<datos.separadorColumnas.length; i++){
      if (datos.separadorColumnas[i] === "barca " || datos.separadorColumnas[i] === "barco "
      || datos.separadorColumnas[i] === "especies " || datos.separadorColumnas[i] === "especie "
      || datos.separadorColumnas[i] === "medidas " || datos.separadorColumnas[i] === "talla " 
      || datos.separadorColumnas[i] === "talles " || datos.separadorColumnas[i] === "tallas " 
      || datos.separadorColumnas[i] === "medides "  ){
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
  
function handleFileSelect(evt) {//console.log('evt', evt.target.files);
    var files = evt.target.files; // FileList object
    playFile(files[0]);
}
  
  
function playFile(file) {
    if (file.type == 'audio/wav' || file.type == 'audio/mpeg'){
        var freader = new FileReader();
        freader.onload = function(e) {
            player.src = e.target.result;
        };
        freader.onerror = function(e){
            alert("No se ha podido leer el archivo")
        }
        freader.readAsDataURL(file);
    }else{
        alert("El archivo no tiene el formato adecuado (debe ser wav o mp3)")
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
    recognition.maxAlternatives = 5; // te muestra las diferentes alternativas para que el usuario pueda elegir, nosotros solo utilizaremos una
    return recognition;
}