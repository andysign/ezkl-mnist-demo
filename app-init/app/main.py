# generated by fastapi-codegen:
#   filename:  open-api-prj-create.yaml
#   timestamp: 2024-06-22T22:04:39+00:00

from __future__ import annotations

from fastapi import FastAPI, HTTPException, UploadFile as UF, Form, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from starlette.middleware.base import BaseHTTPMiddleware,RequestResponseEndpoint
from starlette.requests import Request
import os
import ezkl
from enum import Enum
# from pydantic import BaseModel; from typing import Optional, Dict
from typing import Dict, AnyStr, Any, Optional
from utils import (
                    create_data_dir, create_id_path_about_add_about,
                    create_id_path_and_add_model, create_id_path_and_add_cal,
                    create_id_dir, create_unique_data_sub_path,
                    list_skip_empty_values, list_sub_folders,
                    read_files_from_folder, update_ezkl_py_run_args,
                    validate_date_time_string, validate_file_existence,
                    validate_folder_existence, delete_all_files_from_folder,
                    delete_folder, upload_id_path_json,
                    delete_file_from_folder,
)
from pydantic import BaseModel

app = FastAPI(
    title='ZK ML API Layer Made With OpenAPI 3.0',
    description='''This is a simple open api test\n
        Swagger at [https://swagger.io](https://swagger.io).\n
        Open the editor editor . swagger . io\n
        Or editor-next . swagger . io''',
    version='1.0.0',
    servers=[{'url': 'http://localhost:8001'}],
    root_path='/v1'
)

class NoCacheHttpMiddleware(BaseHTTPMiddleware):
    async def dispatch(self,request:Request,call_next:RequestResponseEndpoint):
        response = await call_next(request)
        if request.method == "GET":
            response.headers["Cache-Control"] = "no-cache, no-store, max-age=0"
            response.headers["Pragma"] = "no-cache"
            response.headers["Expires"] = "0"
        return response

app.add_middleware(NoCacheHttpMiddleware)

app.add_middleware(
    CORSMiddleware,allow_origins=['*'],allow_methods=["*"],allow_headers=["*"]
)

@app.get("/")
def root():
    return {"message": "Go to /v1/docs OR /v1/openapi.json for more"}

@app.get('/prj') # response_model=PrjAllGetResponse
def prj_all_get(): # PrjAllGetResponse
    """
    Prj Retrieve All Projects
    """
    create_data_dir(os.getcwd())
    prj_list = list_sub_folders(f"{os.getcwd()}/data")
    return { "prj_ids": prj_list }

@app.get("/prj/{prj_id}")
def prj_get_by_id(prj_id: str):
    """
    This is designed to retrieve a prj by its ID.
    It validates the prj ID and checks if the corresponding folder exists
    before returning a list of files in that folder.
    """
    path = f"{os.getcwd()}/data/{prj_id}"
    if (not validate_date_time_string(prj_id)):
        raise HTTPException(status_code=400, detail="Invalid ID")
    if (not validate_folder_existence(path)):
        raise HTTPException(status_code=404, detail="Prj not found")
    files = read_files_from_folder(path)
    files_arr = [ {"name": item[0], "size": item[1]} for item in files ]
    return { "response": { "prj_id": prj_id, "files": files_arr } }

@app.delete("/prj/{prj_id}")
def prj_delete_by_id(prj_id: str):
    """
    This is designed to delete a prj by its ID if the ID is valid.
    """
    path = f"{os.getcwd()}/data/{prj_id}"
    if (not validate_folder_existence(path)):
        raise HTTPException(status_code=400, detail="Unable to delete prj")
    delete_all_files_from_folder(path)
    delete_folder(path)
    return {"message": "Delete successfully"}

@app.post("/prj/create") # , response_model=ProjectModelAndName
def prj_create_post(name: str = Form(...), f: UF = File(...), c: UF = None):
    """
    Create by adding name plus uploading model
    Model field is f (required) and calib data field is c calibration (opt) \n
    Use: `-F 'name=abc'` and `-F 'f=@a.onnx'` with the header
    `-H 'Content-Type: multipart/form-data'`
    """
    project_name = name

    model_file = f
    model_file_name = model_file.filename
    model_file_size = model_file.size

    cal_file = c
    cal_file_name = cal_file.filename if c else None
    cal_file_size = cal_file.size if c else None
    if (cal_file is not None):
        print({ "cal_name": cal_file_name, "cal_size": cal_file_size })

    prj_id = create_unique_data_sub_path(os.getcwd())

    res = create_data_dir(os.getcwd())
    res = create_id_dir(prj_id)
    if (res == "error"):
        raise HTTPException(status_code=503, detail="CannotCreateUniqueDir")
    if (model_file_size == 0):
        raise HTTPException(status_code=400, detail="CannotAddEmptyFile")

    res = create_id_path_about_add_about(prj_id, project_name)

    res = create_id_path_and_add_model(prj_id, model_file, model_file_name)

    if (cal_file is not None):
        res = create_id_path_and_add_cal(prj_id, cal_file)

    return { "id": prj_id }

