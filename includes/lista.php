<?php
    //Caminho onde os arquivos estão savos
$path = '../download/';
    
// Escaneia conteudo da pasta segundo nível
$scan = scandir($path);
// Se pasta estiver vazia exibe o aviso, caso não executa a leitura
if(count($scan) > 2) {
    echo "<div id='Accordion1'>";
    //Abre diretório definido acima
    $le = opendir ($path);
    //Lista arquivos e pastas dentro destes diretorios (só utilizaremos para pasta)
    while($result = readdir($le)){  
        
        //Remove os resultados padrão da pasta ".." e "." (lista apenas os resultados diferentes deles)
	   if($result != '..' && $result != '.')  
           
        {
            // Substitui "&" por "@" e "_" por espaço
            $caracter_pasta = array("_", "@");
            $carac_subs_pasta   = array(" ", "&");

            $nome_pasta_final = str_replace($caracter_pasta, $carac_subs_pasta, $result);
            //imprime o nome da pasta que está dentro do diretório                
            echo "<h3><a href='#'>".$nome_pasta_final."</a></h3><div>";
        
            // Escaneia conteudo da pasta segundo nível
            $scan_i = scandir($path.$result);
            // Se pasta estiver vazia exibe o aviso, caso não executa a leitura
            if(count($scan_i) > 2) {
        
                //Abre pasta que fica em um segundo nível
                $pi = opendir ($path.$result);
                //Lista arquivos e pastas dentro destas pastas do segundo nível (só utilizaremos para arquivos)
                
                while($result_i = readdir($pi)){  
                            
                   //Remove os resultados padrão da pasta ".." e "." (lista apenas os resultados diferentes deles)
                    if($result_i != '..' && $result_i != '.')
                            {
                            // Substitui "&" por "@" e "_" por espaço
                            $caracter = array("_", "@");
                            $carac_subs   = array(" ", "&");

                            $nome_final = str_replace($caracter, $carac_subs, $result_i);
                   
                            // Imprime nome da pasta segundo nivel 
                            echo "<p><span class='marca'>".$nome_final."</span><ul class='recuo'>";
                            // Escaneia conteudo da pasta segundo nível
                            $scan_a = scandir($path.$result."/".$result_i);
                            // Se pasta estiver vazia exibe o aviso, caso não executa a leitura
                            if(count($scan_a) > 2) {
                
                                    //Abre pasta que fica em um terceiro nível
                                    $pa = opendir ($path.$result."/".$result_i);
                   
                                    while($result_a = readdir($pa)){   
                
                                        //Remove os resultados padrão da pasta ".." e "." (lista apenas os resultados diferentes deles)
	                                   if($result_a != '..' && $result_a != '.')
                                        {
                                            //Remove a extensão dos arquivos
                                            $nome = preg_replace("/\.[^.]+$/", "", $result_a);
                   
                                            // Substitui "&" por "@" e "_" por espaço
                                            $caracter_a = array("_", "@");
                                            $carac_subs_a   = array(" ", "&");

                                            $nome_final_a = str_replace($caracter_a, $carac_subs_a, $nome);
                   
                                            //imprime os nomes dos arquivos que estavam dentro da pasta do segundo nível sem extensão
                        
                                            echo " <li class='lista'><a href='download/".$result."/".$result_i."/".$result_a."' class='link_download' target='_blank'>".$nome_final_a."</a></li>";
                   
                   
                                        }
                    
                                    }
                                } else {
                                        // Exibe aviso caso a pasta segundo nível esteja vazia
                                        echo "<span id='aviso_lista'>N&atilde;o foram cadastrados arquivos para esta divis&atilde;o</span>";

                                        }
                                echo "</ul></p>";
                            }
                    }
                                    
                } else {
                        // Exibe aviso caso a pasta terceiro nível esteja vazia
                        echo "<span id='aviso_lista'>N&atilde;o foram cadastrados divis&otilde;es para este evento</span>";

                        }
           echo "</div>";
        }
}
echo "</div>";
} else {
        // Exibe aviso caso a pasta segundo nível esteja vazia
        echo "<span id='aviso_lista'>N&atilde;o temos eventos cadastrados, favor entrar em contato com o Departamento de Marketing no telefone: (41) 2101.2500.</span>";
        }
?>
<script type="text/javascript">
$(function() {
	$( "#Accordion1" ).accordion({
		heightStyle:"content",
        collapsible:true,
        active:false
	}); 
});
        </script>