const Term = require('../models/Term.model');

const createTerm = async (courseId, arrayTerm, arrayMean) => {
    try {
        const length = arrayTerm.length;
        const arrayPromise = [];
        for (let i = 0; i < length; i++) {
            const newTerm = {
                course: courseId,
                nameTerm: arrayTerm[i],
                mean: arrayMean[i]
            }

            const term = new Term(newTerm);
            arrayPromise.push(term.save());
        }
        await Promise.all(arrayPromise);
    } catch (error) {
        throw new Error(error)
    }
        
}



module.exports = { createTerm }