#

CheckModeEnum = Enum("CheckModeEnum", { "unsafe": "unsafe", "safe": "safe" })
CommitmentEnum = Enum("CommitmentEnum", { "kzg": "kzg", "ipa": "ipa" })
InputVizEnum = Enum(
    "input_visibility",
    {
        "private": "private", "public": "public",
        "hashed/public": "hashed/public", "hashed/private": "hashed/private",
        "polycommit": "polycommit",
    }
)
OutputVizEnum = Enum(
    "output_visibility",
    {
        "public": "public", "private": "private", "fixed": "fixed",
        "hashed/public": "hashed/public", "hashed/private": "hashed/private",
        "polycommit": "polycommit",
    }
)
ParamsVizEnum = Enum(
    "param_visibility", {
        "public": "public", "private": "private", "fixed": "fixed",
        "hashed/public": "hashed/public", "hashed/private": "hashed/private",
        "polycommit": "polycommit"
    }
)
class St(BaseModel):
    check_mode: Optional[CheckModeEnum] = None # Optional[Literal["unsafe", "safe"]] = None
    commitment: Optional[CommitmentEnum] = None # Optional[Literal["kzg", "ipa"]] = None
    div_rebasing: Optional[bool] = False
    input_scale: Optional[int] = 7
    input_visibility: Optional[InputVizEnum] = None # str = "private" # Required
    logrows: Optional[int] = 17
    lookup_range: Optional[list[int]] = [-32768, 32768]
    num_inner_cols: Optional[int] = 2
    output_visibility: Optional[OutputVizEnum] = None # str = "public" # Required
    param_scale: Optional[int] = 7
    param_visibility: Optional[ParamsVizEnum] = None # str = "fixed" # Required
    rebase_frac_zero_constants: Optional[bool] = False
    scale_rebase_multiplier: Optional[int] = 1
    tolerance: Optional[float] = 1
    variables: Optional[list[tuple[str, int]]] = None

@app.post('/prj/{prj_id}/job/gen-settings', response_model=None)
def prj_id_job_gen_settings(prj_id: str, s: St, model: str=None, out: str=None):
    """
    This will start by set the param visibility to fixed so that the params
    are hardcoded into the circuit and can't be updated later.
    The input visibility should be private and the output visibility
    should be the default (public). Also, out is optional and represents
    the filename of the final settings file. \n
    Use:
    `{"input_visibility":"private","param_visibility": "fixed"}`
    """
    path = f"{os.getcwd()}/data/{prj_id}"
    model = f"{path}/{model if model else 'network.onnx'}"
    output_file_name = out if out else "settings.json"
    output = f"{path}/{output_file_name}"
    if (not validate_folder_existence(path)):
        raise HTTPException(status_code=404, detail="Unable to locate prj")

    py_run_args = ezkl.PyRunArgs()
    py_run_args = update_ezkl_py_run_args(py_run_args, s)

    res = ezkl.gen_settings(model=model, output=output, py_run_args=py_run_args)
    size = os.path.getsize(output)

    if (res == False):
        raise HTTPException(status_code=400, detail="Unable to gen settings")
    if (size == 0):
        raise HTTPException(status_code=400, detail="Empty settings file")
    return { "settings": { "filename": output_file_name, "size": size } }

@app.post('/prj/{prj_id}/job/upload', response_model=None)
def prj_id_job_upload(prj_id: str, f: UF = File(...)) -> None:
    """
    Upload the given file to the project unique location as in
    the location that has the prj id in it's path. \n
    Use:
    `-F 'f=@input.json' -H 'Content-Type: multipart/form-data'`
    """
    path = f"{os.getcwd()}/data/{prj_id}"

    input_file = f
    input_path = f"{path}/{input_file.filename}"

    if (not validate_folder_existence(path)):
        raise HTTPException(status_code=404, detail="Unable to locate prj")

    with open(input_path, "wb+") as f:
        f.write(input_file.file.read())
        f.close()

    size = os.path.getsize(input_path)
    return { "file": { "filename": input_file.filename, "size": size } }

