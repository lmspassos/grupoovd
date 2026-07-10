 $(document).ready(function(){
	 
	//INCLUDE HEADER
	$('#header').load('https://www.ovd.com.br/site/headerTeste.html', function(){});
	
	//INCLUDE BOX MARCAS
	$('#boxMarcas').load('https://www.ovd.com.br/site/includes/box-marcas.html', function(){});
	
	//INCLUDE FOOTER
	$('#footer').load('https://www.ovd.com.br/site/includes/footer.html', function(){});
	
	//INCLUDE MODAL CAMPANHAS
	$('#modalcampanhas').load('https://www.ovd.com.br/site/includes/modal_campanhas.html', function(){});
     
     //INCLUDE LISTA KIT IMPRENSA
	$('#kit_imprensa_lista').load('https://www.ovd.com.br/presskit/includes/lista.php', function(){});
     
     	
	//HOME
	if($('body').hasClass('home'))
		{ 
		   
	   /*CARREGA XML*/
	   loadXml("xml/banner_home.xml");
	  
	   
	   
	   $(".parceirosContent").jCarouselLite({  
	   			   auto:true,
				   timeout: 3000,
				   speed:500,
				   visible:2,
				   btnNext: ".btnNext",
				   btnPrev: ".btnPrev",
				   circular:true
				   
		});
   		
   
	}
	
	
	
	if($('body').hasClass('interna'))
	{
		 
		 $(".sedes").jCarouselLite({   
				   speed:500,
				   auto: true,
				   timeout: 30000,
				   visible:1,
				   btnNext: ".btnNext",
				   btnPrev: ".btnPrev",
				   circular:true
				   
		});
		
		$('.selectContato').jqTransform();
		
  
  
	$.validator.addMethod("regex", function(value, element) {
        return this.optional(element) || /^[a-z0-9,. \n\r\t]+$/i.test(value);
    }, "Campo deve conter apenas letras e números");
  
  	 $("#formContato").validate(
		{
			debug: false,
			rules: {
				nome: {
					required: true,
					regex: true
				},
				email: {
					required: true,
					email: true
				},
				mensagem: {
					required: true,
					regex: true
				}
			},
			messages: {
				nome: {
					required: "Obrigatório",
					regex: "Campo deve conter apenas letras e números"
				},
				email: "E-mail válido obrigatório",
				assunto: "Obrigatório",
				mensagem: {
					required: "Obrigatório",
					regex: "Campo deve conter apenas letras e números"
				}
			},
			submitHandler: function(form) {
			
				var nome = document.getElementById('nome').value;
				var email = document.getElementById('email').value;
				var assunto = document.getElementById('assunto').value;
				var msg = document.getElementById('mensagem').value;
				var cidade = document.getElementById('cidade').value;
				var estado = document.getElementById('estado').value;
				
				if (window.XMLHttpRequest)
				{// code for IE7+, Firefox, Chrome, Opera, Safari
					xmlhttp=new XMLHttpRequest();
				}
				else
				{// code for IE6, IE5
					xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
				}
				xmlhttp.onreadystatechange=function()
				{
					if (xmlhttp.readyState==4 && xmlhttp.status==200)
					{
						document.getElementById('nome').value = "";
						document.getElementById('email').value = "";
						document.getElementById('mensagem').value = "";
						document.getElementById('cidade').value = "";
						document.getElementById("msgEnvioEmail").innerHTML=xmlhttp.responseText;
					}
				}
	  
				params = "origem=portal_ovd&nome="+nome+"&email="+email+"&assunto="+assunto+"&msg="+msg+"&cidade="+cidade+"&estado="+estado;
				url = "enviaEmail.php";
	
				xmlhttp.open("POST",url,true);
				xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
				xmlhttp.setRequestHeader("Content-length", params.length);
				xmlhttp.setRequestHeader("Connection", "close");
				xmlhttp.send(params);
			}
			
		});
   
   
   
	}
		
 });
 
 
/*LOAD XML
====================================================================================*/ 
function loadXml(who)
{
	$.ajax({
		type: "GET",
		url: who,
		dataType: "xml",
		success: function(xml)
		{
			
	
			var bannersLi="";
			var navPgs="";
			var banners = $(xml).find("banners")
			var totalBanners= banners.children().size();
			
		
			
			
			for ( var i = 0; i < totalBanners; i++)
			{
				
				var bannerImg = banners.find('banner:eq('+i+')').text();

				bannersLi += "<li><img src='arquivos/"+bannerImg+"' /></li>";
				navPgs += "<a href='#' class='pg "+i+"'></a>"
				
			}
	
		
			
			$("#banner").html("<div class='nav'>"+navPgs+"</div><ul>"+bannersLi+"</ul>");
			
		
			/* OPÇÕES SLIDER HOME */
			 var carouselHome = {
				auto: true,
				timeout: 8000,
				visible: 1,
				speed: 300,
				pause: true,
				btnGo: $('.nav').find('a')
			  };

      

    		 $('#banner').jCarouselLite(carouselHome);
			$('.nav').css({"left": ( $("#banner").width() - $(".nav").width())/2+"px"});
			
			
			
			
		}
		
		
	});
			
}
