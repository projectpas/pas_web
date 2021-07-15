

export function emailPattern() {
    return"[a-zA-Z0-9.-\._\w.-]{1,}@[a-zA-Z0-9.-]{2,}[.]{1}[a-zA-Z0-9]{2,}";
}

export function urlPattern() {
    return "/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/"
    // return "^([hH][tT]{2}[pP][sS]?:\\/\\/){0,1}(www\\.){0,1}[a-zA-Z0-9\\.\\-]+\\.[a-zA-Z]{2,5}[\\.]{0,1}"
    // return /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
    // return /([hH][tT]{2}[pP][sS]?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,6})/gi;
    // return '([hH][tT]{2}[pP][sS]?://)?([\da-zA-Z.-]+)\\.([a-zA-Z.]{2,6})[/\\w .-]*/?';
    // return /(http(s)?:\\)?([\w-]+\.)+[\w-0-9]+\.+[a-zA-Z0-9]+(\[\?%&=]*)?/;    
    //return /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
    //return /[-a-zA-Z0-9@:%.\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%\+.~#?&//=]*)?/gi;
    // return "^((ht|f)tp(s?))\://([0-9a-zA-Z\-]+\.)+[a-zA-Z]{2,6}(\:[0-9]+)?(/\S*)?$"
}

export function titlePattern() {
    return "([a-zA-Z]+[a-zA-Z0-9.-_ ]+|[a-zA-Z0-9.-_ ]+[a-zA-Z]+)[a-zA-Z0-9.-_ ]*$"
}

export function phonePattern() {
    return "[0-9-]{6,}"
}

export function mobilePattern() {
    return "[0-9-]{10,}"
}

export function geaterThanZeroPattern() {
    return "^$|^([1-9]|[1-9][0-9]|[1-9][0-9][0-9]|[1-9][0-9][0-9][0-9]|[1-9][0-9][0-9][0-9][0-9]||[1-9][0-9][0-9][0-9][0-9][0-9]||[1-9][0-9][0-9][0-9][0-9][0-9][0-9])?"
}

export function namePattern() {
    return "([a-zA-Z0-9.-_/ ])[a-zA-Z0-9.-_ ]*$"
}

export function timePattern() {
    return "[0-9]{2,3}:[0-9]{2}";
}

