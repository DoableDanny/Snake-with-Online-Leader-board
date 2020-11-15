<?php

  // Bring in the packages we've installed
  require_once realpath("vendor/autoload.php");

  // Configure and connect to Heroku MySQL DB (for deployment only)
  include 'DB_config_Heroku.php';

  // Configure and connect to local DB (for development only)
  // include 'DB_config_local.php';
 
  // Check connection
  if(!$conn) {
    echo "Connection error: " . mysqli_connect_error();
  }

  $name = $_COOKIE['username'] ?? "a guest";
  $highScore = $name === "a guest" ? '0 (login to save high score!)' : 0;
  // Check if new username set
  if(isset($_POST['username'])) {
    $highScore = 0;
    $name = $_POST['username'];
    $user = getUserFromDB($name);
    if(isset($user['score'])) {
    $highScore = $user['score'];
    }
    // Set cookie for 4 days
    setcookie('username', $name, time() + 345600);
  }

  function getUserFromDB($name) {
    global $conn;
    $name = mysqli_real_escape_string($conn, $name);
    $getTheUserSql = "SELECT username, score FROM high_scores WHERE username='$name'";
    $userResult = mysqli_query($conn, $getTheUserSql);
    $user = mysqli_fetch_assoc($userResult);
    mysqli_free_result($userResult);
    return $user;
  }

  // If user exists and new highscore, update in DB. Otherwise, create new user row.
  $userExists = false;

  if($name !== "a guest" && isset($_GET['score'])) {
    $score = $_GET['score'];

    // Fetch the user from DB
    $user = getUserFromDB($name);

    // If user found, check if new high score
    if(isset($user['username']) && isset($user['score'])) {
      $userExists = true;
      $highScore = $user['score'];

      if($highScore < $score) {
        $highScore = $score;
        $score = mysqli_real_escape_string($conn, $score);
        $updateScoreSQL = "UPDATE high_scores SET score=$score WHERE username='$name'";

        if(!mysqli_query($conn, $updateScoreSQL)) {
          echo 'Query error: ' . mysqli_error($conn);
        } 
      }
    }

    // If user wasn't found, create new user row in DB
    if($userExists === false) {
      $name = mysqli_real_escape_string($conn, $name);
      $score = mysqli_real_escape_string($conn, $score);
      $addNewUserSql = "INSERT INTO high_scores(username, score) VALUES('$name', '$score')";
      if(mysqli_query($conn, $addNewUserSql)) {
        $highScore = $score;
      } else {
        echo sqli_error($conn);
      }
    }
  }

  // Write query to get users and their scores
  $sql = 'SELECT username, score FROM high_scores ORDER BY score DESC';

  // Make query and get result
  $result = mysqli_query($conn, $sql);

  // Put result into associative array format
  $usersAndScores = mysqli_fetch_all($result, MYSQLI_ASSOC);
  
  // Free result from memory (good practice)
  mysqli_free_result($result);

  // Close connection
  mysqli_close($conn);

?>

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SNAKE</title>
    <link rel="stylesheet" href="style.css" />
    <script src="game.js" defer type="module"></script>
  </head>
  <body>
    <div class="titleAndImgContainer">
      <h1>SNAKE</h1>
      <img class="snake-img" src="./images/anaconda.svg" alt="Snake">
    </div>
    <div class="score-and-game-container">
      <div class="scores-wrapper">
        <p>Currently playing as <b><?php echo htmlspecialchars($name) ?></b></p>
        <h3 id="score">Score: 0</h3>
        <h3 id="high-score">High Score: <?php echo htmlspecialchars($highScore) ?></h3>
      </div>
      <div id="game-board"></div>
    </div>
   

    <div class="formAndLeaderboardWrapper">
      <form action="./" method="POST">
        <label for="username">Enter your twitter username to take part!</label>
        <input type="text" name="username" id="username" value="@">
        <input type="submit" name="submit" value="Submit">
      </form>
      <div id="leaderboard">
        <h2>Leaderboard</h2>
        <table>
          <tr>
            <th>Place</th>
            <th>Name</th>
            <th>Score</th>
          </tr>
          <?php foreach($usersAndScores as $key => $userAndScore) : ?>
          <tr>
            <td><?php echo $key + 1 ?></td>
            <td><?php echo htmlspecialchars($userAndScore['username']) ?></td>
            <td><?php echo htmlspecialchars($userAndScore['score']) ?></td>
          </tr>
          <?php endforeach ?>
        </table>
      </div>
    </div>
    <footer>Made for fun by Danny Adams. Subscribe to my <a href="https://www.youtube.com/channel/UC0URylW_U4i26wN231yRqvA?view_as=subscriber" target="_blank">YouTube Channel.</a>I plan to make coding tutorials soon, I promise!</footer>
  </body>
</html>
