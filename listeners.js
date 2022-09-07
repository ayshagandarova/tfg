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
    rellenarCSV()
    crearCSV()
}


btnRegistrarGeneral.onclick = function() {  
    setResultadoGeneralNull()
    var s = comprobarParseo(resInfoGeneral.value, 8)
    if (s != null){
        processGeneral(s, datos.arrBarco)
        setCodiMuestras()
    }else if (resInfoGeneral.value == ""){
        swal ( "El resultado esta vacío.","", "error" )
    }else{
        swal ( "Ha introducido algo mal, vuela a comprobar la información general." , "",  "error" )
    }
}

resInfoGeneral.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        btnRegistrarGeneral.click()
    }
});

btnRegistrarEspecies.onclick = function(){
    if(resInfoEspecies.value != ""){
        setResultadoEspeciesNull()
        s = processEspecies(resInfoEspecies.value, datos.arrBarco)
    }else {
        swal ( "El resultado esta vacío.","", "error" )
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
    infoEspecies.innerHTML = "Escuchar muestra " + selectCodi.options[selectCodi.selectedIndex].value
    btnRegistrarEspecies.innerHTML = "Registrar muestra " + selectCodi.options[selectCodi.selectedIndex].value
    observaciones.innerHTML = "Escuchar muestra " + selectCodi.options[selectCodi.selectedIndex].value
    btnRegistrarObservaciones.innerHTML = "Registrar muestra " + selectCodi.options[selectCodi.selectedIndex].value
    
    var tablaEspecies = document.getElementById('guardInformacionEspecies');
    while (tablaEspecies.rows.length > 1){
        tablaEspecies.deleteRow(1);
    }
    resInfoEspecies.value = ""
    
    var tablaObser = document.getElementById('guardInformacionObservaciones');
    while (tablaObser.rows.length > 1){
        tablaObser.deleteRow(1);
    }
    resInfoObservaciones.value = ""
});

fecha.addEventListener("change", function(){
    resultadoGeneral.dia = fecha.value
    
})

document.getElementById('audioGeneral').addEventListener('change', handleFileSelect, false);
document.getElementById('audioEspecies').addEventListener('change', handleFileSelect, false);
document.getElementById('audioObservaciones').addEventListener('change', handleFileSelect, false);

infoGeneral.onclick = function () {
    var tablaEspecies = document.getElementById('guardarCSV');
    while (tablaEspecies.rows.length > 1){
        tablaEspecies.deleteRow(1);
    }
    if (aPartirArchivo){
        if(player.src == ""){
            swal ( "No se ha adjuntado ningun archivo." , "",  "error" )
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
        resultadoTodasLasEspecies = []
        setResultadoGeneralNull()
        recognitionGeneral.start();
        infoGeneral.style.background = naranja;
        infoGeneral.innerHTML ="Escuchando..."
        if (aPartirArchivo){
            playAndRegister()
        }
    }else{ 
        btnGeneral = false;
        recognitionGeneral.stop();
        player.pause()
        infoGeneral.innerHTML = "Escuchar"
        infoGeneral.style.background = amarillo;
    }
}

infoEspecies.onclick = function () {
    if (!btnEspecies){
        btnEspecies = true;
        resInfoEspecies.value = ""
        infoEspecies.innerHTML = "Escuchando..."
        if(NetworkError != ""){
            resInfoEspecies.value = NetworkError
            NetworkError = ""
        }
        recognitionEspecies.start();
        infoEspecies.style.background = naranja;
        if (aPartirArchivo){
            playAndRegister()
        }
    }else {
        btnEspecies = false;
        recognitionEspecies.stop();
        player.pause()
        infoEspecies.innerHTML = "Escuchar muestra " + selectCodi.options[selectCodi.selectedIndex].value
        infoEspecies.style.background = amarillo;
    }
}

observaciones.onclick = function() {
    if (!btnObservaciones){
        btnObservaciones = true
        observaciones.innerHTML = "Registrando"
        recognitionObservaciones.start();
        observaciones.style.background = naranja;
        if (aPartirArchivo){
            playAndRegister()
        }
    }else {
        btnObservaciones = false;
        observaciones.innerHTML = "Escuchar muestra " + selectCodi.options[selectCodi.selectedIndex].value
        recognitionObservaciones.stop();
        player.pause()
        observaciones.style.background = amarillo;
    }
}