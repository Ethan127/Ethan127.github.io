<?php

if($_POST["send"]) {
    $recipient="ethan.s127@gmail.com";
    $subject=$_POST["subject"];
    $sender=$_POST["name"];
    $senderEmail=$_POST["email"];
    $message=$_POST["message"];

    $mailBody="Name: $sender\nEmail: $senderEmail\n\n$message";

    mail($recipient, $subject, $mailBody, "From: $sender <$senderEmail> \r\n X-Mailer: PHP");

}

?>








<html>
  <head>
    <title>Contact US</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
    <link rel="stylesheet" type="text/css" href="style.css">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body>
    <nav class="navbar navbar-expand-sm bg-dark navbar-dark sticky-top">
      <a class="navbar-brand" href="index.html"><img src="stupidlogosmall.PNG" height="50px"></img></a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse bg-dark navbar-dark navbar-collapse" id="collapsibleNavbar">
        <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link navtext" href="./about_us.html">About Us</a>
          </li>
          <li class="nav-item">
            <a class="nav-link navtext" href="./options.html">Options</a>
          </li>
          <li class="nav-item">
            <a class="nav-link navtext" href="./contact.html">Contact Us</a>
          </li>
          <li class="nav-item">
            <a class="nav-link navtext" href="./faq.html">FAQs</a>
          </li>
          <li class="nav-item">
            <a class="nav-link navtext" href="./calendar.html">Calendar</a>
          </li>
        </ul>
        <ul class="navbar-nav ml-auto">
          <li class="nav-item">
            <a class="navbar-link" href="#"><img src="https://upload.wikimedia.org/wikipedia/en/thumb/8/8c/Facebook_Home_logo_old.svg/1024px-Facebook_Home_logo_old.svg.png" height="35px"></img></a>
          </li>
          <li class="nav-item">
            <a class="navbar-link" href="#"><img src="https://cdn3.iconfinder.com/data/icons/social-icons-5/607/Twitterbird.png" height="35px"></img></a>
          </li>
          <li class="nav-item">
            <a class="navbar-link" href="#"><img src="http://www.usma.edu/orienteering/SiteAssets/SitePages/Home/The%20New%20Instagram%20Logo%20With%20Transparent%20Background%2011.png?Mobile=1&Source=%2Forienteering%2F%5Flayouts%2Fmobile%2Fdispform%2Easpx%3FList%3D78e4ce47%252D472c%252D4309%252Da7e5%252D2085eeeeaf6b%26ID%3D203%26CurrentPage%3D1" height="35px"></img></a>
          </li>
        </ul>
      </div>
    </nav>

    <br><br>

    <div class="container-fluid homecontent">
      <h2>Thank You</h2>
      <p>Your message has been sent!</p>
      <br><br><br><br><br><br><br><br><br><br><br><br>
    </div>

  </body>
</html>
