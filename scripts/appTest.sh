declare -a test_data
green="\x1b[32m"
red="\x1b[31m"
reset="\x1b[0m"


test_data=('-c5'  ''  '-n5')
file1="numbers.txt"
file2="head.js"
message="${red} Not Matched ${reset}"

for i in ${test_data[@]}
do
  
  head ${userArgs} ${file1} > .actual
  node head.js ${userArgs} ${file1} > .expected
  diff .actual .expected
  if [ echo $? -e 0 ]
  then
    message="${green} Match Found ${reset}"
  fi
  echo ${message} 

done

rm .actual
rm .expected