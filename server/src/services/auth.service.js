exports.hashPassword = async (pwd) => pwd;
exports.compare = async (pwd, hash) => pwd === hash;
