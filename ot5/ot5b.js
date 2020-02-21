/* file: ot5b.js
   desc: Taxilaskurin toiminnoissa tarvittavat skriptit:
		 -matkan hinta-arvion laskenta
		       *etäisyystietojen hakulausekkeen muodostus
			   *etäisyystietojen pyyntö goonlemapsin apilta
			   *hinnan laskenta ja tulostus
		 -lomakkeen tyhjennys
   date: 9.3.2018
   auth: Maarit Parkkonen
 */

var luokkaHinta=[1.60,1.91,2.07,2.23]; 	// maksuluokat (1-2, 3-4, 5-6, yli 6 matkustajaa) euroa/km
var perusHinta=[5.90,5.90,9.00];		//perusmatkan hinta ajankohdan (arki, la/aatto, muu) mukaan

var $alku=$("#alku");			//lähtöosoite
var $loppu=$("#loppu");			//kohdeosoite
var $luokka=$("#luokka");		//maksuluokka
var $aika=$("#aika");			//ajankohta
var $laske=$("#laske");			//laskentapainike
var $tyhjenna=$("#tyhjenna");	//tyhjennäpainike
var $tulostus=$("#tulostus");	//tulostusalue


$(function(){					//kun sivu on latautunut
	$alku.focus();				//kohdistin lähtöosoite -tekstikenttään
});

//laskentapainikkeen klikkaus
$laske.click(function(){
	$tulostus.html("");					//tulostusalueen tyhjennys
	var hakuString=teeHakupyynto();		//hakulauseen muodostavan funktion kutsu
	haePaikkatiedot(hakuString);		//hakufunktion kutsu (joka ohjaa myös laskentaa eteenpäin)
	$alku.focus();						//kohdistin lähtökenttään
	
});

//muodostaa lomakkeella annettujen tietojen pohjalta hakulauseen
//		-palauttaa hakulauseen
function teeHakupyynto(){
	var alkuTaulukko=parsiOsoite($alku.val());		//lähtöosoitteen taulukointi osiin 
	var loppuTaulukko=parsiOsoite($loppu.val());	//kohdeosoitteen taulukointi osiin
	var hakuString="alku=";							//hakulauseen lähtöosoitteen aloitus
	hakuString+=alkuTaulukko[0];					//ensimmäinen hakuosa
	for (var i=1;i<(alkuTaulukko.length);i++){		//liitetään hakulausekkeeseen lähtöosoitteen hakuosat
		hakuString+=",";							//hakuosia erottava merkki
		hakuString+=alkuTaulukko[i];				//hakuosa
	}
	hakuString+="&loppu=";							//hakulauseen kohdeosoitteen aloitus
	hakuString+=loppuTaulukko[0];					
	for (var i=1;i<(loppuTaulukko.length);i++){		//liitetään hakulausekkeeseen kohdeosoitteen hakuosat
		hakuString+=",";							//hakuosia erottava merkki
		hakuString+=loppuTaulukko[i];				//hakuosa
	}
	return hakuString;								//valmiin hakulausekkeen palautus
}

//Taulukoi ja muokkaa käyttäjän antaman osoitteen osat hakuun sopiviksi
//		-saa parametrina käyttäjän syöttämän osoitemerkkijonon
//		-palauttaa hakuosat taulukoituna ja hakulauseeseen oikean muotoisina
function parsiOsoite(osoite){
	var osoiteTaulukko=[]; 							//hakuosien taulukko
	osoiteTaulukko =osoite.split(",");				//jaetaan merkkijono pisteiden kohdalta taulukkoon 
	for (var i=0;i<(osoiteTaulukko.length);i++){	//käydään jokainen taulukon hakuosa läpi
		osoiteTaulukko[i]=osoiteTaulukko[i].trim();	//poistetaan tyhjät alusta ja lopusta
		osoiteTaulukko[i]=osoiteTaulukko[i].replace(" ","+"); //korvataan hakuosan sanojen välissä oleva tyhjä +-merkillä
	}
	return osoiteTaulukko;							//palautetaan hakuosien taulukko
}

