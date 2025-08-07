#!/usr/bin/env node
import nodemailer from 'nodemailer';
import dedent from 'string-dedent';

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

async function sendMail(to, id) {
    try {
        await transporter.verify();
        console.log('✅ SMTP server ready');

        const info = await transporter.sendMail({
            from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
            to: to,
            subject: 'Nouvelle et projet',
            text: dedent`
                Salut Éloïse,  

                Comment vas-tu ? Ça fait un bail qu'on ne s'est pas parlé ! J'espère que tu vas bien et que tout se passe pour le mieux de ton côté. De mon côté, ça tourne plutôt bien. Je suis toujours sur Fedora, et j'ai pas mal bidouillé avec la ligne de commande ces derniers temps. J'ai réussi à automatiser quelques trucs qui me simplifient la vie, c'est toujours un plaisir de pouvoir tout configurer comme on veut.  

                En ce moment, je suis replongé dans Neovim. J'essaie de configurer un workflow un peu plus efficace pour le développement. J'ai découvert quelques plugins géniaux qui me font gagner pas mal de temps. C'est un peu chronophage de tout configurer, mais le résultat en vaut la peine. Plus besoin de sortir de l'éditeur pour pas mal de tâches !  

                Quoi de neuf de ton côté ? Des projets intéressants en cours ? On devrait essayer de se voir bientôt pour en discuter autour d'un verre. Dis-moi ce que tu en penses !  

                ${id}

                À bientôt,  
                Stéphane
            `,
            html: dedent`
                <p>Salut Éloïse,</p>

                <p>Comment vas-tu ? Ça fait un bail qu'on ne s'est pas parlé ! J'espère que tu vas bien et que tout se passe pour le mieux de ton côté. De mon côté, ça tourne plutôt bien. Je suis toujours sur Fedora, et j'ai pas mal bidouillé avec la ligne de commande ces derniers temps. J'ai réussi à automatiser quelques trucs qui me simplifient la vie, c'est toujours un plaisir de pouvoir tout configurer comme on veut.</p>

                <p>En ce moment, je suis replongé dans Neovim. J'essaie de configurer un workflow un peu plus efficace pour le développement. J'ai découvert quelques plugins géniaux qui me font gagner pas mal de temps. C'est un peu chronophage de tout configurer, mais le résultat en vaut la peine. Plus besoin de sortir de l'éditeur pour pas mal de tâches !</p>

                <p>Quoi de neuf de ton côté ? Des projets intéressants en cours ? On devrait essayer de se voir bientôt pour en discuter autour d'un verre. Dis-moi ce que tu en penses !</p>

                <p>${id}</p>

                <p>À bientôt,<br>
                Stéphane</p>
            `
        });
        console.log('✅ Email sent:', to, info.messageId);
    } catch (error) {
        console.error('❌ Error:', to, error.message);
    }
}

[
    "email1@example.com",
    "email2@example.com"
    // ...
].forEach(
    (to) => sendMail(
        to,
        'mlrch-8dfbbdedca1bc27b39a3' // set code to insert in mails here
    )
);

