<?php

	/* Campos enviados do form */
	$origem=$_POST["origem"];
	$nome=$_POST["nome"];
	$email=$_POST["email"];
	$assunto=$_POST["assunto"];
	$msg=$_POST["msg"];
	$cidade=$_POST["cidade"];
	$estado=$_POST["estado"];
	

	try{ 
		$msg = "Mensagem enviada do portal do Grupo OVD" . "<br>de: " . $nome . "<br> Cidade: " . $cidade. "<br> estado: ". $estado . "<br> email: " . $email. "<br>Mensagem: " .$msg;
	
		/* Endereco do web service (interno) — configurar via variável de
		   ambiente no servidor de produção; não versionar a URL real aqui. */
		$wsUrl = getenv('OVD_EMAIL_WS_URL') ?: 'http://SUBSTITUA_PELA_URL_INTERNA/ti-war/ManterEmailWsService?wsdl';
		$client = new SoapClient($wsUrl, array("trace" => 1, "exceptions" => 0));
	
		/* No PHP, o webservice e mapeado em structs, entao toda propriedade deve ser lida como um array associativo */
		$grupoWs = array('txGrupo' => $assunto);
		$origemWs = array('txOrigem' => $origem, 'gruposWs' => $grupoWs);
		$emailWs = array('txMensagem' => $msg, 'txAssunto' => $assunto , 'origemWs' => $origemWs);
		$enviarEmailWsIn = array('emailWs' => $emailWs);
	
		/* Chamando o WebService e capturando o retorno*/
		$response = $client->enviarEmail(array('enviarEmailWsIn' => $enviarEmailWsIn));
	
		/* O retorno do ws vem em um object stdClass , que pode ser lido normalmente */
		$enviarEmailOut = $response->return;
		
		/* Exibindo retorno do webservice */
		if($enviarEmailOut->sucesso){
			echo 'Email enviado com sucesso!';
		} else {
			echo 'Erro ao enviar email. Por favor tente mais tarde.';
		}
	}catch (Exception $e) {
   		 echo 'Caught exception: ',  $e->getMessage(), "\n";
	}
	
	
?>