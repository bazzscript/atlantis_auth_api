const utils = {}


// Utility Funtion that generates a random string of 6 character
utils.generateRandomString = () => {
    const randomNumericString = Math.floor(100000 + Math.random() * 900000).toString();
    return randomNumericString;
}


module.exports = utils;