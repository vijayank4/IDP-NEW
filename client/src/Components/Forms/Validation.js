const Validation = (element, inputName) => {

    //console.log(element)
    if(element.name === inputName)
    {
        if(element.getAttribute('alphabatic') === "true")
        {
            const alphabetPattern = /^[a-zA-Z]+$/
            if(element.value === '')
            {
                element.classList.remove("is-valid");
                element.classList.add("is-invalid");
                if(document.getElementById(inputName+'Error'))
                {
                    document.getElementById(inputName+'Error').remove();
                }
            }
            else if(!alphabetPattern.test(element.value))
            {
                if(document.getElementById(inputName+'Error'))
                {
                    document.getElementById(inputName+'Error').remove();
                }
                element.classList.remove("is-valid");
                element.classList.add("is-invalid");
                if(element.nextSibling === null)
                {
                    element.insertAdjacentHTML('afterend', '<div id="'+inputName+'Error" class="invalid-feedback">'+capitalizeFirstLetter(inputName)+' should be alphabatic</div>');
                }
                else
                {
                    element.nextSibling.insertAdjacentHTML('afterend', '<div id="'+inputName+'Error" class="invalid-feedback">'+capitalizeFirstLetter(inputName)+' should be alphabatic</div>');
                }
                return false;
            }
            else
            {
                element.classList.remove("is-invalid");
                element.classList.add("is-valid");
            }
        }
        if(element.getAttribute('numeric') === "true")
        {
            const numberPattern = /^[0-9]+$/
            if(element.value === '')
            {
                element.classList.remove("is-valid");
                element.classList.add("is-invalid");
                if(document.getElementById(inputName+'Error'))
                {
                    document.getElementById(inputName+'Error').remove();
                }
            }
            else if(!numberPattern.test(element.value))
            {
                if(document.getElementById(inputName+'Error'))
                {
                    document.getElementById(inputName+'Error').remove();
                }
                element.classList.remove("is-valid");
                element.classList.add("is-invalid");
                if(element.nextSibling === null)
                {
                    element.insertAdjacentHTML('afterend', '<div id="'+inputName+'Error" class="invalid-feedback">'+capitalizeFirstLetter(inputName)+' should be numeric</div>');
                }
                else
                {
                    element.nextSibling.insertAdjacentHTML('afterend', '<div id="'+inputName+'Error" class="invalid-feedback">'+capitalizeFirstLetter(inputName)+' should be numeric</div>');
                }
                return false;
            }
            else
            {
                element.classList.remove("is-invalid");
                element.classList.add("is-valid");
            }
        }
        if(element.getAttribute('alphanumeric') === "true")
        {
            const alphaNumericPattern = /^[a-zA-Z0-9]+$/
            if(element.value === '')
            {
                element.classList.remove("is-valid");
                element.classList.add("is-invalid");
                if(document.getElementById(inputName+'Error'))
                {
                    document.getElementById(inputName+'Error').remove();
                }
            }
            else if(!alphaNumericPattern.test(element.value))
            {
                if(document.getElementById(inputName+'Error'))
                {
                    document.getElementById(inputName+'Error').remove();
                }
                element.classList.remove("is-valid");
                element.classList.add("is-invalid");
                if(element.nextSibling === null)
                {
                    element.insertAdjacentHTML('afterend', '<div id="'+inputName+'Error" class="invalid-feedback">'+capitalizeFirstLetter(inputName)+' should be only numbers and alphabatics</div>');
                }
                else
                {
                    element.nextSibling.insertAdjacentHTML('afterend', '<div id="'+inputName+'Error" class="invalid-feedback">'+capitalizeFirstLetter(inputName)+' should be only numbers and alphabatics</div>');
                }
                return false;
            }
            else
            {
                element.classList.remove("is-invalid");
                element.classList.add("is-valid");
            }
        }
        if(element.getAttribute('mandatory') === "true")
        {
            if(element.getAttribute('type') === "checkbox")
            {
                var checkbox = document.getElementById(element.getAttribute('id'));
                if(checkbox.checked === false)
                {
                    checkbox.classList.remove("is-valid");
                    checkbox.classList.add("is-invalid");
                    checkbox.setAttribute('data-value', 'off');
                }
                else
                {
                    checkbox.classList.remove("is-invalid");
                    checkbox.classList.add("is-valid");
                    checkbox.setAttribute('data-value', 'on');
                }
            }
            else
            {
                if(element.value === '')
                {
                    element.classList.remove("is-valid");
                    element.classList.add("is-invalid");
                }
                else
                {
                    element.classList.remove("is-invalid");
                    element.classList.add("is-valid");
                }  
            }   
        }
        if(element.getAttribute('digit') === "true")
        {
            if(element.value === '')
            {
                element.classList.remove("is-valid");
                element.classList.add("is-invalid");
            }
            else if(element.value.length !== parseInt(element.getAttribute('maxLength')))
            {
                if(document.getElementById(inputName+'Error'))
                {
                    document.getElementById(inputName+'Error').remove();
                }
                element.classList.remove("is-valid");
                element.classList.add("is-invalid");
                if(element.nextSibling === null)
                {
                    element.insertAdjacentHTML('afterend', '<div id="'+inputName+'Error" class="invalid-feedback">'+capitalizeFirstLetter(inputName)+' should be allowed '+element.getAttribute('maxLength')+' digit</div>');
                }
                else
                {
                    element.nextSibling.insertAdjacentHTML('afterend', '<div id="'+inputName+'Error" class="invalid-feedback">'+capitalizeFirstLetter(inputName)+' should be allowed '+element.getAttribute('maxLength')+' digit</div>');
                }
                return false;
            }
            else
            {
                element.classList.remove("is-invalid");
                element.classList.add("is-valid");
            }
        }
        if(element.getAttribute('passwordpattern') === "true")
        {
            const passwordPattern = /^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%&*])[a-zA-Z0-9!@#$%&*]+$/
            if(element.value === '')
            {
                element.classList.remove("is-valid");
                element.classList.add("is-invalid");
                if(document.getElementById(inputName+'Error'))
                {
                    document.getElementById(inputName+'Error').remove();
                }
            }
            else if(!passwordPattern.test(element.value))
            {
                if(document.getElementById(inputName+'Error'))
                {
                    document.getElementById(inputName+'Error').remove();
                }
                element.classList.remove("is-valid");
                element.classList.add("is-invalid");
                if(element.nextSibling === null)
                {
                    element.insertAdjacentHTML('afterend', '<div id="'+inputName+'Error" class="invalid-feedback">'+capitalizeFirstLetter(inputName)+' must contain at least one numeric and one alphabetic and one special character</div>');
                }
                else
                {
                    element.nextSibling.insertAdjacentHTML('afterend', '<div id="'+inputName+'Error" class="invalid-feedback">'+capitalizeFirstLetter(inputName)+' must contain at least one numeric and one alphabetic and one special character</div>');
                }
                return false;
            }
            else if(document.getElementById(element.getAttribute('elementname')) !== null)
            {
                if(document.getElementById(element.getAttribute('elementname')).value !== element.value)
                {
                    if(document.getElementById(inputName+'Error'))
                    {
                        document.getElementById(inputName+'Error').remove();
                    }
                    element.classList.remove("is-valid");
                    element.classList.add("is-invalid");
                    if(element.nextSibling === null)
                    {
                        element.insertAdjacentHTML('afterend', '<div id="'+inputName+'Error" class="invalid-feedback">'+capitalizeFirstLetter(element.getAttribute('elementName'))+' and '+inputName+' should not be same</div>');
                    }
                    else
                    {
                        element.nextSibling.insertAdjacentHTML('afterend', '<div id="'+inputName+'Error" class="invalid-feedback">'+capitalizeFirstLetter(element.getAttribute('elementName'))+' and '+inputName+' should not be same</div>');
                    }
                    return false;
                }
                else
                {
                    element.classList.remove("is-invalid");
                    element.classList.add("is-valid");
                }
            }
            else
            {
                element.classList.remove("is-invalid");
                element.classList.add("is-valid");
            }
        }
    }
};
function capitalizeFirstLetter(str)
{
    return str.charAt(0).toUpperCase() + str.slice(1);
} 

export default Validation;