@app.get("/prj/{prj_id}/job/download")
def prj_id_job_download(prj_id: str, f: str):
    """
    Download the given file from the correct unique project path \n
    Use: `?f=proof.json`
    """
    path = f"{os.getcwd()}/data/{prj_id}"
    path_full = f"{path}/{f}"

    media_type = "application/octet-stream"

    if (not validate_folder_existence(path)):
        raise HTTPException(status_code=404, detail="Unable to locate prj")
    if (not os.path.exists(path_full)):
        raise HTTPException(status_code=404, detail="Unable to locate file")

    return FileResponse(path=path_full, filename=f, media_type=media_type)

#

@app.post("/prj/{prj_id}/job/load")
async def prj_id_job_job(prj_id: str, data_json: Dict[AnyStr, Any], n: str):
    """
    Add as file any arbitrary valid JSON data loaded as payload.
    After checking the JSON it will use the n ( name ) as the
    name of the file. Use this to create JSON files in your prj.
    You can use and empty object to delete the file w/ the given name. \n
    Use: `-H 'Content-Type: application/json'`, `-d '{}'` and `?n=input.json`
    """
    path = f"{os.getcwd()}/data/{prj_id}"
    path_full = f"{path}/{n}"

    if (not n):
        raise HTTPException(status_code=400, detail="Filename not given")
    if (not validate_folder_existence(path)):
        raise HTTPException(status_code=404, detail="Unable to locate prj")

    if (bool(data_json)):
        upload_id_path_json(path_full, data_json)
    else:
        delete_file_from_folder(path_full)

    return { "message": "File created or deleted successfully" }

#

Targ = Enum("target", { "resources": "resources", "accuracy": "accuracy" }) # class Targ(str, Enum): resources = "resources"
class Calib(BaseModel):
    data: Optional[str] = None
    model: Optional[str] = None
    settings: Optional[str] = None
    lookup_safety_margin: Optional[int] = None
    scales: Optional[list[int]] = [2, 7]
    scale_rebase_multiplier: Optional[list[int]] = None
    max_logrows: Optional[int] = None
    only_range_check_rebase: Optional[bool] = None

@app.post('/prj/{prj_id}/job/calibrate-settings', response_model=None)
async def prj_id_job_calibrate_settings(prj_id: str, args: Calib, target: Targ):
    """
    This will calibrate the settings file.
    This assumes the cal_data.json file is present in the project folder.
    Select resources for a fast calib / accuracy for a better longer process.
    This is going to take roughly 25 sec\n
    Use:
    `{"scales": [2,7]}`
    """
    path = f"{os.getcwd()}/data/{prj_id}"

    cal_data = f"{path}/cal_data.json"
    args.model = f"{path}/{args.model if args.model else 'network.onnx'}"
    sfn = dict(args)["settings"] if dict(args)["settings"] else "settings.json"
    args.settings = f"{path}/{sfn}"

    if (not validate_folder_existence(path)):
        raise HTTPException(status_code=404, detail="Unable to locate prj")

    if (not validate_file_existence(cal_data)):
        raise HTTPException(status_code=400, detail="Cannot find cal file")
    if (not validate_file_existence(args.model)):
        raise HTTPException(status_code=400, detail="Cannot find model")
    if (not validate_file_existence(args.settings)):
        raise HTTPException(status_code=400, detail="Cannot find settings")

    target = target.value

    rest = list_skip_empty_values(args)

    print("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n")
    await ezkl.calibrate_settings(
        data=cal_data, target=target, **rest
    )

    return { "message": "Calibrated successfully" }

class Circ(BaseModel):
    model: Optional[str] = "network.onnx"
    settings_path: Optional[str] = "settings.json"

@app.post('/prj/{prj_id}/job/compile-circuit', response_model=None)
def prj_id_job_compile_circuit(prj_id: str, args: Circ, out: str = None):
    """
    Compile circuit and return the size of it. The second optional parameter,
    out represents the filename of the circuit.
    Use `{}` as data payload.
    """
    path = f"{os.getcwd()}/data/{prj_id}"
    model = f"{path}/{args.model if args.model else 'network.onnx'}"

    output=f"{path}/{out if out else 'network.ezkl'}"

    s=f"{path}/{args.settings_path if args.settings_path else 'settings.json'}"

    args = list_skip_empty_values(args)

    if (not validate_folder_existence(path)):
        raise HTTPException(status_code=404, detail="Unable to locate prj")
    if (dict(args).get("model") == ""):
        raise HTTPException(status_code=400, detail="Cannot use model path")
    if (dict(args).get("settings_path") == ""):
        raise HTTPException(status_code=400, detail="Cannot use settings path")

    res = ezkl.compile_circuit(
        model=model, compiled_circuit=output, settings_path=s
    )
    if (not res):
        raise HTTPException(status_code=400, detail="Compilation failed")

    size = os.path.getsize(output)
    output_file_name = out if out else "network.ezkl"

    return { "circuit": { "filename": output_file_name, "size": size } }

