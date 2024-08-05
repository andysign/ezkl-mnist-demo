#!/bin/sh
# if [[ "$(curl -sf localhost:8081 2>&1)" ]]; then
# wget -q localhost:8081/network_good.onnx -O network_good.onnx;
# wget -q localhost:8081/network_bad.onnx -O network_bad.onnx;
# wget -q localhost:8081/input.json -O input.json;
# wget -q localhost:8081/cal_data.json -O cal_data.json;
# fi;
L="zk-initiator:8001" &&
E=$RANDOM &&
curl -m 3 --show-error -s $L > /dev/null 2> /tmp/$E.txt;
if [ -s /tmp/$E.txt ]; then echo 1; L="localhost:8001"; fi &&
l=$(curl -s $L/v1/prj | jq .prj_ids | jq length) &&
i=0 &&
while [ $i -lt $l ]; do let i++; curl -s -X DELETE $L/v1/prj/$(curl -s $L/v1/prj | jq -r .prj_ids[0]); done;
echo "" &&
echo CREATING_KEYS &&
echo ETA_ONE_AND_A_HALF_MINUTES &&
H=$(printf "Content-Type: multipart/form-data") &&
R=$(curl -s -X POST -H "$H" -F "name=mnist" -F "f=@./models/network_good.onnx" -F "c=@./settings/cal_data.json" $L/v1/prj/create) &&
ID=$(echo $R | jq -r .id | tr "/" "\n" | tail -1) &&
echo ID_$ID;
#
# curl -s -X POST -H 'Content-Type: application/json' -d '{"model":"network_good.onnx","input_visibility":"private","param_visibility":"fixed"}' localhost:8001/v1/prj/${ID}/job/gen-settings?model=network_good.onnx\&out=settings_good.json > /dev/null 2>&1;
# curl -s -X POST -H 'Content-Type: application/json' -d '{"scales":[2,7],"settings":"settings_good.json","model":"network_good.onnx"}' localhost:8001/v1/prj/${ID}/job/calibrate-settings?target=resources > /dev/null 2>&1;
#
# curl -s -X POST -H 'Content-Type: application/json' -d '{"settings_path":"settings_good.json"}' localhost:8001/v1/prj/${ID}/job/get-srs > /dev/null 2>&1;
#
# curl -s -X POST -H 'Content-Type: application/json' -d '{"model":"network_good.onnx","settings_path":"settings_good.json"}' localhost:8001/v1/prj/${ID}/job/compile-circuit?out=network_good.ezkl > /dev/null 2>&1;
# curl -s -X POST -H 'Content-Type: application/json' -d '{"model":"network_good.ezkl","settings_path":"settings_good.json"}' localhost:8001/v1/prj/${ID}/job/setup?v=vk_good.key\&p=pk_good.key > /dev/null 2>&1;
#
# curl -s -X POST -H 'Content-Type: multipart/form-data' -F 'f=@./models/network_bad.onnx' localhost:8001/v1/prj/${ID}/job/upload > /dev/null 2>&1;
#
# curl -s -X POST -H 'Content-Type: application/json' -d '{"model":"network_bad.onnx","input_visibility":"private","param_visibility":"fixed"}' localhost:8001/v1/prj/${ID}/job/gen-settings?model=network_bad.onnx\&out=settings_bad.json > /dev/null 2>&1;
#
# curl -s -X POST -H 'Content-Type: application/json' -d '{"scales":[2,7],"settings":"settings_bad.json","model":"network_bad.onnx"}' localhost:8001/v1/prj/${ID}/job/calibrate-settings?target=resources > /dev/null 2>&1;
# curl -s -X POST -H 'Content-Type: application/json' -d '{"model":"network_bad.onnx","settings_path":"settings_bad.json"}' localhost:8001/v1/prj/${ID}/job/compile-circuit?out=network_bad.ezkl > /dev/null 2>&1;
# curl -s -X POST -H 'Content-Type: application/json' -d '{"model":"network_bad.ezkl","settings_path":"settings_bad.json"}' localhost:8001/v1/prj/${ID}/job/setup?v=vk_bad.key\&p=pk_bad.key > /dev/null 2>&1;
#
N="./settings/cal_data.json" && curl -s -X POST -H "$H" -F f=@$N $L/v1/prj/${ID}/job/upload &&
N="./srs/kzg.srs" && curl -s -X POST -H "$H" -F f=@$N $L/v1/prj/${ID}/job/upload &&
N="./models/network_good.ezkl" && curl -s -X POST -H "$H" -F f=@$N $L/v1/prj/${ID}/job/upload &&
N="./models/network_good.onnx" && curl -s -X POST -H "$H" -F f=@$N $L/v1/prj/${ID}/job/upload &&
N="./models/network_bad.ezkl" && curl -s -X POST -H "$H" -F f=@$N $L/v1/prj/${ID}/job/upload &&
N="./models/network_bad.onnx" && curl -s -X POST -H "$H" -F f=@$N $L/v1/prj/${ID}/job/upload &&
N="./settings/settings_good.json" && curl -s -X POST -H "$H" -F f=@$N $L/v1/prj/${ID}/job/upload &&
N="./settings/settings_bad.json" && curl -s -X POST -H "$H" -F f=@$N $L/v1/prj/${ID}/job/upload &&
J=$(printf "Content-Type: application/json") &&
curl -s -X POST -H "$J" -d "{\"model\":\"network_good.ezkl\",\"settings_path\":\"settings_good.json\"}" $L/v1/prj/${ID}/job/setup?v=vk_good.key\&p=pk_good.key &&
curl -s -X POST -H "$J" -d "{\"model\":\"network_bad.ezkl\",\"settings_path\":\"settings_bad.json\"}" $L/v1/prj/${ID}/job/setup?v=vk_bad.key\&p=pk_bad.key &&
if [ -s /tmp/$E.txt ]; then echo DONE; else npm run dev; fi
#
# curl -s -X POST -H 'Content-Type: application/json' -d "$(cat input.json)" localhost:8001/v1/prj/${ID}/job/load?n=input.json > /dev/null 2>&1;
#
# curl -s -X POST -H 'Content-Type: application/json' -d '{"model":"network_good.ezkl","vk_path":"vk_good.key","srs_path":"kzg.srs"}' localhost:8001/v1/prj/${ID}/job/gen-witness > /dev/null 2>&1;
# curl -s -X POST -H 'Content-Type: application/json' -d '{"witness":"witness.json","model":"network_good.ezkl","pk_path":"pk_good.key"}' localhost:8001/v1/prj/${ID}/job/gen-proof > /dev/null 2>&1;
#
# curl -s -X POST -H 'Content-Type: application/json' -d '{"model":"network_bad.ezkl","vk_path":"vk_bad.key","srs_path":"kzg.srs"}' localhost:8001/v1/prj/${ID}/job/gen-witness > /dev/null 2>&1;
# curl -s -X POST -H 'Content-Type: application/json' -d '{"witness":"witness.json","model":"network_bad.ezkl","pk_path":"pk_bad.key"}' localhost:8001/v1/prj/${ID}/job/gen-proof > /dev/null 2>&1;
#
# curl -s -X POST -H 'Content-Type: application/json' -d '{"proof_path":"proof.json","settings_path":"settings_good.json","vk_path":"vk_good.key"}' localhost:8001/v1/prj/${ID}/job/verify;
