var parser = require("../pgn-parser.js")
var fs = require('fs')

var should = require('should')
var https = require('https')

/**
 * I had first problems to write those tests, and then found the following issue:
 * https://github.com/mochajs/mocha/issues/1691 which references https://mochajs.org/#asynchronous-code
 *
 * This explains in detail why and how to use the done function provided by mocha.
 */
describe("When readming many games", function () {
    it("should read the correct number of games", function (done) {
        fs.readFile(process.cwd() + '/test/10-games.pgn', 'utf8', function (err, data) {
            if (err) { throw err }
            let res = parser.parse(data, {startRule: "games"})
            should(res.length).equal(32)
            done()
        })
    })
    it("should read the correct number of games (more)", function (done) {
        fs.readFile(process.cwd() + '/test/twic-01.pgn', 'utf8', function (err, data) {
            if (err) { throw err }
            let res = parser.parse(data, { startRule: "games" } )
            should(res.length).equal(232)
            done()
        })
    })
    it("should read the correct number of chess960 games (more)", function (done) {
        fs.readFile(process.cwd() + '/test/chess960_gm_blitz.pgn', 'utf8', function (err, data) {
            if (err) { throw err }
            let res = parser.parse(data, { startRule: "games" } )
            should(res.length).equal(21)
            done()
        })
    })
    // I have kept that bigger file only locally so the test will not run in Github actions
    xit("should read the correct number of games (much more)", function (done) {
        fs.readFile(process.cwd() + '/test/twic-02.pgn', 'utf8', function (err, data) {
            if (err) { throw err }
            let res = parser.parse(data, { startRule: "games" } )
            should(res.length).equal(2885)
            done()
        })
    })
    // Same here, file is even bigger
    xit("should read the correct number of games (all twic == 9072)", function (done) {
        this.timeout(15000);
        fs.readFile(process.cwd() + '/test/twic1333.pgn', 'utf8', function (err, data) {
            if (err) { throw err }
            let res = parser.parse(data, { startRule: "games" } )
            should(res.length).equal(9072)
            done()
        })
    })
})

describe("When reading games from the internet", function () {
    it("should be possible to parse them as well",function (done) {
        /// <script src="https://gist.github.com/mliebelt/d8f2fd9228916df4de0f09a22be4ed46.js"></script>
        // https://gist.github.com/mliebelt/d8f2fd9228916df4de0f09a22be4ed46
        let games = null
        https.get('https://gist.githubusercontent.com/mliebelt/d8f2fd9228916df4de0f09a22be4ed46/raw/d9479e1c35aa926e363504971bb96890d4abf648/2-games.pgn', (res) => {
            // res.setEncoding('utf8')
            let data = ''
            res.on('data', (chunk) => { data += chunk })
            res.on('end', () => {
                let res = parser.parse(data, { startRule: "games" } )
                should(res.length).equal(2)
                done()
            })
        })
    })
})

