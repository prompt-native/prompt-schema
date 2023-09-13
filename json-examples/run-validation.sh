runTest() {
    mode=$1
    file=$2
    failOrPass=$3
    schema="../schema/$mode-schema-*.json"

    echo ">>>>> TEST: should $failOrPass: $file, using schema=$schema"; 
    ajv validate -s $schema -d $file --strict=false
    retVal=$?
    if ([ $failOrPass == 'pass' ] && [ $retVal -eq 0 ]) || ([ $failOrPass == 'fail' ] && [ $retVal -ne 0 ]) ; then
        echo "SUCCESS!\n"
    else
        echo "TEST FAIL! Please check $file and $schema \n"
        exit -1
    fi
}

for file in pass-chat*.json; do 
runTest 'chat' $file 'pass'
done

for file in pass-completion*.json; do 
runTest 'completion' $file 'pass'
done

for file in fail-completion*.json; do 
runTest 'completion' $file 'fail'
done