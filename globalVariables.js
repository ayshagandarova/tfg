var infoGeneral = document.getElementById('infoGeneral'); // button that gets the information of the ship, zone and type of fishing
var resInfoGeneral = document.getElementById('resInfoGeneral'); // the results of the ship
var btnGeneral = false
var btnRegistrarGeneral = document.getElementById('btnRegistrarGeneral')

var infoEspecies = document.getElementById('infoEspecies');  // button that gets the information of each fish
var resInfoEspecies = document.getElementById('resInfoEspecies'); // the rsults of each fish
var btnEspecies = false
var btnRegistrarEspecies = document.getElementById('btnRegistrarEspecies')

var observaciones = document.getElementById('observaciones')
var resInfoObservaciones = document.getElementById('resInfoObservaciones')
var btnObservaciones = false
var btnRegistrarObservaciones = document.getElementById('btnRegistrarObservaciones')

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

var recognitionGeneral
var recognitionEspecies
var recognitionObservaciones

var resultadoGeneral = {barco:"", zona:"", pesca: "", tipus:"", dia:"", caixes:"", mostres: "", codi:"0", pes: "", observaciones: []}
var resultadoEspecies = {especie:[], codigo:[], talla: [] }

var tablaResultado = document.getElementById('guardarCSV');
var exportarCSV = document.getElementById('exportarCSV');
var csv = "Codi;Especie;Talla individu;Pes caixa;Caixes;Mostres;Codi mostra;Tipus;Zona;Barca;Tipus pesca;Data;Observacions\n"
var datos = { gGeneral: "", gEspecies:"", vocGeneral: [], especies: [], codigos: [], separadorColumnas: []};

var tipoRegistro = document.getElementById('tipoRegistro');
var selectCodi = document.getElementById('codi')

var player = document.getElementById('player');

const amarillo = 'rgb(237, 202, 90)'
const naranja = 'rgb(227, 94, 27)'

const DESDE_ARCHIVO = 1
const POR_VOZ = 2

var aPartirArchivo = true

