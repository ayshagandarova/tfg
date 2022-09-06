var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function () {
  if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
    
    // Obtenemos los datos del archivo datos.json, definimos las grámaticas y creamos los objetos de reconocimiento de texto
    var datosFichero = JSON.parse(xmlhttp.responseText);  // contiene todo el json
    definirGramaticas(datosFichero, datos);
    
    recognitionGeneral = setRecognition(datos.gramatica, 'ca-ES')
    recognitionEspecies = setRecognition(datos.gramatica, 'es-ES') // Las especies siempre serán en castellano
    recognitionObservaciones = setRecognition(datos.gGeneral, 'ca-ES') 
    
    recognitionGeneral.onresult = function (event) { 
      if (!event.results[event.results.length - 1][0].transcript.includes(" final")){
        resInfoGeneral.value +=  event.results[event.results.length - 1][0].transcript
        return
      }
      recognitionGeneral.stop()
      resInfoGeneral.value += event.results[event.results.length - 1][0].transcript.replace(" final", "")
      infoGeneral.style.background = amarillo;
      
    }

    recognitionEspecies.onresult = function (event) { // hay respuesta válida
      if (!event.results[event.results.length -1 ][0].transcript.includes(" final")  ){
        resInfoEspecies.value += event.results[event.results.length -1 ][0].transcript + " "
        return 
      }
      if (resultadoEspecies.especie[0] != null){ 
        rellenarCSV()
      }
      recognitionEspecies.stop();
      resInfoEspecies.value += event.results[event.results.length - 1][0].transcript.replace(" final", "")
      infoEspecies.style.background = amarillo;
      recognitionEspecies.stop()
    }

    recognitionObservaciones.onresult = function (event) {
      if (!event.results[event.results.length - 1][0].transcript.includes(" final")){
        resInfoObservaciones.value += event.results[event.results.length -1 ][0].transcript + " "
        return 
      }
      resInfoObservaciones.value += event.results[event.results.length - 1][0].transcript.replace(" final", "")
      recognitionObservaciones.stop();
      observaciones.style.background = amarillo;
    }

    recognitionGeneral.onerror = function (event) {
      swal ( "Se ha producido un error, recargue la página: " + event.error,"", "error" )
    }
    recognitionEspecies.onerror = function (event) {
      swal ( "Se ha producido un error, recargue la página: " + event.error,"", "error" )
    }
    recognitionObservaciones.onerror = function (event) {
      swal ( "Se ha producido un error, recargue la página: " + event.error,"", "error" )
    }
  }
};
xmlhttp.open("GET", "datos.json", true);
xmlhttp.send();


