import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

interface WelcomeEmailParams {
  nombre: string;
  email: string;
  password: string;
}


export async function sendWelcomeEmail({ nombre, email, password }: WelcomeEmailParams) {
  const mailOptions = {
    from: `"User Manager" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '¡Bienvenido a User Manager!',
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 32px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px;">¡Bienvenido, ${nombre}! 🎉</h1>
        </div>
        <div style="padding: 32px;">
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Tu cuenta ha sido creada exitosamente en <strong>User Manager</strong>. 
            A continuación encontrarás tus credenciales de acceso:
          </p>
          <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 24px 0;">
            <p style="margin: 8px 0; color: #111827;"><strong>📧 Email:</strong> ${email}</p>
            <p style="margin: 8px 0; color: #111827;"><strong>🔑 Contraseña:</strong> ${password}</p>
          </div>
          <p style="color: #6b7280; font-size: 14px;">
            Te recomendamos cambiar tu contraseña después de iniciar sesión por primera vez.
          </p>
        </div>
        <div style="background: #f3f4f6; padding: 16px; text-align: center;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">
            Este es un correo automático, por favor no responder.
          </p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}
