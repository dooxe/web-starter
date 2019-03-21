<?php
include __DIR__ . "/lib/BladeOne/lib/BladeOne.php"; 
$views = __DIR__ . '/assets/views'; // it uses the folder /views to read the templates
$cache = __DIR__ . '/cache'; // it uses the folder /cache to compile the result. 
$blade = new eftec\bladeone\BladeOne($views,$cache,eftec\bladeone\BladeOne::MODE_AUTO);
echo $blade->run("pages.home",
    array(
        "variable1"     => "value1"
    )
); // /views/hello.blade.php must exist
?>