//pyytää googlemaps -apilta hakulauseketta vastaavia tietoja
//		-saa parametrina hakulauseen
function haePaikkatiedot(hakuString){
	$.ajax({							//ajax -pyyntö
		url:"http://localhost/googlemaps.php?"+hakuString,  //hakulausekkeen lähetys googlemapsin apille php-ohjelman kautta
		success: function(result) { 	//jos haku onnistuu
			laskeHinta(result);  		//vastauksena saatu JSON -muotoinen tieto ohjataan laskentafunktiolle
			},
		error: function(xhr){ 			//jos tulee virhe
			if (xhr.status==200){		//tietoja ei löytynyt
				$tulostus.html("Etäisyystietoa ei löytynyt");
			}
			else{
				alert("Virhe: " + xhr.status + " " + xhr.statusText);
			}
		}
	});	
}

//hinnan laskenta ja tulostus saatujen tietojen pohjalta
//	-saa parametrina hakutuloksen JSON-muodossa
function laskeHinta(result){	
	var matka = result.rows[0].elements[0].distance.text; //poimitaan välimatka hakupyynnön vastauksena saadusta JSON -tiedosta (jossa objekteja ja taulukkoja sisäkkäin)
	var matkanOsat=matka.split(" ");					  //erotetaan numerot ja km lyhenne toisistaan
	var km=Number((matkanOsat[0].replace(",","")));		  //poistetaan mahdollinen pilkku numeroiden seasta ja muutetaan numeroteksti numeroarvoksi
	var luokka=Number($luokka.val());					  //luetaan valittu maksuluokka 
	var aika=Number($aika.val());						  //luetaan valittu ajankohta
	var hinta=(perusHinta[aika]+(luokkaHinta[luokka]*km)).toFixed(2); //hinnan laskenta ja pyöristys
	$tulostus.html("<strong>Matka: </strong>"+km+" km <br>"+"<strong>Hinta: </strong>"+hinta+" €"); //tulostetaan matka ja hinta-arvio 
}

//lomakkeen tyhjäys ja alkuvalinnat Tyhjennä -painikkeesta
$tyhjenna.click(function(){
	$alku.val("");
	$loppu.val("");
	$luokka.val("0");	
	$aika.val("0");
	$tulostus.html("");
	$alku.focus();
});

//----Enter -tapahtumat--------------------------------------------------------------------------------

//lähtöosoitteen syöttökentän enter -tapahtuma
$alku.on("keydown", function(event) {	//kuuntelee lähtöosoitteen syöttökentän näppäinalas -tapahtumia
  if (event.keyCode == 13) {			//jos on painettu enter
	$loppu.focus();						//kohdistin kohdeosoitekenttään
  }
});

//kohdeosoitteen syöttökentän enter -tapahtuma
$loppu.on("keydown", function(event) {	//kuuntelee kohdeosoitteen syöttökentän näppäinalas -tapahtumia
  if (event.keyCode == 13) {			//jos on painettu enter
	$luokka.focus();					//kohdistin maksuluokan valintakenttään
  }
});

//maksuluokan valintakentän enter -tapahtuma
$luokka.on("keydown", function(event) {	//kuuntelee maksuluokan valintakentän näppäinalas -tapahtumia
  if (event.keyCode == 13) {			//jos on painettu enter
	$aika.focus();						//kohdistin ajankohdan valintakenttään
  }
});

//ajankohdan valintakentän enter -tapahtuma
$aika.on("keydown", function(event) {	//kuuntelee ajankohdan valintakentän näppäinalas -tapahtumia
  if (event.keyCode == 13) {			//jos on painettu enter
	$laske.click();						//käynnistää laske -painikkeen klikkaus -tapahtuman
  }
});
//------------------------------------------------------------------------------------------------------
