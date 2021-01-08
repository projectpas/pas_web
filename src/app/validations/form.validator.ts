export function pulloutRequiredFieldsOfForm(form){
    let errors = [];
    let listOfErrors = [];
     Object.keys(form.controls).map(key => {
                errors = form.controls[key].errors;
               if (errors === null) { return null; }            
               if (errors['required']) {  
                 let titlevalue = key;
                 if(document.getElementById(key)){
                     titlevalue = document.getElementById(key).getAttribute('title');
                 }
                   listOfErrors.push(`${titlevalue} is required`); //test
               } else {
                  // listOfErrors.push(`${key} has an unknown error`);
               }
             });
    
    
    return listOfErrors;
    }