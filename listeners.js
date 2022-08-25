tipoRegistro.addEventListener("change", function() {
    aPartirArchivo = tipoRegistro.options[tipoRegistro.selectedIndex].value == DESDE_ARCHIVO
});
  
player.addEventListener("ended", function(){
    player.currentTime = 0;
    if(btnGeneral){
        recognitionGeneral.stop()
    }else if (btnEspecies){
        recognitionEspecies.stop()
    }else if (btnObservaciones){
        recognitionObservaciones.stop()
    }
    console.log("El audio ha finalizado.");
});

exportarCSV.onclick = function () {
    rellenarCSV()
    crearCSV()
}

selectCodi.addEventListener("change", function() {
    infoEspecies.innerHTML = "Registrar la muestra " + selectCodi.options[selectCodi.selectedIndex].value
    observaciones.innerHTML = "Registrar observaciones de la muestra " + selectCodi.options[selectCodi.selectedIndex].value
});

document.getElementById('audioGeneral').addEventListener('change', handleFileSelect, false);
document.getElementById('audioEspecies').addEventListener('change', handleFileSelect, false);

infoGeneral.onclick = function () {
    if (aPartirArchivo){
        if(player.src == ""){
            alert("No se ha adjuntado ningun archivo.")
            return
        }
    }
    if (resInfoGeneral.value != "" && !btnGeneral && !confirm("No ha guardado todos los datos del muestreo." 
    + "\n" + resultadoGeneral.codi + " muestras de " + resultadoGeneral.muestras + " completadas." 
    + "\n¿Quiere guardar solo " + resultadoGeneral.codi  + " número de muestras y registrar nueva información general?")){
        return
    }
    if (!btnGeneral){ 
        btnGeneral = true
        resInfoGeneral.value = ""
        setResultadoGeneralNull()
        recognitionGeneral.start();
        infoGeneral.innerHTML ="Registrando..."
        var fecha = document.getElementById('date')
        resultadoGeneral.dia = fecha.getAttribute('value')
        if (aPartirArchivo){
            playAndRegister()
        }
    }else{ 
        btnGeneral = false;
        recognitionGeneral.stop();
        infoGeneral.innerHTML = "Registrar información general"
        infoGeneral.style.background = amarillo;
    }
}

infoEspecies.onclick = function () {
    if (!btnEspecies){
        btnEspecies = true;
        resInfoEspecies.value = ""
        infoEspecies.innerHTML = "Registrando..."
        recognitionEspecies.start();
        if (aPartirArchivo){
            playAndRegister()
        }
    }else {
        btnEspecies = false;
        recognitionEspecies.stop();
        infoEspecies.innerHTML = "Registrar la muestra " + selectCodi.options[selectCodi.selectedIndex].value
        infoEspecies.style.background = amarillo;
    }
}

observaciones.onclick = function() {
    if (!btnObservaciones){
        btnObservaciones = true
        observaciones.innerHTML = "Registrando"
        recognitionObservaciones.start();
    }else {
        btnObservaciones = false;
        observaciones.innerHTML = "Registrar observaciones de la muestra " + selectCodi.options[selectCodi.selectedIndex].value
        recognitionObservaciones.stop();
        observaciones.style.background = amarillo;
    }
}