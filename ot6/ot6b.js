/* file: ot6b.js
   desc: Autovuokraamo -sovelluksen toiminnoissa tarvittavat skriptit:
			-päiväyselementin toiminnot
			-varaustietomodaalin avaus
			-tekstisyötteiden tarkistus ja virheilmoitukset
			-vuokrauspäivien tarkistus ja virheilmoitukset
			-tulostuksen muotoilu (modaaliin ja JSON tietona consoliin)
			-lomakkeen tyhjäys ja alkutietojen palautus
   date: 12.3.2018
   auth: Maarit Parkkonen
 */

var $alku=$("#alku");						//aloituspvm
var $loppu=$("#loppu");						//loppupvm
var $etunimi=$("#etunimi");					//vuokraajan etunimi
var $sukunimi=$("#sukunimi");				//vuokraajan sukunimi
var $sposti=$("#sposti");					//vuokraajan sähköpostiosoite
var $puhnro=$("#puhnro");					//vuokraajan puhelinnumero
var $tulostus=$("#tulostus");				//tulostusalue
var $paivyri=$(".paivyri");					//päiväyksen valinta elementti
var $modaali=$("#vahvistusIkkuna");			//varaustietojen vahvistusikkuna/modaali
var $modaaliTulostus=$("#modaaliTulostus");	//modaalin tulostusalue
var $syottokentat=$(".form-control");		//tekstisyötekentät

//---painikkeet-----------------------------------------------
var $vahvistan=$("#vahvistan");	//varauksen vahvistus
var $peruutan=$("#peruutan");	//varauksen peruutus (tyhjentää lomakkeen)
var $muutan=$("#muutan");		//varaustietojen muuttaminen
var $hyvaksyn=$("#hyvaksyn");	//varauksen hyväksyntä (muodostaa JSON -merkkijonon)

//---vakiot---------------------------------------------------
var hinta=120;					//vuokraushinta/vrk
var maxAika=7;					//maximi vuokrausaika vrk
var sekunnitVrk=(86400*1000);	//unixajan muutosvakio vuorokausiksi

//--globaalit muuttujat---------------------------------------
var unixPvm1;					//aloituspvm unixaika muodossa
var unixPvm2;					//loppupvm unisaika muodossa
var tulosteOlio;				//lomakkeen tiedot objekti


$(function(){					//kun sivu on latautuu
	$('[data-toggle="tooltip"]').tooltip(); 	//tooltip käyttöön
	$paivyri.datepicker({ 						//päivyrielementin alustus (options)
        language:  'fi',						//kieli
		format: "dd.mm.yyyy",					//päiväyksen muoto
        weekStart: 1,							//viikko alkaa ma
        todayBtn:  1,							//tänään painike näkyvissä
		autoclose: 1,							//sulkeutuu valinnan jälkeen
		todayHighlight: 1,						//nykyinen päivä merkitty
		minView: 2,								//maksimissaan vuodet tai vuosikymmenet näkyvät
		forceParse: 0							//ei tarvitse parsia käyttäjän syötettä (readonly)
    });
});	
	
//vahvista -painikkeen klikkaus
$vahvistan.click(function(){
	if (tarkistaSyotteet()==true){				//jos syötteet kunnossa
		tulostaVaraustiedot();					//kutsuu syötetiedoista tulosteen muodostavaa funktiota
		$modaali.modal('show');					//avaa varaustiedot -modaalin 
	}
});

//tarkistaa että tekstikentät eivät ole tyhjiä ja varausaika on oikein
// 		-palauttaa true, jos kaikki ok
//		-palauttaa false, jos virheitä ja antaa tekstisyötteistä virheilmoituksen
function tarkistaSyotteet(){
	var ok=true;
	$syottokentat.each(function(){				//tekstikenttien tarkistus
		if ($(this).val()==""){					//jos tyhjä kenttä eli tieto puuttuu
			$(this).focus();					//kohdistin tekstikenttään
			ok=false;							//merkitään syötetiedot virheellisiksi
		}
	});
	if (ok==true){								//jos tekstisyötteet olivat ok
		ok=varausAikaOk();						//kutsutaan aikatiedot tarkistavaa funktiota
	}
	else {										//jos tekstitiedoissa virhe
		$tulostus.html("Puutteelliset varaustiedot");		
	}
	return ok;									//palautetaan tieto syötetietojen virheettömyydestä 
}

//varauksen aikatietojen tarkistus
//		-onko aloitusaika aiemmin kuin palautusaika?
//		-ylittääkö vuokra-aika maksimi ajan?
// 		-palauttaa true, jos kaikki ok
//		-palauttaa false, jos virheitä ja antaa varausajasta virheilmoituksen	
function varausAikaOk(){
	var pvm1=parsiPaivays($alku.val());		//kutsuu alkupäiväyksestä päiväysobjektin muodostavaa funktiota
	var pvm2=parsiPaivays($loppu.val());	//kutsuu palautuspäiväyksestä päiväysobjektin muodostavaa funktiota
	unixPvm1=pvm1.getTime();				//muutetaan alkupäiväys objekti unixAikaan
	unixPvm2=pvm2.getTime();				//muutetaan palautuspäiväys objekti unixAikaan
	if (unixPvm1<=unixPvm2){				//jos palautuspäiväys ei ole alkupäiväystä aiemmin
		var paivat=(((unixPvm2-unixPvm1)/sekunnitVrk)+1);	//lasketaan vuokraajan pituus vuorokausissa
		if (paivat<=maxAika){				//jos vuokra-aika ok
			$tulostus.html("");				//tyhjätään virheilmoitukset
			return true;					//palautetaan kaikki kunnossa
		}
		else{								//jos vuokraaika liian pitkä
			$tulostus.html("Varausaika on liian pitkä, maksimi aika on "+maxAika+" vuorokautta");		
			return false;					//palautetaan "virheellinen"
		}
	}
	else{									//jos palautusaika ennen alkuaikaa
		$tulostus.html("Tarkista varausaika: palautusaika on ennen varauksen aloitusta");		
		return false;						//palautetaan "virheellinen"
	}
}

