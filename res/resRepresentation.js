/*	VARIABLES GLOBALES :
	width_canevas : largeur du canevas
	height_canevas : hauteur du canevas
	width_barre : largeur de chaque barre
	espace_barres : espace entre chaque barre
	graph : le canvas
	ctx : le context (pour dessiner)
	tabBlocs : le tableau contenant les zones (carrées) pour les infobulles avec leurs valeurs associées
	grossisement : zoom du graph (valeur par laquelle multiplier les valeurs d'affichage pour obtenir 
					les vraies valeurs, sert aussi pour les valeurs sur les axes)
*/

const width_canevas =17000;
const height_canevas = 1200;
const nb_barre = 2;
const width_barre = 24;				
const espace_barres = 10;				
graph = document.getElementById("dessin");
ctx = graph.getContext("2d");
tabBlocs = [];
grossisement = 0.5;

// récupèration des valeurs du csv par un script php
$.ajax({
	type:'get',
	url:"res/resRepresentation.php",
	success:function(data){
	        console.log(data)
	        var decalageWidth = 180; // décalage entre les Axes et le reste du graph
	        var decalageHeight = 50; // décalage entre la légende et le reste du graph 

	        printLegendes();
	        printAxe(decalageWidth,decalageHeight,grossisement);
			
			//affichages de toutes les barres 
			printPlusieuresBarres(width_barre, data, decalageWidth, decalageHeight);	                
	            
	}
})

/* 	détection de l'entrée de la souris dans une zone d'infobulle et affichage 
	des infos sur les places réservées correspondants à ce carré
*/
graph.addEventListener(
	"mousemove", 
	(function(evt) {
		var rect = evt.target.getBoundingClientRect();
		var x = evt.clientX - rect.left;
		var y = evt.clientY - rect.top;
		var xd, yd;
		var text = "";
		graph.title = "";

		for(var i = 0; i < tabBlocs.length; i ++) {
			
			xd = tabBlocs[i].X;
			yd = tabBlocs[i].Y;
			
			if ((x > xd) && (x < xd+tabBlocs[i].width) && (y > yd) && (y < yd+tabBlocs[i].height) ) {
				
				text = tabBlocs[i].nbPlaces*grossisement +" places tarif "+tabBlocs[i].tarif+" pour "+tabBlocs[i].height*grossisement +" euros";
				
				var numLigne = parseInt( (i)/4  +1, 10);
				if(tabBlocs[i].tarif == "plein" || tabBlocs[i].tarif == "reduit"){
					graph.title= text+" de bénéfice. [pièce "+numLigne+"]";
				}else{
					graph.title = text+" de perte. [pièce "+numLigne+"]";
				}

				break;
			}else{
				graph.title="";
			}
		}
	}),
	false);