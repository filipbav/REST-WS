// api_services/studentits_service.js
const dbStudentITS = require('../databases/db_studentITS'); // anpassa path om ditt filnamn ar annat

function sendJson(res, statusCode, body) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(body));
}

// GET /studentits/get_persnummer?username=xxx
function handleGetPersnummer(req, res, username) {
    if (!username) {
        return sendJson(res, 400, { error: 'username saknas' });
    }

    const row = dbStudentITS.getPersnummerByUsername(username);

    if (!row) {
        return sendJson(res, 404, { error: 'Student hittades inte' });
    }

    return sendJson(res, 200, {
        username: username,
        personnummer: row.personnummer
    });
}

// (valfritt) admin-endpoint: lista alla studenter
function handleGetAllStudents(req, res) {
    const list = dbStudentITS.getAllStudents();
    return sendJson(res, 200, list);
}

module.exports = {
    handleGetPersnummer,
    handleGetAllStudents
};
