# utils.py

from __future__ import annotations
import os, re, json
from datetime import datetime
from enum import Enum
from typing import List, Tuple, Any

def create_unique_sub_path() -> str:
    """
    Creates a unique sub-path based on the current date and time,
    using zero-padding for single-digit values.
    """
    now = datetime.now()
    result = f"{now.year}"
    result += f"{str(now.month).zfill(2)}"
    result += f"{str(now.day).zfill(2)}"
    result += f"{str(now.hour).zfill(2)}"
    result += f"{str(now.minute).zfill(2)}"
    return result

def create_unique_data_sub_path(path: str) -> str:
    """
    Combines the current working directory, 'data' subdirectory, and a unique
    path based on the current date and time.
    """
    current_dir = path # os.getcwd()
    # result = os.joinpath(current_dir, "data", create_unique_sub_path())
    result = f"{current_dir}/data/{create_unique_sub_path()}"
    return result

def create_data_dir(path: str) -> str:
    """
    Creates a 'data' directory in the current working directory if it does not exist.
    Returns an empty string if the directory exists, otherwise creates and returns the path to the newly created directory.
    """
    current_dir = path
    data_path = f"{current_dir}/data"
    empty_str = "" if os.path.exists(data_path) else os.mkdir(data_path)
    return empty_str

def create_id_dir(path: str) -> str:
    """
    Creates an 'id' directory in the correct place if it does not exist
    """
    error_or_empty = "error" if os.path.exists(path) else os.mkdir(path)
    return error_or_empty

def create_id_path_about_add_about(prj_id: str, name: str):
    """
    Creates an about_project file with adding the value of nam in it
    """
    about_path = f"{prj_id}/about_project.txt"
    if (os.path.exists(about_path)):
        return "error"
    with open(about_path, "w") as f:
        json.dump(dict(name=name), f, separators=(',', ':'))
        f.close()
    return ""

def create_id_path_and_add_model(prj_id, model_file, model_file_name):
    """
    Creates a file in the given path and places the model data as binary
    """
    model_path = f"{prj_id}/{model_file_name}"
    if os.path.exists(model_path):
        return "error"
    with open(model_path, "wb+") as f:
        f.write(model_file.file.read())
        f.close()

def create_id_path_and_add_cal(prj_id, cal_file):
    """
    Create a file in the given path and place the cal data in it as binary
    """
    cal_path = f"{prj_id}/cal_data.json"
    if os.path.exists(cal_path):
        return "error"
    with open(cal_path, "wb+") as f:
        f.write(cal_file.file.read())
        f.close()

def read_files_from_folder(folder_path: str) -> List[Tuple[str, int]]:
    """
    Reads all filenames and their sizes from the given folder and returns them as a list of tuples.
    :param folder_path: Path to the folder containing the files.
    :return: A list of tuples, each containing the filename and its size in bytes.
    """
    return [(filename, os.path.getsize(os.path.join(folder_path, filename)))
            for filename in os.listdir(folder_path)
            if os.path.isfile(os.path.join(folder_path, filename))]

def list_sub_folders(p: str) -> List[str]:
    """
    Lists all level-one sub-folders from the given folder.
    :param folder_path: Path to the folder containing the sub-folders.
    :return: A list of names of the level-one sub-folders.
    """
    l = [name for name in os.listdir(p) if os.path.isdir(os.path.join(p, name))]
    return l

def validate_folder_existence(p: str) -> bool:
    """Validates if the a folder exists."""
    return bool(True if os.path.isdir(p) else False)

def validate_file_existence(p: str) -> bool:
     """Validates if the a file exists."""
     return bool(True if os.path.isfile(p) else False)

def validate_date_time_string(s: str) -> bool:
    """Validates if the input string matches the 'YYYYMMDDHHmm' format."""
    pattern = r'^\d{12}$'
    return bool(re.match(pattern, s))

def delete_all_files_from_folder(p: str) -> None:
    """Deletes all files from the given folder."""
    join = os.path.join
    [os.remove(join(p, f)) for f in os.listdir(p) if os.path.isfile(join(p, f))]
    return None

def delete_folder(p: str) -> None:
    """Deletes the given folder assuming that folder is empty."""
    os.rmdir(p)
    return None

def upload_id_path_json(p: str, data: any) -> None:
    """
    Creates a json file in the given path with given data
    """
    with open(p, "w+") as f:
        json.dump(dict(data), f, separators=(',', ':'))
        f.close()
    return True

def delete_file_from_folder(p: str) -> None:
    """
    Deletes the given file as in file w/ given path.
    """
    if (os.path.exists(p)):
        os.remove(p)
    return True

def list_skip_empty_values(args: list) -> list:
    """Skip all key values where the value is empty."""
    l = {k: v for k, v in dict(args).items() if v is not None}
    return l

def update_ezkl_py_run_args(py_run_args: Any, args_set: Any) -> dict:
    """Update only the values that need changing from the ezkl args all obj"""
    args = {k: v for k, v in dict(args_set).items() if v is not None}
    for k, v in args.items():
        if (type(v) is list):
            v = (tuple(v))
        if (isinstance(v, Enum)):
            v = v.name
        py_run_args.__setattr__(k, v)
    return py_run_args
