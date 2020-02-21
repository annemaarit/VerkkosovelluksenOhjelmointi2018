/* file: ot3c.js
   desc: hakee tiedot palvelimella sijaitsevasta json -tiedostosta ja
	     muodostaa niistä Tuotteet -taulukon, käyttäjä voi taulukosta hakea
		 tekstisyötteen avulla tuotteelle hinnan
   date: 22.1.2018
   auth: Maarit Parkkonen
 */
 
 var enter=13;
 
// 
$(function(){
var $painike=$("#hae");			//haku -painike
var $syote=$("#syote");			//hakukenttä
var $tulos=$("#tulos");			//html -sivun haun tuloksen tulostusalue
var $tulostus=$("#tulostus");	//html -sivun taulukon tulostusalue
var tiedot=[];					//Javascript -objekti, jossa taulukoituna objekteja

teeTaulukko();

$syote.focus();					//kohdistin syöttökenttään

//hakee tiedot palvelimelta ja ohjaa ne taulukon muodostavalle funktiolle
function teeTaulukko(){
	var xmlhttp = new XMLHttpRequest();						//uusi Ajaxin tiedoston haku/pyyntöobjekti
	xmlhttp.onreadystatechange = function() {				//pyyntöobjektin valmius -ominaisuuden vaihtuessa kutsutaan funktiota
		if (this.readyState == 4 && this.status == 200){	//kun pyyntö ok
			tiedot=JSON.parse(this.responseText); 			//muutetaan vastauksena saatu JSON -tiedosto javascript -objektiksi
			naytaTaulukko(tiedot);							//kutsutaan html -taulukon muodostavaa funktiota
		}
	};
	xmlhttp.open('GET','tuotteet.json',true);		//pyynnön valmistelu
	xmlhttp.send();									//pyynnön lähetys
}

//muodostaa ja tulostaa html -taulukon globaalin tiedot muuttujan kautta
function naytaTaulukko(){
		var tuloste="";
		var otsikot=[];
		var arvo;

		tuloste = "<table>";
		tuloste += "<tr>";
		
		//taulukoi html -taulukon otsikot, jotka ovat
		//myös samalla arvoparien nimet
		for (x in tiedot[0]){
			tuloste +="<th>"+x+"</th>";
			otsikot.push(x);
		}
		tuloste += "</tr>";
		
		//Html-taulukon solut 
		for (var i=0;i<tiedot.length;i++){			
			tuloste +="<tr>";		
			for (var j=0;j<otsikot.length;j++){	//arvot html -taulukon soluihin
				arvo=tiedot[i][otsikot[j]];		//yksittäinen arvo
				if (isNaN(arvo)){				//arvon tyylimäärittely sen tietotyypin perusteella
					tuloste +='<td class="teksti">'+arvo+'</td>';
				}
				else{
					tuloste +='<td class="numero">'+arvo+'</td>';
				}
				
			}
			tuloste +="</tr>";													
		}
		
		tuloste += "</table>";
		$tulostus.append(tuloste);	//valmiin html -taulukon tulostus	
}

//haku -painikkeen klikkaus
$painike.on("click",function(){	
		haeHinta();					//kutsutaan..
});


//enterin painaminen syöttökentässä
$syote.on("keypress",function(e){
		var nappain=e.which;		//mikä näppäin
		if (nappain==enter){		//jos painike on enter
			haeHinta();				//kutsutaan haku -funktiota
		}
});

function haeHinta(){
		$etsi=$syote.val();		//syöttökentän sisältö
		var loytyi=false;
		$tulos.text("");		//edellisen tuloksen tyhjennys
		if ($etsi.length>0){	//jos syöttökenttä ei ole tyhjä
			for (var i=0;i<(tiedot.length)&&(loytyi==false);i++){ //taulukon objektien läpikäyntiä
				if (tiedot[i].Tuote==$etsi){	//kun tuote löytyy
					$syote.val("");				//tyhjätään syöttökenttä	
					$syote.focus();				//kohdistin syöttökenttään		
					loytyi=true;				//merkitään löydetyksi
					$tulos.append('<span class="tulos">'+$etsi+"</span>: hinta on "+tiedot[i].Hinta+"€");  //tulostetaan tulos
					}
			}
			if (loytyi==false){
				$tulos.append("Ei tuotetta nimellä: "+$etsi);
			}
		}
		else{
			$tulos.append("Kirjoita tuotteen nimi");
		}
}

});