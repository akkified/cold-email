import { google } from 'googleapis';

export async function sendEmail({
    to,
    subject,
    body,
    accessToken,
    refreshToken,
}: {
    to: string;
    subject: string;
    body: string;
    accessToken: string;
    refreshToken: string;
}) {
    const auth = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET
    );

    auth.setCredentials({
        access_token: accessToken,
        refresh_token: refreshToken,
    });

    const gmail = google.gmail({ version: 'v1', auth });

    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
    const htmlBody = body.replace(/\n/g, '<br />');

    const messageParts = [
        `To: ${to}`,
        'Content-Type: text/html; charset=utf-8',
        'MIME-Version: 1.0',
        `Subject: ${utf8Subject}`,
        '',
        htmlBody,
    ];
    const message = messageParts.join('\r\n');

    // The body needs to be base64url encoded.
    const encodedMessage = Buffer.from(message)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

    try {
        const res = await gmail.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: encodedMessage,
            },
        });
        return res.data;
    } catch (error) {
        console.error('Gmail API Error:', error);
        throw error;
    }
}
