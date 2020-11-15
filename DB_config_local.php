<?php 

  //Include this file in index.php for local develpment

  // Create immutable object with .env vars then load them to here
  $dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
  $dotenv->load();

  define("DB_SERVER", $_ENV['DB_SERVER']);
  define("DB_USERNAME", $_ENV['DB_USERNAME']);
  define("DB_PASSWORD", $_ENV['DB_PASSWORD']);
  define("DB_NAME", $_ENV['DB_NAME']);

   // Connect to DB
   $conn = mysqli_connect(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);

?>