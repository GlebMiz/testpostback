import fetch from 'node-fetch';

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;
const KEITARO_DOMAIN = process.env.KEITARO_DOMAIN;

export default async function handler(req, res) {
    try {
        // const referer = req.headers.referer || '';
        // if (!referer.includes(KEITARO_DOMAIN)) {
        //     return res.status(403).json({ status: 'error', message: 'Forbidden: invalid domain' });
        // }

        console.log(req.headers.referer || '');
        

        const query = req.query;

        const status = query.status || '';
        const campaign_name = query.campaign_name || '';
        const offer_name = query.offer_name || '';
        const offer_id = query.offer_id || '';
        const country = query.country || '';
        const creative_id = query.creative_id || '0';
        const revenue = query.revenue || '';

        const sub_ids = [];
        for (let i = 1; i <= 30; i++) {
            const key = i === 1 ? 'subid' : 'sub_id_' + i;
            if (query[key]) {
                sub_ids[i] = query[key];
            }
        }

        let message = `🔔 [Keitaro for TeamLead] Событие - ${status}\n\n`;
        message += `👨‍💻 Кампания: ${campaign_name}\n`;
        message += `💼 Оффер: ${offer_name} (${offer_id})\n`;
        message += `🌏 Гео: ${country}\n`;

        if (sub_ids.length > 0) {
            sub_ids.forEach((value, index) => {
                if (value) {
                    const num = index > 1 ? index + ' ' : '';
                    message += `SubID${num}: ${value}\n`;
                }
            });
        }

        message += `🖼 CreativeID: ${creative_id}\n\n`;
        message += `💰 Доход: ${revenue}`;

        const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

        const response = await fetch(telegramUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            })
        });

        const result = await response.json();
        res.status(200).json({ status: 'ok', response: result });

    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
}