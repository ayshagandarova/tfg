tipoRegistro.addEventListener("change", function() {
    aPartirArchivo = tipoRegistro.options[tipoRegistro.selectedIndex].value == DESDE_ARCHIVO
});
  
player.addEventListener("ended", function(){
    player.currentTime = 0;
    if(btnGeneral){
        infoGeneral.click()
    }else if (btnEspecies){
        infoEspecies.click()
    }else if (btnObservaciones){
        observaciones.click()
    }
    console.log("El audio ha finalizado.");

});

exportarCSV.onclick = function () {
    crearCSV()
}


btnRegistrarGeneral.onclick = function() {  
    setResultadoGeneralNull()
    var s = comprobarParseo(resInfoGeneral.value, 8)
    if (s != null){
        s = processGeneral(s, datos.arrBarco)
        setCodiMuestras()
    }else{
        alert("Ha introducido algo mal, vuela a comprobar la información general.")
    }
}

resInfoGeneral.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        btnRegistrarGeneral.click()
    }
});

btnRegistrarEspecies.onclick = function(){
    setResultadoEspeciesNull()
    var s = comprobarParseo(resInfoEspecies.value, 1)
    if (s != null){
        s = processEspecies(s, datos.arrBarco)
        
    }else{
        alert("Ha introducido algo mal, vuela a comprobar la información de las especies.")
    }
}
resInfoEspecies.addEventListener("keypress", function(event){
    if (event.key === "Enter") {
        btnRegistrarEspecies.click()
    }
});

btnRegistrarObservaciones.onclick = function(){
   
    const select = document.getElementById('codi');
    var codi = select.options[select.selectedIndex].value;
    resultadoGeneral.observaciones[codi - 1] = resInfoObservaciones.value
    var tablaObservaciones = document.getElementById('guardInformacionObservaciones');
    for (var i = 0; i< resultadoEspecies.especie.length; i++){
        for (var j=0; j<datos.especies.length; j++){
            if (resultadoEspecies.especie[i].includes(datos.especies[j])){
            resultadoEspecies.codigo[i] =  datos.codigos[j]
            break;
            }
        }
        for (var j = 0; j < resultadoEspecies.talla[i].length; j++){
            var row = tablaObservaciones.insertRow()
            resultadoHTML = "<th>" + resultadoEspecies.especie[i] + "</th><th>" + resultadoEspecies.codigo[i] 
            + "</th><th>" + resultadoEspecies.talla[i][j] + "</th><th>" + resInfoObservaciones.value + "</th>"
            row.innerHTML = resultadoHTML
        }
    }
}
resInfoObservaciones.addEventListener("keypress", function(event){
    if (event.key === "Enter") {
       btnRegistrarObservaciones.click()
    }
});

selectCodi.addEventListener("change", function() {
    infoEspecies.innerHTML = "Escuchar información especies " + selectCodi.options[selectCodi.selectedIndex].value
    btnRegistrarEspecies.innerHTML = "Registrar la muestra " + selectCodi.options[selectCodi.selectedIndex].value
    observaciones.innerHTML = "Escuchar observación " + selectCodi.options[selectCodi.selectedIndex].value
    btnRegistrarObservaciones.innerHTML = "Registrar la observación " + selectCodi.options[selectCodi.selectedIndex].value
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
        infoGeneral.style.background = naranja;
        infoGeneral.innerHTML ="Escuchando..."
        var fecha = document.getElementById('date')
        resultadoGeneral.dia = fecha.getAttribute('value')
        if (aPartirArchivo){
            playAndRegister()
        }
    }else{ 
        btnGeneral = false;
        recognitionGeneral.stop();
        player.pause()
        infoGeneral.innerHTML = "Escuchar la información general"
        infoGeneral.style.background = amarillo;
    }
}

infoEspecies.onclick = function () {
    if (!btnEspecies){
        btnEspecies = true;
        resInfoEspecies.value = ""
        infoEspecies.innerHTML = "Escuchando..."
        recognitionEspecies.start();
        infoEspecies.style.background = naranja;
        if (aPartirArchivo){
            playAndRegister()
        }
    }else {
        btnEspecies = false;
        recognitionEspecies.stop();
        player.pause()
        infoEspecies.innerHTML = "Escuchar información especies " + selectCodi.options[selectCodi.selectedIndex].value
        infoEspecies.style.background = amarillo;
    }
}

observaciones.onclick = function() {
    if (!btnObservaciones){
        btnObservaciones = true
        observaciones.innerHTML = "Registrando"
        recognitionObservaciones.start();
        observaciones.style.background = naranja;
    }else {
        btnObservaciones = false;
        observaciones.innerHTML = "Escuchar observación " + selectCodi.options[selectCodi.selectedIndex].value
        recognitionObservaciones.stop();
        player.pause()
        observaciones.style.background = amarillo;
    }
}