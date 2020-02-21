/* file: ot3d.js
   desc: hakee tiedot palvelimella sijaitsevasta json -tiedostosta ja
	     muodostaa niistä Elokuvat -taulukon
   date: 23.2.2018
   auth: Maarit Parkkonen
 */
 
// 
$(function(){			

var $tulostus=$("#tulostus");	//html -sivun tulostusalue

teeTaulukko();				

//hakee tiedot palvelimelta ja ohjaa ne taulukon muodostavalle funktiolle
function teeTaulukko(){
		$.ajax({url: "elokuvat.json", success: function(tiedot){	//json tietojen lukeminen palvelimelta tiedot -objektiin
			naytaTaulukko(tiedot);									//html -taulukon muodostavan funktion kutsuminen
			}														
		});
}

//muodostaa ja tulostaa html -taulukon
function naytaTaulukko(tiedot){			//tiedot parametri on Javascript -objekti, jossa taulukoituna objekteja
		var tuloste="";					//tekstimuuttuja html -taulukon muodostamiseen: elementit ja sisältö
		var otsikot=[];					//html-taulukon otsikot
		var varillinen=true;			//html-taulukon riviin liitettävä tyylimääre
		
		tuloste = "<table>";
		tuloste += "<tr>";
		
		//html -taulukkoon otsikot eli taulukkoon tallennettujen objektien arvoparien nimet		
		for (x in tiedot[0]){ 
			tuloste +="<th>"+x+"</th>";
			otsikot.push(x);
		}
		tuloste += "</tr>";
		
		//html -taulukon tietorivit eli taulukkoon tallennettujen objektien arvoparien arvot
		//käsitteellaan yksi rivi kerrallaan
		for (var i=0;i<tiedot.length;i++){
			//jokatoinen rivi värilliseksi css -luokkamääritteen kautta
			if (varillinen){ 
				tuloste +='<tr class="vari">';	
				varillinen=false;
			}
			else{	
				tuloste +="<tr>";
				varillinen=true;
				}
			//rivin sisältämän objektin arvot html-taulukon soluihin
			for (var j=0;j<otsikot.length;j++){
				tuloste +='<td>'+tiedot[i][otsikot[j]]+'</td>';
			}
			tuloste +="</tr>";			
		}
		tuloste += "</table>";
		$tulostus.append(tuloste);	//valmiin html -taulukon tulostus	
}

});