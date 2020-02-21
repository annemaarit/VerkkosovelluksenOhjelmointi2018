/* file: ot1a.jss
   desc: listaan tulostus
   date: 28.1.2018
   auth: Maarit Parkkonen
 */

// Kun sivu on valmis, tulostaa viestin listaan kpl kertaa 
$(function(){
	var viesti="Heippa maailma!";
	var $tulostus=$("#tulostus");	//tulostusalue
	var kpl=2;
	$tulostus.append("<ul>"); 		//lisätään listan aloitus -tagi ennen divin viimeistä tagia
	for (var i=1;i<=kpl;i++){ 		//lisätään listan rivit kpl kertaa 
		$tulostus.append("<li>"+viesti+"</li>");
	}
	$tulostus.append("</ul>"); 		//suljetaan lista

});	

//näinkin sen olisi kai voinut tehdä:
//$("#tulostus").html(viesti+"<br>"+viesti);