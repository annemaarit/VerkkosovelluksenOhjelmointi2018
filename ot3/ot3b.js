/* file: ot3b.js
   desc: hakee tiedot palvelimella sijaitsevasta json -tiedostosta ja
	     muodostaa niistä Tuotteet -taulukon
   date: 21.1.2018
   auth: Maarit Parkkonen
 */
// 
$(function(){
var $tulostus=$("#tulostus");	//html -sivun tulostusalue

teeTaulukko();

//hakee tiedot palvelimelta ja ohjaa ne taulukon muodostavalle funktiolle
function teeTaulukko(){
	var xmlhttp = new XMLHttpRequest();						//uusi Ajaxin tiedoston haku/pyyntöobjekti
	xmlhttp.onreadystatechange = function() {				//pyyntöobjektin valmius -ominaisuuden vaihtuessa kutsutaan funktiota
		if (this.readyState == 4 && this.status == 200){	//kun pyyntö ok
			var tiedot=JSON.parse(this.responseText); 		//muutetaan vastauksena saatu JSON -tiedosto javascript -objektiksi
			naytaTaulukko(tiedot);							//kutsutaan html -taulukon muodostavaa funktiota
		}
	};
	xmlhttp.open('GET','tuotteet.json',true);		//pyynnön valmistelu
	xmlhttp.send();									//pyynnön lähetys
}

//muodostaa ja tulostaa html -taulukon
function naytaTaulukko(tiedot){	//tiedot parametri on Javascript -objekti, jossa taulukoituna objekteja
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
		$tulostus.append(tuloste);		//valmiin html -taulukon tulostus
}

});