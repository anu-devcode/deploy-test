import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as Handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

export interface EmailOptions {
    to: string;
    subject: string;
    template: string;
    context: Record<string, any>;
}

@Injectable()
export class EmailService {
    private transporter: nodemailer.Transporter;
    private templates: Map<string, Handlebars.TemplateDelegate> = new Map();
    private readonly logger = new Logger(EmailService.name);

    constructor() {
        // Initialize SMTP transporter with Brevo
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        // Preload templates
        this.loadTemplates();
    }

    private loadTemplates() {
        const templatesDir = path.join(__dirname, 'templates');

        // Check if templates directory exists
        if (!fs.existsSync(templatesDir)) {
            this.logger.warn('Templates directory not found, using inline templates');
            return;
        }

        const templateFiles = fs.readdirSync(templatesDir).filter(f => f.endsWith('.hbs'));

        for (const file of templateFiles) {
            const templateName = file.replace('.hbs', '');
            const templatePath = path.join(templatesDir, file);
            const templateContent = fs.readFileSync(templatePath, 'utf-8');
            this.templates.set(templateName, Handlebars.compile(templateContent));
        }

        this.logger.log(`Loaded ${this.templates.size} email templates`);
    }

    private getTemplate(name: string): Handlebars.TemplateDelegate {
        if (this.templates.has(name)) {
            return this.templates.get(name)!;
        }

        // Fallback inline templates
        const inlineTemplates: Record<string, string> = {
            verification: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h1 style="color: #16a34a; text-align: center;">Welcome to Adis Harvest!</h1>
                    <p>Hi {{name}},</p>
                    <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="{{verificationUrl}}" style="background-color: #16a34a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">Verify Email</a>
                    </div>
                    <p>This link expires in 24 hours.</p>
                    <p>If you didn't create an account, please ignore this email.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                    <p style="color: #666; font-size: 12px; text-align: center;">Adis Harvest - Quality Agricultural Products</p>
                </div>
            `,
            'password-reset': `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h1 style="color: #16a34a; text-align: center;">Reset Your Password</h1>
                    <p>Hi {{name}},</p>
                    <p>We received a request to reset your password. Click the button below to create a new password:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="{{resetUrl}}" style="background-color: #16a34a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a>
                    </div>
                    <p>This link expires in 1 hour.</p>
                    <p>If you didn't request this, please ignore this email. Your password will remain unchanged.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                    <p style="color: #666; font-size: 12px; text-align: center;">Adis Harvest - Quality Agricultural Products</p>
                </div>
            `,
            welcome: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h1 style="color: #16a34a; text-align: center;">Welcome to Adis Harvest! 🌾</h1>
                    <p>Hi {{name}},</p>
                    <p>Your email has been verified successfully! You're now part of the Adis Harvest family.</p>
                    <p>Here's what you can do:</p>
                    <ul>
                        <li>Browse our premium agricultural products</li>
                        <li>Get exclusive bulk pricing</li>
                        <li>Track your orders in real-time</li>
                        <li>Save your favorite products</li>
                    </ul>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="{{shopUrl}}" style="background-color: #16a34a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">Start Shopping</a>
                    </div>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                    <p style="color: #666; font-size: 12px; text-align: center;">Adis Harvest - Quality Agricultural Products</p>
                </div>
            `,
            'order-confirmation': `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h1 style="color: #16a34a; text-align: center;">Order Confirmed! 🎉</h1>
                    <p>Hi {{name}},</p>
                    <p>Thank you for your order! We've received your order and it's being processed.</p>
                    <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 0;"><strong>Order Number:</strong> {{orderNumber}}</p>
                        <p style="margin: 10px 0 0;"><strong>Total:</strong> ETB {{total}}</p>
                    </div>
                    <h3>Order Items:</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        {{#each items}}
                        <tr style="border-bottom: 1px solid #eee;">
                            <td style="padding: 10px 0;">{{this.name}} x {{this.quantity}}</td>
                            <td style="padding: 10px 0; text-align: right;">ETB {{this.price}}</td>
                        </tr>
                        {{/each}}
                    </table>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="{{trackingUrl}}" style="background-color: #16a34a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">Track Your Order</a>
                    </div>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                    <p style="color: #666; font-size: 12px; text-align: center;">Adis Harvest - Quality Agricultural Products</p>
                </div>
            `,
            'order-status': `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h1 style="color: #16a34a; text-align: center;">Order Update</h1>
                    <p>Hi {{name}},</p>
                    <p>Your order <strong>{{orderNumber}}</strong> has been updated:</p>
                    <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                        <p style="margin: 0; font-size: 18px; color: #16a34a; font-weight: bold;">{{status}}</p>
                    </div>
                    {{#if trackingInfo}}
                    <p><strong>Tracking:</strong> {{trackingInfo}}</p>
                    {{/if}}
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="{{trackingUrl}}" style="background-color: #16a34a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">Track Your Order</a>
                    </div>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                    <p style="color: #666; font-size: 12px; text-align: center;">Adis Harvest - Quality Agricultural Products</p>
                </div>
            `,
            'staff-invite': `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h1 style="color: #16a34a; text-align: center;">Welcome to the Team!</h1>
                    <p>Hi {{name}},</p>
                    <p>You've been invited to join Adis Harvest as a staff member. Here are your login credentials:</p>
                    <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 0;"><strong>Email:</strong> {{email}}</p>
                        <p style="margin: 10px 0 0;"><strong>Temporary Password:</strong> {{temporaryPassword}}</p>
                    </div>
                    <p style="color: #dc2626;"><strong>Important:</strong> Please change your password immediately after logging in.</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="{{loginUrl}}" style="background-color: #16a34a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">Login Now</a>
                    </div>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                    <p style="color: #666; font-size: 12px; text-align: center;">Adis Harvest - Quality Agricultural Products</p>
                </div>
            `,
            promotional: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h1 style="color: #16a34a; text-align: center;">{{subject}}</h1>
                    {{{content}}}
                    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                    <p style="color: #666; font-size: 12px; text-align: center;">
                        Adis Harvest - Quality Agricultural Products<br>
                        <a href="{{unsubscribeUrl}}" style="color: #666;">Unsubscribe</a>
                    </p>
                </div>
            `,
            'security-alert': `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #fee2e2; border-radius: 12px;">
                    <h1 style="color: #dc2626; text-align: center;">Security Alert! 🛡️</h1>
                    <p>Hi {{name}},</p>
                    <p>We detected a new login to your Adis Harvest account from a new device or location:</p>
                    <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 0;"><strong>Device:</strong> {{userAgent}}</p>
                        <p style="margin: 10px 0 0;"><strong>IP Address:</strong> {{ipAddress}}</p>
                        <p style="margin: 10px 0 0;"><strong>Time:</strong> {{time}}</p>
                    </div>
                    <p>If this was you, you can ignore this email. If you don't recognize this activity, please change your password immediately and review your active sessions.</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="{{securityUrl}}" style="background-color: #0f172a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">Review Security Settings</a>
                    </div>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                    <p style="color: #666; font-size: 12px; text-align: center;">Adis Harvest - Quality Agricultural Products</p>
                </div>
            `,
            'payment-failed': `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h1 style="color: #dc2626; text-align: center;">Payment Failed ❌</h1>
                    <p>Hi {{name}},</p>
                    <p>We were unable to process your payment for order <strong>{{orderNumber}}</strong>.</p>
                    <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                        <p style="margin: 0; color: #dc2626; font-weight: bold;">{{reason}}</p>
                    </div>
                    <p>Please try again with a different payment method to complete your purchase.</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="{{checkoutUrl}}" style="background-color: #16a34a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">Retry Payment</a>
                    </div>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                    <p style="color: #666; font-size: 12px; text-align: center;">Adis Harvest - Quality Agricultural Products</p>
                </div>
            `,
            'review-update': `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h1 style="color: #16a34a; text-align: center;">Review Update! ⭐</h1>
                    <p>Hi {{name}},</p>
                    <p>Good news! Your review for <strong>{{productName}}</strong> has been {{status}}.</p>
                    <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 0; font-style: italic;">"{{comment}}"</p>
                    </div>
                    {{#if reply}}
                    <p><strong>Merchant Reply:</strong></p>
                    <p style="color: #475569;">{{reply}}</p>
                    {{/if}}
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="{{productUrl}}" style="background-color: #16a34a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">View Product</a>
                    </div>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                    <p style="color: #666; font-size: 12px; text-align: center;">Adis Harvest - Quality Agricultural Products</p>
                </div>
            `,
            'system-alert': `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc; border-radius: 12px;">
                    <h1 style="color: #334155; text-align: center;">System Update</h1>
                    <p>Hi {{name}},</p>
                    <div style="background-color: white; padding: 25px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0;">
                        <h3 style="margin-top: 0; color: #0f172a;">{{title}}</h3>
                        <p style="color: #475569; line-height: 1.6;">{{message}}</p>
                    </div>
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
                    <p style="color: #666; font-size: 12px; text-align: center;">Adis Harvest - Quality Agricultural Products</p>
                </div>
            `,
        };

        if (inlineTemplates[name]) {
            return Handlebars.compile(inlineTemplates[name]);
        }

        throw new Error(`Template "${name}" not found`);
    }

    async send(options: EmailOptions): Promise<boolean> {
        try {
            const template = this.getTemplate(options.template);
            const html = template(options.context);

            await this.transporter.sendMail({
                from: process.env.SMTP_FROM || '"Adis Harvest" <noreply@adisharvest.com>',
                to: options.to,
                subject: options.subject,
                html,
            });

            this.logger.log(`Email sent to ${options.to}: ${options.subject}`);
            return true;
        } catch (error) {
            this.logger.error(`Failed to send email to ${options.to}:`, error);
            return false;
        }
    }

    // Convenience methods
    async sendVerificationEmail(email: string, token: string, name: string): Promise<boolean> {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        return this.send({
            to: email,
            subject: 'Verify Your Email - Adis Harvest',
            template: 'verification',
            context: {
                name: name || 'there',
                verificationUrl: `${frontendUrl}/auth/verify-email?token=${token}`,
            },
        });
    }

    async sendPasswordResetEmail(email: string, token: string, name: string): Promise<boolean> {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        return this.send({
            to: email,
            subject: 'Reset Your Password - Adis Harvest',
            template: 'password-reset',
            context: {
                name: name || 'there',
                resetUrl: `${frontendUrl}/auth/reset-password?token=${token}`,
            },
        });
    }

    async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        return this.send({
            to: email,
            subject: 'Welcome to Adis Harvest! 🌾',
            template: 'welcome',
            context: {
                name: name || 'there',
                shopUrl: `${frontendUrl}/shop`,
            },
        });
    }

    async sendOrderConfirmation(
        email: string,
        order: { orderNumber: string; total: number; items: Array<{ name: string; quantity: number; price: number }> },
        name: string,
        isGuest: boolean = false,
    ): Promise<boolean> {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const trackingUrl = isGuest
            ? `${frontendUrl}/track-order?orderNumber=${order.orderNumber}&email=${encodeURIComponent(email)}`
            : `${frontendUrl}/account/orders/${order.orderNumber}`;

        return this.send({
            to: email,
            subject: `Order Confirmed: ${order.orderNumber}`,
            template: 'order-confirmation',
            context: {
                name: name || 'Customer',
                orderNumber: order.orderNumber,
                total: order.total.toLocaleString(),
                items: order.items,
                trackingUrl,
            },
        });
    }

    async sendOrderStatusUpdate(
        email: string,
        orderNumber: string,
        status: string,
        name: string,
        trackingInfo?: string,
        isGuest: boolean = false,
    ): Promise<boolean> {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const trackingUrl = isGuest
            ? `${frontendUrl}/track-order?orderNumber=${orderNumber}&email=${encodeURIComponent(email)}`
            : `${frontendUrl}/account/orders/${orderNumber}`;

        return this.send({
            to: email,
            subject: `Order ${orderNumber} - ${status}`,
            template: 'order-status',
            context: {
                name: name || 'Customer',
                orderNumber,
                status,
                trackingInfo,
                trackingUrl,
            },
        });
    }

    async sendStaffInvite(email: string, name: string, temporaryPassword: string): Promise<boolean> {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        return this.send({
            to: email,
            subject: 'Welcome to Adis Harvest Team',
            template: 'staff-invite',
            context: {
                name: name || 'Team Member',
                email,
                temporaryPassword,
                loginUrl: `${frontendUrl}/admin/login`,
            },
        });
    }

    async sendPromotionalEmail(
        email: string,
        subject: string,
        content: string,
        unsubscribeToken: string,
    ): Promise<boolean> {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        return this.send({
            to: email,
            subject,
            template: 'promotional',
            context: {
                subject,
                content,
                unsubscribeUrl: `${frontendUrl}/unsubscribe?token=${unsubscribeToken}`,
            },
        });
    }

    async sendSecurityAlert(
        email: string,
        name: string,
        details: { userAgent: string; ipAddress: string; time: string }
    ): Promise<boolean> {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        return this.send({
            to: email,
            subject: 'Security Alert: New Login Detected - Adis Harvest',
            template: 'security-alert',
            context: {
                name: name || 'Customer',
                ...details,
                securityUrl: `${frontendUrl}/account/security`,
            },
        });
    }

    async sendPaymentFailed(
        email: string,
        name: string,
        orderNumber: string,
        reason: string
    ): Promise<boolean> {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        return this.send({
            to: email,
            subject: `Payment Failed: Order ${orderNumber}`,
            template: 'payment-failed',
            context: {
                name: name || 'Customer',
                orderNumber,
                reason,
                checkoutUrl: `${frontendUrl}/checkout?orderNumber=${orderNumber}`,
            },
        });
    }

    async sendReviewUpdate(
        email: string,
        name: string,
        productName: string,
        status: 'approved' | 'replied',
        comment: string,
        reply?: string,
        productSlug?: string
    ): Promise<boolean> {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        return this.send({
            to: email,
            subject: `Update on your review for ${productName}`,
            template: 'review-update',
            context: {
                name: name || 'Customer',
                productName,
                status,
                comment,
                reply,
                productUrl: `${frontendUrl}/products/${productSlug || ''}`,
            },
        });
    }

    async sendSystemAlert(
        email: string,
        name: string,
        title: string,
        message: string
    ): Promise<boolean> {
        return this.send({
            to: email,
            subject: `System Alert: ${title}`,
            template: 'system-alert',
            context: {
                name: name || 'Customer',
                title,
                message,
            },
        });
    }
}