#

CommitmentSrsEnum = Enum("CommitmentEnum", { "kzg": "kzg", "ipa": "ipa" })
class GetSrs(BaseModel):
    settings_path: Optional[str] = "settings.json"
    logrows: Optional[int] = None
    commitment: Optional[CommitmentSrsEnum] = "kzg"

@app.post('/prj/{prj_id}/job/get-srs', response_model=None)
async def prj_id_job_get_srs(prj_id: str, srs: GetSrs) -> None:
    """
    Gets as in downloads the SRS file based on your prj.
    Returns a info about the size of the grabbed file.
    This is going to take roughly 10 sec or 48 on accuracy target\n
    Use `{}` as data payload.
    """
    path = f"{os.getcwd()}/data/{prj_id}"

    s = f"{path}/{srs.settings_path if srs.settings_path else 'settings.json'}"
    settings = s
    output = f"{path}/kzg.srs"

    srs = list_skip_empty_values(srs)

    if (not validate_folder_existence(path)):
        raise HTTPException(status_code=404, detail="Unable to locate prj")

    commitment = ezkl.PyCommitments.KZG
    if ("commitment" in srs and srs["commitment"] == "ipa"):
        commitment = ezkl.PyCommitments.IPA
    logrows = None
    if ("logrows" in srs):
        logrows = srs.logrows

    res = await ezkl.get_srs(
        settings_path=settings, srs_path=output,
        commitment=commitment, logrows=logrows
    )
    if (not res):
        raise HTTPException(status_code=400, detail="Download SRS failed")

    size = os.path.getsize(output)

    return { "srs": { "filename": "kzg.srs", "size": size } }

#

class ArgsSetup(BaseModel):
    model: Optional[str] = "network.ezkl"
    settings_path: Optional[str] = "settings.json"
    srs_path: Optional[str] = "kzg.srs"
    disable_selector_compression: Optional[bool] = False

@app.post('/prj/{prj_id}/job/setup', response_model=None)
def prj_id_job_setup(prj_id: str, args: ArgsSetup, v: str=None, p: str=None):
    """
    Creates the verifier vk.key and prover key pk.key.
    This is going to take roughly 13 sec or 3+ min on accuracy target
    The second optional arg v refers to the output vk filename.
    The third optional arg p refers to the output pk filename.\n
    Use `{}` as data payload.
    """
    path = f"{os.getcwd()}/data/{prj_id}"

    compiled_model_path=f"{path}/{args.model if args.model else 'network.ezkl'}"
    vk_path = f"{path}/{v if v else 'vk.key'}"
    pk_path = f"{path}/{p if p else 'pk.key'}"
    srs_path = f"{path}/{args.srs_path if args.srs_path else 'kzg.srs'}"

    args = list_skip_empty_values(args)
    rest = dict()
    if ("disable_selector_compression" in args):
        dsc = args["disable_selector_compression"]
        rest = dict(disable_selector_compression=dsc)

    res = ezkl.setup(
        model=compiled_model_path,
        vk_path=vk_path,
        pk_path=pk_path,
        srs_path=srs_path,
        **rest
    )

    if (not res):
        raise HTTPException(status_code=400, detail="Vk and Pk setup failed")

    size_v = os.path.getsize(vk_path)
    size_p = os.path.getsize(pk_path)
    vk_file_name = v if v else "vk.key"
    pk_file_name = p if p else "pk.key"

    info_v = { "filename": vk_file_name, "size": size_v }
    info_p = { "filename": pk_file_name, "size": size_p }

    return { "v_key": info_v, "p_key": info_p }

#

class ArgsGen(BaseModel):
    data: Optional[str] = "input.json"
    model: Optional[str] = "network.ezkl"
    vk_path: Optional[str] = "vk.key"
    srs_path: Optional[str] = "kzg.srs"

