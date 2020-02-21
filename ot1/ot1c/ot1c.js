/* file: ot1c.js
   desc: tekstikappaleiden liukuva piilotus/näyttäminen
   date: 28.1.2018
   auth: Maarit Parkkonen
 */

// 
$(function(){ 										//kun sivu on valmis
	$("p.runo").slideUp(0); 						//piilotetaan tekstikappaleet, joiden luokkana runo
	$("h3.otsikko").on("click",function(){ 			//klikattaessa kolmostason otsikkoa, jossa luokkana otsikko
		$(this).siblings(".runo").slideToggle(600);	//valitun otsikon sisaruselementille (tekstikappale), jolla luokkana runo
	});												//vaihdetaan näkyvyys päinvastaiseksi eli liukuvasti näkyviin tai piiloon
});		 
	
	
