#! /bin/sh
 
echo "plz provide sample file, ignore if already provided \n"

input_file=$1

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

head $input_file $input_file > .sysHead
node head.js $input_file $input_file > .myHead
echo "for format -> node head.js file1 file2"
node compareFiles.js

head -n 5 $input_file $input_file > .sysHead
node head.js -n 5 $input_file $input_file > .myHead
echo "for format -> node head.js -n 5 file1 file2"
node compareFiles.js


head -n5 $input_file $input_file > .sysHead
node head.js -n5 $input_file $input_file > .myHead
echo "for format -> node head.js -n5 file1 file2"
node compareFiles.js

head -5 $input_file $input_file > .sysHead
node head.js -5 $input_file $input_file > .myHead
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

head -c5 $input_file $input_file > .sysHead
node head.js -c5 $input_file $input_file > .myHead
echo "for format -> node head.js -c5 file1 file2"
node compareFiles.js

head -c 5 $input_file $input_file > .sysHead
node head.js -c 5 $input_file $input_file > .myHead
echo "for format -> node head.js -c 5 file1 file2"
node compareFiles.js


rm .myHead
rm .sysHead