@app.post('/prj/{prj_id}/job/gen-witness', response_model=None)
async def prj_id_job_gen_witness(prj_id: str, args: ArgsGen, out: str = None):
    """
    Generates the witness.json file from using the input.json,
    the compiled model, the verifier (key vk.key) and the srs file (kzg.srs)
    The out optional parameter represents the filename of the witness json\n
    Use `{}` as data payload.
    """

    path = f"{os.getcwd()}/data/{prj_id}"

    data_input = f"{path}/{args.data if args.data else 'input.json'}"
    model_compiled = f"{path}/{args.model if args.model else 'network.ezkl'}"

    output = f"{path}/{out if out else 'witness.json'}"

    vk_path = f"{path}/{args.vk_path if args.vk_path else 'vk.key'}"
    srs_path = f"{path}/{args.srs_path if args.srs_path else 'kzg.srs'}"

    if (not validate_folder_existence(path)):
        raise HTTPException(status_code=404, detail="Unable to locate prj")

    await ezkl.gen_witness(
        data=data_input,
        model=model_compiled,
        output=output,
        vk_path=vk_path,
        srs_path=srs_path,
    )

    size = os.path.getsize(output)
    output_file_name = out if out else 'witness.json'

    return { "witness": { "filename": output_file_name, "size": size } }

#

PTypeEnum = Enum("PTypeEnum", { "single": "single", "for-aggr": "for-aggr" })
class ArgsProof(BaseModel):
    witness: Optional[str] = "witness.json"
    model: Optional[str] = "network.ezkl"
    pk_path: Optional[str] = "pk.key"
    proof_type: Optional[PTypeEnum] = "single"
    srs_path: Optional[str] = "kzg.srs"

@app.post("/prj/{prj_id}/job/gen-proof")
def prj_id_job_gen_proof(prj_id: str, args: ArgsProof, out: str = None):
    """
    Generates the proof.json file and uses witness, circuit, pk,
    proof type and srs as arguments.
    This is going to take roughly 12 sec or 5 min on accuracy target
    The optional param out represents the filename of the proof json file\n
    Use `{}` as data payload.
    """
    path = f"{os.getcwd()}/data/{prj_id}"

    witness = f"{path}/{args.witness if args.witness else 'witness.json'}"
    model_compiled=f"{path}/{args.model if args.model else 'network.ezkl'}"
    pk_path = f"{path}/{args.pk_path if args.pk_path else 'pk.key'}"

    output = f"{path}/{out if out else 'proof.json'}"

    proof_type = f"single"
    srs_path = f"{path}/{args.srs_path if args.srs_path else 'kzg.srs'}"

    if ("proof_type" in args and args["proof_type"] == "for-aggr"):
        proof_type = "for-aggr"

    if (not validate_folder_existence(path)):
        raise HTTPException(status_code=404, detail="Unable to locate prj")

    res = ezkl.prove(
        witness=witness,
        model=model_compiled,
        pk_path=pk_path,
        proof_path=output,
        proof_type=proof_type,
        srs_path=srs_path,
    )

    if (not res):
        raise HTTPException(status_code=400, detail="Proof gen failed")

    proof = res["proof"]
    proof_file_name = out if out else 'proof.json'
    size = os.path.getsize(output)

    return { "pf": {"filename": proof_file_name, "size": size}, "proof": proof }

class ArgsVerify(BaseModel):
    proof_path: Optional[str] = "proof.json"
    settings_path: Optional[str] = "settings.json"
    vk_path: Optional[str] = "vk.key"
    srs_path: Optional[str] = "kzg.srs"
    non_reduced_srs: Optional[bool] = False

@app.post("/prj/{prj_id}/job/verify")
def prj_id_job_verify(prj_id: str, ag: ArgsVerify):
    """
    Verifies the proof outputting true or false depending on if
    the proof is valid or not.
    This uses as input the proof, settings, vk, the srs file and
    the non_reduced_srs boolean (false by default).\n
    Use `{}` as data payload.
    """
    path = f"{os.getcwd()}/data/{prj_id}"
    proof_path=f"{path}/{ag.proof_path if ag.proof_path else 'proof.json'}"
    s_path=f"{path}/{ag.settings_path if ag.settings_path else 'settings.json'}"
    vk_path = f"{path}/{ag.vk_path if ag.vk_path else 'vk.key'}"
    srs_path = f"{path}/{ag.srs_path if ag.srs_path else 'kzg.srs'}"

    rest = dict()
    if ("non_reduced_srs" in ag):
        rest = dict(non_reduced_srs=ag["non_reduced_srs"])

    if (not validate_folder_existence(path)):
        raise HTTPException(status_code=404, detail="Unable to locate prj")

    error = None
    try:
        res = ezkl.verify(
            proof_path=proof_path,
            settings_path=s_path,
            vk_path=vk_path,
            srs_path=srs_path,
            **rest
        )
    except Exception as e:
        error = f"{e}"
    if (error):
        raise HTTPException(status_code=403, detail=error)

    return { "verification_result": res }
