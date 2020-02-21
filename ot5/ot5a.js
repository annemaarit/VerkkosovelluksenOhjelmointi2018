/* file: ot5a.js
   desc: Kaupunkikohtaisen lämpötilanhakusovelluksen toiminnoissa tarvittavat skriptit:
			-kaupunkikohtaisen tiedon haku openweathermap apin kautta
			(-lämpötilan muuttaminen Kelvinistä Celsiukseksi)
			-haetun tiedon tulostus
   date: 8.3.2018
   auth: Maarit Parkkonen
 */

var $hae=$("#hae");
var $nimi=$("#nimi");
var $tulostus=$("#tulostus");
var $kaupunki=$("#kaupunki");

$(function(){			//kun sivu on ladattu
	$kaupunki.focus();	//kohdistin kaupungin nimi kenttään
});

//hae -painikkeen klikkaus	
$hae.click(function(){	
	haeLampotila($kaupunki.val()); //kutsuu lämpötilan hakufunktiota kaupungin nimi syöttökentän tiedoilla
});

//pyytää openweathermap apilta kaupungin nimeä vastaavia tietoja 
function haeLampotila(kaupunki){
	$.ajax({							//ajax -pyyntö
		url:"http://localhost/openweathermap.php?paikkakunta="+kaupunki, //kaupungin nimen lähetys apille php-ohjelman kautta 
		success: function(result) { 	//jos haku onnistuu
			tulosta(result,kaupunki);  	////vastauksena saatu JSON -muotoinen tieto ohjataan tulosta -funktiolle
			},
		error: function(xhr){ 			//jos tulee virhe
			if (xhr.status==200){		//tietoja ei löytynyt
				tulosta("",kaupunki);	//annetaan tyhjä tuloste tulosta -funktiolle
			}
			else{						//jokin muu virhe
				alert("Virhe: " + xhr.status + " " + xhr.statusText); 
			}
		}
	});	
}

//Poimii lämpötilan hakutuloksesta tai jos hakutulos tyhjä, ilmoittaa virheen
//	-saa 1.parametrina hakutuloksen JSON-muodossa
//	-saa 2.parametrina haetun kaupungin nimen
function tulosta(result,kaupunki){
	if (result!=""){ //jos lämpötila on löytynyt
		//var lampotila = muunnaCelsius(Number(result.main.temp));
		//------LISÄSIN php -tiedoston urliin: units=metric parametrin, lähettää nyt suoraan tiedot celsiuksena-------
		//------ELI: $urli = "http://api.openweathermap.org/data/2.5/weather?lang=en&units=metric&q=".$paikkakunta."&appid=85bff0d6d2b77e90b75aea6889af3026"---
		var lampotila = result.main.temp;
		$tulostus.html(kaupunki+", lämpötila: "+lampotila + " C");					//tulostus diville
	}
	else{ //tyhjä hakutulos
			$tulostus.html("Ei lämpötilatietoja annetulla "+kaupunki+" nimellä");	//tulostus diville		
		}
	$kaupunki.focus();
}

//function muunnaCelsius(kelvin){
//	var celsius=(kelvin-273.15).toFixed(1);
//	return celsius;
//}

//ylikirjoittaa lomakkeen oletuksena olevan enter -tapahtuman
$kaupunki.on("keydown", function(event) {	//kuuntelee kaupungin nimen syöttökentän näppäinalas -tapahtumia
 if (event.keyCode == 13) {					// jos on painettu enter
	event.preventDefault();					// pysäyttää käynnissä olevan tapahtuman
	$hae.click();							// käynnistää hae -painikkeen klikkaus -tapahtuman
  }
});




