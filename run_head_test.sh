#! /bin/sh
 
echo "plz provide sample file, ignore if already provided \n"

LIGHTGRAY='\033[0;37m'
NC='\033[0m'
input_file=$1
input_file2=$2

head -n5 $input_file > .sysHead
node head.js -n5 $input_file > .myHead
echo "for format -> node head.js -n5 file1"
node compareFiles.js

head -n 5 $input_file > .sysHead
node head.js -n 5 $input_file > .myHead
echo "for format -> node head.js -n 5 file1"
node compareFiles.js

head -5 $input_file > .sysHead
node head.js -5 $input_file > .myHead
echo "for format -> node head.js -5 file1"
node compareFiles.js

head $input_file $input_file2 > .sysHead
node head.js $input_file $input_file2 > .myHead
echo "for format -> node head.js file1 file2"
node compareFiles.js

head -n 5 $input_file $input_file2 > .sysHead
node head.js -n 5 $input_file $input_file2 > .myHead
echo "for format -> node head.js -n 5 file1 file2"
node compareFiles.js


head -n5 $input_file $input_file2 > .sysHead
node head.js -n5 $input_file $input_file2 > .myHead
echo "for format -> node head.js -n5 file1 file2"
node compareFiles.js

head -5 $input_file $input_file2 > .sysHead
node head.js -5 $input_file $input_file2 > .myHead
echo "for format -> node head.js -5 file1 file2"
node compareFiles.js

head -c5 $input_file > .sysHead
node head.js -c5 $input_file > .myHead
echo "for format -> node head.js -c5 file1"
node compareFiles.js

head -c 5 $input_file > .sysHead
node head.js -c 5 $input_file > .myHead
echo "for format -> node head.js -c 5 file1"
node compareFiles.js

head -c5 $input_file $input_file2 > .sysHead
node head.js -c5 $input_file $input_file2 > .myHead
echo "for format -> node head.js -c5 file1 file2"
node compareFiles.js

head -c 5 $input_file $input_file2 > .sysHead
node head.js -c 5 $input_file $input_file2 > .myHead
echo "for format -> node head.js -c 5 file1 file2"
node compareFiles.js

head -n11 $input_file > .sysHead
node head.js -n11 $input_file > .myHead
echo "for format -> node head.js -n11 file1 file2"
node compareFiles.js

head -n16 $input_file > .sysHead
node head.js -n16 $input_file > .myHead
echo "for format -> node head.js -n16 file1 file2"
node compareFiles.js

echo  "\nIllegal Cases\n"

head -x5 $input_file 2> .sysHead
node head.js -x5 $input_file 2> .myHead
echo "for format -> node head.js -x5 file1 (illegal option)"
node compareFiles.js

head -x 5 $input_file 2> .sysHead
node head.js -x 5 $input_file 2> .myHead
echo "for format -> node head.js -x 5 file1 (illegal option)"
node compareFiles.js

head --5 $input_file 2> .sysHead
node head.js --5 $input_file 2> .myHead
echo "for format -> node head.js --5 file1 (illegal option)"
node compareFiles.js

head -- $input_file > .sysHead 
node head.js -- $input_file > .myHead
echo "for format -> node head.js -- file1" 
node compareFiles.js

head -- 5 $input_file 2> .sysHead 1>> .sysHead
node head.js -- 5 $input_file 2> .myHead 1>> .myHead
echo "for format -> node head.js -- 5 file1" 
node compareFiles.js

