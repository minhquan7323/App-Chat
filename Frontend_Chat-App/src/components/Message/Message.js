const success = (mes = 'Success') => {
    return { status: 'success', message: mes };
};

const error = (mes = 'Error') => {
    return { status: 'error', message: mes };
};

const warning = (mes = 'Warning') => {
    return { status: 'warning', message: mes };
};

const info = (mes = 'Info') => {
    return { status: 'info', message: mes };
};

export {
    success,
    error,
    warning,
    info
};
