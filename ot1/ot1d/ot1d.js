/* file: ot1d.js
   desc: alustaa valuuttatiedot, toteuttaa valuutan vaihdon,
		 laskee ja tulostaa annettua rahamäärää vastaavan tuloksen
   date: 28.1.2018
   auth: Maarit Parkkonen
 */

 var usdVal=0.80412; 				//dollarin valuuttakurssi 28.1.2018 klo22
 var eurVal=1.24360; 				//euron valuuttakurssi 28.1.2018 klo22
 
$(function(){ 						//kun sivu valmis
	var $valuutta;					//valittuna oleva valuutta
	var $nappi=$("button#laske");	//laskentapainike
	var $tulosta=$("#tulostus");	//tulostusalue
	var $maara=$("#summa");			//rahamäärän eli summan syöttökenttä
	
	asetaValuutta();				//sivun oletus valuuttatietojen asetus
	$maara.focus();					//kohdistin summan syöttökenttään
	
	//vaihtaa valuutan toiseksi
	function asetaValuutta(){
		$valuutta=($("input:checked")).val();	//valitun valuutta -radiopainikkeen arvo
		$nappi.text("Muuta "+$valuutta);		//muutetaan laskentapainikkeen teksti
	}	
	
	//valuutta -radiopainikkeiden klikkaus
	$("input.valuutta").on("click",function(){
		asetaValuutta();						//kutsuu valuutan vaihtavaa funktiota
		$tulosta.text("");						//tyhjentää tulostusalueen
	});
	
	//laskenta -painikkeen klikkaus
	$("#laske").on("click",function(){		
		var tulos;								//laskennan tulos
		if ($valuutta=="euroiksi"){									//syötetty dollareita
			tulos=((usdVal*$maara.val()).toFixed(2))+" euroa";		//muutetaan euroiksi
		}
		else {														//syötetty euroja
			tulos=((eurVal*$maara.val()).toFixed(2))+" dollaria";	//muutetaan dollareiksi
		}
		$tulosta.text(tulos);					//tulostetaan tulos
	});
		
});
