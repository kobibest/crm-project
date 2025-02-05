const express = require('express');
const router = express.Router();
const { google } = require('googleapis');
const sheets = google.sheets('v4');

// קבלת וובהוק ושמירת הפעולה ב-Google Sheets
router.post('/webhook', async (req, res) => {
    const { client_id, action_type, title, description, action_date, performed_by } = req.body;
    
    const auth = new google.auth.GoogleAuth({
        scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });
    
    const sheetsClient = await auth.getClient();
    const spreadsheetId = 'YOUR_SPREADSHEET_ID_HERE';
    const range = 'Sheet1!A:F';
    
    const request = {
        spreadsheetId,
        range,
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        resource: {
            values: [[client_id, action_type, title, description, action_date, performed_by]]
        },
        auth: sheetsClient
    };
    
    try {
        await sheets.spreadsheets.values.append(request);
        res.send('Action recorded');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// שליפת פעולות לפי ID של לקוח מ-Google Sheets
router.get('/client/:id/actions', async (req, res) => {
    const clientId = req.params.id;

    const auth = new google.auth.GoogleAuth({
        scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    const sheetsClient = await auth.getClient();
    const spreadsheetId = 'YOUR_SPREADSHEET_ID_HERE';
    const range = 'Sheet1!A:F';

    const request = {
        spreadsheetId,
        range,
        auth: sheetsClient
    };

    try {
        const response = await sheets.spreadsheets.values.get(request);
        const rows = response.data.values;
        const actions = rows.filter(row => row[0] == clientId).map(row => ({
            client_id: row[0],
            action_type: row[1],
            title: row[2],
            description: row[3],
            action_date: row[4],
            performed_by: row[5]
        }));
        res.json(actions);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;
