#!/usr/bin/env node
import fs from 'fs';
import nodemailer from 'nodemailer';
import dedent from 'string-dedent';
import { parse } from "csv-parse/sync";
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

// Create a transporter for SMTP
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

async function sendMailToPersonalInbox({ toEmail, firstname, lastname, codeId }) {
    try {
        await transporter.verify();
        console.log('✅ SMTP server ready');

        const info = await transporter.sendMail({
            from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
            to: toEmail,
            subject: 'Nouvelle et projet',
            text: dedent`
                Salut ${firstname},  

                Comment vas-tu ? Ça fait un bail qu'on ne s'est pas parlé ! J'espère que tu vas bien et que tout se passe pour le mieux de ton côté. De mon côté, ça tourne plutôt bien. Je suis toujours sur Fedora, et j'ai pas mal bidouillé avec la ligne de commande ces derniers temps. J'ai réussi à automatiser quelques trucs qui me simplifient la vie, c'est toujours un plaisir de pouvoir tout configurer comme on veut.  

                En ce moment, je suis replongé dans Neovim. J'essaie de configurer un workflow un peu plus efficace pour le développement. J'ai découvert quelques plugins géniaux qui me font gagner pas mal de temps. C'est un peu chronophage de tout configurer, mais le résultat en vaut la peine. Plus besoin de sortir de l'éditeur pour pas mal de tâches !  

                Quoi de neuf de ton côté ? Des projets intéressants en cours ? On devrait essayer de se voir bientôt pour en discuter autour d'un verre. Dis-moi ce que tu en penses !  

                ${codeId}

                À bientôt,  
                Stéphane
            `,
            html: dedent`
                <p>Salut ${firstname},</p>

                <p>Comment vas-tu ? Ça fait un bail qu'on ne s'est pas parlé ! J'espère que tu vas bien et que tout se passe pour le mieux de ton côté. De mon côté, ça tourne plutôt bien. Je suis toujours sur Fedora, et j'ai pas mal bidouillé avec la ligne de commande ces derniers temps. J'ai réussi à automatiser quelques trucs qui me simplifient la vie, c'est toujours un plaisir de pouvoir tout configurer comme on veut.</p>

                <p>En ce moment, je suis replongé dans Neovim. J'essaie de configurer un workflow un peu plus efficace pour le développement. J'ai découvert quelques plugins géniaux qui me font gagner pas mal de temps. C'est un peu chronophage de tout configurer, mais le résultat en vaut la peine. Plus besoin de sortir de l'éditeur pour pas mal de tâches !</p>

                <p>Quoi de neuf de ton côté ? Des projets intéressants en cours ? On devrait essayer de se voir bientôt pour en discuter autour d'un verre. Dis-moi ce que tu en penses !</p>

                <p>${codeId}</p>

                <p>À bientôt,<br>
                Stéphane</p>
            `
        });
        console.log('✅ Email sent:', toEmail, info.messageId);
    } catch (error) {
        console.error('❌ Error:', toEmail, error.message);
    }
}

async function sendMailToProfessionalInbox({ toEmail, firstname, lastname, codeId }) {
    try {
        await transporter.verify();
        console.log('✅ SMTP server ready');

        const info = await transporter.sendMail({
            from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
            to: toEmail,
            subject: 'Demande de facture',
            text: dedent`
                Bonjour Mr ${lastname},  

                Pouvez-vous m'envoyer la facture de notre mission ?

                ${codeId}

                Cordialement,  
                Stéphane Klein
            `,
            html: dedent`
                <p>Bonjour Mr ${lastname},</p>

                <p>Pouvez-vous m'envoyer la facture de notre mission ?</p>

                <p>${codeId}</p>

                <p>Cordialement,<br />
                Stéphane Klein</p>
            `
        });
        console.log('✅ Email sent:', toEmail, info.messageId);
    } catch (error) {
        console.error('❌ Error:', toEmail, error.message);
    }
}

const argv = yargs(hideBin(process.argv))
    .usage('Usage: ./send.js --code-id <CODE_ID> --csv-source=mailreach|mailtester|mailercheck --inbox-type=personal|professional')
    .option('code-id', {
        type: 'string',
        demandOption: true,
        describe: 'MailReach Spam Checker code id (required)',
        requiresArg: true
    })
    .option('inbox-type', {
        type: 'string',
        demandOption: true,
        choices: ['personal', 'professional'],
        requiresArg: true
    })
    .option('csv-source', {
        type: 'string',
        demandOption: true,
        choices: ['mailreach', 'mailtester', 'mailercheck'],
        requiresArg: true
    })
    .help('h')
    .alias('h', 'help')
    .example('./send.js --code-id mlrch-65feebb17a97c6e6f46fa74 --inbox-type=personal --csv-source=mailreach')
    .version(false)
    .argv;

let emails;

switch (argv.csvSource) {
    case 'mailreach':
        emails = parse(
            fs.readFileSync('emails.csv', 'utf8'),
            {
                columns: true,
                skip_empty_lines: true
            }
        );

        emails.forEach(
            async (row) => {
                switch (argv.inboxType) {
                    case 'personal':
                        await sendMailToPersonalInbox({
                            toEmail: row['Email'],
                            firstname: row['First name'],
                            lastname: row['Last name'],
                            codeId: argv.codeId
                        });
                        break;
                    case 'professional':
                        await sendMailToProfessionalInbox({
                            toEmail: row['Email'],
                            firstname: row['First name'],
                            lastname: row['Last name'],
                            codeId: argv.codeId
                        });
                        break;
                }
            }
        );
        break;
    case 'mailtester':
    case 'mailercheck':
        emails = parse(
            fs.readFileSync('emails.csv', 'utf8'),
            {
                columns: false,
                skip_empty_lines: true
            }
        );

        emails.forEach(
            async (row) => {
                switch (argv.inboxType) {
                    case 'personal':
                        await sendMailToPersonalInbox({
                            toEmail: row[0],
                            firstname: 'John',
                            lastname: 'Doe',
                            codeId: argv.codeId
                        });
                        break;
                    case 'professional':
                        await sendMailToProfessionalInbox({
                            toEmail: row[0],
                            firstname: 'John',
                            lastname: 'Doe',
                            codeId: argv.codeId
                        });
                        break;
                }
            }
        );
        break;
}
