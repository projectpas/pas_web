import { DBkeys } from "../services/db-Keys";

// used to pass (field/key) and value and original Data and get  Filtered Data Bases on the (value/input) you give 
export function getObjectByValue(field: string, value: string, originalData: any) {
    if ((field !== '' && field !== undefined) && (value !== '' && value !== undefined) && (originalData !== undefined && originalData.length > 0)) {
        const data = originalData.filter(x => {
            if (x[field] === value) {
                return x;
            }
        })
        return data[0];
    }

}
// used to pass  (field/key) and id and original Data and get  Filtered Data Bases on the (id/input) you give 
export function getObjectById(field: string, id: any, originalData: any) {


    if ((field !== '' && field !== undefined) && (id !== '' && id !== undefined) && (originalData !== undefined && originalData.length > 0)) {
        const data = originalData.filter(x => {

            if (parseInt(x[field]) === parseInt(id)) {
                return x;
            }
        })
        return data[0];
    }
}
// pass (field/key) and assigned value from the object  
export function getValueFromObjectByKey(field: string, object: any) {

    if ((field !== '' && field !== undefined) && (object !== undefined && object !== null)) {
        return object[field];
    }
}
// pass the (field/key) and (idField) where to Match with the  (id/input) from Original Data and particular value of key after Filter
export function getValueFromArrayOfObjectById(field: string, idField: string, id: any, originalData: any) {
    if ((field !== '' && field !== undefined) && (idField !== '' && idField !== undefined) && (id !== '' && id !== undefined) && (originalData !== undefined && originalData.length > 0)) {
        const data = originalData.filter(x => {
            if (parseInt(x[idField]) === parseInt(id)) {
                return x;
            }
        })
        return (data && data.length > 0)?data[0][field]:'';
    }
}


// Used to Return String on Create Mode on Edit Mode Return the String from the Object 
export function editValueAssignByCondition(field: any, value: any) {
    if ((value !== undefined) && (field !== '' && field !== undefined)) {
        if (typeof (value) === 'string' || typeof (value) === 'number') {
            return value
        } else {
            return getValueFromObjectByKey(field, value)
        }
    }
}


export function FilterDataNotEquals(field, object, originalData) {
    if ((field !== '' && field !== undefined) && (object !== undefined && object !== null) && (originalData !== undefined && originalData.length > 0)) {
        //  data = 
        const data = originalData.reduce((acc, obj) => {
            return acc.filter(x => x[field] !== object[field])
        }, originalData)

        return data;
    }
}

// Used to Match and Validate the current selected and Previous data and return Boolean on Edit Mode
export function selectedValueValidate(field: string, object: any, editData: any) {



    if ((field !== '' && field !== undefined) && (object !== undefined && object !== null) && (editData !== undefined && editData !== null)) {
        // if(editData !== undefined){

        // }
        return getValueFromObjectByKey(field, object) == editValueAssignByCondition(field, editData[field]);

    }

}

export function validateRecordExistsOrNotOnEdit(field: string, currentInput: any, editData: any, originalData: any) {
    if ((field !== '' && field !== undefined) && (currentInput !== '' && currentInput !== undefined) && (editData !== undefined && editData !== null) && (originalData !== undefined && originalData.length > 0)) {
        const data = originalData.filter(x => {
            return x[field] !== editData[field];
        })
        return data;
    }

}

// Used to Autocomplete Validation Whether Record Exist or not on the Key Event Comparses with original Data 
export function validateRecordExistsOrNot(field: string, currentInput: any, originalData: any, editModeDataObject?: any) {

    let filterOriginalData = originalData;
    if (editModeDataObject !== undefined) {
        filterOriginalData = validateRecordExistsOrNotOnEdit(field, currentInput, editModeDataObject, originalData)
    }
    if ((field !== '' && field !== undefined) && (currentInput !== '' && currentInput !== undefined) && (originalData !== undefined && originalData.length > 0)) {
        if (typeof (currentInput) === 'string') {
            const data = filterOriginalData.filter(x => {
                return x[field].toLowerCase() === currentInput.toLowerCase().trim()
            })
            return data;
        } else if (typeof (currentInput) === 'number') {
            const data = filterOriginalData.filter(x => {

                return parseInt(x[field]) === currentInput
            })
            return data;
        }

    } else {
        return [];
    }

}
export function colorCodeGeneratorForHistory(index: number, field: string, value: any, dataList: any) {
    // console.log(index, field, value, dataList);

    if ((index !== null && index !== undefined) && (field !== '' && field !== undefined) && (value !== '' && value !== undefined) && (dataList !== undefined)) {
        // console.log(index, field, value, dataList);
        const dataLength = this.dataList.length;
        if (index >= 0 && index <= dataLength) {
            if ((index + 1) === dataLength) {
                return true;
            } else {
                return dataList[index + 1][field] === value
            }

        }
    }
}



export function listSearchFilterObjectCreation(filterData) {
    const data = filterData;
    let result = {};
    if (data !== undefined) {
        const keys = Object.keys(data);
        for (var i = 0; i < keys.length; i++) {
            result[keys[i]] = data[keys[i]]['value'] === undefined ? data[keys[i]] : data[keys[i]]['value']
        }
        // const a = keys.map(x => {
        //     return {
        //         [x]: data[x]['value']
        //     }
        // })
    }
    return result;
}

export function getPageCount(totalNoofRecords?, pageSize?) {
    return Math.ceil(totalNoofRecords / pageSize)
}


export function validateRecordExistsOrNotForInput(currentInput: any, originalData: any, originalDataField: string, editModeDataObject?: any) {

    if ((currentInput !== '' && currentInput !== undefined) && (originalData !== undefined && originalData.length > 0)) {
        if (typeof (currentInput) === 'string') {
            const data = originalData.filter(x => {
                return x[originalDataField].toLowerCase() === currentInput.toLowerCase().trim()
            })
            return data;
        } else if (typeof (currentInput) === 'number') {
            const data = originalData.filter(x => {

                return parseInt(x[originalDataField]) === currentInput
            })
            return data;
        }

    } else {
        return [];
    }
}

export function toLowerCaseOnInput(value) {
    if (value !== undefined && typeof (value) === 'string') {
        return value.toLowerCase();
    }
}

export function getValueByFieldFromArrayofObject(field, value, originalData) {
    if ((field !== '' && field !== undefined) && (value !== '' && value !== undefined) && (originalData !== undefined && originalData.length > 0)) {
        return originalData.filter(x => {
            if (x[field] === value) {
                return x;
            }
        })
    }
}



export function formatNumberAsGlobalSettingsModule(value, decimalCount){
    if (value || value == 0 || value == "0") {
        if (isNaN(value) == true) {
            value = Number(value.replace(/[^0-9.-]+/g, ""));
        }
        let globalSettings = localStorage.getItem(DBkeys.GLOBAL_SETTINGS) || {};
        let  global_lang = globalSettings['cultureName'];
        value = new Intl.NumberFormat(global_lang, { style: 'decimal', minimumFractionDigits: decimalCount, maximumFractionDigits: decimalCount }).format(value)
    }
    return value;

}

export function formatStringToNumber(value){
    if(value){
        if (isNaN(value) == true) {
            value = Number(value.replace(/[^0-9.-]+/g, ""));
        }
    }
    return value
}

export function isEmptyObject(value) {
    for(var key in value) {
        if(value.hasOwnProperty(key))
            return false;
    }
    return true;
}

