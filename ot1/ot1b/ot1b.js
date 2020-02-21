/* file: ot1b.js
   desc: piilottaa/näyttää painikkeiden klikkauksesta alaotsikot
   date: 28.1.2018
   auth: Maarit Parkkonen
 */

// 
$(function(){ //kun sivu on valmis

	//viittaukset muuttujiin
	var $alaotsikko=$("h1.alaotsikko");
	var $nappi1=$("#nappi_1");
	var $nappi2=$("#nappi_2");	

	$nappi1.on("click", function(){ //tapahtuman käsittelijä: painiketta yksi klikattaessa
		$alaotsikko.hide(300); 		//piilotetaan kaikki 1.tason otsikot, joissa luokkana alaotsikko
	});
	
	$nappi2.on("click", function(){ //tapahtuman käsittelijä: painiketta kaksi klikattaessa
		$alaotsikko.show(300); 		//näytetään kaikki 1.tason otsikot, joissa luokkana alaotsikko
	});	
	
});