import nodemailer from 'nodemailer';

// Create transporter for SMTP
const createTransporter = () => {
    return nodemailer.createTransporter({
        service: 'gmail', // You can change this to other services like 'outlook', 'yahoo', etc.
        auth: {
            user: process.env.EMAIL_USER, // Your email
            pass: process.env.EMAIL_PASS  // Your app password
        }
    });
};

// Send appointment confirmation email
export const sendAppointmentConfirmation = async (appointmentData) => {
    try {
        const transporter = createTransporter();
        
        const { userData, docData, slotDate, slotTime } = appointmentData;
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userData.email,
            subject: 'Appointment Confirmation - SmartHealthcare',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #4F46E5; margin: 0;">SmartHealthcare</h1>
                        <p style="color: #666; margin: 5px 0;">Your Health, Our Priority</p>
                    </div>
                    
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                        <h2 style="color: #28a745; margin-top: 0;">✅ Appointment Confirmed!</h2>
                        <p style="color: #333; font-size: 16px;">Dear ${userData.name},</p>
                        <p style="color: #333;">Your appointment has been successfully booked. Here are the details:</p>
                    </div>
                    
                    <div style="background-color: #fff; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                        <h3 style="color: #4F46E5; margin-top: 0;">Appointment Details</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">Doctor:</td>
                                <td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #333;">${docData.name || 'To be assigned'}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">Specialty:</td>
                                <td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #333;">${docData.speciality}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">Date:</td>
                                <td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #333;">${new Date(slotDate).toLocaleDateString()}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">Time:</td>
                                <td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #333;">${slotTime}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-weight: bold; color: #555;">Location:</td>
                                <td style="padding: 8px 0; color: #333;">${userData.location}</td>
                            </tr>
                        </table>
                    </div>
                    
                    <div style="background-color: #e3f2fd; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                        <h4 style="color: #1976d2; margin-top: 0;">📋 Important Notes:</h4>
                        <ul style="color: #333; margin: 0; padding-left: 20px;">
                            <li>Please arrive 15 minutes before your appointment time</li>
                            <li>Bring a valid ID and insurance card if applicable</li>
                            <li>If you need to reschedule, please contact us at least 24 hours in advance</li>
                        </ul>
                    </div>
                    
                    ${userData.message ? `
                    <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                        <h4 style="color: #856404; margin-top: 0;">📝 Your Message:</h4>
                        <p style="color: #333; margin: 0;">${userData.message}</p>
                    </div>
                    ` : ''}
                    
                    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                        <p style="color: #666; margin: 0;">Need help? Contact us:</p>
                        <p style="color: #4F46E5; margin: 5px 0; font-weight: bold;">📞 +1 (555) 123-4567</p>
                        <p style="color: #4F46E5; margin: 5px 0; font-weight: bold;">✉️ support@smarthealthcare.com</p>
                    </div>
                    
                    <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
                        <p>© 2024 SmartHealthcare. All rights reserved.</p>
                    </div>
                </div>
            `
        };
        
        const result = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', result.messageId);
        return { success: true, messageId: result.messageId };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error: error.message };
    }
};
