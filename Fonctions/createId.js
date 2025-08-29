const CHARACTERS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

module.exports = prefix => {
    let id = "";
    for (let i = 0; i < 10; i++) {
        id += CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
    }
    return `${prefix}-${id}`;
};
