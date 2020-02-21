/* file: ot4.js
   desc: Lintubongari -sovelluksen toiminnoissa:
   			-uusien havaintojen lisäys
			-lintulajikohtaisten havaintojen haku
			-kaikkien havaintojen näyttäminen
			-yksittäisen havainnon poisto (tapahtuu kaikki havainnot taulukossa)
			-kaikkien havaintojen poistaminen (localStoragen tyhjäys)
		tarvittavat skriptit.
   date: 6.3.2018
   auth: Maarit Parkkonen
 */

$(function(){ 	
//globaalit muuttujat
var nakyvissa=null;						//mikä toimintaelementti näkyvissä (null=ei mikään eli päänäkymä)
var havainnotTaulukko=[];				//havainto -objektien taulukko

//toimintaelementit
var $osaUusi=$("div#osaUusi");			//Uusi havainto -elementti
var $osaKaikki=$("div#osaKaikki");		//Kaikki havainnot -elementti
var $osaHae=$("div#osaHae");			//Hae havainto -elementti
var $osaTyhjenna=$("div#osaTyhjenna");	//Varaston tyhjäys -varmistuselementti

//painikkeet
var $painikkeet=$("div#painikkeet");	//päänäytön kaikki painikkeet
var $uusiPainike=$("#uusi");			//Uusi havainto -elementin avaus
var $haePainike=$("#hae");				//Hae havainto -elementin avaus
var $kaikkiPainike=$("#tulosta");		//Kaikki havainnot -elementin avaus
var $tyhjennaPainike=$("#tyhjenna");	//Varaston tyhjäys -varmistuselementin avaus
var $tallennaPainike=$("#tallenna");	//Uusi havainto -lomakkeen tietojen tallennus
var $teeHakuPainike=$("#teeHaku");		//Hae havainto -lomakkeen haun tekeminen
var $peruPainike=$("button.peru");		//kaikkien elementtien peru/paluu/sulje -painikkeet
	

//lomakkeiden syöttökentät
var $laji=$("#laji");					//Uusi havainto -lomakkeella
var $kpl=$("#kpl");						//Uusi havainto -lomakkeella
var $lajiHaku=$("#lajiHaku");			//Hae havainto -lomakkeella

//uusi havainto -lomakkeen automaattiset tietokentät
var $pvm=$("#pvm");						//päivämäärä
var $klo=$("#klo");						//kellon aika
var $paikka=$("#paikka");				//koordinaatit

//tulostusalueet
var $tulostus=$("#tulostus");			//yleinen tulostusalue (ei Kaikki havainnot -taulukko)
var $taulukko=$("#taulukko");			//Kaikki havainnot -taulukon tulostusalue


	//sivun alustus: elementtien piilotus
	$osaUusi.hide();			
	$osaKaikki.hide();			
	$osaHae.hide();				
	$osaTyhjenna.hide();
	
	//Päänäytön painikkeet-------------------------------------------------//
	
	//avaa ja alustaa Uusi havainto -elementin
	$uusiPainike.on("click",function(){
		naytaElementti($osaUusi);		//elementin avaus
		getLocation();					//paikkatietojen haku
		haePaivays();					//päiväyksen haku
		$laji.focus();					//kohdistin laji -kenttään
	});	
	
	//avaa Hae havainto -elementin
	$haePainike.on("click",function(){
		naytaElementti($osaHae);		//elementin avaus
		$lajiHaku.focus();				//kohdistin haku -kenttään
	});	
	
	//avaa Kaikki havainnot -elementin ja pyytää havaintojen tulostusta
	$kaikkiPainike.on("click",function(){
		naytaElementti($osaKaikki);		//elementin avaus
		$taulukko.html("");				//tulostusalueen tyhjennys
		tulostaTaulukko("");			//HTML -taulukon tulostus
	});	
	
	//avaa Varaston tyhjäys -varmistuselementin
	$tyhjennaPainike.on("click",function(){
		naytaElementti($osaTyhjenna); 	//elementin avaus
	});
	//------------------------------------------------------------------------------------//
	
	//toimintaelementin avaaminen näkyviin
	function naytaElementti(elementti){
		$painikkeet.hide();
		if (nakyvissa!=null){		//jos edellinen elementti näkyvissä
			nakyvissa.hide();		//piilotetaan
			$tulostus.html("");		//tulostusalueen tyhjennys
		}
		elementti.fadeIn(100);		//uusi elementti näkyviin	
		nakyvissa=elementti;		//merkitään elementti muistiin
	}
	
	
	//elementtien peru/paluu/sulje -painikkeet
	$peruPainike.on("click",function(){
			paanayttoon();		//paluu päänäyttöön
	});	

	//paluu päänäyttöön
	function paanayttoon(){
		nakyvissa.hide();			//piilota näkyvä toimintaelementti
		$("input").val("");			//tyhjennä syöttökentät
		$painikkeet.fadeIn(100);	//päänäytön painikkeet näkyviin
		$tulostus.html("");			//tulostusalueen tyhjennys
		nakyvissa=null;				//ei toimintaelementtejä näkyvissä
	}
	
    //Uuden havainnon tallennus
    $tallennaPainike.click(function(){  	//Uusi havainto -elementin tallenna painikkeesta
		if (tarkistaTiedot()==true){		//syöttökenttien tietojen tarkistus
			var havainto = { 		 	 	//uusi JS objekti
				laji : $laji.val(), 		//lomakkeen tiedot objektiin
				kpl : $kpl.val(),
				pvm : $pvm.text(),
				klo : $klo.text(),
				paikka : $paikka.text()
			}
			haeHavainnot();											//haetaan aiemmin tallennetut havainnot havainnotTaulukkoon
			havainnotTaulukko.push(havainto);						//lisätään uusi havainto taulukkoon
			var havainnotJSON = JSON.stringify(havainnotTaulukko); 	//muutetaan taulukko stringiksi
			//console.log(havainnotJSON);
			localStorage.setItem("havainnot",havainnotJSON);  		//tallennus havainnot- varastoon		
			paanayttoon();											//paluu päänäyttöön
			} 
    });
	
	//havaintojen haku tietovarastosta
	function haeHavainnot(){
        var havainnotJSON = localStorage.getItem("havainnot"); 		//havaintojen haku varastosta JSON-muodossa     
		havainnotTaulukko = JSON.parse(havainnotJSON);				//muutetaan JSON tietoparit JS objekteiksi havainnotTaulukkoon	
		if(havainnotTaulukko == null){ 								//jos ei havaintoja
			havainnotTaulukko = [];									//taulukon alustus
		}			
	}
	
	//Uusi havainto -lomakkeen syöttökenttien tietojen tarkistus
	//	-palauttaa false, jos tiedot virheelliset
	//	-palauttaa true, jos tiedot ok
	function tarkistaTiedot(){
			if ($laji.val()==""){		//jos lajinimi puuttuu
				$tulostus.html("Laji puuttuu");
				$laji.focus();
				return false;						
				}
			else if ($kpl.val()==""){	//jos kappalemäärä puuttuu
				$tulostus.html("Kappalemäärä puuttuu");
				$kpl.focus();
				return false;
			}
			else{
				return true;
			}
	}
	
	//hakee ajan ja päiväyksen koneen kellosta
	//	-muodostaa päiväyksen muodossa: pp.kk.vvvv
	//	-muodostaa kellon ajan muodossa: hh:mm 
	function haePaivays(){
		var paivays = new Date();				//koneelta haettu aikatieto
		var vuosi = paivays.getFullYear();		//päivä- ja aikatietojen erittely koneen ajasta
		var kuukausi = (paivays.getMonth()+1);
		var paiva = paivays.getDate();
		var tunti = paivays.getHours();
		var minuutit = paivays.getMinutes();
		$pvm.text(paiva+"."+kuukausi+"."+vuosi); //päiväyksen tulostus Uusi havainto -lomakkeelle
		$klo.text(tunti+":"+minuutit);			 //kellon ajan tulostus Uusi havainto -lomakkeelle
		
	}
	
	//paikkatiedon hakeminen
	function getLocation() {
		if (navigator.geolocation) {								//jos selain tukee paikannusta
			navigator.geolocation.getCurrentPosition(showPosition); //hakee paikkatiedon ja välittää sen tiedot näyttävälle funktiolle
		} 
		else { 
			$paikka.text("Tämä selain ei tue paikannusta");
		}
	}
	
	//näyttää paikkatiedon Uusi havainto -lomakkeella
	function showPosition(position) {
		$paikka.text("Latitude: " + (position.coords.latitude).toFixed(5) + " Longitude: " + (position.coords.longitude).toFixed(5));
	}
	
    //Hae havainto -lomakkeen hakutoiminnon aloitus
    $teeHakuPainike.click(function(){			//hakupainikkeesta
		var haettava=$lajiHaku.val();			//haettavan lintulajin nimi
		if (haettava!=""){						//jos hakukenttä ei tyhjä
			tulostaTaulukko(haettava);			//kutsuu haun suorittavaa ja tulostavaa funktiota
		}
		else {									//jos tyhjä hakukenttä
			$tulostus.html("Lajinimi puuttuu");
			$lajiHaku.focus();			
		}
    });
	
    //havaintojen haku- ja tulostus HTML -taulukkoon
	//		- jos haku -parametri on tyhjä, hakee ja tulostaa kaikki havainnot
	//		- jos haku -parametri ei ole tyhjä, hakee ja tulostaa parametrina annetun lajin havainnot
	//		- jos ei havaintoja, tulostaa ilmoituksen
    function tulostaTaulukko(haku){
		var tuloste="";									//tulostettava hTML -taulukko tai ilmoitusteksti
		haeHavainnot();									//haetaan aiemmin tallennetut havainnot havainnotTaulukkoon	
		if (haku!=""){									//jos kyseessä lajikohtainen haku
			etsiLajiHavainnot(haku);					//lajin havainnot havainnotTaulukkoon
			tuloste='<div><h3>'+haku+'</h3></div>'; 	//hakutulokseen laji -otsikko
			tuloste+='<div class="table-responsive"><table class="table table-striped">';
		}
		if (havainnotTaulukko.length>0){				//jos havaintoja on tallennettuna
			tuloste+='<thead><tr>';			
			if (haku!=""){		//lajikohtainen haku
				tuloste+='<th>Kpl</th><th>Päiväys</th><th>Aika</th><th>Paikka</th>';			
			}
			else{				//kaikki havainnot
				tuloste+='<th>Laji</th><th>Kpl</th><th>Päiväys</th><th>Aika</th><th>Paikka</th><th>Poista</th>';			
			}

			tuloste+='</tr></thead><tbody>';
			for(var i in havainnotTaulukko){ //käydään havainnot läpi yksi kerrallaan
				tuloste+='<tr>';
				if (haku==""){ //kaikki havainnot
					tuloste+='<td>'+havainnotTaulukko[i].laji+'</td>';								//lajinimi
				}
				tuloste+='<td>'+havainnotTaulukko[i].kpl+'</td>';
				tuloste+='<td>'+havainnotTaulukko[i].pvm+'</td>';
				tuloste+='<td>'+havainnotTaulukko[i].klo+'</td>';
				tuloste+='<td>'+havainnotTaulukko[i].paikka+'</td>';
				if (haku==""){ //kaikki havainnot		
					tuloste+='<td><img src="delete.png" alt="poista'+i+'" class="poisto"></td>';	//havainnon poisto kuvake
				}
				tuloste+='</tr>';
			}
			if (haku!=""){		//lajikohtainen haku	
				tuloste+='</table></div>';
				$tulostus.html(tuloste);
			}
			else{				//kaikki havainnot
				$taulukko.html("");
				$taulukko.append(tuloste);
			}
		}
		else{ //jos haku ei tuottanut havaintoja
			if (haku!=""){		//lajikohtainen haku
				tuloste="Ei "+haku+" havaintoja";
				$tulostus.html(tuloste);
			}
			else{				//kaikki havainnot
				tuloste="Ei tallennettuja havaintoja";
				$taulukko.html("");
				$taulukko.append(tuloste);
			}
			
		}
    }
	
	//lajikohtainen haku havainnotTaulukosta ja 
	//taulukon muuttaminen lajikohtaiseksi
	function etsiLajiHavainnot(laji){
		var aputaulukko=[];
		for(var i in havainnotTaulukko){ 				//käydään kaikki havainnot läpi yksi kerrallaan
			if (havainnotTaulukko[i].laji==laji){		//jos objektin lajinimi vastaa parametrina saatua nimeä
				aputaulukko.push(havainnotTaulukko[i]);	//objekti aputaulukkoon
			}
		}
		havainnotTaulukko=aputaulukko;					//havaintoTaulukosta lajikohtainen
	}


    //havainnon poistaminen (Kaikki havainnot -elementin taulukon rivikohtaisesta poisto -kuvakkeesta) 
    $taulukko.on("click",".poisto",function() { 								//poisto -kuvakkeen klikkaus	 
        var valittu = parseInt($(this).attr("alt").replace("poista","")); 		//havainnon taulukkoindeksi poisto-kuvakkeen alt:sta	
        havainnotTaulukko.splice(valittu,1); 									//poistaa havainnotTaulukosta sen, jota on klikattu
        localStorage.setItem("havainnot", JSON.stringify(havainnotTaulukko)); 	//muunnetaan ja tallennetaan havainnot varastoon
        tulostaTaulukko("");													//tulostetaan muutettu taulukko
    });

	
    //Tyhjentää kaikki havainnot tietovarastosta
    $("#poistaKaikki").click(function(){ 
        localStorage.clear();	//tietovaraston tyhjäys
		paanayttoon();			//paluu päänäyttöön
    });
	
});