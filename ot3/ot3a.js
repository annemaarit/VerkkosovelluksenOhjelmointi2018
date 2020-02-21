/* file: ot3a.jss
   desc: hakee tiedot palvelimella sijaitsevasta csv -tiedostosta ja
	     muodostaa niistä Tuotteet -taulukon
   date: 20.1.2018
   auth: Maarit Parkkonen
 */
// 
$(function(){			
var $tulostus=$("#tulostus");	//html -sivun tulostusalue

//merkkivakiot
var m1=";";
var m2="\n";
var m3=/\n/g; //valitsee kaikki rivinvaihdot

teeTaulukko();

//hakee tiedot palvelimelta ja ohjaa ne taulukon muodostavalle funktiolle
function teeTaulukko(){
  var arvot=[];
  var kpl;
  var xhttp = new XMLHttpRequest();						//uusi Ajaxin tiedoston haku/pyyntöobjekti
  xhttp.onreadystatechange = function() {				//pyyntöobjektin valmius -ominaisuuden vaihtuessa kutsutaan funktiota
    if (this.readyState == 4 && this.status == 200) {	//kun pyyntö ok
		var merkkijono=this.responseText;
		kpl=laskeOtsikot(merkkijono);					//otsikkojen eli taulukon sarakkeiden määrä
		arvot=parsiTiedot(kpl,merkkijono);				//muutetaan vastauksena saatu tekstitiedosto javascript -objektiksi
		naytaTaulukko(kpl,arvot);						//kutsutaan html -taulukon muodostavaa funktiota
    }
  }
  xhttp.open("GET", "tuotteet.csv", true);		//pyynnön valmistelu
  xhttp.send();									//pyynnön lähetys
}

//laskee yhden rivin otsikkojen (objektien arvoparien) kappalemäärän
function laskeOtsikot(jono){
		var ekarivi,i;
		var maara=1;
		i = jono.indexOf(m2);				//rivin loppumerkin sijainti		
		ekarivi = jono.slice(0,i);			//ensimmäinen rivi
		for (var j=0;j<jono.length;j++){	//rivin merkkien läpikäynti
			if (ekarivi[j]==m1){			//jos välilyönti
				maara++;					//kasvatetaan kappalemäärää
			}
		}
		return maara;						//palautetaan kappalemäärä
}

//tiedoston arvoparien arvot taulukkoon
function parsiTiedot(kpl,tiedot){
		var rivit =[];
		var rivi=[];
		var tulos=[];
		rivit = tiedot.split(m3); 				//pätkitään rivit taulukkoon jokaisen rivinvaihdon kohdalta
		for(var i=0;i<(rivit.length-2);i++){ 	//kaikkien rivien läpikäynti
			rivi=rivit[i].split(m1)				//yksi rivi kerrallaan
			for (var j=0;j<kpl;j++){			//jokainen rivin sisältämä arvo
				tulos.push(rivi[j]); 			//yksittäinen arvo yhteiseen taulukkoon
			}
		}	
		return tulos;							//palautetaan taulukko, jossa kaikki arvot
}

//muodostaa ja tulostaa html -taulukon
function naytaTaulukko(kpl,arvot){
		var tuloste="";		//tekstimuuttuja html -taulukon muodostamiseen: elementit ja sisältö
		var arvo;			//yksittäinen arvo	
		var i=0;
		var j;
		
		tuloste = "<table><tr>";	
		
		//html -taulukon otsikot
		while (i<kpl){ 				//otsikkotiedot arvot -taulukon alusta
			tuloste +="<th>"+arvot[i]+"</th>";
			i++;
		}
		tuloste += "</tr>";
		
		//Html-taulukon solut 
		while (i<arvot.length){ 	//jatkaa arvot -taulukon läpikäyntiä loppuun asti
			tuloste +="<tr>";
			j=1;
			while (j<=kpl){			//arvot html -taulukon soluihin
				arvo=arvot[i];		//yksittäinen arvo
				if (isNaN(arvo)){	//arvon tyylimäärittely sen tietotyypin perusteella
					tuloste +='<td class="teksti"'+j+'">'+arvo+'</td>';
				}
				else{
					tuloste +='<td class="numero"'+j+'">'+arvo+'</td>';
				}
				i++;
				j++;
			}
			tuloste +="</tr>";
		}
		tuloste += "</table>";
		$tulostus.append(tuloste);	//valmiin html -taulukon tulostus
}
});