//muuttaa suomalaisen päiväyksen amerikkalaiseen muotoon
//		-palauttaa päiväysobjektin
function parsiPaivays(pvm){
	var osat=[];			//päiväyksen osat: indexit 0=yyyy, 1=mm, 2=dd
	osat=pvm.split(".");	//jaetaan päiväys taulukkoon
	var pvmOlio=new Date(osat[2]+"/"+osat[1]+"/"+osat[0]);	//uusi päiväysobjekti
	return pvmOlio;			//palauteteen objekti
}

//muodostaa lomakkeen tiedoista tulosteOlion (globaali) ja tulostaa sen tiedot modaaliin
//		-laskee tarvittavan vuokrausmaksun
function tulostaVaraustiedot(){
	tulosteOlio={							//lomakkeen tiedot objekti
		alkuPvm: $alku.val(),
		loppuPvm: $loppu.val(),
		etunimi: $etunimi.val(),
		sukunimi: $sukunimi.val(),
		sahkopostiosoite: $sposti.val(),
		puhelinnumero: $puhnro.val()
	}	
	var maksu=(hinta*((((unixPvm2-unixPvm1)/sekunnitVrk)+1))).toFixed(0);					   //vuokrausmaksu
	var tuloste="<strong>Nimi:</strong> "+tulosteOlio.etunimi+" "+tulosteOlio.sukunimi+"<br>"; //tulosteen muodostus
	tuloste+="<strong>Sähköpostiosoite: </strong>"+tulosteOlio.sahkopostiosoite+"<br>";
	tuloste+="<strong>Puhelinnumero: </strong>"+tulosteOlio.puhelinnumero+"<br>";
	tuloste+="<strong>Varausajankohta:</strong>"+tulosteOlio.alkuPvm+" - "+tulosteOlio.loppuPvm+"<br>";
	tuloste+="<h4>Hinta yhteensä: "+maksu+"€</h4>";	
	$modaaliTulostus.html(tuloste);	//tulostus modaaliin

}

//muodostaa globaalista lomakkeen tiedot sisältävästä objektista JSON -muotoisen merkkijonon
function muodostaData(){
	var data = JSON.stringify(tulosteOlio);	//muunnetaan JSON-stringiksi
	console.log(data);						//tulostus konsoliin	
}

//hyväksyn -painikkeen klikkaus (varaus tehdään)
$hyvaksyn.click(function(){
	muodostaData();		//kutsutaan tulosteOliosta JSON -merkkijonon muodostavaa funktiota
	tyhjennaLomake();	//palautetaan lomake alkutilanteeseen	
});

//peruutan -painikkeen klikkaus (koko varaus perutaan)
$peruutan.click(function(){
	tyhjennaLomake();
});

//lomakkeen palautus alkutilanteeseen: tyhjäys ja oletusvalinnat
function tyhjennaLomake(){
	$alku.val("");							//päiväyskentät tyhjiksi
	$loppu.val("");
	$paivyri.each(function(){				//päiväyselementit alkutilaan 
		$(this).datepicker("update","");
	});	
	$etunimi.val("");						//tekstikentät tyhjiksi
	$sukunimi.val("");
	$sposti.val("");	
	$puhnro.val("");
	$tulostus.html("");						//tulostusalueen tyhjäys
	unixPvm1="";							//globaalit muuttujat alkutilaan
	unixPvm2="";
	tulosteOlio=null;
}

//----Enter -tapahtumat--------------------------------------------------------------------------------

//etunimi syöttökentän enter -tapahtuma
$etunimi.on("keydown", function(event) {	//kuuntelee etunimi syöttökentän näppäinalas -tapahtumia
  if (event.keyCode == 13) {				//jos on painettu enter
	$sukunimi.focus();						//kohdistin sukunimikenttään
  }
});

//sukunimi syöttökentän enter -tapahtuma
$sukunimi.on("keydown", function(event) {	//kuuntelee sukunimi syöttökentän näppäinalas -tapahtumia
  if (event.keyCode == 13) {				//jos on painettu enter
	$sposti.focus();						//kohdistin sähköpostikenttään
  }
});

//sähköposti syöttökentän enter -tapahtuma
$sposti.on("keydown", function(event) {		//kuuntelee sähköposti syöttökentän näppäinalas -tapahtumia
  if (event.keyCode == 13) {				//jos on painettu enter
	$puhnro.focus();						//kohdistin puhelinnumerokenttään
  }
});

//puhelinnumero syöttökentän enter -tapahtuma
$puhnro.on("keydown", function(event) {		//kuuntelee puhelinnumero syöttökentän näppäinalas -tapahtumia
  if (event.keyCode == 13) {				//jos on painettu enter
	$vahvistan.click();						//käynnistää vahvistan -painikkeen klikkaus -tapahtuman
  }
});
//------------------------------------------------------------------------------------------------------
