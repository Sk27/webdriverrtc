function calculateArray (operation, results) {
    var ret = {}
    results.forEach((result) => {
        calcResult[operation](result, ret)
    })
    return ret
}

/**
 * calculate result
 */
const calcResult = {
    /**
     * adds all consecutive result values
     */
    '+': (results, result) => {
        if (Array.isArray(results)) {
            var ret = {}
            results.forEach((result) => calcResult['+'](result, ret))
            return ret
        }

        Object.keys(results).forEach((attr) => {
            if (typeof results[attr] === 'object') {
                if (!result[attr]) {
                    result[attr] = {}
                }

                return calcResult['+'](results[attr] || {}, result[attr])
            } else if (typeof results[attr] !== 'number') {
                return false
            }

            result[attr] = (result[attr] || 0) + results[attr]
        })
    },
    /**
     * devides each object value by divisor
     */
    '/': (divident, divisor, toFixed = 2) => {
        var result = JSON.parse(JSON.stringify(divident))
        Object.keys(result).forEach((attr) => {
            if (typeof result[attr] === 'object') {
                result[attr] = calcResult['/'](result[attr] || {}, divisor, toFixed)
                return result[attr]
            }

            result[attr] /= divisor
            result[attr] = result[attr].toFixed(toFixed) / 1
        })

        return result
    },
    /**
     * keeps the max value
     */
    'max': (results = {}, result) => {
        if (Array.isArray(results)) {
            let ret = {}
            results.forEach((result) => calcResult['max'](result, ret))
            return ret
        }

        Object.keys(results).forEach((attr) => {
            if (typeof results[attr] === 'object') {
                if (!result[attr]) {
                    result[attr] = {}
                }

                return calcResult['max'](results[attr] || {}, result[attr] || {})
            } else if (typeof results[attr] !== 'number') {
                return false
            }

            if (!result[attr]) {
                result[attr] = results[attr]
            } else if (results[attr] > result[attr]) {
                result[attr] = results[attr]
            }
        })
    },
    /**
     * keeps the min value
     */
    'min': (results, result) => {
        if (Array.isArray(results)) {
            return calculateArray('min', results)
        }

        Object.keys(results).forEach((attr) => {
            if (typeof results[attr] === 'object') {
                if (!result[attr]) {
                    result[attr] = {}
                }

                return calcResult['min'](results[attr] || {}, result[attr] || {})
            }

            if (typeof results[attr] !== 'number') {
                return false
            }

            if (!result[attr]) {
                result[attr] = results[attr]
            } else if (results[attr] < result[attr]) {
                result[attr] = results[attr]
            }
        })
    },
    /**
     * puts all consecutive results in one array
     */
    '[]': (results, result) => {
        if (Array.isArray(results)) {
            return calculateArray('[]', results)
        }

        /**
         * first sum up each result
         */
        Object.keys(results).forEach((attr) => {
            if (typeof results[attr] === 'object') {
                if (!result[attr]) {
                    result[attr] = {}
                }

                return calcResult['[]'](results[attr] || {}, result[attr])
            }

            /**
             * `!result[attr].push` to ensure that result[attr] is an array. Sometimes it results into an
             * empty object (`{}`)
             */
            if (!result[attr] || !result[attr].push) {
                result[attr] = []
            }

            result[attr].push(results[attr])
        })
    },
    /**
     * if results are listed in an array this method takes
     * the middle value of that array
     */
    '-|-': (result, toFixed) => {
        var ret = {}
        toFixed = toFixed || 2

        Object.keys(result).forEach((attr) => {
            if (typeof result[attr] === 'object' && !(result[attr] instanceof Array)) {
                ret[attr] = calcResult['-|-'](result[attr] || {}, toFixed)
                return ret[attr]
            }

            /**
             * first sort list
             */
            result[attr].sort((a, b) => a - b)

            /**
             * if array length is even take the middle value
             */
            var resultLength = result[attr].length
            if (resultLength % 2 === 0) {
                ret[attr] = (result[attr][resultLength / 2 - 1] + (result[attr][resultLength / 2])) / 2
            } else {
                ret[attr] = result[attr][Math.floor(resultLength / 2)]
            }
        })

        return ret
    }
}

export default calcResult
