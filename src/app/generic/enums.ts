export function getModuleNameById(id) {
    const moduleId = parseInt(id)
    switch (moduleId) {
        case 1: {
            return 'Customer '
        }
        case 2: {
            return 'Vendor';
        }
        case 3: {
            return 'LegalEntity';

        }
    }
}
export function getModuleIdByName(name) {
    const moduleName = name
    switch (moduleName) {
        case 'Customer': {
            return 1
        }
        case 'Vendor': {
            return 2;
        }
        case 'LegalEntity': {
            return 3;

        }
    }
}

