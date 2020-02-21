/* file: ot2.jss
   desc: Ostoslistan tapahtumat:
		-uuden tuotteen lisääminen listalle(Lisää -painike tai Enter)
		-tuotteen poistaminen listalta (Tuotteen nimen klikkaus)
   date: 11.2.2018
   auth: Maarit Parkkonen
 */
 
var enter=13;

// 
$(function(){
	var $lista=$("#lista");	
	var $tuote=$("#tuote");				//tuotteen syöttökenttä	
	var $painike=$("#lisaa");			//lisää -painike
	
	$tuote.focus();						//kohdistin syöttökenttään
	
	//lisää -painikkeen klikkaus
	$painike.on("click",function(){	
		lisaaTuote();					//kutsutaan tuotteen lisäystä
	});
	
	//enterin painaminen syöttökentässä
	$tuote.on("keypress",function(e){
		var painike=e.which;			//mikä painike
		if (painike==enter){			//jos painike on enter
			lisaaTuote();				//kutsutaan tuotteen lisäystä
		}
	});
	
	//uuden tuotteen lisäys tuotelistalle
	function lisaaTuote(){
		var $tavara=$tuote.val();		//syöttökentän sisältö
		if ($tavara.length>0){			//jos syöttökenttä ei ole tyhjä
			//$("<li>"+$tavara+"</li>").appendTo($lista).hide().slideDown(750); 	//lisätään uusi lista -elementti liukutehosteella
			($("<li></li>").text($tavara)).appendTo($lista).hide().slideDown(750);  //sama jQuery tyylisesti, toimii myös 
			$tuote.val("");				//tyhjätään syöttökenttä	
		}
		$tuote.focus();					//kohdistin syöttökenttään
	}
	
	//Tuotteen nimen klikkaus, tuote poistetaan listasta
	$lista.on("click","li",function(e){	//kun tuotelistan jotain li -elementtiä klikataan
		$(this).animate({				//klikattu li -elementti animoitavaksi olioksi
			opacity:0.0,				//häivytys
			height:"0",					//kutistus
			padding:"0"					//kutistus
			},750,						//animoinnin kesto
			function(){					//funktio, jota kutsutaan kun animointi valmis
				$(this).remove();		//olion poisto
				});
		$tuote.focus();					//kohdistin syöttökenttään
	});
	
	//näytön koon muuttuessa -> ei toimi
	//$(window).on("resize", function(){
	//	$tuote.focus();		
	//});
	
});
