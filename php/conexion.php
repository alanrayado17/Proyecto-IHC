<?php
class Conexion
{
	var $host="localhost";
	var $usuario="root";
	var $contrasena="qwerty123";
	var $baseDatos="basedatos";
	var $conexion;
	function __construct()
	{
		
	}
	function conectar()
	{
		$this->conexion=mysqli_connect($this->host,$this->usuario,$this->contrasena,$this->baseDatos);
		mysqli_set_charset($this->conexion,"utf8");
		if(mysqli_error($this->conexion))
			echo"ERROR AL CONECTAR";
		return;
	}
	function executarConsulta($sql)
	{
		$arrayCollection = NULL;
		$result = mysqli_query($this->conexion,$sql) or die(mysql_error());
		if(!is_bool($result)){
      		while($row = mysqli_fetch_array($result)) { $arrayCollection[] = $row; }
	  		return $arrayCollection;   	  
		}else{
	  		return true;	
		}
	}
} 
$objConexion=new Conexion();
$objConexion->conectar();
$sql="DELETE FROM administrador";
echo var_dump($objConexion->executarConsulta($sql));
?>