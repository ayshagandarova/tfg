
setFecha()
var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function () {
  if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
    
    // Obtenemos los datos del archivo datos.json, definimos las grámaticas y creamos los objetos de reconocimiento de texto
    var datosFichero = JSON.parse(xmlhttp.responseText);  // contiene todo el json
    definirGramaticas(datosFichero, datos);
    
    recognitionGeneral = setRecognition(datos.gramatica, 'ca-ES')
    recognitionEspecies = setRecognition(datos.gramatica, 'es-ES') // Las especies siempre serán en castellano
    recognitionObservaciones = setRecognition(datos.gGeneral, 'ca-ES') 

    resInfoGeneral.addEventListener("keypress", function(event) {
      if (event.key === "Enter") {
        // event.preventDefault();
        setResultadoGeneralNull()
        console.log(resInfoGeneral.value)
        resInfoGeneral.value = resInfoGeneral.value.toLowerCase()
        var s = comprobarParseo(resInfoGeneral.value, 8)
        if (s != null){
          console.log(s)
          s = processGeneral(s, datos.arrBarco)
          setCodiMuestras()
        }else{
          alert("Ha introducio algo mal, vuela a comprobar la información general.")
        }
      }
    });

    resInfoEspecies.addEventListener("keypress", function(event){
      if (event.key === "Enter") {
        // event.preventDefault();
          setResultadoEspeciesNull()
          resInfoEspecies.value = resInfoEspecies.value.toLowerCase()
          var s = comprobarParseo(resInfoEspecies.value, 2)
          console.log(s)
          if (s != null){
            s = processEspecies(s, datos.arrBarco)
            setCodiMuestras()
          }else{
            alert("Ha introducio algo mal, vuela a comprobar la información de las especies.")
          }
        }
    });
    recognitionGeneral.onresult = function (event) { // hay respuesta válida
      if (!event.results[event.results.length - 1][0].transcript.includes(" final")){
        console.log("queda información ")
        resInfoGeneral.value +=  event.results[event.results.length - 1][0].transcript
        return // si no lleva la palabra stop no hace nada y espera a que haya
      }else {
        recognitionGeneral.stop();
        resInfoGeneral.value += event.results[event.results.length - 1][0].transcript.replace(" final", "")
        infoGeneral.style.background = amarillo;
      }
      // comrpobamos las 5 opciones:
      
      /*for (var i = 0 ; i < event.results.length; i++){ // comprueba los diferentes onmatch
        prova += event.results[i][0].transcript + " " 
      }*/
      resInfoGeneral.value = resInfoGeneral.value
      var s = comprobarParseo(resInfoGeneral.value, 8)
      if (s==null){
        speechSynthesis.speak(new SpeechSynthesisUtterance("No se han podido registrar todas las columnas. Compruebe el texto"));
      }else{
        s = processGeneral(s, datos.arrBarco)
        setCodiMuestras()
        recognitionGeneral.stop()
        infoGeneral.style.background = amarillo;
      }
    }

    recognitionEspecies.onresult = function (event) { // hay respuesta válida
      if (!event.results[event.results.length -1 ][0].transcript.includes(" final")  ){
        resInfoEspecies.value += event.results[event.results.length -1 ][0].transcript + " "
        return // si no lleva la palabra stop no hace nada y espera a que se registre
      }else {
        if (resultadoEspecies.especie[0] != null){ 
          console.log("tengo especies de antes, las añado al csv")
          rellenarCSV()
        }
        recognitionEspecies.stop();
        console.log(player)
        resInfoEspecies.value += event.results[event.results.length - 1][0].transcript.replace(" final", "")
        infoEspecies.style.background = amarillo;
      }
      resInfoEspecies.value = resInfoEspecies.value.toLowerCase()
      var s = comprobarParseo(resInfoEspecies.value, 2)
      if (s!= null){
        s = processEspecies(s, datos.arrBarco)
      }
      recognitionEspecies.stop()
      infoEspecies.style.background = amarillo;
    }
    recognitionObservaciones.onresult = function (event) {
      var obser = ""
      if (!event.results[event.results.length - 1][0].transcript.includes(" final")){
        console.log("queda información ")
        return // si no lleva la palabra stop no hace nada y espera a que haya
      }else {
        recognitionObservaciones.stop();
        observaciones.style.background = amarillo;
        event.results[event.results.length - 1][0].transcript = event.results[event.results.length - 1][0].transcript.replace(" final", "")
      }

      for (var i = 0 ; i < event.results.length; i++){
        obser += event.results[i][0].transcript + " "
      }

      var select = document.getElementById('codi');
      var codi = select.options[select.selectedIndex].value;
      resultadoGeneral.observaciones[codi] = obser
      observaciones.style.background = amarillo;
    }

    recognitionGeneral.onerror = function (event) {
      resInfoBarco.textContent = 'Se ha producido un error, recargue la página: ' + event.error;
    }
    recognitionEspecies.onerror = function (event) {
      resInfoBarco.textContent = 'Se ha producido un error, recargue la página: ' + event.error;
    }
  }
};
xmlhttp.open("GET", "datos.json", true);
xmlhttp.send();


